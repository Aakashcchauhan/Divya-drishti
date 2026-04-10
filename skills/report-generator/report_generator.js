import path from "path";
import fs from "fs-extra";
import crypto from "crypto";

const SEVERITY_ORDER = { critical: 4, high: 3, medium: 2, low: 1 };
const CATEGORY_WEIGHT = { security: 3, logic: 2, performance: 1, ui: 1 };

const normalizeSeverity = (value) => {
  const normalized = String(value || "low").trim().toLowerCase();
  if (["critical", "high", "medium", "low"].includes(normalized)) return normalized;
  if (normalized === "needs review") return "low";
  return "low";
};

const normalizeConfidence = (value) => {
  const normalized = String(value || "likely").trim().toLowerCase();

  if (normalized === "high" || normalized === "confirmed") return "confirmed";
  if (normalized === "low" || normalized === "needs review" || normalized === "needs_review") {
    return "needs_review";
  }

  return "likely";
};

const normalizeCategory = (value) => {
  const normalized = String(value || "").trim().toLowerCase();
  if (["security", "logic", "performance", "ui"].includes(normalized)) return normalized;
  return "logic";
};

const maskSensitiveText = (value) => {
  if (!value) return "";

  return String(value)
    .replace(/\b\d{1,3}(?:\.\d{1,3}){3}\b/g, "[REDACTED_IP]")
    .replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, "[REDACTED_EMAIL]")
    .replace(/\b(?:AKIA|AIza|ghp_)[A-Za-z0-9_\-]{8,}\b/g, "[REDACTED_TOKEN]")
    .replace(/\b(?:password|secret|token|api[_-]?key)\s*[:=]\s*['"][^'"]+['"]/gi, "$1: [REDACTED_SECRET]");
};

const toRelativePath = (filePath, targetRoot) => {
  if (!filePath) return "unknown";
  if (!path.isAbsolute(filePath)) return filePath;

  const base = targetRoot && path.isAbsolute(targetRoot) ? targetRoot : process.cwd();
  const rel = path.relative(base, filePath);
  return rel && !rel.startsWith("..") ? rel : path.basename(filePath);
};

const normalizeFinding = (finding, options = {}) => {
  const targetRoot = options.target || process.cwd();

  const issue = maskSensitiveText(finding.issue || "Unspecified issue");
  const impact = maskSensitiveText(finding.impact || "Impact not specified.");
  const fix = maskSensitiveText(finding.fix || finding.recommendation || "No remediation provided.");
  const reasoning = maskSensitiveText(finding.reasoning || finding.gap || issue);
  const evidence = maskSensitiveText(finding.evidence || "");
  const exploit = Array.isArray(finding.exploit)
    ? finding.exploit.map((step) => maskSensitiveText(step))
    : [];

  return {
    ...finding,
    id: finding.id || `FINDING_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    category: normalizeCategory(finding.category),
    severity: normalizeSeverity(finding.severity),
    confidence: normalizeConfidence(finding.confidence),
    file: toRelativePath(finding.file, targetRoot),
    line: Number.isInteger(finding.line) ? finding.line : 0,
    issue,
    impact,
    fix,
    recommendation: fix,
    reasoning,
    evidence,
    exploit
  };
};

// -------------------------
// LOAD MEMORY SAFELY
// -------------------------
const loadFindings = async (memoryPath) => {
  const sources = ["security.json", "logic.json", "performance.json"];
  let all = [];

  for (const file of sources) {
    try {
      const data = await fs.readJson(path.join(memoryPath, file));
      if (data?.findings) all.push(...data.findings);
    } catch {}
  }

  return all;
};

// -------------------------
// DEDUPLICATION ENGINE
// -------------------------
const deduplicate = (findings) => {
  const seen = new Set();

  return findings.filter((f) => {
    const fingerprint = `${f.file}|${f.line}|${f.category}|${(f.issue || "").toLowerCase().replace(/\s+/g, " ").trim()}`;
    const key = crypto.createHash("sha1").update(fingerprint).digest("hex");

    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

// -------------------------
// SEVERITY BREAKDOWN
// -------------------------
const getBreakdown = (findings) => {
  const map = { critical: 0, high: 0, medium: 0, low: 0 };

  findings.forEach((f) => {
    if (map[f.severity] !== undefined) map[f.severity]++;
  });

  return map;
};

// -------------------------
// HEALTH SCORE
// -------------------------
const calculateScore = (breakdown, total) => {
  if (total === 0) return "A";
  if (breakdown.critical > 0) return "F";
  if (breakdown.high > 2) return "D";
  if (breakdown.high > 0) return "C";
  if (breakdown.medium > 5) return "B";
  return "A";
};

// -------------------------
// FINAL VERDICT
// -------------------------
const getVerdict = (breakdown, findings) => {
  if (breakdown.critical > 0) return "Critical Risk";

  const weightedRisk = findings.reduce((sum, finding) => {
    const categoryWeight = CATEGORY_WEIGHT[finding.category] || 1;
    const severityWeight = SEVERITY_ORDER[finding.severity] || 1;
    return sum + categoryWeight * severityWeight;
  }, 0);

  if (breakdown.high >= 3 || weightedRisk >= 18) return "Not Production Ready";
  if (breakdown.high > 0 || breakdown.medium >= 4 || weightedRisk >= 10) {
    return "Needs Fixes Before Production";
  }

  if (breakdown.medium > 0 || breakdown.low > 0) return "Safe with Warnings";
  return "Safe";
};

const sortFindings = (items) => {
  return [...items].sort((a, b) => {
    return SEVERITY_ORDER[b.severity] - SEVERITY_ORDER[a.severity];
  });
};

const groupByPriority = (findings) => ({
  immediate: findings.filter((f) => f.severity === "critical"),
  highPriority: findings.filter((f) => f.severity === "high"),
  optimization: findings.filter((f) => ["medium", "low"].includes(f.severity))
});

const getTopByCategory = (findings, category) => {
  const items = findings.filter((f) => f.category === category);
  if (!items.length) return "No major issue detected";
  return sortFindings(items)[0].issue;
};

const buildAiSummary = (findings, breakdown, verdict) => {
  if (!findings.length) {
    return "The system appears Safe under current scanner rules. No actionable findings were produced.";
  }

  const topFindings = sortFindings(findings).slice(0, 3);
  const topList = topFindings.map((f) => `- ${f.issue} (${f.category})`).join("\n");

  return [
    `The system shows ${verdict}.`,
    "",
    "Critical risks include:",
    topList,
    "",
    "These issues may lead to system instability, security vulnerabilities, or degraded user experience.",
    `Severity profile: Critical ${breakdown.critical}, High ${breakdown.high}, Medium ${breakdown.medium}, Low ${breakdown.low}.`
  ].join("\n");
};

// -------------------------
// MARKDOWN RENDER
// -------------------------
const renderMarkdown = (data) => {
  const {
    findings,
    breakdown,
    verdict,
    score,
    aiSummary,
    targetLabel,
    targetPath,
    scannedFilesCount
  } = data;

  const priority = groupByPriority(findings);
  const auditDate = new Date().toISOString();
  const projectName = path.basename(targetPath || targetLabel || "unknown");

  let report = "# Audit Report\n\n";

  report += "## Project Metadata\n";
  report += `- Project Name: ${projectName}\n`;
  report += `- Audit Date: ${auditDate}\n`;
  report += `- Files Scanned: ${scannedFilesCount}\n`;
  report += "- Audit Version: v1.0.0\n";
  report += `- Target: ${targetLabel}\n`;
  report += `- Target Path: ${targetPath}\n\n`;

  report += "## Executive Summary\n\n";
  report += `${aiSummary}\n\n`;

  report += "## Severity Breakdown\n\n";
  report += "| Critical | High | Medium | Low |\n";
  report += "|----------|------|--------|-----|\n";
  report += `| ${breakdown.critical} | ${breakdown.high} | ${breakdown.medium} | ${breakdown.low} |\n\n`;

  report += "## Overall Risk Level\n\n";
  report += `- ${verdict}\n`;
  report += `- Health Score: ${score}\n\n`;

  report += "## Key Findings\n\n";
  report += `- Security: ${getTopByCategory(findings, "security")}\n`;
  report += `- Logic: ${getTopByCategory(findings, "logic")}\n`;
  report += `- Performance: ${getTopByCategory(findings, "performance")}\n`;
  report += `- UI/UX: ${getTopByCategory(findings, "ui")}\n\n`;

  report += "## Detailed Findings\n\n";

  sortFindings(findings).forEach((f) => {
    report += `#### [${f.id}] ${f.issue}\n\n`;
    report += `- Category: ${f.category}\n`;
    report += `- Severity: ${f.severity}\n`;
    report += `- File: ${f.file}:${f.line || "N/A"}\n`;
    if (f.cwe) report += `- CWE: ${f.cwe}\n`;

    report += `\n**Description**\n${f.reasoning || f.issue}\n\n`;
    report += `**Impact**\n${f.impact || "Impact not specified."}\n\n`;

    if (Array.isArray(f.exploit) && f.exploit.length) {
      report += "**Exploit Scenario**\n";
      f.exploit.forEach((step, i) => {
        report += `${i + 1}. ${step}\n`;
      });
      report += "\n";
    }

    report += `**Fix**\n${f.fix || f.recommendation || "No remediation provided."}\n\n`;
    report += `**Confidence**\n${f.confidence}\n\n`;

    if (f.evidence) {
      report += "**Code Evidence**\n";
      report += "```\n";
      report += `${f.evidence}\n`;
      report += "```\n\n";
    }

    report += "---\n\n";
  });

  report += "## Remediation Summary\n\n";
  report += "### Immediate (Critical)\n";
  if (priority.immediate.length) {
    priority.immediate.forEach((f) => {
      report += `- [${f.id}] ${f.issue} (${f.file}:${f.line || "N/A"})\n`;
    });
  } else {
    report += "- No critical items.\n";
  }

  report += "\n### High Priority\n";
  if (priority.highPriority.length) {
    priority.highPriority.forEach((f) => {
      report += `- [${f.id}] ${f.issue} (${f.file}:${f.line || "N/A"})\n`;
    });
  } else {
    report += "- No high-priority items.\n";
  }

  report += "\n### Optimization\n";
  if (priority.optimization.length) {
    priority.optimization.forEach((f) => {
      report += `- [${f.id}] ${f.issue} (${f.file}:${f.line || "N/A"})\n`;
    });
  } else {
    report += "- No optimization items.\n";
  }

  report += "\n## Final Verdict\n\n";
  report += `- ${verdict}\n`;

  return report;
};

// -------------------------
// MAIN GENERATOR
// -------------------------
export const reportGenerator = async (memoryPath, format = "markdown", options = {}) => {
  let findings = [];
  const { includeLowConfidence = false } = options;

  if (Array.isArray(memoryPath)) {
    findings = memoryPath;
  } else {
    findings = await loadFindings(memoryPath);
  }

  findings = findings.map((f) => normalizeFinding(f, options));

  if (!includeLowConfidence) {
    findings = findings.filter((f) => f.confidence !== "needs_review");
  }

  findings = deduplicate(findings);

  const targetValue = options.target || "unknown";
  const targetLabel = path.basename(targetValue) || targetValue;
  const targetPath = targetValue;
  const scannedFilesCount = Array.isArray(options.scannedFiles)
    ? options.scannedFiles.length
    : 0;

  const breakdown = getBreakdown(findings);
  const verdict = getVerdict(breakdown, findings);
  const score = calculateScore(breakdown, findings.length);
  const aiSummary = buildAiSummary(findings, breakdown, verdict);

  const result = {
    summary: {
      critical: breakdown.critical,
      high: breakdown.high,
      medium: breakdown.medium,
      low: breakdown.low,
      total: findings.length,
      verdict,
      score,
      ai_summary: aiSummary,
      target: targetLabel,
      target_path: targetPath,
      files_scanned: scannedFilesCount
    },
    findings: findings.map((f) => ({
      id: f.id,
      category: f.category,
      severity: f.severity,
      file: f.file,
      line: f.line,
      issue: f.issue,
      cwe: f.cwe || null,
      impact: f.impact,
      fix: f.fix || f.recommendation,
      confidence: f.confidence
    }))
  };

  if (format === "json") {
    return JSON.stringify(result, null, 2);
  }

  return renderMarkdown({
    findings,
    breakdown,
    verdict,
    score,
    aiSummary,
    targetLabel,
    targetPath,
    scannedFilesCount
  });
};

// Alias
export const generateReport = reportGenerator;
