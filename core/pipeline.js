import path from "path";
import { runAutoFix } from "./autoFix.js";
import { generatePatchSuggestions } from "./patchGenerator.js";

const resolveAuditTarget = (inputPath) => {
  const envWorkspace = process.env.GITHUB_WORKSPACE;
  const fallbackPath = envWorkspace || process.cwd();

  return path.resolve(inputPath || fallbackPath);
};

export const runPipeline = async (config, skills, inputPath, options = {}) => {
  const {
    skipGitManager = false,
    autoFix = false,
    autoFixOptions = {}
  } = options;

  const targetPath = resolveAuditTarget(inputPath);

  let context = {
    files: [],
    findings: [],
    uiSkeletons: [],
    target: targetPath
  };

  for (const step of config.execution.pipeline) {
    const skill = skills[step];

    if (!skill) continue;

    if (step === "file_reader") {
      context.files = await skill(targetPath);
    }

    else if (step.includes("scanner")) {
      for (const file of context.files) {
        const results = await skill(file.content, file.path);
        context.findings.push(...results);
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
      context.report = await skill(context.findings, "markdown", {
        target: context.target,
        scannedFiles: context.files.map((f) => f.path)
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
  }

  return context;
};
