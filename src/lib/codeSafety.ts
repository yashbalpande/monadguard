export interface CodeScanResult {
  id: string;
  source: string; // GitHub URL or pasted code
  riskLevel: "safe" | "warning" | "critical";
  score: number; // 0-100
  findings: SafetyFinding[];
  timestamp: Date;
  shortSummary: string;
}

export interface SafetyFinding {
  severity: "low" | "medium" | "high" | "critical";
  pattern: string;
  description: string;
  line?: string;
  recommendation: string;
}

const DANGEROUS_PATTERNS = [
  {
    name: "delegatecall",
    pattern: /delegatecall/gi,
    severity: "critical" as const,
    description: "delegatecall can execute arbitrary code in contract context",
    recommendation: "Verify the call target and ensure it's trusted",
  },
  {
    name: "selfdestruct",
    pattern: /selfdestruct|suicide/gi,
    severity: "critical" as const,
    description: "selfdestruct can destroy the contract and drain funds",
    recommendation: "This should only be in tested kill-switch functions",
  },
  {
    name: "owner withdraw",
    pattern: /owner.*withdraw|withdraw.*owner|onlyOwner.*transfer/gi,
    severity: "high" as const,
    description: "Owner can withdraw funds without user consent",
    recommendation: "Ensure this is legitimate and time-locked if possible",
  },
  {
    name: "unlimited mint",
    pattern: /mint\s*\([^)]*uint(-)?max/gi,
    severity: "high" as const,
    description: "Unlimited minting can cause inflation and rug pulls",
    recommendation: "Check for mint limits and role restrictions",
  },
  {
    name: "hidden state changes",
    pattern: /private.*function.*transfer|private.*function.*mint/gi,
    severity: "medium" as const,
    description: "Private functions that modify critical state",
    recommendation: "Review access controls carefully",
  },
  {
    name: "no access control",
    pattern: /function\s+\w+\s*\([^)]*\)\s*public\s*{[\s\S]*?(transfer|mint|withdraw)/gi,
    severity: "high" as const,
    description: "Public function accessing sensitive operations",
    recommendation: "Add proper access control modifiers",
  },
  {
    name: "hardcoded addresses",
    pattern: /0x[a-fA-F0-9]{40}/g,
    severity: "low" as const,
    description: "Hardcoded addresses reduce flexibility",
    recommendation: "Use constructor parameters or governance for addresses",
  },
  {
    name: "unchecked arithmetic",
    pattern: /unchecked\s*{/gi,
    severity: "medium" as const,
    description: "Unchecked math can cause integer overflows",
    recommendation: "Verify the math is intentional and safe",
  },
  {
    name: "approval without return check",
    pattern: /\.approve\s*\(/gi,
    severity: "medium" as const,
    description: "Not checking return value of approve()",
    recommendation: "Use safeTransfer or check return value",
  },
];

/**
 * Scan Solidity code for safety issues
 */
export function scanSolidityCode(code: string): CodeScanResult {
  const findings: SafetyFinding[] = [];
  let maxSeverity: "low" | "medium" | "high" | "critical" = "low";

  for (const patternDef of DANGEROUS_PATTERNS) {
    const matches = code.match(patternDef.pattern);
    if (matches) {
      findings.push({
        severity: patternDef.severity,
        pattern: patternDef.name,
        description: patternDef.description,
        recommendation: patternDef.recommendation,
      });

      // Track max severity
      const severityRank = {
        low: 0,
        medium: 1,
        high: 2,
        critical: 3,
      };
      if (severityRank[patternDef.severity] > severityRank[maxSeverity]) {
        maxSeverity = patternDef.severity;
      }
    }
  }

  // Calculate risk score (0-100)
  let score = 0;
  for (const finding of findings) {
    const weight = { low: 5, medium: 15, high: 25, critical: 40 };
    score += weight[finding.severity];
  }
  score = Math.min(score, 100);

  // Determine risk level
  let riskLevel: "safe" | "warning" | "critical" = "safe";
  if (score >= 70 || findings.some((f) => f.severity === "critical")) {
    riskLevel = "critical";
  } else if (score >= 40 || findings.some((f) => f.severity === "high")) {
    riskLevel = "warning";
  }

  // Generate short summary
  const criticalCount = findings.filter((f) => f.severity === "critical").length;
  const highCount = findings.filter((f) => f.severity === "high").length;

  let shortSummary = `${findings.length} issue(s) found`;
  if (criticalCount > 0) {
    shortSummary = `⚠️ ${criticalCount} CRITICAL issue(s)`;
  } else if (highCount > 0) {
    shortSummary = `⚠️ ${highCount} HIGH-risk issue(s)`;
  } else if (findings.length === 0) {
    shortSummary = "✓ No major issues detected";
  }

  return {
    id: `scan-${Date.now()}`,
    source: code.substring(0, 100) + (code.length > 100 ? "..." : ""),
    riskLevel,
    score,
    findings,
    timestamp: new Date(),
    shortSummary,
  };
}

/**
 * Extract Solidity files from GitHub repo (URL only)
 */
export function parseGitHubUrl(url: string): {
  owner: string;
  repo: string;
  isValid: boolean;
} {
  // Extract from GitHub URL
  const match = url.match(/github\.com\/([^/]+)\/([^/\s]+)/);
  if (match) {
    return { owner: match[1], repo: match[2], isValid: true };
  }
  return { owner: "", repo: "", isValid: false };
}
