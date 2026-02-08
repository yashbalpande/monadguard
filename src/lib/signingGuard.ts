export interface SigningRequest {
  domain: string;
  message: string;
  type: "personal_sign" | "eth_sign" | "sign_message" | "unknown";
  riskLevel: "safe" | "warning" | "critical";
  riskReasons: string[];
  timestamp: Date;
  isDomainTrusted?: boolean;
  isPhishingAttempt?: boolean;
}

import { isKnownScamDomain } from "./scamDatabase";

/**
 * Check if a domain is trying to impersonate a well-known service
 */
function detectPhishingAttempt(domain: string): boolean {
  // Use the scam database for detection
  const scamMatch = isKnownScamDomain(domain);
  return !!scamMatch;
}

/**
 * Check if domain has ever been approved by user
 * (In production, this would check localStorage or backend)
 */
export function isDomainWhitelisted(domain: string): boolean {
  const whitelist = [
    "etherscan.io",
    "opensea.io",
    "opensea.com",
    "uniswap.org",
    "uniswap.xyz",
    "pancakeswap.finance",
    "1inch.io",
    "aave.com",
    "curve.fi",
    "yearn.finance",
    "lido.fi",
    "makerdao.com",
    "compound.finance",
    "defi.monad.xyz",
    "localhost",
    "127.0.0.1",
  ];

  return whitelist.some(trusted => domain.toLowerCase().includes(trusted.toLowerCase()));
}

/**
 * Analyze a signing request for risks
 */
export function analyzeSigningRequest(
  domain: string,
  message: string
): {
  riskLevel: "safe" | "warning" | "critical";
  riskReasons: string[];
  isReusable: boolean;
  isDomainTrusted: boolean;
  isPhishingAttempt: boolean;
} {
  const riskReasons: string[] = [];
  const isDomainTrusted = isDomainWhitelisted(domain);
  const isPhishingAttempt = detectPhishingAttempt(domain);

  // Check 1: Phishing attempt (highest priority)
  if (isPhishingAttempt) {
    riskReasons.push("This domain looks like it's impersonating a popular DeFi app");
  }

  // Check 2: Reusable signatures
  const isReusable = !message.includes("nonce") && !message.includes("timestamp");
  if (isReusable) {
    riskReasons.push("Message lacks nonce/timestamp - could be replayed");
  }

  // Check 3: Dangerous functions
  const dangerousKeywords = [
    "approve",
    "transferFrom",
    "call",
    "delegatecall",
    "permit",
    "setApprovalForAll",
  ];

  const messageLC = message.toLowerCase();
  const hasDangerousKeyword = dangerousKeywords.some((kw) =>
    messageLC.includes(kw)
  );

  if (hasDangerousKeyword) {
    riskReasons.push("Message grants permission to spend your tokens");
  }

  // Check 4: Unknown domains (only flag if not whitelisted AND not phishing)
  if (!isDomainTrusted && !isPhishingAttempt) {
    riskReasons.push(`You've never approved ${domain} before`);
  }

  // Check 5: Unusual message length
  const isUnusuallyLong = message.length > 500;
  if (isUnusuallyLong) {
    riskReasons.push("Message is very long - may contain hidden content");
  }

  // Check 6: Hex-encoded data (harder to read)
  if (message.startsWith("0x") || /^[0-9a-f]{32,}$/i.test(message)) {
    riskReasons.push("Message is hex-encoded - you can't read what you're signing");
  }

  // Determine risk level
  // Phishing attempts are always critical
  let riskLevel: "safe" | "warning" | "critical" = "safe";

  if (isPhishingAttempt) {
    riskLevel = "critical";
  } else if (riskReasons.length >= 3) {
    riskLevel = "critical";
  } else if (riskReasons.length >= 1) {
    riskLevel = "warning";
  }

  return { 
    riskLevel, 
    riskReasons, 
    isReusable,
    isDomainTrusted,
    isPhishingAttempt,
  };
}

/**
 * Format a signing request for display
 */
export function formatSigningRequest(
  domain: string,
  message: string
): { displayMessage: string; preview: string } {
  let displayMessage = message;
  let preview = message.substring(0, 100);

  if (message.startsWith("0x")) {
    displayMessage = `[Hex Encoded Data]\n${message.substring(0, 66)}...`;
    preview = `Hex: ${message.substring(0, 50)}...`;
  } else if (message.length > 200) {
    displayMessage = message.substring(0, 200) + "...";
  }

  return { displayMessage, preview };
}
