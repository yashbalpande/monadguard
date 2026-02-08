import { motion } from "framer-motion";
import { Shield, Zap, Bell } from "lucide-react";

const steps = [
  { icon: Shield, title: "Set Rules", desc: "Define what emergencies look like for your wallet." },
  { icon: Zap, title: "Real-Time Watch", desc: "We monitor every block, every transfer, every approval." },
  { icon: Bell, title: "Instant Action", desc: "Alert fires. One click freezes your wallet. Damage stopped." },
];

export default function SolutionSection() {
  return (
    <section className="section-snap bg-gradient-dark grid-bg relative">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyber/30 to-transparent" />
      <div className="relative z-10 max-w-5xl mx-auto px-6 w-full">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-sm font-mono tracking-[0.3em] uppercase text-primary/70 mb-4">The Solution</p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Emergency Guard watches <span className="text-gradient-cyber">24/7.</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              className="text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-cyber border border-cyber glow-cyber flex items-center justify-center mx-auto mb-6">
                <s.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{s.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
