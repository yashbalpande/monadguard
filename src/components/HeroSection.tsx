import { motion } from "framer-motion";
import { Shield, ChevronDown } from "lucide-react";
import { useGuard } from "@/contexts/GuardContext";

export default function HeroSection() {
  const { wallet, connectWallet } = useGuard();

  return (
    <section className="section-snap bg-gradient-dark grid-bg relative">
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
          Onchain Emergency Guard · Monad
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-5xl md:text-7xl font-black leading-[1.05] tracking-tight mb-8"
        >
          When something goes wrong,{" "}
          <span className="text-gradient-cyber">seconds save money.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-12 leading-relaxed"
        >
          Real-time wallet monitoring. Instant emergency detection. One-click safety actions.
          Your onchain guardian never sleeps.
        </motion.p>

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
              Connect Wallet
            </button>
          ) : (
            <div className="px-6 py-3 rounded-xl bg-gradient-cyber border border-cyber font-mono text-sm text-primary">
              ✓ {wallet.address?.slice(0, 6)}...{wallet.address?.slice(-4)}
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
