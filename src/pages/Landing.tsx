import { useState } from "react";
import { Link } from "react-router-dom";
import { Shield, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isKnownScamDomain, getScamDomainExplanation, scoreDomainTrust } from "@/lib/scamDatabase";
import { isDomainWhitelisted } from "@/lib/signingGuard";

export default function LandingPage() {
  const [domainInput, setDomainInput] = useState("");
  const [domainResult, setDomainResult] = useState<null | {
    domain: string;
    isSafe: boolean;
    risk: string;
    severity?: string;
    explanation?: string;
    trustScore?: number;
  }>(null);

  const handleCheckDomain = () => {
    if (!domainInput.trim()) return;

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
  };

  return (
    <div className="w-full min-h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <header className="border-b border-gray-800 sticky top-0 bg-gray-950 z-40">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-purple-500" />
            <span className="text-xl font-bold">Monad Guard</span>
          </div>
          <nav className="hidden md:flex items-center gap-12 text-sm">
            <a href="#" className="text-gray-400 hover:text-gray-200">
              Docs
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-200">
              GitHub
            </a>
          </nav>
          <Button asChild className="bg-purple-600 hover:bg-purple-700 text-white">
            <Link to="/dashboard">Launch</Link>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="space-y-12">
          <div className="space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Stop losing crypto<br />
              to fake websites
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl">
              Monad Guard checks domains for phishing attempts and known scam patterns. Check before you sign.
            </p>
          </div>

          {/* Domain Check */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 max-w-2xl">
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Check a domain
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="uniswap.org"
                    value={domainInput}
                    onChange={(e) => setDomainInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleCheckDomain()}
                    className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <Button
                    onClick={handleCheckDomain}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6"
                  >
                    Check
                  </Button>
                </div>
              </div>

              {domainResult && (
                <div className={`border rounded-lg p-4 ${
                  domainResult.severity === "critical"
                    ? "bg-red-950 border-red-800"
                    : domainResult.severity === "high"
                    ? "bg-orange-950 border-orange-800"
                    : domainResult.isSafe
                    ? "bg-green-950 border-green-800"
                    : "bg-yellow-950 border-yellow-800"
                }`}>
                  <div className="flex items-start gap-3">
                    {domainResult.severity === "critical" || domainResult.severity === "high" ? (
                      <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-400" />
                    ) : (
                      <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-green-400" />
                    )}
                    <div>
                      <div className="font-semibold mb-1">{domainResult.domain}</div>
                      <div className={`text-sm ${
                        domainResult.severity === "critical"
                          ? "text-red-300"
                          : domainResult.severity === "high"
                          ? "text-orange-300"
                          : domainResult.isSafe
                          ? "text-green-300"
                          : "text-yellow-300"
                      }`}>
                        {domainResult.risk}
                      </div>
                      <p className="text-sm text-gray-400 mt-2">
                        {domainResult.explanation}
                      </p>
                      {domainResult.trustScore !== undefined && (
                        <div className="mt-2 text-xs text-gray-500">
                          Trust score: {domainResult.trustScore}/100
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick examples */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-gray-500 uppercase">Try these:</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {[
                "stakesecured.com",
                "maxes-q.com",
                "uniswapp-swap.xyz",
                "opensea-official.click",
                "etherscan-verify.top",
                "bitfreds.com"
              ].map((domain) => (
                <button
                  key={domain}
                  onClick={() => {
                    setDomainInput(domain);
                    setTimeout(() => handleCheckDomain(), 0);
                  }}
                  className="px-3 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded text-xs text-gray-300 transition-colors"
                >
                  {domain}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What it does */}
      <section className="border-t border-gray-800 bg-gray-900">
        <div className="max-w-6xl mx-auto px-6 py-24">
          <div className="grid md:grid-cols-3 gap-12">
            <div>
              <div className="text-3xl font-bold text-purple-500 mb-4">1</div>
              <h3 className="font-semibold mb-3">Check domains</h3>
              <p className="text-sm text-gray-400">
                Enter any website URL to scan it against known phishing patterns and scam databases.
              </p>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-500 mb-4">2</div>
              <h3 className="font-semibold mb-3">Review risks</h3>
              <p className="text-sm text-gray-400">
                Get details on what makes a site suspicious – typosquatting, suspicious TLDs, known exploits.
              </p>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-500 mb-4">3</div>
              <h3 className="font-semibold mb-3">Protect yourself</h3>
              <p className="text-sm text-gray-400">
                Sign into the dashboard to get real-time protection when you interact with crypto apps.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Known scams */}
      <section className="border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-24">
          <h2 className="text-3xl font-bold mb-12">What we detect</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-purple-400 mb-4">Domain impersonation</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>• uniswapp.xyz (mimics Uniswap)</li>
                <li>• opensea-official.click (mimics OpenSea)</li>
                <li>• etherscan-verify.top (mimics Etherscan)</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-purple-400 mb-4">Known scam platforms</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>• stakesecured.com (fake investment)</li>
                <li>• coinfred.com (fake crypto)</li>
                <li>• bitcenter-us.com (fake exchange)</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-purple-400 mb-4">Suspicious patterns</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>• Double dashes or underscores</li>
                <li>• Suspicious TLDs (.xyz, .click, .top)</li>
                <li>• Unusual character combinations</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-purple-400 mb-4">Limitations</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>• Can't detect zero-day exploits</li>
                <li>• Works without browser extension</li>
                <li>• Manual checks only (not real-time yet)</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-gray-800 bg-gray-900">
        <div className="max-w-6xl mx-auto px-6 py-24 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to protect your wallet?</h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Launch the dashboard to monitor your transactions and get alerts when something looks wrong.
          </p>
          <Button asChild className="bg-purple-600 hover:bg-purple-700 text-white px-8 h-12">
            <Link to="/dashboard">Open Dashboard</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-gray-950">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              © 2024 Monad Guard
            </div>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-gray-500 hover:text-gray-400">Privacy</a>
              <a href="#" className="text-gray-500 hover:text-gray-400">Terms</a>
              <a href="#" className="text-gray-500 hover:text-gray-400">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
