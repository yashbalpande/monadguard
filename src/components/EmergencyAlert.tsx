import { motion, AnimatePresence } from "framer-motion";
import { useGuard } from "@/contexts/GuardContext";
import { AlertTriangle, Lock, RotateCcw, X } from "lucide-react";

export default function EmergencyAlert() {
  const { activeEmergency, freezeWallet, revokeApprovals, dismissEmergency } = useGuard();

  return (
    <AnimatePresence>
      {activeEmergency && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-xl"
        >
          {/* Pulsing red background */}
          <div className="absolute inset-0 bg-gradient-emergency pulse-emergency opacity-20" />

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 20 }}
            className="relative z-10 max-w-lg w-full mx-6 bg-gradient-card border border-emergency/50 rounded-2xl overflow-hidden"
          >
            {/* Top emergency bar */}
            <div className="bg-emergency/20 px-6 py-4 flex items-center gap-3 border-b border-emergency/30">
              <div className="w-10 h-10 rounded-full bg-emergency/20 flex items-center justify-center pulse-emergency">
                <AlertTriangle className="w-5 h-5 text-emergency" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-emergency text-lg">🚨 Emergency Detected</p>
                <p className="text-xs text-emergency/70 font-mono">
                  {activeEmergency.timestamp.toLocaleTimeString()} · {activeEmergency.severity.toUpperCase()}
                </p>
              </div>
              <button onClick={dismissEmergency} className="text-muted-foreground hover:text-foreground transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-5">
              <div>
                <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider mb-1">Rule Triggered</p>
                <p className="text-sm font-medium">{activeEmergency.ruleLabel}</p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider mb-1">What Happened</p>
                <p className="text-sm text-foreground/80 leading-relaxed">{activeEmergency.description}</p>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => {
                    freezeWallet();
                    dismissEmergency();
                  }}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl bg-emergency text-emergency-foreground font-semibold text-sm hover:brightness-110 transition-all active:scale-95"
                >
                  <Lock className="w-4 h-4" />
                  Freeze Wallet
                </button>
                <button
                  onClick={() => {
                    revokeApprovals();
                    dismissEmergency();
                  }}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl border border-emergency/50 text-emergency font-semibold text-sm hover:bg-emergency/10 transition-all active:scale-95"
                >
                  <RotateCcw className="w-4 h-4" />
                  Revoke All
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
