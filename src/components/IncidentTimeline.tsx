import { motion } from "framer-motion";
import { useGuard } from "@/contexts/GuardContext";
import { Clock, Shield, CheckCircle, AlertTriangle } from "lucide-react";

export default function IncidentTimeline() {
  const { events } = useGuard();

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
          <p className="text-sm font-mono tracking-[0.3em] uppercase text-primary/70 mb-4">History</p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Incident <span className="text-gradient-cyber">Timeline</span>
          </h2>
        </motion.div>

        {events.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center py-16"
          >
            <Shield className="w-12 h-12 text-primary/30 mx-auto mb-4" />
            <p className="text-muted-foreground">No incidents yet. Your wallet is safe.</p>
            <p className="text-xs text-muted-foreground/60 mt-2 font-mono">Simulate an emergency to see the timeline</p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {events.map((event, i) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="bg-gradient-card border border-border rounded-xl p-5 relative"
              >
                {/* Timeline line */}
                {i < events.length - 1 && (
                  <div className="absolute left-[29px] top-[60px] bottom-[-16px] w-px bg-border" />
                )}

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-emergency/10 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-5 h-5 text-emergency" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold text-sm">{event.ruleLabel}</p>
                      <span className="text-xs font-mono text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {event.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{event.description}</p>
                    {event.actionTaken && (
                      <div className="flex items-center gap-2 text-xs">
                        <CheckCircle className="w-3.5 h-3.5 text-success" />
                        <span className="text-success">{event.actionTaken}</span>
                        {event.estimatedLossPrevented && (
                          <span className="ml-auto font-mono text-success/70">Saved: {event.estimatedLossPrevented}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
