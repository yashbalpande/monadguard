import { useState } from "react";
import { Trash2, Lock, Unlock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TokenApproval {
  id: string;
  token: string;
  tokenSymbol: string;
  spender: string;
  spenderName: string;
  amount: string;
  isUnlimited: boolean;
  riskLevel: "safe" | "warning" | "critical";
}

const MOCK_APPROVALS: TokenApproval[] = [
  {
    id: "1",
    token: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    tokenSymbol: "USDC",
    spender: "0x68b3465833fb72B5A828cEDA7c5fD54DF32270F3",
    spenderName: "Uniswap V3 Router",
    amount: "1000",
    isUnlimited: false,
    riskLevel: "safe",
  },
  {
    id: "2",
    token: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    tokenSymbol: "USDT",
    spender: "0x7a250d5630b4cf539739df2c5dacb4c659f2488d",
    spenderName: "Uniswap V2 Router",
    amount: "unlimited",
    isUnlimited: true,
    riskLevel: "warning",
  },
  {
    id: "3",
    token: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    tokenSymbol: "DAI",
    spender: "0x1E0447884a6a996CceAFf73d403fDE132E37138D",
    spenderName: "Unknown Contract",
    amount: "unlimited",
    isUnlimited: true,
    riskLevel: "critical",
  },
];

export default function ApprovalManager() {
  const [approvals, setApprovals] = useState<TokenApproval[]>(MOCK_APPROVALS);
  const [selectedApproval, setSelectedApproval] = useState<string | null>(null);

  const handleRevoke = (id: string) => {
    setApprovals(approvals.filter((a) => a.id !== id));
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "safe":
        return "text-green-400";
      case "warning":
        return "text-yellow-400";
      case "critical":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  const getRiskBgColor = (risk: string) => {
    switch (risk) {
      case "safe":
        return "bg-green-950";
      case "warning":
        return "bg-yellow-950";
      case "critical":
        return "bg-red-950";
      default:
        return "bg-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Token Approvals</h2>
        <p className="text-gray-400">
          See which contracts have permission to spend your tokens
        </p>
      </div>

      <div className="grid gap-4">
        {approvals.length === 0 ? (
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 text-center">
            <p className="text-gray-400">No approvals found</p>
          </div>
        ) : (
          approvals.map((approval) => (
            <div
              key={approval.id}
              className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                selectedApproval === approval.id
                  ? "border-purple-500 bg-purple-950"
                  : "border-gray-700 bg-gray-800 hover:bg-gray-750"
              }`}
              onClick={() =>
                setSelectedApproval(
                  selectedApproval === approval.id ? null : approval.id
                )
              }
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div>
                      <h3 className="font-semibold text-white">
                        {approval.tokenSymbol}
                      </h3>
                      <p className="text-xs text-gray-500 font-mono">
                        {approval.token.slice(0, 6)}...{approval.token.slice(-4)}
                      </p>
                    </div>
                    <div className={`text-xs font-semibold px-2 py-1 rounded ${getRiskColor(approval.riskLevel)} ${getRiskBgColor(approval.riskLevel)}`}>
                      {approval.riskLevel.toUpperCase()}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="text-gray-400">Approved to: </span>
                      <span className="text-white font-medium">
                        {approval.spenderName}
                      </span>
                      <br />
                      <span className="text-xs text-gray-500 font-mono">
                        {approval.spender.slice(0, 6)}...{approval.spender.slice(-4)}
                      </span>
                    </div>

                    <div className="text-sm">
                      <span className="text-gray-400">Limit: </span>
                      <span className="text-white font-mono">
                        {approval.isUnlimited ? (
                          <span className="flex items-center gap-1 text-red-400">
                            <Lock className="w-4 h-4" /> UNLIMITED
                          </span>
                        ) : (
                          <span>{approval.amount}</span>
                        )}
                      </span>
                    </div>

                    {approval.isUnlimited && (
                      <div className="bg-red-950 border border-red-800 rounded p-2 text-xs text-red-300">
                        ⚠️ This approval has no spending limit. The contract can drain your balance.
                      </div>
                    )}
                  </div>
                </div>

                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRevoke(approval.id);
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white"
                  size="sm"
                >
                  <Trash2 className="w-4 h-4" />
                  Revoke
                </Button>
              </div>

              {selectedApproval === approval.id && (
                <div className="mt-4 pt-4 border-t border-gray-700 space-y-3">
                  <div className="text-xs text-gray-400 space-y-2">
                    {approval.riskLevel === "critical" && (
                      <div className="bg-red-950 border border-red-800 rounded p-3">
                        <strong className="text-red-300">Critical Risk:</strong>
                        <p>Unknown contract with unlimited approval. Revoke immediately.</p>
                      </div>
                    )}
                    {approval.isUnlimited && approval.riskLevel !== "critical" && (
                      <div className="bg-yellow-950 border border-yellow-800 rounded p-3">
                        <strong className="text-yellow-300">Warning:</strong>
                        <p>Consider setting a spending limit to reduce risk.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-sm text-gray-300">
        <p className="font-semibold mb-2">💡 Best Practices:</p>
        <ul className="space-y-1 text-xs">
          <li>• Revoke unlimited approvals to unknown contracts</li>
          <li>• Keep approvals for well-known protocols (Uniswap, Aave)</li>
          <li>• Set spending limits when possible</li>
          <li>• Regularly audit your approvals</li>
        </ul>
      </div>
    </div>
  );
}
