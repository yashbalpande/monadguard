import { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle, TrendingUp, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { scanSolidityCode, type CodeScanResult } from "@/lib/codeSafety";

interface CodeScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanComplete: (result: CodeScanResult) => void;
}

export function CodeScannerModal({
  isOpen,
  onClose,
  onScanComplete,
}: CodeScannerModalProps) {
  const [code, setCode] = useState("");
  const [scanResult, setScanResult] = useState<CodeScanResult | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [activeTab, setActiveTab] = useState("input");

  const handleScan = async () => {
    if (!code.trim()) return;

    setIsScanning(true);
    // Simulate scanning delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const result = scanSolidityCode(code);
    setScanResult(result);
    onScanComplete(result);

    setIsScanning(false);
    setActiveTab("results");
  };

  const getRiskBadgeColor = (riskLevel: string) => {
    if (riskLevel === "critical")
      return "bg-destructive text-destructive-foreground";
    if (riskLevel === "warning") return "bg-yellow-500 text-white";
    return "bg-green-500 text-white";
  };

  const getSeverityColor = (severity: string) => {
    if (severity === "critical") return "text-destructive";
    if (severity === "high") return "text-yellow-600";
    if (severity === "medium") return "text-yellow-500";
    return "text-blue-500";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto border-2 border-purple-500/30">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Scan Contract Code
          </DialogTitle>
          <DialogDescription>
            Check Solidity contracts for security issues
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="input">Paste Code</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
          </TabsList>

          <TabsContent value="input" className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold">Solidity Code</label>
              <textarea
                placeholder="Paste your Solidity contract code here..."
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-64 p-3 rounded-lg border border-muted-foreground/20 bg-muted/50 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="text-xs text-muted-foreground">
                {code.length} characters
              </p>
            </div>

            <Alert className="bg-blue-500/5 border-blue-500/20">
              <AlertTriangle className="h-4 w-4 text-blue-600" />
              <AlertTitle>What we check for</AlertTitle>
              <AlertDescription className="text-sm">
                Dangerous patterns, access control issues, risks from unlimited mints and approvals, and arithmetic errors
              </AlertDescription>
            </Alert>

            <Button
              onClick={handleScan}
              disabled={!code.trim() || isScanning}
              className="w-full"
              size="lg"
            >
              {isScanning ? "Scanning..." : "Scan Code"}
            </Button>
          </TabsContent>

          <TabsContent value="results">
            {scanResult ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {/* Summary */}
                <div
                  className={`p-4 rounded-lg border ${
                    scanResult.riskLevel === "critical"
                      ? "bg-destructive/5 border-destructive/30"
                      : scanResult.riskLevel === "warning"
                        ? "bg-yellow-500/5 border-yellow-500/30"
                        : "bg-green-500/5 border-green-500/30"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {scanResult.riskLevel === "critical" ? (
                        <AlertTriangle className="w-5 h-5 text-destructive" />
                      ) : scanResult.riskLevel === "warning" ? (
                        <AlertTriangle className="w-5 h-5 text-yellow-500" />
                      ) : (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      )}
                      <span className="font-semibold">Risk Analysis</span>
                    </div>
                    <Badge className={getRiskBadgeColor(scanResult.riskLevel)}>
                      {scanResult.riskLevel.toUpperCase()}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm">{scanResult.shortSummary}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <TrendingUp className="w-4 h-4" />
                      <span>Risk Score: {scanResult.score}/100</span>
                    </div>
                  </div>
                </div>

                {/* Findings */}
                {scanResult.findings.length > 0 ? (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">
                      Issues Found ({scanResult.findings.length})
                    </h4>
                    {scanResult.findings.map((finding, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="p-3 rounded-lg border border-muted-foreground/10 bg-muted/30 space-y-2"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className={getSeverityColor(finding.severity)}
                            >
                              {finding.severity.toUpperCase()}
                            </Badge>
                            <span className="font-mono text-sm font-semibold">
                              {finding.pattern}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {finding.description}
                        </p>
                        <div className="bg-muted-foreground/5 p-2 rounded text-xs">
                          <p className="font-semibold text-muted-foreground mb-1">
                            Recommendation:
                          </p>
                          <p>{finding.recommendation}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <Alert className="bg-green-500/5 border-green-500/20">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertTitle>No Major Issues</AlertTitle>
                    <AlertDescription>
                      The code passed basic security pattern checks. However,
                      manual review is always recommended.
                    </AlertDescription>
                  </Alert>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setActiveTab("input");
                      setScanResult(null);
                      setCode("");
                    }}
                    className="flex-1"
                  >
                    Scan Another
                  </Button>
                  <Button onClick={onClose} className="flex-1">
                    Close
                  </Button>
                </div>
              </motion.div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>Run a scan to see results here</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
