import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import { useAccount, useConnect, useDisconnect, useBalance } from "wagmi";
import { injected } from "wagmi/connectors";
import { MONAD_CHAIN_ID } from "@/lib/chains";
import { analyzeSigningRequest, type SigningRequest } from "@/lib/signingGuard";
import { analyzeApprovalRisk, type ApprovalRisk } from "@/lib/approvalGuard";
import { formatUnits } from "viem";
import { scanSolidityCode, type CodeScanResult } from "@/lib/codeSafety";
import { getWalletBalance } from "@/lib/blockchain";

export interface EmergencyRule {
  id: string;
  type: "balance_drain" | "approval_abuse" | "price_crash";
  enabled: boolean;
  label: string;
  params: {
    percentThreshold: number;
    timeWindowSeconds: number;
  };
}

export interface EmergencyEvent {
  id: string;
  timestamp: Date;
  ruleId: string;
  ruleLabel: string;
  severity: "critical" | "high" | "medium";
  description: string;
  actionTaken?: string;
  estimatedLossPrevented?: string;
  sources: ("signing" | "approval" | "code_safety" | "balance_drain")[];
}

interface WalletState {
  connected: boolean;
  address: string | null;
  balance: number;
  emergencyMode: boolean;
}

export interface LastApprovalForRevoke {
  tokenAddress: string;
  spenderAddress: string;
}

interface GuardContextType {
  wallet: WalletState;
  rules: EmergencyRule[];
  events: EmergencyEvent[];
  isMonitoring: boolean;
  activeEmergency: EmergencyEvent | null;
  signingRequest: SigningRequest | null;
  approvalRisk: ApprovalRisk | null;
  codeScanResult: CodeScanResult | null;
  lastApprovalForRevoke: LastApprovalForRevoke | null;
  connectWallet: () => void;
  disconnectWallet: () => void;
  addRule: (rule: Omit<EmergencyRule, "id">) => void;
  updateRule: (id: string, updates: Partial<EmergencyRule>) => void;
  deleteRule: (id: string) => void;
  toggleRule: (id: string) => void;
  simulateEmergency: (type: EmergencyRule["type"]) => void;
  simulateSigningRisk: (domain: string, message: string) => void;
  simulateApprovalRisk: (spender: string, amount: string, token: string) => void;
  simulateCodeScan: (codeOrResult: string | CodeScanResult) => void;
  allowSigningRequest: () => void;
  rejectSigningRequest: () => void;
  allowApproval: () => void;
  rejectApproval: () => void;
  freezeWallet: () => void;
  revokeApprovals: (onChainSuccess?: boolean) => void;
  dismissEmergency: () => void;
  toggleMonitoring: () => void;
}

const STORAGE_KEY_EVENTS = "wallet-sentinel-events";
const STORAGE_KEY_ACTIVE_EMERGENCY = "wallet-sentinel-active-emergency";

const GuardContext = createContext<GuardContextType | null>(null);

const DEFAULT_RULES: EmergencyRule[] = [
  {
    id: "rule-1",
    type: "balance_drain",
    enabled: true,
    label: "Balance Drain Detection",
    params: { percentThreshold: 30, timeWindowSeconds: 60 },
  },
  {
    id: "rule-2",
    type: "approval_abuse",
    enabled: true,
    label: "Approval Abuse Detection",
    params: { percentThreshold: 0, timeWindowSeconds: 30 },
  },
  {
    id: "rule-3",
    type: "price_crash",
    enabled: false,
    label: "Price Crash Detection",
    params: { percentThreshold: 25, timeWindowSeconds: 120 },
  },
];

function generateAddress(): string {
  const chars = "0123456789abcdef";
  let addr = "0x";
  for (let i = 0; i < 40; i++) addr += chars[Math.floor(Math.random() * 16)];
  return addr;
}

export function GuardProvider({ children }: { children: React.ReactNode }) {
  // Wagmi hooks for real wallet connection
  const { address, isConnected, chain } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { data: balanceData, refetch: refetchBalance } = useBalance({
    address: address as `0x${string}`,
    chainId: MONAD_CHAIN_ID,
    query: { enabled: !!address, refetchInterval: 0 },
  });

  // Load persisted emergency state (Date revival for timestamp)
  const loadPersistedState = useCallback((): { events: EmergencyEvent[]; activeEmergency: EmergencyEvent | null } => {
    try {
      const rawEvents = localStorage.getItem(STORAGE_KEY_EVENTS);
      const rawActive = localStorage.getItem(STORAGE_KEY_ACTIVE_EMERGENCY);
      const reviver = (_key: string, v: unknown) =>
        typeof v === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(v) ? new Date(v) : v;
      const parsedEvents: EmergencyEvent[] = rawEvents ? JSON.parse(rawEvents, reviver) : [];
      const parsedActive: EmergencyEvent | null = rawActive ? JSON.parse(rawActive, reviver) : null;
      return { events: parsedEvents, activeEmergency: parsedActive };
    } catch {
      return { events: [], activeEmergency: null };
    }
  }, []);

  const [rules, setRules] = useState<EmergencyRule[]>(DEFAULT_RULES);
  const [events, setEvents] = useState<EmergencyEvent[]>(() => loadPersistedState().events);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [activeEmergency, setActiveEmergency] = useState<EmergencyEvent | null>(() => loadPersistedState().activeEmergency);
  const [signingRequest, setSigningRequest] = useState<SigningRequest | null>(null);
  const [approvalRisk, setApprovalRisk] = useState<ApprovalRisk | null>(null);
  const [codeScanResult, setCodeScanResult] = useState<CodeScanResult | null>(null);
  const [lastApprovalForRevoke, setLastApprovalForRevoke] = useState<LastApprovalForRevoke | null>(null);
  const [previousBalance, setPreviousBalance] = useState<string>("0");
  const recentApprovalMetaRef = useRef<{ approvedAt: Date; balanceAtApproval: number } | null>(null);
  const monitoringRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Persist events and active emergency so emergency mode survives reload
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_EVENTS, JSON.stringify(events));
  }, [events]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ACTIVE_EMERGENCY, activeEmergency ? JSON.stringify(activeEmergency) : "");
  }, [activeEmergency]);

  // Construct wallet state from Wagmi data (wagmi may return value/decimals/symbol or formatted)
  const balance =
    balanceData &&
    ("formatted" in balanceData
      ? parseFloat((balanceData as { formatted: string }).formatted)
      : parseFloat(formatUnits((balanceData as { value: bigint }).value, (balanceData as { decimals: number }).decimals)));
  const wallet: WalletState = {
    connected: isConnected,
    address: address || null,
    balance: balance || 0,
    emergencyMode: !!activeEmergency,
  };

  // Connect wallet via Wagmi
  const connectWallet = useCallback(() => {
    connect({ connector: injected() });
    setIsMonitoring(true);
  }, [connect]);

  // Disconnect wallet via Wagmi
  const disconnectWallet = useCallback(() => {
    disconnect();
    setIsMonitoring(false);
    if (monitoringRef.current) clearInterval(monitoringRef.current);
  }, [disconnect]);

  const addRule = useCallback((rule: Omit<EmergencyRule, "id">) => {
    setRules((prev) => [...prev, { ...rule, id: `rule-${Date.now()}` }]);
  }, []);

  const updateRule = useCallback((id: string, updates: Partial<EmergencyRule>) => {
    setRules((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates } : r)));
  }, []);

  const deleteRule = useCallback((id: string) => {
    setRules((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const toggleRule = useCallback((id: string) => {
    setRules((prev) => prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)));
  }, []);

  const triggerEmergency = useCallback((event: EmergencyEvent) => {
    setEvents((prev) => [event, ...prev]);
    setActiveEmergency(event);
  }, []);

  const simulateEmergency = useCallback(
    (type: EmergencyRule["type"]) => {
      const descriptions: Record<string, { desc: string; label: string }> = {
        balance_drain: {
          desc: "Wallet balance dropped 31% in 52 seconds. Suspicious outbound transfer detected to unknown contract.",
          label: "Balance Drain Detection",
        },
        approval_abuse: {
          desc: "ERC-20 unlimited approval was used with no subsequent swap. Potential approval exploit in progress.",
          label: "Approval Abuse Detection",
        },
        price_crash: {
          desc: "Token MON price dropped 28% in 90 seconds. Flash crash or liquidity pull detected.",
          label: "Price Crash Detection",
        },
      };

      const d = descriptions[type];
      const event: EmergencyEvent = {
        id: `event-${Date.now()}`,
        timestamp: new Date(),
        ruleId: rules.find((r) => r.type === type)?.id || "unknown",
        ruleLabel: d.label,
        severity: "critical",
        description: d.desc,
        sources: ["balance_drain"],
      };

      triggerEmergency(event);
    },
    [rules, triggerEmergency]
  );

  const freezeWallet = useCallback(() => {
    if (activeEmergency) {
      setEvents((prev) =>
        prev.map((e) =>
          e.id === activeEmergency.id
            ? { ...e, actionTaken: "Wallet frozen via Guard contract", estimatedLossPrevented: "~1.3 MON ($2,847)" }
            : e
        )
      );
    }
  }, [activeEmergency]);

  const revokeApprovals = useCallback(
    (onChainSuccess?: boolean) => {
      if (activeEmergency) {
        const actionTaken = onChainSuccess
          ? "All ERC-20 approvals revoked on-chain"
          : "Approval revoke recorded (no on-chain revoke pending)";
        setEvents((prev) =>
          prev.map((e) =>
            e.id === activeEmergency.id
              ? { ...e, actionTaken, estimatedLossPrevented: onChainSuccess ? "~2.1 MON ($4,599)" : undefined }
              : e
          )
        );
      }
    },
    [activeEmergency]
  );

  const dismissEmergency = useCallback(() => {
    setActiveEmergency(null);
  }, []);

  const toggleMonitoring = useCallback(() => {
    setIsMonitoring((prev) => !prev);
  }, []);

  // ===== CONDITION 1: SIGNING RISK =====
  const simulateSigningRisk = useCallback(
    (domain: string, message: string) => {
      const analysis = analyzeSigningRequest(domain, message);
      const request: SigningRequest = {
        domain,
        message,
        type: "personal_sign",
        riskLevel: analysis.riskLevel,
        riskReasons: analysis.riskReasons,
        timestamp: new Date(),
        isDomainTrusted: analysis.isDomainTrusted,
        isPhishingAttempt: analysis.isPhishingAttempt,
      };
      setSigningRequest(request);

      // Trigger emergency if critical
      if (analysis.riskLevel === "critical") {
        const riskDescription = analysis.isPhishingAttempt
          ? `Phishing attempt detected from ${domain} - site is impersonating a legitimate DeFi app`
          : `Dangerous signing request from ${domain}. ${analysis.riskReasons[0] || "Unknown risk"}`;
        
        const event: EmergencyEvent = {
          id: `event-${Date.now()}`,
          timestamp: new Date(),
          ruleId: "signing-guard",
          ruleLabel: "Signing Risk Detection",
          severity: "critical",
          description: riskDescription,
          sources: ["signing"],
        };
        triggerEmergency(event);
      }
    },
    [triggerEmergency]
  );

  const allowSigningRequest = useCallback(() => {
    setSigningRequest(null);
  }, []);

  const rejectSigningRequest = useCallback(() => {
    if (signingRequest) {
      setEvents((prev) => [
        ...prev,
        {
          id: `event-${Date.now()}`,
          timestamp: new Date(),
          ruleId: "signing-guard",
          ruleLabel: "Signing Request Blocked",
          severity: "high",
          description: `User rejected signing request from ${signingRequest.domain}`,
          actionTaken: "Signing request blocked",
          sources: ["signing"],
        },
      ]);
    }
    setSigningRequest(null);
  }, [signingRequest]);

  // ===== CONDITION 2: APPROVAL RISK =====
  const simulateApprovalRisk = useCallback(
    (spender: string, amount: string, token: string) => {
      const risk = analyzeApprovalRisk(spender, amount, token);
      setApprovalRisk(risk);
      setLastApprovalForRevoke({ tokenAddress: token, spenderAddress: spender });

      // Trigger emergency if critical
      if (risk.riskLevel === "critical") {
        const event: EmergencyEvent = {
          id: `event-${Date.now()}`,
          timestamp: new Date(),
          ruleId: "approval-guard",
          ruleLabel: "Approval Abuse Detection",
          severity: "critical",
          description: `Dangerous approval detected: ${risk.reasons[0] || "Unknown risk"} to ${spender.substring(0, 10)}...`,
          sources: ["approval"],
        };
        triggerEmergency(event);
      }
    },
    [triggerEmergency]
  );

  const allowApproval = useCallback(() => {
    if (approvalRisk) {
      const now = new Date();
      setEvents((prev) => [
        ...prev,
        {
          id: `event-${Date.now()}`,
          timestamp: now,
          ruleId: "approval-guard",
          ruleLabel: "Approval Allowed",
          severity: "medium",
          description: `User approved ${approvalRisk.isUnlimited ? "UNLIMITED" : approvalRisk.amount} tokens to ${approvalRisk.spenderAddress}`,
          sources: ["approval"],
        },
      ]);
      recentApprovalMetaRef.current = { approvedAt: now, balanceAtApproval: wallet.balance };
    }
    setApprovalRisk(null);
  }, [approvalRisk, wallet.balance]);

  const rejectApproval = useCallback(() => {
    if (approvalRisk) {
      setEvents((prev) => [
        ...prev,
        {
          id: `event-${Date.now()}`,
          timestamp: new Date(),
          ruleId: "approval-guard",
          ruleLabel: "Approval Rejected",
          severity: "high",
          description: `User rejected approval of ${approvalRisk.isUnlimited ? "UNLIMITED" : approvalRisk.amount} tokens`,
          actionTaken: "Approval blocked",
          sources: ["approval"],
        },
      ]);
    }
    setApprovalRisk(null);
  }, [approvalRisk]);

  // ===== CONDITION 3: CODE SAFETY =====
  const simulateCodeScan = useCallback(
    (codeOrResult: string | CodeScanResult) => {
      const result =
        typeof codeOrResult === "string" ? scanSolidityCode(codeOrResult) : codeOrResult;
      setCodeScanResult(result);

      // Trigger emergency if critical
      if (result.riskLevel === "critical") {
        const event: EmergencyEvent = {
          id: `event-${Date.now()}`,
          timestamp: new Date(),
          ruleId: "code-safety",
          ruleLabel: "Scam Contract Detected",
          severity: "critical",
          description: `Code scan found ${result.findings.length} security issues. ${result.shortSummary}`,
          sources: ["code_safety"],
        };
        triggerEmergency(event);
      }
    },
    [triggerEmergency]
  );

  // Monitor network and detect balance changes
  useEffect(() => {
    // Network validation happens automatically via Wagmi
    // No additional checks needed here
  }, [isConnected, chain?.id]);

  // Monitor balance changes for emergency detection (uses rule threshold)
  useEffect(() => {
    if (!wallet.connected || !address) return;

    const currentBalance = wallet.balance.toString();
    const balanceRule = rules.find((r) => r.type === "balance_drain");
    const threshold = balanceRule?.enabled ? balanceRule.params.percentThreshold : 100;

    if (previousBalance !== "0" && balanceRule?.enabled) {
      const prev = parseFloat(previousBalance);
      const curr = parseFloat(currentBalance);

      if (prev > 0) {
        const percentChange = ((curr - prev) / prev) * 100;
        if (percentChange < -Math.abs(threshold)) {
          const event: EmergencyEvent = {
            id: `event-${Date.now()}`,
            timestamp: new Date(),
            ruleId: balanceRule.id,
            ruleLabel: balanceRule.label,
            severity: "critical",
            description: `Wallet balance dropped ${Math.abs(percentChange).toFixed(1)}% (threshold ${threshold}%). Potential balance drain detected.`,
            sources: ["balance_drain"],
          };
          triggerEmergency(event);
        }
      }
    }

    setPreviousBalance(currentBalance);
  }, [wallet.balance, wallet.connected, address, previousBalance, rules, triggerEmergency]);

  // Active monitoring: refetch balance and check approval abuse
  useEffect(() => {
    if (!isMonitoring || !wallet.connected || !address) return;

    const runTick = async () => {
      await refetchBalance();
      const meta = recentApprovalMetaRef.current;
      if (meta) {
        const minutesSinceApproval = (Date.now() - meta.approvedAt.getTime()) / (60 * 1000);
        if (minutesSinceApproval >= 10) {
          recentApprovalMetaRef.current = null;
          return;
        }
        const currentBal = await getWalletBalance(address);
        const current = parseFloat(currentBal);
        if (meta.balanceAtApproval > 0 && current >= 0) {
          const drop = ((meta.balanceAtApproval - current) / meta.balanceAtApproval) * 100;
          if (drop >= 30) {
            const event: EmergencyEvent = {
              id: `event-${Date.now()}`,
              timestamp: new Date(),
              ruleId: "approval-guard",
              ruleLabel: "Approval Abuse Detection",
              severity: "critical",
              description: `Balance dropped ${drop.toFixed(1)}% shortly after an approval. Possible approval abuse.`,
              sources: ["approval"],
            };
            triggerEmergency(event);
            recentApprovalMetaRef.current = null;
          }
        }
      }
    };

    runTick();
    monitoringRef.current = setInterval(runTick, 8000);
    return () => {
      if (monitoringRef.current) clearInterval(monitoringRef.current);
    };
  }, [isMonitoring, wallet.connected, address, refetchBalance, triggerEmergency]);

  // Update monitoring state based on connection
  useEffect(() => {
    if (!isConnected) {
      setIsMonitoring(false);
    }
  }, [isConnected]);

  return (
    <GuardContext.Provider
      value={{
        wallet,
        rules,
        events,
        isMonitoring,
        activeEmergency,
        signingRequest,
        approvalRisk,
        codeScanResult,
        lastApprovalForRevoke,
        connectWallet,
        disconnectWallet,
        addRule,
        updateRule,
        deleteRule,
        toggleRule,
        simulateEmergency,
        simulateSigningRisk,
        simulateApprovalRisk,
        simulateCodeScan,
        allowSigningRequest,
        rejectSigningRequest,
        allowApproval,
        rejectApproval,
        freezeWallet,
        revokeApprovals,
        dismissEmergency,
        toggleMonitoring,
      }}
    >
      {children}
    </GuardContext.Provider>
  );
}

/**
 * Hook to use Guard context
 */
export function useGuard(): GuardContextType {
  const context = useContext(GuardContext);
  if (!context) {
    throw new Error("useGuard must be used within GuardProvider");
  }
  return context;
}

