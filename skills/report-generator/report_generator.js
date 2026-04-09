import path from "path";
import fs from "fs-extra";

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

  return findings.filter(f => {
    const key = `${f.file}-${f.line}-${f.issue}`;
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

  findings.forEach(f => {
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
const getVerdict = (breakdown) => {
  if (breakdown.critical > 0) return "Critical Risk / Not Production Ready";
  if (breakdown.high > 0) return "Needs Immediate Fixes";
  if (breakdown.medium > 0) return "Safe with Improvements Required";
  return "Production Ready";
};

// -------------------------
// GROUP BY CATEGORY
// -------------------------
const groupFindings = (findings) => {
  const grouped = {
    security: [],
    logic: [],
    performance: []
  };

  findings.forEach(f => {
    if (grouped[f.category]) grouped[f.category].push(f);
  });

  return grouped;
};

// -------------------------
// SORT FINDINGS
// -------------------------
const sortFindings = (items) => {
  const weight = { critical: 4, high: 3, medium: 2, low: 1 };

  return items.sort((a, b) => {
    return weight[b.severity] - weight[a.severity];
  });
};

const buildAiSummary = (findings, breakdown, verdict) => {
  if (!findings.length) {
    return "No findings detected. Codebase appears production-ready under current rules.";
  }

  const topFindings = [...findings].sort((a, b) => {
    const weight = { critical: 4, high: 3, medium: 2, low: 1 };
    return weight[b.severity] - weight[a.severity];
  }).slice(0, 3);

  const topSummary = topFindings.map((f) => `${f.issue} (${f.severity})`).join("; ");
  const riskSummary = `Critical: ${breakdown.critical}, High: ${breakdown.high}, Medium: ${breakdown.medium}, Low: ${breakdown.low}.`;

  return `Verdict: ${verdict}. Top risks: ${topSummary}. Severity breakdown: ${riskSummary}`;
};

// -------------------------
// MARKDOWN RENDER
// -------------------------
const renderMarkdown = (data) => {
  const { findings, breakdown, verdict, score, aiSummary } = data;

  let report = `# Divya Drishti Audit Report\n\n`;

  report += `## Metadata\n`;
  report += `- Audit Date: ${new Date().toISOString()}\n`;
  report += `- Total Findings: ${findings.length}\n`;
  report += `- Health Score: ${score}\n`;
  report += `- Final Verdict: ${verdict}\n\n`;

  report += `## AI Summary\n\n`;
  report += `${aiSummary}\n\n`;

  report += `## Severity Breakdown\n\n`;
  report += `| Critical | High | Medium | Low |\n`;
  report += `|----------|------|--------|-----|\n`;
  report += `| ${breakdown.critical} | ${breakdown.high} | ${breakdown.medium} | ${breakdown.low} |\n\n`;

  const grouped = groupFindings(findings);

  const renderSection = (title, items) => {
    if (!items.length) return "";

    let section = `## ${title} Findings\n\n`;

    sortFindings(items).forEach((f, i) => {
      section += `### ${i + 1}. [${f.severity.toUpperCase()}] ${f.issue}\n\n`;
      section += `- File: ${f.file}:${f.line || "N/A"}\n`;
      if (f.cwe) section += `- CWE: ${f.cwe}\n`;
      if (f.gap) section += `- Logic Gap: ${f.gap}\n`;
      section += `- Impact: ${f.impact || "N/A"}\n`;
      section += `- Confidence: ${f.confidence || "medium"}\n`;

      if (f.recommendation) {
        section += `- Fix: ${f.recommendation}\n`;
      }

      if (f.evidence) {
        section += `\nCode Snippet:\n\`\`\`\n${f.evidence}\n\`\`\`\n`;
      }

      section += `\n`;
    });

    return section;
  };

  report += renderSection("Security", grouped.security);
  report += renderSection("Logic", grouped.logic);
  report += renderSection("Performance", grouped.performance);

  return report;
};

// -------------------------
// MAIN GENERATOR
// -------------------------
export const reportGenerator = async (memoryPath, format = "markdown") => {
  let findings = [];

  if (Array.isArray(memoryPath)) {
    findings = memoryPath;
  } else {
    findings = await loadFindings(memoryPath);
  }

  findings = deduplicate(findings);

  const breakdown = getBreakdown(findings);
  const verdict = getVerdict(breakdown);
  const score = calculateScore(breakdown, findings.length);

  const aiSummary = buildAiSummary(findings, breakdown, verdict);

  const result = {
    summary: {
      total: findings.length,
      breakdown,
      verdict,
      score,
      ai_summary: aiSummary
    },
    findings
  };

  if (format === "json") {
    return JSON.stringify(result, null, 2);
  }

  return renderMarkdown({
    findings,
    breakdown,
    verdict,
    score,
    aiSummary
  });
};

// Alias
export const generateReport = reportGenerator;