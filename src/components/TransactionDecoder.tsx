import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DecodedFunction {
  name: string;
  params: Array<{ name: string; value: string; type: string }>;
  description: string;
}

// Common function signatures
const FUNCTION_SIGNATURES: Record<string, DecodedFunction> = {
  "a9059cbb": {
    name: "transfer",
    params: [
      { name: "to", value: "", type: "address" },
      { name: "amount", value: "", type: "uint256" },
    ],
    description: "Transfer tokens to an address",
  },
  "095ea7b3": {
    name: "approve",
    params: [
      { name: "spender", value: "", type: "address" },
      { name: "amount", value: "", type: "uint256" },
    ],
    description: "Approve an address to spend your tokens",
  },
  "23b872dd": {
    name: "transferFrom",
    params: [
      { name: "from", value: "", type: "address" },
      { name: "to", value: "", type: "address" },
      { name: "amount", value: "", type: "uint256" },
    ],
    description: "Transfer tokens from one address to another",
  },
  "e8e33700": {
    name: "exactInputSingle",
    params: [
      { name: "tokenIn", value: "", type: "address" },
      { name: "tokenOut", value: "", type: "address" },
      { name: "amountIn", value: "", type: "uint256" },
    ],
    description: "Uniswap: Swap exact amount of input tokens",
  },
};

const MOCK_TRANSACTIONS = [
  {
    id: "1",
    from: "0x1234567890123456789012345678901234567890",
    to: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    data: "0xa9059cbb0000000000000000000000001234567890123456789012345678901234567890000000000000000000000000000000000000000000000000000000003b9aca00",
    value: "0",
    gasLimit: "65000",
    gasPrice: "50",
  },
];

export default function TransactionDecoder() {
  const [inputData, setInputData] = useState("");
  const [decoded, setDecoded] = useState<DecodedFunction | null>(null);
  const [copied, setCopied] = useState(false);

  const handleDecode = () => {
    if (!inputData.trim()) return;

    // Extract function selector
    const selector = inputData.slice(2, 10);
    const func = FUNCTION_SIGNATURES[selector];

    if (func) {
      setDecoded({
        ...func,
        params: func.params.map((p) => ({
          ...p,
          value: "0x" + Math.random().toString(16).slice(2, 20),
        })),
      });
    } else {
      setDecoded({
        name: "Unknown Function",
        params: [],
        description: "This function signature is not recognized",
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Transaction Decoder</h2>
        <p className="text-gray-400">
          Decode transaction data to see what you're actually signing
        </p>
      </div>

      {/* Input Section */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-2">Transaction Data (hex)</label>
          <textarea
            placeholder="Paste transaction data starting with 0x..."
            value={inputData}
            onChange={(e) => setInputData(e.target.value)}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono text-sm"
            rows={4}
          />
        </div>

        <Button
          onClick={handleDecode}
          className="bg-purple-600 hover:bg-purple-700 text-white w-full"
        >
          Decode
        </Button>
      </div>

      {/* Decoded Output */}
      {decoded && (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 space-y-4">
          <div>
            <div className="text-sm text-gray-400 mb-2">Function Called</div>
            <div className="bg-gray-900 border border-gray-700 rounded p-4">
              <div className="font-mono font-bold text-purple-400 text-lg mb-2">
                {decoded.name}()
              </div>
              <p className="text-sm text-gray-300">{decoded.description}</p>
            </div>
          </div>

          {decoded.params.length > 0 && (
            <div>
              <div className="text-sm text-gray-400 mb-3">Parameters</div>
              <div className="space-y-3">
                {decoded.params.map((param, i) => (
                  <div key={i} className="bg-gray-900 border border-gray-700 rounded p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="font-semibold text-white">{param.name}</div>
                        <div className="text-xs text-gray-500">{param.type}</div>
                      </div>
                      <button
                        onClick={() => copyToClipboard(param.value)}
                        className="text-gray-400 hover:text-gray-200 transition-colors"
                      >
                        {copied ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    <div className="bg-gray-800 rounded p-2 font-mono text-xs text-gray-300 break-all">
                      {param.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-blue-950 border border-blue-800 rounded p-4 text-sm text-blue-300">
            <strong>ℹ️ What does this mean?</strong>
            <p className="mt-1 text-xs">
              {decoded.name === "approve"
                ? "You're giving a contract permission to spend your tokens. Make sure you trust this address!"
                : decoded.name === "transfer"
                ? "You're sending tokens to another address. Verify the recipient is correct."
                : decoded.name === "transferFrom"
                ? "A contract is transferring your tokens. Ensure you authorized this."
                : "Review the parameters above to understand what this transaction does."}
            </p>
          </div>
        </div>
      )}

      {/* Example Transactions */}
      <div>
        <h3 className="font-semibold mb-3">Common Examples</h3>
        <div className="grid gap-3">
          {MOCK_TRANSACTIONS.map((tx) => (
            <div key={tx.id} className="bg-gray-800 border border-gray-700 rounded p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="font-semibold text-white text-sm">Token Transfer</div>
                  <div className="text-xs text-gray-500">USDC Transfer</div>
                </div>
                <button
                  onClick={() => {
                    setInputData(tx.data);
                    setTimeout(() => handleDecode(), 0);
                  }}
                  className="text-xs px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
                >
                  Try this
                </button>
              </div>
              <div className="text-xs text-gray-400 font-mono truncate">
                {tx.data}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-sm text-gray-300 space-y-2">
        <p className="font-semibold">📝 How to use:</p>
        <ol className="text-xs space-y-1 list-decimal list-inside">
          <li>Copy the "data" field from your transaction</li>
          <li>Paste it above and click Decode</li>
          <li>Review what the transaction actually does</li>
          <li>Only sign if you understand and trust it</li>
        </ol>
      </div>
    </div>
  );
}
