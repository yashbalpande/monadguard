import { motion } from "framer-motion";
import { AlertTriangle, Clock, Eye } from "lucide-react";

const problems = [
  {
    icon: AlertTriangle,
    title: "Wallet Drains",
    desc: "Malicious contracts silently drain your funds. By the time you notice, it's too late.",
  },
  {
    icon: Eye,
    title: "Approval Exploits",
    desc: "Unlimited ERC-20 approvals are weaponized. One compromised protocol means total loss.",
  },
  {
    icon: Clock,
    title: "Delayed Reactions",
    desc: "Manual monitoring fails. Human reaction time can't compete with automated attacks.",
  },
];

export default function ProblemSection() {
  return (
    <section id="problem" className="section-snap bg-gradient-dark relative">
      <div className="absolute inset-0 bg-gradient-emergency opacity-20" />
      <div className="relative z-10 max-w-5xl mx-auto px-6 w-full">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-sm font-mono tracking-[0.3em] uppercase text-emergency/70 mb-4">The Problem</p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Your wallet is <span className="text-gradient-emergency">unprotected.</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {problems.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              className="bg-gradient-card border border-emergency/20 rounded-2xl p-8 hover:border-emergency/40 transition-colors"
            >
              <p.icon className="w-8 h-8 text-emergency mb-5" />
              <h3 className="text-xl font-semibold mb-3">{p.title}</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
