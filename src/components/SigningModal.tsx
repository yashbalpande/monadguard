import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, CheckCircle, XCircle, Copy } from "lucide-react";
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
import type { SigningRequest } from "@/lib/signingGuard";

interface SigningModalProps {
  isOpen: boolean;
  request: SigningRequest | null;
  onAllow: () => void;
  onReject: () => void;
}

export function SigningModal({
  isOpen,
  request,
  onAllow,
  onReject,
}: SigningModalProps) {
  const [copied, setCopied] = useState(false);

  const getRiskColor = () => {
    if (!request) return "";
    if (request.riskLevel === "critical")
      return "border-destructive bg-destructive/5";
    if (request.riskLevel === "warning")
      return "border-yellow-500 bg-yellow-500/5";
    return "border-green-500 bg-green-500/5";
  };

  const getRiskIcon = () => {
    if (!request) return null;
    if (request.riskLevel === "critical")
      return <XCircle className="w-5 h-5 text-destructive" />;
    if (request.riskLevel === "warning")
      return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
    return <CheckCircle className="w-5 h-5 text-green-500" />;
  };

  return (
    <AnimatePresence>
      {isOpen && request && (
        <Dialog open={isOpen} onOpenChange={onReject}>
          <DialogContent className="sm:max-w-xl border-2 border-yellow-500/50 bg-gradient-to-br from-background to-yellow-950/5">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl">
                {getRiskIcon()}
                <span>
                  {request.riskLevel === "critical"
                    ? "Risky Signature Request"
                    : request.riskLevel === "warning"
                      ? "Review This Request Carefully"
                      : "Sign This Message?"}
                </span>
              </DialogTitle>
              <DialogDescription className="text-base">
                Review the request details carefully before proceeding
              </DialogDescription>
            </DialogHeader>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* Phishing Warning - highest priority */}
              {request.isPhishingAttempt && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 rounded-lg border-2 border-destructive bg-destructive/10"
                >
                  <div className="flex items-start gap-3">
                    <XCircle className="w-6 h-6 text-destructive flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-destructive mb-1">
                        This looks like a scam
                      </p>
                      <p className="text-sm text-destructive/90">
                        The website is trying to impersonate a legitimate DeFi app. Do not sign anything on this site.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Domain Info with Trust Status */}
              <div className={`p-4 rounded-lg border ${getRiskColor()}`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-muted-foreground">
                    Website
                  </span>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{request.type}</Badge>
                    {request.isDomainTrusted ? (
                      <Badge className="bg-green-500/20 text-green-700 border-green-500/30">Approved</Badge>
                    ) : (
                      <Badge className="bg-yellow-500/20 text-yellow-700 border-yellow-500/30">Unknown</Badge>
                    )}
                  </div>
                </div>
                <p className="font-mono text-lg break-all text-foreground mb-2">{request.domain}</p>
                {!request.isDomainTrusted && (
                  <p className="text-xs text-yellow-700">
                    You haven't approved signing on this domain before. Be extra careful.
                  </p>
                )}
              </div>

              {/* Message Preview */}
              <div className="p-4 rounded-lg bg-muted/50 border border-muted-foreground/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-muted-foreground">
                    Message Content
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(request.message);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                <p className="font-mono text-sm break-all whitespace-pre-wrap max-h-32 overflow-y-auto">
                  {request.message}
                </p>
                {copied && (
                  <p className="text-xs text-green-500 mt-2">Copied!</p>
                )}
              </div>

              {/* Risk Analysis */}
              {request.riskReasons.length > 0 && (
                <Alert
                  variant={
                    request.riskLevel === "critical" ? "destructive" : "default"
                  }
                >
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>
                    {request.riskLevel === "critical"
                      ? request.isPhishingAttempt 
                        ? "Likely scam"
                        : "This looks dangerous"
                      : "Things to check"}
                  </AlertTitle>
                  <AlertDescription>
                    <ul className="list-disc list-inside space-y-1 mt-2">
                      {request.riskReasons.map((reason, idx) => (
                        <li key={idx} className="text-sm">
                          {reason}
                        </li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              {/* Safety Tips */}
              <div className="p-4 rounded-lg bg-blue-500/5 border border-blue-500/20">
                <p className="text-sm font-semibold mb-2 text-blue-700">
                  How to stay safe
                </p>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  {request.isPhishingAttempt ? (
                    <>
                      <li>This website is impersonating a known service</li>
                      <li>Scammers make fake versions to steal your funds</li>
                      <li>Leave this site immediately and verify the real URL</li>
                      <li>Always check your bookmarks for the real website</li>
                    </>
                  ) : (
                    <>
                      <li>Only sign if you recognize and trust this website</li>
                      <li>Check the domain carefully for typos or tricks</li>
                      <li>Never sign messages you don't fully understand</li>
                      <li>When in doubt, close the tab and don't sign</li>
                    </>
                  )}
                </ul>
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
                Don't Sign
              </Button>
              <Button
                onClick={onAllow}
                disabled={request.riskLevel === "critical"}
                className="flex-1"
                size="lg"
                variant={
                  request.riskLevel === "critical" ? "outline" : "default"
                }
              >
                {request.riskLevel === "critical"
                  ? "Too Risky to Allow"
                  : "Continue"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
