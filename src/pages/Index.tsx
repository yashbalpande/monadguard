import { useState } from "react";
import { GuardProvider, useGuard } from "@/contexts/GuardContext";
import HeroSection from "@/components/HeroSection";
import ProblemSection from "@/components/ProblemSection";
import SolutionSection from "@/components/SolutionSection";
import MonitoringDashboard from "@/components/MonitoringDashboard";
import EmergencyAlert from "@/components/EmergencyAlert";
import IncidentTimeline from "@/components/IncidentTimeline";
import DemoTriggers from "@/components/DemoTriggers";
import { SigningModal } from "@/components/SigningModal";
import { CodeScannerModal } from "@/components/CodeScannerModal";
import { ApprovalWarning } from "@/components/ApprovalWarning";

function IndexContent() {
  const {
    simulateSigningRisk,
    simulateApprovalRisk,
    simulateCodeScan,
    signingRequest,
    approvalRisk,
    allowSigningRequest,
    rejectSigningRequest,
    allowApproval,
    rejectApproval,
  } = useGuard();

  const [codeScannerOpen, setCodeScannerOpen] = useState(false);

  const handleSimulateSign = () => {
    // Simulate a phishing attempt - domain mimicking Uniswap
    simulateSigningRisk(
      "uniswapp-swap.xyz",
      "0x1234567890abcdef... [Verify permissions for token transfer]"
    );
  };

  const handleSimulateApproval = () => {
    simulateApprovalRisk(
      "0x68b3465833fb72B5A828cCEd3294860B313B67c5",
      "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
      "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
    );
  };

  const handleSimulateCode = (code: string) => {
    simulateCodeScan(code);
  };

  return (
    <>
      <div className="w-full min-h-screen bg-background text-foreground overflow-y-auto">
        <HeroSection />
        <ProblemSection />
        <SolutionSection />
        <MonitoringDashboard />
        <DemoTriggers
          onSimulateSign={handleSimulateSign}
          onSimulateApproval={handleSimulateApproval}
          onOpenCodeScanner={() => setCodeScannerOpen(true)}
        />
        <IncidentTimeline />
      </div>

      {/* Modals for all three conditions */}
      <SigningModal
        isOpen={!!signingRequest}
        request={signingRequest}
        onAllow={allowSigningRequest}
        onReject={rejectSigningRequest}
      />

      <ApprovalWarning
        isOpen={!!approvalRisk}
        risk={approvalRisk}
        onAllow={allowApproval}
        onReject={rejectApproval}
      />

      <CodeScannerModal
        isOpen={codeScannerOpen}
        onClose={() => setCodeScannerOpen(false)}
        onScanComplete={handleSimulateCode}
      />

      <EmergencyAlert />
    </>
  );
}

const Index = () => {
  return (
    <GuardProvider>
      <IndexContent />
    </GuardProvider>
  );
};

export default Index;
