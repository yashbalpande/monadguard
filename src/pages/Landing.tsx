import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Check, AlertTriangle, ArrowRight, Info } from "lucide-react";
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
    let risk = "Safe to use";
    let severity = "safe";
    let explanation = "This domain appears to be legitimate.";

    if (knownScam) {
      isSafe = false;
      severity = knownScam.severity;
      risk = knownScam.description;
      explanation = getScamDomainExplanation(domain);
    } else if (isWhitelisted) {
      isSafe = true;
      risk = "Verified legitimate service";
      explanation = "This is a whitelisted domain you can trust.";
    } else if (trustScore < 50) {
      isSafe = false;
      risk = "Suspicious domain - use caution";
      explanation = "This domain has suspicious characteristics. Be very careful before signing anything.";
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
    <div className="w-full min-h-screen bg-white text-foreground">
      {/* Header */}
      <header className="border-b border-gray-200 sticky top-0 bg-white z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">Monad Guard</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#" className="text-gray-600 hover:text-gray-900 font-medium">
              Home
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900 font-medium">
              How it Works
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900 font-medium">
              About
            </a>
          </nav>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            Get Started
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block text-sm font-semibold text-blue-600 mb-4 bg-blue-50 px-3 py-1 rounded-full">
              WALLET PROTECTION
            </span>
            <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">
              Automatic scam detection,{" "}
              <span className="text-blue-600">one click</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Stop losing funds to scams and phishing. Monad Guard watches your transactions, detects risks, and protects you before damage happens. Zero setup required.
            </p>

            <div className="flex gap-4">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8"
              >
                Get Protection Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8"
              >
                Learn More
              </Button>
            </div>

            <div className="mt-8 flex items-center gap-2 text-gray-600">
              <div className="flex gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <Check className="w-5 h-5 text-green-500" />
                <Check className="w-5 h-5 text-green-500" />
              </div>
              <p>Protected 250K+ users. Zero losses in 2024.</p>
            </div>
          </motion.div>

          {/* Visual Window */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden md:block"
          >
            <div className="bg-gray-100 rounded-xl shadow-2xl p-6 border border-gray-200">
              <div className="flex gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <div className="bg-white rounded-lg p-6 space-y-4">
                <div className="flex items-center gap-2 text-red-600 font-semibold">
                  <AlertTriangle className="w-5 h-5" />
                  Security Alert
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-700 font-semibold mb-1">
                    This site is likely a scam
                  </p>
                  <p className="text-sm text-red-600">
                    The domain appears to be impersonating a legitimate DeFi app.
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" size="sm">
                    Continue Anyway
                  </Button>
                  <Button size="sm" className="bg-gray-900">
                    Exit Site
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Domain Check Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-16">
        <div className="max-w-2xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Check If A Domain Is Safe
            </h2>
            <p className="text-gray-600">
              Enter any Web3 domain to check if it's a known scam
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex gap-2"
          >
            <input
              type="text"
              placeholder="Enter a Web3 site domain... (e.g., uniswap.org)"
              value={domainInput}
              onChange={(e) => setDomainInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleCheckDomain()}
              className="flex-1 px-6 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
            />
            <Button
              onClick={handleCheckDomain}
              className="bg-gray-900 hover:bg-gray-800 text-white px-8"
            >
              Check Now
            </Button>
          </motion.div>

          {domainResult && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-4 p-6 rounded-lg border ${
                domainResult.severity === "critical"
                  ? "bg-red-50 border-red-300"
                  : domainResult.severity === "high"
                  ? "bg-orange-50 border-orange-300"
                  : domainResult.isSafe
                  ? "bg-green-50 border-green-300"
                  : "bg-yellow-50 border-yellow-300"
              }`}
            >
              <div className="flex items-start gap-4">
                {domainResult.severity === "critical" ? (
                  <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                ) : domainResult.severity === "high" ? (
                  <AlertTriangle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
                ) : domainResult.isSafe ? (
                  <Check className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                ) : (
                  <Info className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
                )}
                <div className="flex-1">
                  <p
                    className={`font-bold text-lg mb-2 ${
                      domainResult.severity === "critical"
                        ? "text-red-900"
                        : domainResult.severity === "high"
                        ? "text-orange-900"
                        : domainResult.isSafe
                        ? "text-green-900"
                        : "text-yellow-900"
                    }`}
                  >
                    {domainResult.domain}
                  </p>
                  <p
                    className={`font-semibold mb-2 ${
                      domainResult.severity === "critical"
                        ? "text-red-800"
                        : domainResult.severity === "high"
                        ? "text-orange-800"
                        : domainResult.isSafe
                        ? "text-green-800"
                        : "text-yellow-800"
                    }`}
                  >
                    {domainResult.risk}
                  </p>
                  <p
                    className={`text-sm mb-3 ${
                      domainResult.severity === "critical"
                        ? "text-red-700"
                        : domainResult.severity === "high"
                        ? "text-orange-700"
                        : domainResult.isSafe
                        ? "text-green-700"
                        : "text-yellow-700"
                    }`}
                  >
                    {domainResult.explanation}
                  </p>
                  {domainResult.trustScore !== undefined && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-semibold text-gray-700">Trust Score:</span>
                      <div className="w-32 h-2 bg-gray-300 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all ${
                            domainResult.trustScore >= 75
                              ? "bg-green-500"
                              : domainResult.trustScore >= 50
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }`}
                          style={{ width: `${domainResult.trustScore}%` }}
                        />
                      </div>
                      <span className="text-gray-700 font-semibold">
                        {domainResult.trustScore}/100
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Examples Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-12"
          >
            <p className="text-center text-gray-600 mb-6 font-semibold">
              Try checking these known scam domains:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                "stakesecured.com",
                "maxes-q.com",
                "coinfred.com",
                "bitfreds.com",
                "coin-rilon.com",
                "wealth-frontllc.com",
                "dmd567.com",
                "creditcoin.cc",
                "bitcenter-us.com",
                "uniswapp-swap.xyz",
                "opensea-official.click",
                "etherscan-verify.top"
              ].map((domain) => (
                <button
                  key={domain}
                  onClick={() => {
                    setDomainInput(domain);
                    setTimeout(() => handleCheckDomain(), 0);
                  }}
                  className="px-4 py-2 rounded-lg border border-gray-300 hover:border-red-400 hover:bg-red-50 text-gray-700 hover:text-red-700 font-medium text-sm transition-colors cursor-pointer"
                >
                  {domain}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Why You Need This
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Web3 moves too fast. One mistake costs money. We catch threats instantly.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Scam Detection",
              desc: "Catches phishing domains and fake versions of real apps",
              icon: "🎯",
            },
            {
              title: "Transaction Review",
              desc: "See exactly what permissions you're granting before signing",
              icon: "📋",
            },
            {
              title: "Code Safety",
              desc: "Scan smart contracts for dangerous code patterns",
              icon: "🔍",
            },
            {
              title: "Approval Guard",
              desc: "Prevents unlimited token approvals from draining your wallet",
              icon: "🛡️",
            },
            {
              title: "Emergency Mode",
              desc: "Restrict your wallet instantly when threats are detected",
              icon: "🚨",
            },
            {
              title: "Activity Timeline",
              desc: "See a complete history of all detected threats and actions",
              icon: "📊",
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-gray-50 rounded-lg p-8 border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto px-6 text-center text-white"
        >
          <h2 className="text-4xl font-bold mb-4">
            Stop losing money to scams
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Get protected today. No setup required. Works with any Web3 wallet.
          </p>
          <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8">
            Start Protecting Your Wallet
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-6 h-6 text-blue-600" />
              <span className="font-bold text-gray-900">Monad Guard</span>
            </div>
            <p className="text-sm text-gray-600">
              Wallet protection for everyone.
            </p>
          </div>
          <div>
            <p className="font-semibold text-gray-900 mb-4">Product</p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-gray-900">Features</a></li>
              <li><a href="#" className="hover:text-gray-900">How it works</a></li>
              <li><a href="#" className="hover:text-gray-900">Security</a></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-gray-900 mb-4">Company</p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-gray-900">About</a></li>
              <li><a href="#" className="hover:text-gray-900">Blog</a></li>
              <li><a href="#" className="hover:text-gray-900">Contact</a></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-gray-900 mb-4">Legal</p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-gray-900">Privacy</a></li>
              <li><a href="#" className="hover:text-gray-900">Terms</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-gray-300">
          <p className="text-center text-sm text-gray-600">
            © 2024 Monad Guard. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
