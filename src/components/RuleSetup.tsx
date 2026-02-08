import { motion } from "framer-motion";
import { useGuard, type EmergencyRule } from "@/contexts/GuardContext";
import { Shield, Zap, TrendingDown, Trash2 } from "lucide-react";
import { useState } from "react";

const ruleIcons: Record<EmergencyRule["type"], React.ElementType> = {
  balance_drain: TrendingDown,
  approval_abuse: Shield,
  price_crash: Zap,
};

const ruleLabels: Record<EmergencyRule["type"], string> = {
  balance_drain: "Balance Drain",
  approval_abuse: "Approval Abuse",
  price_crash: "Price Crash",
};

export default function RuleSetup() {
  const { rules, toggleRule, deleteRule, addRule, wallet } = useGuard();
  const [showAdd, setShowAdd] = useState(false);
  const [newType, setNewType] = useState<EmergencyRule["type"]>("balance_drain");
  const [newThreshold, setNewThreshold] = useState(30);
  const [newWindow, setNewWindow] = useState(60);

  const handleAdd = () => {
    addRule({
      type: newType,
      enabled: true,
      label: `${ruleLabels[newType]} (${newThreshold}% / ${newWindow}s)`,
      params: { percentThreshold: newThreshold, timeWindowSeconds: newWindow },
    });
    setShowAdd(false);
  };

  return (
    <section className="section-snap bg-gradient-dark relative">
      <div className="relative z-10 max-w-3xl mx-auto px-6 w-full">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <p className="text-sm font-mono tracking-[0.3em] uppercase text-primary/70 mb-4">Configure</p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Emergency <span className="text-gradient-cyber">Rules</span>
          </h2>
          <p className="text-muted-foreground">Define what triggers an emergency for your wallet.</p>
        </motion.div>

        <div className="space-y-4 mb-6">
          {rules.map((rule, i) => {
            const Icon = ruleIcons[rule.type];
            return (
              <motion.div
                key={rule.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className={`bg-gradient-card border rounded-xl p-5 flex items-center justify-between transition-colors ${
                  rule.enabled ? "border-cyber/30" : "border-border opacity-60"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${rule.enabled ? "bg-gradient-cyber" : "bg-muted"}`}>
                    <Icon className={`w-5 h-5 ${rule.enabled ? "text-primary" : "text-muted-foreground"}`} />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{rule.label}</p>
                    <p className="text-xs text-muted-foreground font-mono">
                      {rule.params.percentThreshold > 0 ? `>${rule.params.percentThreshold}%` : "Any event"} within {rule.params.timeWindowSeconds}s
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleRule(rule.id)}
                    className={`w-12 h-6 rounded-full transition-colors relative ${
                      rule.enabled ? "bg-primary" : "bg-muted"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 w-5 h-5 rounded-full bg-foreground transition-transform ${
                        rule.enabled ? "left-[26px]" : "left-0.5"
                      }`}
                    />
                  </button>
                  <button onClick={() => deleteRule(rule.id)} className="text-muted-foreground hover:text-emergency transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {!showAdd ? (
          <button
            onClick={() => setShowAdd(true)}
            className="w-full py-3 rounded-xl border border-dashed border-cyber/30 text-primary/70 hover:text-primary hover:border-cyber/60 transition-colors text-sm font-medium"
          >
            + Add Rule
          </button>
        ) : (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="bg-gradient-card border border-cyber/30 rounded-xl p-6 space-y-4"
          >
            <div className="grid grid-cols-3 gap-3">
              {(["balance_drain", "approval_abuse", "price_crash"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setNewType(t)}
                  className={`py-2 px-3 rounded-lg text-xs font-medium transition-colors ${
                    newType === t ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {ruleLabels[t]}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Threshold %</label>
                <input
                  type="number"
                  value={newThreshold}
                  onChange={(e) => setNewThreshold(Number(e.target.value))}
                  className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm font-mono text-foreground"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Window (sec)</label>
                <input
                  type="number"
                  value={newWindow}
                  onChange={(e) => setNewWindow(Number(e.target.value))}
                  className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm font-mono text-foreground"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={handleAdd} className="flex-1 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm">
                Create Rule
              </button>
              <button onClick={() => setShowAdd(false)} className="px-4 py-2 rounded-lg bg-muted text-muted-foreground text-sm">
                Cancel
              </button>
            </div>
          </motion.div>
        )}

        {!wallet.connected && (
          <p className="text-center text-muted-foreground text-sm mt-6 font-mono">Connect wallet to activate rules</p>
        )}
      </div>
    </section>
  );
}
