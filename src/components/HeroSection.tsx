import { motion } from "framer-motion";
import { Shield, ChevronDown, AlertCircle } from "lucide-react";
import { useGuard } from "@/contexts/GuardContext";
import { useAccount } from "wagmi";
import { MONAD_CHAIN_ID } from "@/lib/chains";

export default function HeroSection() {
  const { wallet, connectWallet, isMonitoring } = useGuard();
  const { chain } = useAccount();
  const isWrongNetwork = wallet.connected && chain?.id !== MONAD_CHAIN_ID;

  return (
    <section className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden bg-gradient-dark grid-bg py-20 px-6">
      {/* Scanline overlay */}
      <div className="absolute inset-0 scanline pointer-events-none opacity-30" />
      
      {/* Floating orb */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-cyber/5 blur-[120px] animate-pulse-glow" />
      
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="w-20 h-20 rounded-2xl bg-gradient-cyber border border-cyber glow-cyber flex items-center justify-center mx-auto">
            <Shield className="w-10 h-10 text-primary" />
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-sm font-mono tracking-[0.3em] uppercase text-primary/70 mb-6"
        >
          Wallet Protection · Monad Testnet
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-5xl md:text-7xl font-black leading-[1.05] tracking-tight mb-8"
        >
          React faster to{" "}
          <span className="text-gradient-cyber">wallet threats.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-12 leading-relaxed"
        >
          Watches your wallet for risky transactions. Alerts you when something looks wrong.
          You decide what to do next.
        </motion.p>

        {/* Network Warning */}
        {isWrongNetwork && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/30 flex items-center gap-2 max-w-2xl"
          >
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
            <p className="text-sm text-destructive">
              Wrong network detected. Please switch to Monad Testnet (Chain ID: {MONAD_CHAIN_ID})
            </p>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 items-center"
        >
          {!wallet.connected ? (
            <button
              onClick={connectWallet}
              className="px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-lg glow-cyber-strong hover:brightness-110 transition-all duration-300 active:scale-95"
            >
              Connect Wallet to Monad
            </button>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="px-6 py-3 rounded-xl bg-gradient-cyber border border-cyber font-mono text-sm text-primary">
                {wallet.address?.slice(0, 6)}...{wallet.address?.slice(-4)}
              </div>
              <div className="px-6 py-2 rounded-lg bg-primary/10 border border-primary/20 font-mono text-xs text-primary/80">
                {isMonitoring ? "Monitoring Active" : "Monitoring Inactive"} · {wallet.balance.toFixed(4)} MON
              </div>
            </div>
          )}
          <a
            href="#problem"
            className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
          >
            Learn more ↓
          </a>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <ChevronDown className="w-6 h-6 text-muted-foreground animate-bounce" />
      </motion.div>
    </section>
  );
}
