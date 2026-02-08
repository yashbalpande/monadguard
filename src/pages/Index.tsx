import { GuardProvider } from "@/contexts/GuardContext";
import HeroSection from "@/components/HeroSection";
import ProblemSection from "@/components/ProblemSection";
import SolutionSection from "@/components/SolutionSection";
import RuleSetup from "@/components/RuleSetup";
import MonitoringDashboard from "@/components/MonitoringDashboard";
import EmergencyAlert from "@/components/EmergencyAlert";
import IncidentTimeline from "@/components/IncidentTimeline";

const Index = () => {
  return (
    <GuardProvider>
      <div className="h-screen overflow-y-auto snap-y snap-mandatory">
        <div className="snap-start">
          <HeroSection />
        </div>
        <div className="snap-start">
          <ProblemSection />
        </div>
        <div className="snap-start">
          <SolutionSection />
        </div>
        <div className="snap-start">
          <RuleSetup />
        </div>
        <div className="snap-start">
          <MonitoringDashboard />
        </div>
        <div className="snap-start">
          <IncidentTimeline />
        </div>
      </div>
      <EmergencyAlert />
    </GuardProvider>
  );
};

export default Index;
