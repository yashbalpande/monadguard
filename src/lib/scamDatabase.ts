/**
 * Scam Database - Known malicious domains and contracts
 * This is a heuristic-based detection system.
 * In production, this would connect to a real-time threat intelligence service.
 */

export interface ScamThreat {
  pattern: RegExp;
  type: "domain" | "contract";
  severity: "high" | "critical";
  description: string;
}

// Known phishing domain patterns
export const SCAM_DOMAINS: ScamThreat[] = [
  // Uniswap impersonators
  {
    pattern: /uniswap[p\-_]*[^.]*\.(xyz|click|top|download)/i,
    type: "domain",
    severity: "critical",
    description: "Uniswap phishing attempt",
  },
  {
    pattern: /uni-swap|uni.*swap[^.]*\.(xyz|click|top)/i,
    type: "domain",
    severity: "critical",
    description: "Uniswap typosquatting",
  },
  
  // OpenSea impersonators
  {
    pattern: /opensea[s\-_]*[^.]*\.(xyz|click|top)/i,
    type: "domain",
    severity: "critical",
    description: "OpenSea phishing attempt",
  },
  
  // Etherscan impersonators
  {
    pattern: /etherscan[s\-_]*[^.]*\.(xyz|click|top)/i,
    type: "domain",
    severity: "critical",
    description: "Etherscan phishing attempt",
  },
  
  // Generic DeFi scams
  {
    pattern: /defi[\w-]*\.(xyz|click|top|download|stream)/i,
    type: "domain",
    severity: "high",
    description: "Suspicious DeFi domain",
  },
  {
    pattern: /(swap|bridge|farm|stake|mint|nft)[\w-]*\.(xyz|click|top)/i,
    type: "domain",
    severity: "high",
    description: "Suspicious finance domain",
  },
  
  // Double dash trick (common scam tactic)
  {
    pattern: /[-]{2,}/,
    type: "domain",
    severity: "high",
    description: "Suspicious characters in domain",
  },
  
  // Too many underscores
  {
    pattern: /[_]{2,}|[\-_]{3,}/,
    type: "domain",
    severity: "high",
    description: "Suspicious domain format",
  },

  // Known fake crypto investment/trading platforms
  {
    pattern: /^stakesecured\.com$/i,
    type: "domain",
    severity: "critical",
    description: "Fake crypto investment platform - no withdrawals",
  },
  {
    pattern: /^maxes-q\.com(\/.*)?$/i,
    type: "domain",
    severity: "critical",
    description: "Fake crypto investment platform - no withdrawals",
  },
  {
    pattern: /^coinfred\.com$/i,
    type: "domain",
    severity: "critical",
    description: "Fake cryptocurrency platform - scam",
  },
  {
    pattern: /^bitfreds\.com$/i,
    type: "domain",
    severity: "critical",
    description: "Fake cryptocurrency platform - scam",
  },
  {
    pattern: /^coin-rilon\.com$/i,
    type: "domain",
    severity: "critical",
    description: "Fake cryptocurrency platform - scam",
  },
  {
    pattern: /^wealth-frontllc\.com$/i,
    type: "domain",
    severity: "critical",
    description: "Fake investment platform impersonating WealthFront",
  },
  {
    pattern: /^dmd567\.com$/i,
    type: "domain",
    severity: "critical",
    description: "Fake crypto/investment platform - scam",
  },
  {
    pattern: /^creditcoin\.cc$/i,
    type: "domain",
    severity: "critical",
    description: "Fake cryptocurrency platform - scam",
  },
  {
    pattern: /^bitcenter-us\.com$/i,
    type: "domain",
    severity: "critical",
    description: "Fake cryptocurrency exchange - scam",
  },
];

/**
 * Check if a domain matches any known phishing patterns
 */
export function isKnownScamDomain(domain: string): ScamThreat | null {
  for (const threat of SCAM_DOMAINS) {
    if (threat.type === "domain" && threat.pattern.test(domain)) {
      return threat;
    }
  }
  return null;
}

/**
 * Get detailed explanation of why a domain is flagged
 */
export function getScamDomainExplanation(domain: string): string {
  const threat = isKnownScamDomain(domain);
  if (!threat) return "";

  const explanations: Record<string, string> = {
    "Uniswap phishing attempt":
      "This domain closely mimics Uniswap but uses a suspicious TLD. It's designed to trick you into thinking it's the real Uniswap.",
    "Uniswap typosquatting":
      "This domain looks like a misspelling of Uniswap. Scammers use typos to catch users who make typing mistakes.",
    "OpenSea phishing attempt":
      "This domain is impersonating OpenSea. Never sign or approve anything on fake versions.",
    "Etherscan phishing attempt":
      "This domain is mimicking Etherscan. Real Etherscan never asks you to sign transactions.",
    "Suspicious DeFi domain":
      "This domain uses a commonly abused TLD (.xyz, .click, etc.) in a DeFi context. Be very careful.",
    "Suspicious finance domain":
      "This is likely a fake trading or farming site. These are commonly used to steal funds.",
    "Suspicious characters in domain":
      "This domain has tricky characters like double dashes used to confuse users.",
    "Suspicious domain format":
      "This domain uses unusual formatting that's characteristic of scam sites.",
    "Fake crypto investment platform - no withdrawals":
      "This is a known fake investment platform. Users report being unable to withdraw funds after deposits.",
    "Fake cryptocurrency platform - scam":
      "This is a known fraudulent cryptocurrency platform designed to steal deposits.",
    "Fake investment platform impersonating WealthFront":
      "This site impersonates WealthFront to trick users into depositing funds that cannot be withdrawn.",
    "Fake crypto/investment platform - scam":
      "Known scam platform that accepts deposits but prevents withdrawals.",
    "Fake cryptocurrency exchange - scam":
      "Fraudulent exchange designed to steal funds and cryptocurrency.",
  };


  return explanations[threat.description] || threat.description;
}

/**
 * Score a domain's trustworthiness
 * Returns a score from 0-100, where lower = more suspicious
 */
export function scoreDomainTrust(domain: string, isDomainWhitelisted: boolean): number {
  // Whitelisted domains get high score
  if (isDomainWhitelisted) return 95;

  let score = 50; // Start at neutral

  // Deduct for suspicious patterns
  if(!isKnownScamDomain(domain)) score += 10;
  
  if (domain.includes("localhost") || domain.includes("127.0.0.1")) score = 90;
  
  // Deduct for long domains
  if (domain.length > 50) score -= 10;
  
  // Deduct for multiple dots
  if ((domain.match(/\./g) || []).length > 3) score -= 5;
  
  // Deduct for numbers in wrong places
  if (/\d{2,}/.test(domain.split(".")[0])) score -= 5;

  return Math.max(0, Math.min(100, score));
}
