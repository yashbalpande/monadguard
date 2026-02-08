import { Link } from "react-router-dom";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
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

      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <div className="space-y-8">
          <div>
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Protect your wallet from scams
            </h1>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl">
              Check domains for phishing. Monitor transactions. Track approvals. All in one place.
            </p>
            <Button asChild className="bg-purple-600 hover:bg-purple-700 text-white h-12 px-8">
              <Link to="/dashboard">Open Dashboard</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-gray-800 bg-gray-900">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-bold mb-12">What you get</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <div className="text-lg font-semibold text-purple-400">Domain Checker</div>
              <p className="text-gray-400 text-sm">
                Check if a website is real or a phishing attempt before you sign anything.
              </p>
            </div>
            <div className="space-y-2">
              <div className="text-lg font-semibold text-purple-400">Transaction Monitor</div>
              <p className="text-gray-400 text-sm">
                See wallet activity and get alerts when something looks risky.
              </p>
            </div>
            <div className="space-y-2">
              <div className="text-lg font-semibold text-purple-400">Approval Manager</div>
              <p className="text-gray-400 text-sm">
                Track token approvals and revoke ones you don't recognize.
              </p>
            </div>
            <div className="space-y-2">
              <div className="text-lg font-semibold text-purple-400">Transaction Decoder</div>
              <p className="text-gray-400 text-sm">
                Understand what a transaction does before you sign.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-gray-800">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-bold mb-12">How it works</h2>
          <ol className="space-y-6 max-w-2xl">
            <li className="flex gap-4">
              <span className="font-bold text-purple-400 flex-shrink-0">1.</span>
              <div>
                <div className="font-semibold">Open dashboard</div>
                <p className="text-sm text-gray-400 mt-1">Connect your wallet to get started</p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="font-bold text-purple-400 flex-shrink-0">2.</span>
              <div>
                <div className="font-semibold">Check before you sign</div>
                <p className="text-sm text-gray-400 mt-1">Use any of the tools to verify what you're about to do</p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="font-bold text-purple-400 flex-shrink-0">3.</span>
              <div>
                <div className="font-semibold">Stay safe</div>
                <p className="text-sm text-gray-400 mt-1">Avoid losing money to phishing and scams</p>
              </div>
            </li>
          </ol>
        </div>
      </section>

      {/* Limitations */}
      <section className="border-t border-gray-800 bg-gray-900">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-bold mb-8">Be aware</h2>
          <ul className="space-y-2 text-sm text-gray-400 max-w-2xl">
            <li>• This is pattern matching, not AI predictions</li>
            <li>• Can't detect brand new scams not yet reported</li>
            <li>• Always double-check URLs yourself</li>
            <li>• Use this with other security practices</li>
          </ul>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="border-t border-gray-800">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <h2 className="text-2xl font-bold mb-6">Ready?</h2>
          <Button asChild className="bg-purple-600 hover:bg-purple-700 text-white h-12 px-8">
            <Link to="/dashboard">Go to Dashboard</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-gray-950">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-xs text-gray-500">
            © 2024 Monad Guard — On Monad Testnet
          </div>
        </div>
      </footer>
    </div>
  );
}
