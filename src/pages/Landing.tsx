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
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-purple-500" />
            <span className="font-bold">Monad Guard</span>
          </div>
          <Button asChild className="bg-purple-600 hover:bg-purple-700 text-white">
            <Link to="/dashboard">Dashboard</Link>
          </Button>
        </div>
      </header>

      {/* Hero - Simplified */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-4">
          Check if a website is a scam
        </h1>
        <p className="text-gray-400 mb-8 max-w-2xl">
          Before you connect your wallet or sign something, check if the site is real or fake.
        </p>

        {/* Domain Check - Main Feature */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-12">
          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="paste a domain (e.g. uniswap.org)"
                value={domainInput}
                onChange={(e) => setDomainInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleCheckDomain()}
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              />
              <Button
                onClick={handleCheckDomain}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                Check
              </Button>
            </div>

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
                  <div>
                    <div className="font-semibold text-sm">{domainResult.domain}</div>
                    <div
                      className={`text-sm mt-1 ${
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

        {/* Quick Examples */}
        <div>
          <p className="text-xs text-gray-500 mb-3 font-medium">Try these to see how it works:</p>
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
                className="px-3 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded text-xs text-gray-300 transition-colors text-left"
              >
                {domain}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* How it works - Simple list */}
      <section className="border-t border-gray-800 bg-gray-900">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <h2 className="text-2xl font-bold mb-8">What it checks</h2>
          <ul className="space-y-3 max-w-2xl">
            <li className="flex gap-3">
              <span className="text-purple-400 font-bold mt-0.5">1.</span>
              <div>
                <div className="font-semibold text-sm">Domain typos</div>
                <div className="text-xs text-gray-400">uniswapp.xyz vs uniswap.org</div>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-purple-400 font-bold mt-0.5">2.</span>
              <div>
                <div className="font-semibold text-sm">Known scam sites</div>
                <div className="text-xs text-gray-400">Addresses we've seen used for phishing</div>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-purple-400 font-bold mt-0.5">3.</span>
              <div>
                <div className="font-semibold text-sm">Suspicious patterns</div>
                <div className="text-xs text-gray-400">Double dashes, weird TLDs, unusual characters</div>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-purple-400 font-bold mt-0.5">4.</span>
              <div>
                <div className="font-semibold text-sm">Whitelisted domains</div>
                <div className="text-xs text-gray-400">Verified safe sites like uniswap.org</div>
              </div>
            </li>
          </ul>
        </div>
      </section>

      {/* Warnings - What it doesn't do */}
      <section className="border-t border-gray-800">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <h2 className="text-2xl font-bold mb-8">Limitations</h2>
          <ul className="space-y-2 text-sm text-gray-400 max-w-2xl">
            <li>• Can't detect brand new scam sites (not yet reported)</li>
            <li>• This is pattern matching, not AI predictions</li>
            <li>• Always double-check URLs yourself</li>
            <li>• Use this in combination with other security practices</li>
          </ul>
        </div>
      </section>

      {/* CTA - Simple */}
      <section className="border-t border-gray-800 bg-gray-900">
        <div className="max-w-4xl mx-auto px-6 py-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Get more protection</h2>
          <p className="text-gray-400 mb-6 max-w-xl mx-auto text-sm">
            Open the dashboard to monitor your transactions and get alerts when something looks risky.
          </p>
          <Button asChild className="bg-purple-600 hover:bg-purple-700 text-white">
            <Link to="/dashboard">Open Dashboard</Link>
          </Button>
        </div>
      </section>

      {/* Footer - Simple */}
      <footer className="border-t border-gray-800 bg-gray-950">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-xs text-gray-500 flex items-center justify-between">
            <span>© 2024 Monad Guard</span>
            <div className="flex gap-6">
              <a href="#" className="hover:text-gray-400">Privacy</a>
              <a href="#" className="hover:text-gray-400">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
