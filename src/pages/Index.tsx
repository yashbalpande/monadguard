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
import ApprovalManager from "@/components/ApprovalManager";
import AddressLabels from "@/components/AddressLabels";
import TransactionDecoder from "@/components/TransactionDecoder";
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
  const [activeTab, setActiveTab] = useState<"overview" | "approvals" | "addresses" | "decoder">("overview");

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
        
        {/* Main Dashboard with Tabs */}
        <div className="bg-gray-950 text-gray-100">
          <div className="max-w-6xl mx-auto px-6 py-12">
            {/* Tab Navigation */}
            <div className="flex gap-2 mb-12 border-b border-gray-800">
              {[
                { id: "overview", label: "Overview" },
                { id: "approvals", label: "Approvals" },
                { id: "addresses", label: "Addresses" },
                { id: "decoder", label: "Decoder" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-3 font-medium text-sm transition-colors border-b-2 ${
                    activeTab === tab.id
                      ? "border-purple-500 text-purple-400"
                      : "border-transparent text-gray-400 hover:text-gray-200"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === "overview" && (
              <div className="space-y-8">
                <MonitoringDashboard />
                <IncidentTimeline />
              </div>
            )}
            {activeTab === "approvals" && <ApprovalManager />}
            {activeTab === "addresses" && <AddressLabels />}
            {activeTab === "decoder" && <TransactionDecoder />}
          </div>
        </div>
        
        <HowItWorksSection />
        <DemoTriggers
          onSimulateSign={handleSimulateSign}
          onSimulateSignThisSite={handleSimulateSignThisSite}
          onSimulateSafeSign={handleSimulateSafeSign}
          onSimulateApproval={handleSimulateApproval}
          onOpenCodeScanner={() => setCodeScannerOpen(true)}
          onSimulateScamCode={handleSimulateScamCode}
        />
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
