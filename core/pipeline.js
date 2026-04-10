import path from "path";
import { runAutoFix } from "./autoFix.js";
import { generatePatchSuggestions } from "./patchGenerator.js";

const resolveAuditTarget = (inputPath) => {
  const envWorkspace = process.env.GITHUB_WORKSPACE;
  const fallbackPath = envWorkspace || process.cwd();

  return path.resolve(inputPath || fallbackPath);
};

const getScannableFiles = (files = []) => {
  return files.filter(
    (file) =>
      file &&
      file.status === "safe" &&
      typeof file.content === "string" &&
      file.content.trim().length > 0
  );
};

const getScannerCategory = (step) => {
  if (step.includes("security")) return "security";
  if (step.includes("logic")) return "logic";
  if (step.includes("performance")) return "performance";
  return "logic";
};

const pushSystemFinding = (context, finding) => {
  context.findings.push({
    type: "system_finding",
    id: finding.id,
    category: finding.category || "logic",
    severity: finding.severity || "medium",
    confidence: finding.confidence || "confirmed",
    file: finding.file || "pipeline",
    line: 0,
    issue: finding.issue,
    impact: finding.impact,
    fix: finding.fix,
    recommendation: finding.fix,
    reasoning: finding.reasoning,
    evidence: finding.evidence || ""
  });
};

export const runPipeline = async (config, skills, inputPath, options = {}) => {
  const {
    skipGitManager = false,
    autoFix = false,
    autoFixOptions = {},
    verbose = false
  } = options;

  const executionSteps = Array.isArray(config?.execution?.pipeline)
    ? config.execution.pipeline
    : [
        "file_reader",
        "security_scanner",
        "logic_scanner",
        "performance_scanner",
        "ui_skeleton_generator",
        "report_generator",
        "git_manager"
      ];

  const targetPath = resolveAuditTarget(inputPath);
  const pipelineStart = Date.now();

  let context = {
    files: [],
    scannableFiles: [],
    findings: [],
    uiSkeletons: [],
    target: targetPath,
    diagnostics: {
      durations: {},
      fileReader: {
        discovered: 0,
        scannable: 0,
        skipped: 0,
        errored: 0
      },
      scanners: {},
      totalScanTimeMs: 0
    }
  };

  for (const step of executionSteps) {
    const stepStart = Date.now();
    const skill = skills[step];

    if (!skill) continue;

    if (step === "file_reader") {
      context.files = await skill(targetPath);
      context.scannableFiles = getScannableFiles(context.files);

      const skippedOrLarge = context.files.filter(
        (file) => file?.status === "skipped"
      ).length;
      const errored = context.files.filter(
        (file) => file?.status === "error"
      ).length;

      context.diagnostics.fileReader = {
        discovered: context.files.length,
        scannable: context.scannableFiles.length,
        skipped: skippedOrLarge,
        errored
      };

      if (verbose) {
        console.log(
          `[audit] file_reader: discovered=${context.files.length}, scannable=${context.scannableFiles.length}, skipped=${skippedOrLarge}, errored=${errored}`
        );
      }

      if (context.scannableFiles.length === 0) {
        pushSystemFinding(context, {
          id: "EMPTY_SCAN_INPUT",
          category: "logic",
          severity: "high",
          issue: "No scannable files loaded for analysis",
          impact: "Security, logic, and performance scanners cannot produce meaningful findings.",
          reasoning: "File discovery returned no safe text files with content.",
          fix: "Verify target path, glob filters, and ignore rules; ensure source files exist and are readable.",
          evidence: `target=${targetPath}`
        });
      }
    }

    else if (step.includes("scanner")) {
      const scannerStart = Date.now();
      const scannerName = step;
      const category = getScannerCategory(step);

      context.diagnostics.scanners[scannerName] = {
        filesVisited: 0,
        findingsProduced: 0,
        failures: 0,
        durationMs: 0
      };

      for (const file of context.scannableFiles) {
        context.diagnostics.scanners[scannerName].filesVisited += 1;

        if (verbose) {
          console.log(`[audit] ${scannerName}: scanning ${file.path}`);
        }

        try {
          const results = await skill(file.content, file.path);
          const safeResults = Array.isArray(results) ? results : [];

          context.findings.push(...safeResults);
          context.diagnostics.scanners[scannerName].findingsProduced += safeResults.length;
        } catch (err) {
          context.diagnostics.scanners[scannerName].failures += 1;

          pushSystemFinding(context, {
            id: `${scannerName.toUpperCase()}_RUNTIME_ERROR_${context.diagnostics.scanners[scannerName].failures}`,
            category,
            severity: "high",
            issue: `${scannerName} failed on a file`,
            impact: "Scanner execution was interrupted for at least one file, reducing audit coverage.",
            reasoning: String(err?.message || "Unknown scanner error"),
            fix: "Handle scanner exceptions and validate parser dependencies for this file type.",
            evidence: file.path
          });
        }
      }

      context.diagnostics.scanners[scannerName].durationMs = Date.now() - scannerStart;

      if (verbose) {
        const stats = context.diagnostics.scanners[scannerName];
        console.log(
          `[audit] ${scannerName}: files=${stats.filesVisited}, findings=${stats.findingsProduced}, failures=${stats.failures}, durationMs=${stats.durationMs}`
        );
      }
    }

    else if (step === "ui_skeleton_generator") {
      const performanceFindings = context.findings.filter(
        (finding) => String(finding.category || "").toLowerCase() === "performance"
      );

      context.uiSkeletons = await skill(context.files, performanceFindings);

      const uiFindings = context.uiSkeletons.map((item) => ({
        category: "ui",
        severity: item.priority === "high" ? "high" : "medium",
        confidence: "likely",
        file: item.file,
        line: 0,
        issue: `UI skeleton opportunity detected (${item.layout || "structured"} layout)`,
        impact: "Users may experience poor perceived performance during loading states.",
        fix:
          item.recommendation ||
          "Introduce skeleton placeholders for key UI blocks to reduce perceived latency.",
        reasoning: `Detected UI blocks in ${item.file} with ${item.layout || "unknown"} structure.`
      }));

      context.findings.push(...uiFindings);
    }

    else if (step === "report_generator") {
      context.diagnostics.totalScanTimeMs = Date.now() - pipelineStart;

      context.report = await skill(context.findings, "markdown", {
        target: context.target,
        scannedFiles: context.scannableFiles.map((f) => f.path),
        diagnostics: context.diagnostics
      });

      context.patches = await generatePatchSuggestions(context.target, {
        findings: context.findings
      });

      if (autoFix) {
        context.autoFix = await runAutoFix(context.target, {
          findings: context.findings,
          ...autoFixOptions
        });
      }
    }

    else if (step === "git_manager") {
      if (skipGitManager) {
        continue;
      }

      await skill(context.report);
    }

    context.diagnostics.durations[step] = Date.now() - stepStart;
  }

  context.diagnostics.totalScanTimeMs = Date.now() - pipelineStart;

  if (verbose) {
    console.log(`[audit] pipeline total duration: ${context.diagnostics.totalScanTimeMs}ms`);
  }

  return context;
};
