import { motion } from "framer-motion";
import { AlertTriangle, XCircle, FileWarning, ListChecks } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";

export default function HowItWorksSection() {
  const [open, setOpen] = useState(false);

  return (
    <section className="section-snap bg-gradient-dark relative py-16 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <p className="text-sm font-mono tracking-[0.3em] uppercase text-primary/70 mb-4">Guide</p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            How you’ll know if it’s a scam or an incident
          </h2>
        </motion.div>

        <Collapsible open={open} onOpenChange={setOpen}>
          <CollapsibleTrigger asChild>
            <button
              type="button"
              className="w-full py-4 px-5 rounded-xl bg-primary/10 border border-primary/30 text-left font-semibold text-primary hover:bg-primary/15 transition-colors flex items-center justify-between"
            >
              <span>When do we say “scam” vs “warning” vs “incident”?</span>
              <span className="text-2xl text-primary/70">{open ? "−" : "+"}</span>
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="mt-4 space-y-6 rounded-xl border border-border bg-card/50 p-6">
              {/* 1. SCAM */}
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-destructive/20 flex items-center justify-center flex-shrink-0">
                  <XCircle className="w-6 h-6 text-destructive" />
                </div>
                <div>
                  <h3 className="font-bold text-destructive mb-1">When we say “SCAM” or “Blocked”</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    We block the action and show a red warning. You cannot proceed with “Continue” or “Approve”.
                  </p>
                  <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                    <li><strong>Signing:</strong> Domain matches known phishing (e.g. uniswapp-swap.xyz), or message is dangerous (no nonce, grants token access).</li>
                    <li><strong>Approval:</strong> Unlimited approval to an unknown contract = high scam risk.</li>
                    <li><strong>Code scan:</strong> Contract has critical patterns (e.g. selfdestruct, owner withdraw, delegatecall).</li>
                  </ul>
                </div>
              </div>

              {/* 2. WARNING */}
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-bold text-yellow-600 dark:text-yellow-500 mb-1">When we say “Warning” or “Review”</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    We don’t block, but we ask you to check carefully. You can still choose to proceed.
                  </p>
                  <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                    <li>Unknown domain (you haven’t approved it before).</li>
                    <li>Approval to an unknown spender (but not unlimited).</li>
                    <li>Code with medium/high risk (e.g. unchecked math, hardcoded addresses).</li>
                  </ul>
                </div>
              </div>

              {/* 3. INCIDENT / ERROR OCCURRED */}
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-emergency/20 flex items-center justify-center flex-shrink-0">
                  <FileWarning className="w-6 h-6 text-emergency" />
                </div>
                <div>
                  <h3 className="font-bold text-emergency mb-1">When an “incident” or “error” has occurred</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Something risky was detected or you took a safety action. We record it and may show an emergency screen.
                  </p>
                  <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                    <li><strong>Emergency popup:</strong> Red full-screen alert = an incident just happened (scam attempt, approval abuse, dangerous code, or big balance drop).</li>
                    <li><strong>Incident timeline:</strong> Every event is logged with time, what triggered it (Condition 1/2/3), and what you did (blocked, allowed, revoked).</li>
                    <li><strong>Red banner:</strong> “Wallet Restricted” = you’re in emergency mode; risky actions are blocked until you revoke or dismiss.</li>
                  </ul>
                </div>
              </div>

              {/* Quick reference */}
              <div className="pt-4 border-t border-border flex items-start gap-3">
                <ListChecks className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold text-foreground mb-1">Quick reference</p>
                  <p className="text-muted-foreground">
                    <strong className="text-destructive">Red + “Don’t Sign” / “Too Risky”</strong> = we treat it as a scam; action is blocked.{" "}
                    <strong className="text-emergency">Emergency popup</strong> = an incident was detected.{" "}
                    <strong className="text-primary">Incident timeline</strong> = full history of what happened and what you did.
                  </p>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </section>
  );
}
