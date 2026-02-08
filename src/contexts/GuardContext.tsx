import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";

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
}

interface WalletState {
  connected: boolean;
  address: string | null;
  balance: number;
  emergencyMode: boolean;
}

interface GuardContextType {
  wallet: WalletState;
  rules: EmergencyRule[];
  events: EmergencyEvent[];
  isMonitoring: boolean;
  activeEmergency: EmergencyEvent | null;
  connectWallet: () => void;
  disconnectWallet: () => void;
  addRule: (rule: Omit<EmergencyRule, "id">) => void;
  updateRule: (id: string, updates: Partial<EmergencyRule>) => void;
  deleteRule: (id: string) => void;
  toggleRule: (id: string) => void;
  simulateEmergency: (type: EmergencyRule["type"]) => void;
  freezeWallet: () => void;
  revokeApprovals: () => void;
  dismissEmergency: () => void;
  toggleMonitoring: () => void;
}

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
  const [wallet, setWallet] = useState<WalletState>({
    connected: false,
    address: null,
    balance: 4.2069,
    emergencyMode: false,
  });
  const [rules, setRules] = useState<EmergencyRule[]>(DEFAULT_RULES);
  const [events, setEvents] = useState<EmergencyEvent[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [activeEmergency, setActiveEmergency] = useState<EmergencyEvent | null>(null);
  const monitoringRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const connectWallet = useCallback(() => {
    setWallet({
      connected: true,
      address: generateAddress(),
      balance: 4.2069,
      emergencyMode: false,
    });
    setIsMonitoring(true);
  }, []);

  const disconnectWallet = useCallback(() => {
    setWallet({ connected: false, address: null, balance: 0, emergencyMode: false });
    setIsMonitoring(false);
    if (monitoringRef.current) clearInterval(monitoringRef.current);
  }, []);

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
    setWallet((prev) => ({ ...prev, emergencyMode: true }));
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
      };

      setWallet((prev) => ({ ...prev, balance: type === "balance_drain" ? prev.balance * 0.69 : prev.balance }));
      triggerEmergency(event);
    },
    [rules, triggerEmergency]
  );

  const freezeWallet = useCallback(() => {
    setWallet((prev) => ({ ...prev, emergencyMode: true }));
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

  const revokeApprovals = useCallback(() => {
    if (activeEmergency) {
      setEvents((prev) =>
        prev.map((e) =>
          e.id === activeEmergency.id
            ? { ...e, actionTaken: "All ERC-20 approvals revoked", estimatedLossPrevented: "~2.1 MON ($4,599)" }
            : e
        )
      );
    }
  }, [activeEmergency]);

  const dismissEmergency = useCallback(() => {
    setActiveEmergency(null);
  }, []);

  const toggleMonitoring = useCallback(() => {
    setIsMonitoring((prev) => !prev);
  }, []);

  // Simulated heartbeat
  useEffect(() => {
    if (isMonitoring && wallet.connected) {
      monitoringRef.current = setInterval(() => {
        // Just keeps the monitoring alive — real version would poll
      }, 5000);
      return () => {
        if (monitoringRef.current) clearInterval(monitoringRef.current);
      };
    }
  }, [isMonitoring, wallet.connected]);

  return (
    <GuardContext.Provider
      value={{
        wallet,
        rules,
        events,
        isMonitoring,
        activeEmergency,
        connectWallet,
        disconnectWallet,
        addRule,
        updateRule,
        deleteRule,
        toggleRule,
        simulateEmergency,
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

export function useGuard() {
  const ctx = useContext(GuardContext);
  if (!ctx) throw new Error("useGuard must be used within GuardProvider");
  return ctx;
}
