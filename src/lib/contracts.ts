/**
 * Smart Contract ABIs and Configuration
 * Generated from Hardhat compilation artifacts
 */

// Emergency Guard ABI
export const EMERGENCY_GUARD_ABI = [
  {
    type: "function",
    name: "activateEmergency",
    inputs: [{ name: "_reason", type: "string" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "deactivateEmergency",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "addGuardian",
    inputs: [{ name: "_guardian", type: "address" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "removeGuardian",
    inputs: [{ name: "_guardian", type: "address" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "isFrozen",
    inputs: [{ name: "_account", type: "address" }],
    outputs: [{ type: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getEmergencyStatus",
    inputs: [{ name: "_account", type: "address" }],
    outputs: [
      {
        type: "tuple",
        components: [
          { name: "isFrozen", type: "bool" },
          { name: "frozenAt", type: "uint256" },
          { name: "reason", type: "string" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "isGuardian",
    inputs: [
      { name: "_user", type: "address" },
      { name: "_guardian", type: "address" },
    ],
    outputs: [{ type: "bool" }],
    stateMutability: "view",
  },
  {
    type: "event",
    name: "EmergencyActivated",
    inputs: [
      { name: "user", type: "address", indexed: true },
      { name: "reason", type: "string" },
    ],
  },
  {
    type: "event",
    name: "EmergencyDeactivated",
    inputs: [{ name: "user", type: "address", indexed: true }],
  },
] as const;

// Approval Manager ABI
export const APPROVAL_MANAGER_ABI = [
  {
    type: "function",
    name: "trackApproval",
    inputs: [
      { name: "_token", type: "address" },
      { name: "_spender", type: "address" },
      { name: "_amount", type: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "revokeApproval",
    inputs: [
      { name: "_token", type: "address" },
      { name: "_spender", type: "address" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getUserApprovals",
    inputs: [{ name: "_user", type: "address" }],
    outputs: [
      {
        type: "tuple[]",
        components: [
          { name: "token", type: "address" },
          { name: "spender", type: "address" },
          { name: "amount", type: "uint256" },
          { name: "approvedAt", type: "uint256" },
          { name: "isActive", type: "bool" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getApprovalCount",
    inputs: [{ name: "_user", type: "address" }],
    outputs: [{ type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "hasApproval",
    inputs: [
      { name: "_user", type: "address" },
      { name: "_token", type: "address" },
      { name: "_spender", type: "address" },
    ],
    outputs: [{ type: "bool" }],
    stateMutability: "view",
  },
  {
    type: "event",
    name: "ApprovalTracked",
    inputs: [
      { name: "user", type: "address", indexed: true },
      { name: "token", type: "address", indexed: true },
      { name: "spender", type: "address", indexed: true },
      { name: "amount", type: "uint256" },
    ],
  },
  {
    type: "event",
    name: "ApprovalRevoked",
    inputs: [
      { name: "user", type: "address", indexed: true },
      { name: "token", type: "address", indexed: true },
      { name: "spender", type: "address", indexed: true },
    ],
  },
] as const;

// Transaction Validator ABI
export const TRANSACTION_VALIDATOR_ABI = [
  {
    type: "function",
    name: "validateTransaction",
    inputs: [
      { name: "_target", type: "address" },
      { name: "_value", type: "uint256" },
      { name: "_data", type: "bytes" },
    ],
    outputs: [
      {
        type: "tuple",
        components: [
          { name: "isValid", type: "bool" },
          { name: "riskScore", type: "uint256" },
          { name: "riskLevel", type: "string" },
          { name: "warnings", type: "string[]" },
          { name: "validatedAt", type: "uint256" },
        ],
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getValidationHistory",
    inputs: [
      { name: "_user", type: "address" },
      { name: "_limit", type: "uint256" },
    ],
    outputs: [
      {
        type: "tuple[]",
        components: [
          { name: "isValid", type: "bool" },
          { name: "riskScore", type: "uint256" },
          { name: "riskLevel", type: "string" },
          { name: "warnings", type: "string[]" },
          { name: "validatedAt", type: "uint256" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "suspendAddress",
    inputs: [
      { name: "_address", type: "address" },
      { name: "_reason", type: "string" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "unsuspendAddress",
    inputs: [{ name: "_address", type: "address" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "isSuspended",
    inputs: [{ name: "_address", type: "address" }],
    outputs: [{ type: "bool" }],
    stateMutability: "view",
  },
  {
    type: "event",
    name: "TransactionValidated",
    inputs: [
      { name: "user", type: "address", indexed: true },
      { name: "target", type: "address", indexed: true },
      { name: "riskScore", type: "uint256" },
      { name: "riskLevel", type: "string" },
    ],
  },
  {
    type: "event",
    name: "AddressSuspended",
    inputs: [
      { name: "target", type: "address", indexed: true },
      { name: "reason", type: "string" },
    ],
  },
] as const;

// Contract Addresses (configured via environment variables)
export const CONTRACT_ADDRESSES = {
  emergencyGuard: import.meta.env.VITE_EMERGENCY_GUARD_ADDRESS || "",
  approvalManager: import.meta.env.VITE_APPROVAL_MANAGER_ADDRESS || "",
  transactionValidator: import.meta.env.VITE_TRANSACTION_VALIDATOR_ADDRESS || "",
};

// Network Configuration
export const MONAD_TESTNET = {
  id: 10143,
  name: "Monad Testnet",
  rpcUrl: "https://testnet.monad.xyz/rpc",
  explorerUrl: "https://testnet.monad.xyz",
};

/**
 * Check if smart contracts are deployed
 */
export function isContractsDeployed(): boolean {
  return !!(
    CONTRACT_ADDRESSES.emergencyGuard &&
    CONTRACT_ADDRESSES.approvalManager &&
    CONTRACT_ADDRESSES.transactionValidator
  );
}

/**
 * Get contract info for debugging
 */
export function getContractInfo() {
  return {
    deployed: isContractsDeployed(),
    network: MONAD_TESTNET,
    contracts: CONTRACT_ADDRESSES,
  };
}
