import { ethers } from "ethers";

export interface ApprovalRisk {
  isApproval: boolean;
  isUnlimited: boolean;
  spenderAddress: string;
  tokenAddress: string;
  amount: string;
  riskLevel: "safe" | "warning" | "critical";
  reasons: string[];
}

/**
 * Check if a transaction is an ERC-20 approval
 */
export function detectApprovalTx(data: string): boolean {
  // ERC-20 approve() function selector: 0x095ea7b3
  return data.startsWith("0x095ea7b3");
}

/**
 * Decode ERC-20 approve transaction
 */
export function decodeApprovalTx(data: string): {
  spender: string;
  amount: string;
} | null {
  if (!data.startsWith("0x095ea7b3") || data.length < 138) {
    return null;
  }

  try {
    // Parse the encoded data
    // approve(address spender, uint256 amount)
    const spender = "0x" + data.slice(34, 74);
    const amountHex = data.slice(74);
    const amount = ethers.toBeHex(amountHex);

    return {
      spender: ethers.getAddress(spender),
      amount,
    };
  } catch (error) {
    console.error("Error decoding approval:", error);
    return null;
  }
}

/**
 * Analyze approval risk
 */
export function analyzeApprovalRisk(
  spender: string,
  amount: string,
  tokenAddress: string
): ApprovalRisk {
  const reasons: string[] = [];
  let riskLevel: "safe" | "warning" | "critical" = "safe";

  const MAX_UINT256 =
    "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";
  const isUnlimited =
    amount === MAX_UINT256 ||
    ethers.toBigInt(amount) >
      ethers.toBigInt("0xffffffffffffffff"); // uint64 max check

  // Check 1: Unlimited approval
  if (isUnlimited) {
    reasons.push("Unlimited approval - can drain entire token balance");
    riskLevel = "critical";
  }

  // Check 2: Unknown spender
  const knownSpenders = [
    "0x1111111254fb6c44bac0bed2854e76f90643097d", // 1inch
    "0xe592427a0aece92de3edee1f18e0157c05861564", // Uniswap V3
    "0x68b3465833fb72B5A828cCEd3294860B313B67c5", // Uniswap V2/V3
    "0x7a250d5630b4cf539739df2c5dacb4c659f2488d", // Uniswap V2
  ];

  const isKnownSpender = knownSpenders.some(
    (s) => s.toLowerCase() === spender.toLowerCase()
  );

  if (!isKnownSpender) {
    reasons.push(`Unknown spender address: ${spender.substring(0, 10)}...`);
    riskLevel = "warning";
  }

  // Check 3: Combination check
  if (isUnlimited && !isKnownSpender) {
    riskLevel = "critical";
    if (!reasons.includes("Combination: unlimited + unknown spender")) {
      reasons.push(
        "Combination: unlimited approval to unknown contract - HIGH RISK"
      );
    }
  }

  return {
    isApproval: true,
    isUnlimited,
    spenderAddress: spender,
    tokenAddress,
    amount,
    riskLevel,
    reasons,
  };
}

interface Transaction {
  timestamp?: number;
  from?: string;
}

/**
 * Monitor for approval abuse after approval is made
 */
export function detectApprovalAbuse(
  approvalTime: Date,
  approvalAmount: string,
  spenderAddress: string,
  recentTransactions: Transaction[]
): {
  isAbused: boolean;
  abuseSigns: string[];
  severity: "safe" | "warning" | "critical";
} {
  const abuseSigns: string[] = [];
  let isAbused = false;
  let severity: "safe" | "warning" | "critical" = "safe";

  // Check if spender made large transfers shortly after approval
  for (const tx of recentTransactions) {
    const txTime = new Date(tx.timestamp || 0);
    const timeDiff = txTime.getTime() - approvalTime.getTime();

    // If transaction happened within 5 minutes
    if (timeDiff > 0 && timeDiff < 5 * 60 * 1000) {
      // Check if it's a transfer from the spender
      if (tx.from?.toLowerCase() === spenderAddress.toLowerCase()) {
        abuseSigns.push(
          `Suspicious transfer from spender within ${Math.round(timeDiff / 1000)} seconds`
        );
        isAbused = true;
        severity = "critical";
      }
    }
  }

  // Check if no legitimate swap happened
  if (recentTransactions.length === 0 && approvalAmount !== "0") {
    abuseSigns.push("Approval made but no swap detected");
    severity = "warning";
  }

  return { isAbused, abuseSigns, severity };
}
