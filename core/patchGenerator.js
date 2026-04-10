import fs from "fs-extra";
import path from "path";

const ALLOWED_SEVERITY = new Set(["high", "critical"]);

const normalize = (value = "") => String(value).trim().toLowerCase();

const createDiff = (filePath, oldLine, newLine, lineNumber) => {
  return [
    `--- a/${filePath}`,
    `+++ b/${filePath}`,
    `@@ -${lineNumber},1 +${lineNumber},1 @@`,
    `-${oldLine}`,
    `+${newLine}`
  ].join("\n");
};

const generateFix = async (codeLine, issue = "", id = "") => {
  const issueText = `${issue} ${id}`.toLowerCase();

  if (issueText.includes("loose equality") || issueText.includes("loose_equality")) {
    return codeLine.replace(/([^=!])==([^=])/g, "$1===$2");
  }

  if (issueText.includes("innerhtml") || issueText.includes("xss_dom")) {
    return codeLine.replace(/innerHTML/g, "textContent");
  }

  if (issueText.includes("sync_io") && codeLine.includes("readFileSync")) {
    return codeLine.replace(/readFileSync/g, "readFile");
  }

  return codeLine;
};

const shouldSuggest = (finding) => {
  const severity = normalize(finding.severity);
  const confidence = normalize(finding.confidence || "high");

  if (!ALLOWED_SEVERITY.has(severity)) return false;
  if (confidence !== "high") return false;
  if (!finding.file || !finding.line) return false;

  return true;
};

const loadFindings = async (repoPath, findings) => {
  if (Array.isArray(findings) && findings.length) {
    return findings;
  }

  const memoryCandidates = [
    path.join(repoPath, "memory", "final-report.json"),
    path.join(repoPath, "memory", "findings.json")
  ];

  for (const candidate of memoryCandidates) {
    if (!(await fs.pathExists(candidate))) continue;
    const data = await fs.readJson(candidate);
    if (Array.isArray(data?.findings)) return data.findings;
  }

  return [];
};

export const generatePatchSuggestions = async (repoPath, options = {}) => {
  const { findings: incomingFindings = [] } = options;
  const basePath = path.resolve(repoPath || process.cwd());
  const findings = await loadFindings(basePath, incomingFindings);

  if (!findings.length) {
    return [];
  }

  const patches = [];

  for (const finding of findings) {
    if (!shouldSuggest(finding)) {
      continue;
    }

    const absFile = path.isAbsolute(finding.file)
      ? finding.file
      : path.resolve(basePath, finding.file);

    if (!(await fs.pathExists(absFile))) {
      continue;
    }

    const content = await fs.readFile(absFile, "utf8");
    const lines = content.split(/\r?\n/);
    const oldLine = lines[Number(finding.line) - 1];

    if (!oldLine) {
      continue;
    }

    const newLine = await generateFix(oldLine, finding.issue, finding.id);

    if (oldLine === newLine) {
      continue;
    }

    const relativeFile = path.relative(basePath, absFile).replace(/\\/g, "/");

    patches.push({
      file: relativeFile,
      line: Number(finding.line),
      issue: finding.issue,
      severity: normalize(finding.severity),
      confidence: normalize(finding.confidence || "high"),
      diff: createDiff(relativeFile, oldLine, newLine, Number(finding.line))
    });
  }

  const outputPath = path.join(basePath, "memory", "patches.json");
  await fs.ensureDir(path.dirname(outputPath));
  await fs.writeJson(outputPath, { patches }, { spaces: 2 });

  return patches;
};
