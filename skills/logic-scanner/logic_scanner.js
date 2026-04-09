export const logicScanner = async (code, filePath) => {
  const findings = [];
  const lines = code.split("\n");

  const PATTERNS = [
    {
      id: "LOOSE_EQUALITY",
      regex: /[^!=]==[^=]/,
      severity: "medium",
      issue: "Loose equality (==) detected",
      gap: "Type coercion during comparison can lead to unexpected edge cases and logic bypasses.",
      impact: "System inconsistency or unexpected truthy validations."
    },
    {
      id: "MISSING_AWAIT",
      regex: /const\s+\w+\s*=\s*(fetch|axios|db\.\w+|query)\(/,
      severity: "high",
      issue: "Potentially unawaited asynchronous operation",
      gap: "The result of the async call will be a Promise, not the resolved value, breaking downstream logic.",
      impact: "Application state corruption or null reference exceptions."
    },
    {
      id: "INSECURE_DIRECT_OBJECT_REFERENCE",
      regex: /req\.params\.id|req\.query\.id/i,
      severity: "medium",
      issue: "Direct use of ID parameters",
      gap: "Using an ID directly without verifying ownership or active tenancy.",
      impact: "Unauthorized data exposure (IDOR)."
    },
    {
      id: "MISSING_CATCH",
      regex: /\.then\([^)]+\)(?!\s*\.catch)/,
      severity: "medium",
      issue: "Unhandled Promise rejection",
      gap: "An async task has no explicit error handling.",
      impact: "Silent failures and unhandled promise crashes in production."
    }
  ];

  lines.forEach((line, index) => {
    PATTERNS.forEach(pattern => {
      // Avoid comments
      if (line.trim().startsWith('//') || line.trim().startsWith('/*')) return;

      if (pattern.regex.test(line)) {
        findings.push({
          category: "logic",
          severity: pattern.severity,
          file: filePath,
          line: index + 1,
          issue: pattern.issue,
          gap: pattern.gap,
          impact: pattern.impact,
          confidence: "needs review",
          evidence: line.trim()
        });
      }
    });
  });

  return findings;
};

export const logicScan = logicScanner;
