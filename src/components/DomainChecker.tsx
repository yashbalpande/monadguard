import { useState } from "react";
import { AlertCircle, CheckCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isKnownScamDomain, getScamDomainExplanation, scoreDomainTrust } from "@/lib/scamDatabase";
import { isDomainWhitelisted } from "@/lib/signingGuard";

export default function DomainChecker() {
  const [domainInput, setDomainInput] = useState("");
  const [domainResult, setDomainResult] = useState<null | {
    domain: string;
    isSafe: boolean;
    risk: string;
    severity?: string;
    explanation?: string;
    trustScore?: number;
  }>(null);
  const [isChecking, setIsChecking] = useState(false);

  const handleCheckDomain = async () => {
    if (!domainInput.trim()) return;

    setIsChecking(true);
    
    // Simulate slight delay for better UX
    setTimeout(() => {
      const domain = domainInput.toLowerCase().trim();
      const isWhitelisted = isDomainWhitelisted(domain);
      const knownScam = isKnownScamDomain(domain);
      const trustScore = scoreDomainTrust(domain, isWhitelisted);

      let isSafe = true;
      let risk = "Looks safe";
      let severity = "safe";
      let explanation = "No obvious red flags detected.";

      if (knownScam) {
        isSafe = false;
        severity = knownScam.severity;
        risk = knownScam.description;
        explanation = getScamDomainExplanation(domain);
      } else if (isWhitelisted) {
        isSafe = true;
        risk = "Verified";
        explanation = "This domain is in our whitelist.";
      } else if (trustScore < 50) {
        isSafe = false;
        risk = "Suspicious";
        explanation = "This domain has characteristics of scam sites. Be careful.";
      }

      setDomainResult({
        domain,
        isSafe,
        risk,
        severity,
        explanation,
        trustScore,
      });

      setIsChecking(false);
    }, 300);
  };

  const quickDomains = [
    "uniswapp.xyz",
    "opensea-official.click",
    "etherscan-verify.top",
    "stakesecured.com",
  ];

  return (
    <div className="space-y-8">
      {/* Main checker */}
      <div className="border border-gray-800 rounded-lg p-8 bg-gray-900">
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <Search className="w-5 h-5" />
          Check a Domain
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-3">
              Enter website URL to check for phishing or scams
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. uniswap.org"
                value={domainInput}
                onChange={(e) => setDomainInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleCheckDomain()}
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <Button
                onClick={handleCheckDomain}
                disabled={isChecking || !domainInput.trim()}
                className="bg-purple-600 hover:bg-purple-700 text-white px-8"
              >
                {isChecking ? "Checking..." : "Check"}
              </Button>
            </div>
          </div>

          {/* Result */}
          {domainResult && (
            <div
              className={`border rounded-lg p-4 ${
                domainResult.severity === "critical"
                  ? "bg-red-950 border-red-800"
                  : domainResult.severity === "high"
                  ? "bg-orange-950 border-orange-800"
                  : domainResult.isSafe
                  ? "bg-green-950 border-green-800"
                  : "bg-yellow-950 border-yellow-800"
              }`}
            >
              <div className="flex items-start gap-3">
                {domainResult.severity === "critical" ||
                domainResult.severity === "high" ? (
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-400" />
                ) : (
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-green-400" />
                )}
                <div className="flex-1">
                  <div className="font-semibold text-sm">{domainResult.domain}</div>
                  <div
                    className={`text-sm font-medium mt-1 ${
                      domainResult.severity === "critical"
                        ? "text-red-300"
                        : domainResult.severity === "high"
                        ? "text-orange-300"
                        : domainResult.isSafe
                        ? "text-green-300"
                        : "text-yellow-300"
                    }`}
                  >
                    {domainResult.risk}
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    {domainResult.explanation}
                  </p>
                  {domainResult.trustScore !== undefined && (
                    <div className="mt-3 pt-2 border-t border-gray-700">
                      <div className="text-xs text-gray-500">
                        Trust score: <span className="font-semibold">{domainResult.trustScore}/100</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick examples */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
        <div className="text-sm text-gray-400 mb-4 font-medium">Try checking these:</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {quickDomains.map((domain) => (
            <button
              key={domain}
              onClick={() => {
                setDomainInput(domain);
                setTimeout(() => {
                  const isWhitelisted = isDomainWhitelisted(domain);
                  const knownScam = isKnownScamDomain(domain);
                  const trustScore = scoreDomainTrust(domain, isWhitelisted);

                  let isSafe = true;
                  let risk = "Looks safe";
                  let severity = "safe";
                  let explanation = "No obvious red flags detected.";

                  if (knownScam) {
                    isSafe = false;
                    severity = knownScam.severity;
                    risk = knownScam.description;
                    explanation = getScamDomainExplanation(domain);
                  } else if (isWhitelisted) {
                    isSafe = true;
                    risk = "Verified";
                    explanation = "This domain is in our whitelist.";
                  } else if (trustScore < 50) {
                    isSafe = false;
                    risk = "Suspicious";
                    explanation = "This domain has characteristics of scam sites. Be careful.";
                  }

                  setDomainResult({
                    domain,
                    isSafe,
                    risk,
                    severity,
                    explanation,
                    trustScore,
                  });
                }, 0);
              }}
              className="px-3 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded text-xs text-gray-300 transition-colors"
            >
              {domain}
            </button>
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 space-y-4">
        <h3 className="font-semibold text-sm">What this checks for</h3>
        <ul className="space-y-3 text-xs text-gray-400">
          <li className="flex gap-2">
            <span className="text-purple-400 font-bold">•</span>
            <span><strong>Domain typos:</strong> uniswapp.xyz vs uniswap.org</span>
          </li>
          <li className="flex gap-2">
            <span className="text-purple-400 font-bold">•</span>
            <span><strong>Known scams:</strong> addresses we've identified as phishing</span>
          </li>
          <li className="flex gap-2">
            <span className="text-purple-400 font-bold">•</span>
            <span><strong>Suspicious patterns:</strong> double dashes, suspicious TLDs</span>
          </li>
          <li className="flex gap-2">
            <span className="text-purple-400 font-bold">•</span>
            <span><strong>Whitelisted domains:</strong> verified safe sites</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
