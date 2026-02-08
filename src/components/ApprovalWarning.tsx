import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import type { ApprovalRisk } from "@/lib/approvalGuard";

interface ApprovalWarningProps {
  isOpen: boolean;
  risk: ApprovalRisk | null;
  onAllow: () => void;
  onReject: () => void;
  emergencyMode?: boolean;
}

export function ApprovalWarning({
  isOpen,
  risk,
  onAllow,
  onReject,
  emergencyMode = false,
}: ApprovalWarningProps) {
  if (!risk) return null;

  const allowBlocked = emergencyMode || risk.riskLevel === "critical";

  const getRiskColor = () => {
    if (risk.riskLevel === "critical")
      return "border-destructive bg-destructive/5";
    if (risk.riskLevel === "warning")
      return "border-yellow-500 bg-yellow-500/5";
    return "border-green-500 bg-green-500/5";
  };

  const getRiskIcon = () => {
    if (risk.riskLevel === "critical")
      return <XCircle className="w-5 h-5 text-destructive" />;
    if (risk.riskLevel === "warning")
      return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
    return <CheckCircle className="w-5 h-5 text-green-500" />;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onReject}>
          <DialogContent className="sm:max-w-lg border-2 border-orange-500/50 bg-gradient-to-br from-background to-orange-950/5">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl">
                {getRiskIcon()}
                <span>
                  {risk.riskLevel === "critical"
                    ? "⚠️ RISKY – Possible scam (unlimited to unknown contract)"
                    : risk.riskLevel === "warning"
                      ? "Review this approval"
                      : "Approval request"}
                </span>
              </DialogTitle>
              <DialogDescription>
                {risk.riskLevel === "critical"
                  ? "We treat this as high scam risk. You can only cancel. Use a limited amount or a known contract instead."
                  : "Review the approval details before confirming."}
              </DialogDescription>
            </DialogHeader>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* Token & Spender Info */}
              <div className={`p-4 rounded-lg border ${getRiskColor()}`}>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground font-semibold mb-1">
                      Token Address
                    </p>
                    <p className="font-mono text-sm break-all">
                      {risk.tokenAddress}
                    </p>
                  </div>
                  <div className="border-t border-muted-foreground/10 pt-3">
                    <p className="text-xs text-muted-foreground font-semibold mb-1">
                      Spender Address
                    </p>
                    <p className="font-mono text-sm break-all">
                      {risk.spenderAddress}
                    </p>
                  </div>
                </div>
              </div>

              {/* Approval Amount */}
              <div className="p-4 rounded-lg bg-muted/50 border border-muted-foreground/20">
                <p className="text-xs text-muted-foreground font-semibold mb-2">
                  Approval Amount
                </p>
                <div className="flex items-center justify-between">
                  <p className="font-mono text-lg break-all">
                    {risk.isUnlimited ? "UNLIMITED" : risk.amount}
                  </p>
                  {risk.isUnlimited && (
                    <Badge className="bg-destructive">UNLIMITED</Badge>
                  )}
                </div>
              </div>

              {/* Risk Analysis */}
              {risk.reasons.length > 0 && (
                <Alert
                  variant={
                    risk.riskLevel === "critical" ? "destructive" : "default"
                  }
                >
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>
                    {risk.riskLevel === "critical"
                      ? "Critical Risks"
                      : "Warnings"}
                  </AlertTitle>
                  <AlertDescription>
                    <ul className="list-disc list-inside space-y-1 mt-2">
                      {risk.reasons.map((reason, idx) => (
                        <li key={idx} className="text-sm">
                          {reason}
                        </li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              {/* Emergency mode: approval blocked */}
              {emergencyMode && (
                <div className="p-4 rounded-lg border-2 border-destructive/50 bg-destructive/10">
                  <p className="text-sm font-semibold text-destructive">
                    Emergency mode: new approvals are blocked. Revoke existing approvals first.
                  </p>
                </div>
              )}

              {/* Safety Recommendations */}
              <div className="p-4 rounded-lg bg-blue-500/5 border border-blue-500/20 space-y-2">
                <p className="text-sm font-semibold text-blue-700">
                  Before you approve
                </p>
                {risk.isUnlimited && (
                  <p className="text-sm text-muted-foreground">
                    You could set a spending limit instead of approving unlimited amount.
                  </p>
                )}
                <p className="text-sm text-muted-foreground">
                  Only approve contracts you trust.
                </p>
                <p className="text-sm text-muted-foreground">
                  Consider revoking old approvals to reduce risk.
                </p>
                {risk.riskLevel !== "safe" && (
                  <p className="text-sm text-yellow-600 font-semibold">
                    ⚠️ Use extreme caution with this approval
                  </p>
                )}
              </div>
            </motion.div>

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                onClick={onReject}
                className="flex-1"
                size="lg"
              >
                Cancel
              </Button>
              <Button
                onClick={onAllow}
                disabled={allowBlocked}
                className="flex-1"
                size="lg"
                variant={allowBlocked ? "outline" : "default"}
              >
                {allowBlocked
                  ? emergencyMode
                    ? "Blocked (emergency)"
                    : "Too Risky for Now"
                  : "Approve"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
