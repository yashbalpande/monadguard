import { motion } from "framer-motion";
import { useGuard } from "@/contexts/GuardContext";
import { Activity, Shield, Wifi, AlertTriangle, Zap, TrendingDown } from "lucide-react";
import { useState, useEffect } from "react";

export default function MonitoringDashboard() {
  const { wallet, rules, isMonitoring, simulateEmergency } = useGuard();
  const [heartbeat, setHeartbeat] = useState(0);

  useEffect(() => {
    if (!isMonitoring || !wallet.connected) return;
    const interval = setInterval(() => setHeartbeat((h) => h + 1), 2000);
    return () => clearInterval(interval);
  }, [isMonitoring, wallet.connected]);

  const activeRules = rules.filter((r) => r.enabled).length;

  return (
    <section className="section-snap bg-gradient-dark grid-bg relative">
      <div className="relative z-10 max-w-4xl mx-auto px-6 w-full">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <p className="text-sm font-mono tracking-[0.3em] uppercase text-primary/70 mb-4">Live</p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Monitoring <span className="text-gradient-cyber">Dashboard</span>
          </h2>
        </motion.div>

        {/* Status cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            {
              icon: Wifi,
              label: "Status",
              value: wallet.connected && isMonitoring ? "Active" : "Offline",
              active: wallet.connected && isMonitoring,
            },
            {
              icon: Activity,
              label: "Heartbeat",
              value: wallet.connected ? `#${heartbeat}` : "—",
              active: wallet.connected,
            },
            {
              icon: Shield,
              label: "Rules Active",
              value: `${activeRules}/${rules.length}`,
              active: activeRules > 0,
            },
            {
              icon: AlertTriangle,
              label: "Balance",
              value: wallet.connected ? `${wallet.balance.toFixed(4)} MON` : "—",
              active: wallet.connected,
            },
          ].map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className={`bg-gradient-card border rounded-xl p-4 ${card.active ? "border-cyber/30" : "border-border"}`}
            >
              <card.icon className={`w-5 h-5 mb-2 ${card.active ? "text-primary" : "text-muted-foreground"}`} />
              <p className="text-xs text-muted-foreground">{card.label}</p>
              <p className={`font-mono font-semibold text-sm mt-1 ${card.active ? "text-foreground" : "text-muted-foreground"}`}>
                {card.value}
              </p>
              {card.label === "Heartbeat" && wallet.connected && (
                <div className="mt-2 h-1 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full heartbeat" style={{ width: "60%" }} />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Emergency mode banner */}
        {wallet.emergencyMode && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-emergency border border-emergency/50 rounded-xl p-4 mb-8 flex items-center gap-3 pulse-emergency"
          >
            <AlertTriangle className="w-6 h-6 text-emergency" />
            <div>
              <p className="font-semibold text-emergency">Emergency Mode Active</p>
              <p className="text-xs text-emergency/70">Only safe actions allowed. Risky transactions blocked.</p>
            </div>
          </motion.div>
        )}

        {/* Simulate buttons */}
        {wallet.connected && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="border border-dashed border-warning/30 rounded-xl p-6"
          >
            <p className="text-xs font-mono text-warning/70 uppercase tracking-widest mb-4">⚡ Simulation Mode</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { type: "balance_drain" as const, icon: TrendingDown, label: "Simulate Drain" },
                { type: "approval_abuse" as const, icon: Shield, label: "Simulate Exploit" },
                { type: "price_crash" as const, icon: Zap, label: "Simulate Crash" },
              ].map((sim) => (
                <button
                  key={sim.type}
                  onClick={() => simulateEmergency(sim.type)}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-warning/10 border border-warning/20 text-warning hover:bg-warning/20 transition-colors text-sm font-medium"
                >
                  <sim.icon className="w-4 h-4" />
                  {sim.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
