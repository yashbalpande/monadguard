import { motion } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";
import { useState } from "react";

interface ScamWarningProps {
  domain?: string;
  isVisible?: boolean;
}

export default function ScamWarning({ domain, isVisible = false }: ScamWarningProps) {
  const [dismissed, setDismissed] = useState(false);

  if (!isVisible || dismissed) return null;

  // Check if domain looks suspicious
  const isSuspicious =
    domain &&
    (/uniswap\w+\.xyz/.test(domain) ||
      /opensea\w+\.xyz/.test(domain) ||
      /etherscan\w+\.xyz/.test(domain) ||
      /defi[\w]*\.xyz/.test(domain) ||
      /[\-]{2,}/.test(domain));

  if (!isSuspicious) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed top-0 left-0 right-0 z-50 bg-destructive text-destructive-foreground px-4 py-3"
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <div>
            <p className="font-semibold">Warning: Suspicious Website</p>
            <p className="text-sm opacity-90">
              This website appears to be impersonating a legitimate DeFi application. Do not enter your wallet seed phrase or sign any transactions.
            </p>
          </div>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="flex-shrink-0 hover:opacity-80 transition-opacity"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
}
