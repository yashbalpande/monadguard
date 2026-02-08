import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, AlertTriangle, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface RuleSetupProps {
  onSimulateSign: () => void;
  onSimulateSignThisSite: () => void;
  onSimulateSafeSign: () => void;
  onSimulateApproval: () => void;
  onOpenCodeScanner: () => void;
  onSimulateScamCode?: () => void;
}

export default function DemoTriggers({
  onSimulateSign,
  onSimulateSignThisSite,
  onSimulateSafeSign,
  onSimulateApproval,
  onOpenCodeScanner,
  onSimulateScamCode,
}: RuleSetupProps) {
  const [activeTab, setActiveTab] = useState<
    "signing" | "approval" | "code" | null
  >(null);

  return (
    <section className="section-snap bg-gradient-dark relative py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Badge className="mb-4 bg-purple-500/20 text-purple-200 border-purple-500/30">
            Demo Mode
          </Badge>
          <h2 className="text-4xl font-bold mb-4">Try It Out</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            See how the system responds to different scenarios. Everything here is simulated.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Condition 1: Signing Risk */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <Card
              className="p-6 border-2 border-yellow-500/30 hover:border-yellow-500/60 transition-colors cursor-pointer"
              onClick={() => setActiveTab("signing")}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-yellow-500" />
                </div>
                <h3 className="text-lg font-bold">1. Signing Risk</h3>
              </div>

              <p className="text-sm text-muted-foreground mb-4">
                When websites ask you to sign a message, we check if it looks legitimate.
              </p>

              <div className="space-y-2 mb-4 text-xs text-muted-foreground">
                <p>Detects unknown domains</p>
                <p>Warns about reusable signatures</p>
                <p>Flags suspicious keywords</p>
              </div>

              <div className="space-y-2">
                <Button
                  onClick={() => {
                    setActiveTab("signing");
                    onSimulateSign();
                  }}
                  className="w-full"
                  variant="outline"
                  size="sm"
                >
                  Risky (phishing domain)
                </Button>
                <Button
                  onClick={() => {
                    setActiveTab("signing");
                    onSimulateSignThisSite();
                  }}
                  variant="ghost"
                  size="sm"
                  className="w-full text-muted-foreground"
                >
                  Sign from this site
                </Button>
                <Button
                  onClick={() => {
                    setActiveTab("signing");
                    onSimulateSafeSign();
                  }}
                  variant="ghost"
                  size="sm"
                  className="w-full text-muted-foreground"
                >
                  Safe (trusted + nonce)
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Condition 2: Approval Abuse */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Card
              className="p-6 border-2 border-orange-500/30 hover:border-orange-500/60 transition-colors cursor-pointer"
              onClick={() => setActiveTab("approval")}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg bg-orange-500/10 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-orange-500" />
                </div>
                <h3 className="text-lg font-bold">2. Approval Abuse</h3>
              </div>

              <p className="text-sm text-muted-foreground mb-4">
                Approvals let contracts spend your tokens. We catch unlimited approvals and suspicious spenders.
              </p>

              <div className="space-y-2 mb-4 text-xs text-muted-foreground">
                <p>Catches unlimited approvals</p>
                <p>Identifies unknown spenders</p>
                <p>Tracks how funds are used after approval</p>
              </div>

              <Button
                onClick={() => {
                  setActiveTab("approval");
                  onSimulateApproval();
                }}
                className="w-full"
                variant="outline"
                size="sm"
              >
                Simulate Approval Request
              </Button>
            </Card>
          </motion.div>

          {/* Condition 3: Code Safety */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <Card
              className="p-6 border-2 border-purple-500/30 hover:border-purple-500/60 transition-colors cursor-pointer"
              onClick={onOpenCodeScanner}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <Code2 className="w-6 h-6 text-purple-500" />
                </div>
                <h3 className="text-lg font-bold">3. Code Safety</h3>
              </div>

              <p className="text-sm text-muted-foreground mb-4">
                Paste a smart contract to see if it has dangerous patterns.
              </p>

              <div className="space-y-2 mb-4 text-xs text-muted-foreground">
                <p>Spots dangerous code patterns</p>
                <p>Checks for access control issues</p>
                <p>Rates contracts by risk level</p>
              </div>

              <div className="space-y-2">
                <Button onClick={onOpenCodeScanner} className="w-full" variant="outline" size="sm">
                  Open Code Scanner
                </Button>
                {onSimulateScamCode && (
                  <Button
                    onClick={onSimulateScamCode}
                    variant="ghost"
                    size="sm"
                    className="w-full text-destructive/80"
                  >
                    Simulate scam contract
                  </Button>
                )}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Info: How they unify */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-lg p-6"
        >
          <h3 className="font-bold mb-3 flex items-center gap-2">
            How They Work Together
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            All three conditions feed into one Emergency Engine that:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-sm">
            <div>
              <p className="font-semibold text-foreground mb-1">Alert</p>
              <p className="text-muted-foreground">You get notified immediately</p>
            </div>
            <div>
              <p className="font-semibold text-foreground mb-1">Restrict</p>
              <p className="text-muted-foreground">Your wallet gets restricted</p>
            </div>
            <div>
              <p className="font-semibold text-foreground mb-1">Protect</p>
              <p className="text-muted-foreground">Safety options appear</p>
            </div>
            <div>
              <p className="font-semibold text-foreground mb-1">Record</p>
              <p className="text-muted-foreground">Everything gets logged</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
