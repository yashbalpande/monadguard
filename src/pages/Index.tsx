import { useState } from "react";
import { GuardProvider, useGuard } from "@/contexts/GuardContext";
import HeroSection from "@/components/HeroSection";
import ProblemSection from "@/components/ProblemSection";
import SolutionSection from "@/components/SolutionSection";
import MonitoringDashboard from "@/components/MonitoringDashboard";
import EmergencyAlert from "@/components/EmergencyAlert";
import IncidentTimeline from "@/components/IncidentTimeline";
import HowItWorksSection from "@/components/HowItWorksSection";
import DemoTriggers from "@/components/DemoTriggers";
import { SigningModal } from "@/components/SigningModal";
import { CodeScannerModal } from "@/components/CodeScannerModal";
import { ApprovalWarning } from "@/components/ApprovalWarning";
import type { CodeScanResult } from "@/lib/codeSafety";

function IndexContent() {
  const {
    wallet,
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
    simulateSigningRisk(
      "uniswapp-swap.xyz",
      "0x1234567890abcdef... [Verify permissions for token transfer]"
    );
  };

  const handleSimulateSignThisSite = () => {
    const domain =
      typeof window !== "undefined" && window.location?.hostname
        ? window.location.hostname
        : "localhost";
    simulateSigningRisk(
      domain,
      "Sign in to continue. Nonce: " + Math.random().toString(36).slice(2)
    );
  };

  const handleSimulateSafeSign = () => {
    simulateSigningRisk(
      "uniswap.org",
      "Login to Uniswap. Nonce: xyz789. Timestamp: " + Date.now() + ". Request valid for 5 minutes."
    );
  };

  const handleSimulateApproval = () => {
    simulateApprovalRisk(
      "0x68b3465833fb72B5A828cCEd3294860B313B67c5",
      "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
      "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
    );
  };

  const handleSimulateCode = (result: CodeScanResult) => {
    simulateCodeScan(result);
  };

  const handleSimulateScamCode = () => {
    const scamSnippet = `
contract RugPull {
  address owner;
  function ownerWithdraw() public {
    require(msg.sender == owner);
    selfdestruct(payable(owner));
  }
  function mint(uint max) public {
    // unlimited mint
  }
}
`;
    simulateCodeScan(scamSnippet);
  };

  return (
    <>
      <div className="w-full min-h-screen bg-background text-foreground overflow-y-auto">
        <HeroSection />
        <ProblemSection />
        <SolutionSection />
        <MonitoringDashboard />
        <HowItWorksSection />
        <DemoTriggers
          onSimulateSign={handleSimulateSign}
          onSimulateSignThisSite={handleSimulateSignThisSite}
          onSimulateSafeSign={handleSimulateSafeSign}
          onSimulateApproval={handleSimulateApproval}
          onOpenCodeScanner={() => setCodeScannerOpen(true)}
          onSimulateScamCode={handleSimulateScamCode}
        />
        <IncidentTimeline />
      </div>

      {/* Modals for all three conditions */}
      <SigningModal
        isOpen={!!signingRequest}
        request={signingRequest}
        onAllow={allowSigningRequest}
        onReject={rejectSigningRequest}
        emergencyMode={wallet.emergencyMode}
      />

      <ApprovalWarning
        isOpen={!!approvalRisk}
        risk={approvalRisk}
        onAllow={allowApproval}
        onReject={rejectApproval}
        emergencyMode={wallet.emergencyMode}
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
