#!/usr/bin/env node

import path from "path";
import process from "process";
import fs from "fs-extra";
import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";

import { runEngine } from "./core/engine.js";
import { runAutoFix } from "./core/autoFix.js";
import { runAIPipeline } from "./pipeline.js";
import { exportReportPdf } from "./tools/report-pdf.js";
import { initLogger } from "./utils/logger.js";

const REPORT_FILE = "AUDIT_REPORT.md";
const SUMMARY_FILE = "AUDIT_SUMMARY.md";
const MEMORY_DIR = "memory";

const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };

const normalizeSeverity = (value) => String(value || "low").trim().toLowerCase();

const toCategoryBuckets = (findings = []) => {
  return {
    security: findings.filter((f) => String(f.category || "").toLowerCase() === "security"),
    logic: findings.filter((f) => String(f.category || "").toLowerCase() === "logic"),
    performance: findings.filter((f) => String(f.category || "").toLowerCase() === "performance"),
    ui: findings.filter((f) => String(f.category || "").toLowerCase() === "ui")
  };
};

const renderSummary = (reportText = "") => {
  const lines = reportText.split(/\r?\n/);
  const hits = lines
    .map((line) => line.trim())
    .filter((line) => /critical|high/i.test(line))
    .filter(Boolean);

  const dedup = [...new Set(hits.map((line) => line.replace(/\s+/g, " ").trim()))];

  const body = [
    "# Audit Summary Report",
    "",
    "## Critical and High Issues",
    ""
  ];

  if (dedup.length === 0) {
    body.push("No critical or high issues found");
  } else {
    dedup.sort((a, b) => {
      const sa = /critical/i.test(a) ? 2 : 1;
      const sb = /critical/i.test(b) ? 2 : 1;
      return sb - sa;
    });

    for (const item of dedup) {
      body.push(`- ${item}`);
    }
  }

  body.push(
    "",
    "## Notes",
    "- Duplicate issues removed",
    "- Focused on high-impact risks only"
  );

  return body.join("\n");
};

const hasCriticalFindings = (findings = []) => {
  return findings.some((f) => normalizeSeverity(f.severity) === "critical");
};

const persistMemoryOutputs = async (findings, repoPath) => {
  const memoryPath = path.resolve(MEMORY_DIR);
  await fs.ensureDir(memoryPath);

  const buckets = toCategoryBuckets(findings);
  await fs.writeJson(path.join(memoryPath, "security.json"), { findings: buckets.security }, { spaces: 2 });
  await fs.writeJson(path.join(memoryPath, "logic.json"), { findings: buckets.logic }, { spaces: 2 });
  await fs.writeJson(path.join(memoryPath, "performance.json"), { findings: buckets.performance }, { spaces: 2 });
  await fs.writeJson(path.join(memoryPath, "ui.json"), { findings: buckets.ui }, { spaces: 2 });

  const sorted = [...findings].sort(
    (a, b) => (severityOrder[normalizeSeverity(b.severity)] || 1) - (severityOrder[normalizeSeverity(a.severity)] || 1)
  );

  await fs.writeJson(path.join(memoryPath, "findings.json"), { findings: sorted }, { spaces: 2 });

  const runStamp = [
    `timestamp=${new Date().toISOString()}`,
    `target=${repoPath}`,
    `total_findings=${findings.length}`,
    `critical=${sorted.filter((f) => normalizeSeverity(f.severity) === "critical").length}`,
    `high=${sorted.filter((f) => normalizeSeverity(f.severity) === "high").length}`
  ].join("\n");

  await fs.writeFile(path.join(memoryPath, "latest_run.txt"), runStamp, "utf8");
};

const runScan = async (repoPathArg, options) => {
  await initLogger();

  const repoPath = path.resolve(repoPathArg || ".");
  const skipGitManager = options.git === false;
  const spinner = ora(chalk.blue("Running Divya Drishti audit pipeline...")).start();

  try {
    const exists = await fs.pathExists(repoPath);
    if (!exists) {
      spinner.fail(chalk.red(`Invalid repository path: ${repoPath}`));
      process.exit(1);
    }

    spinner.text = chalk.cyan("Scanning repository files and running analysis modules...");

    const result = await runEngine(repoPath, {
      format: options.json ? "json" : "markdown",
      skipGitManager,
      verbose: Boolean(options.verbose)
    });

    const reportText = String(result.report || "").trim();
    if (!reportText) {
      spinner.fail(chalk.red("No report content was generated."));
      process.exit(1);
    }

    await fs.writeFile(REPORT_FILE, reportText, "utf8");

    const findings = Array.isArray(result.findings) ? result.findings : [];
    await persistMemoryOutputs(findings, repoPath);

    if (options.summary) {
      const summary = renderSummary(reportText);
      await fs.writeFile(SUMMARY_FILE, summary, "utf8");
    }

    if (options.pdf) {
      await exportReportPdf(reportText, "./memory/audit_report.pdf");
    }

    spinner.succeed(chalk.green("Audit completed successfully"));

    console.log(chalk.yellow("\nExecution Summary"));
    console.log(chalk.white(`- Target: ${repoPath}`));
    console.log(chalk.white(`- Report: ${REPORT_FILE}`));
    console.log(chalk.white(`- Memory: ${MEMORY_DIR}/security.json, logic.json, performance.json, ui.json, findings.json`));
    if (options.summary) {
      console.log(chalk.white(`- Summary: ${SUMMARY_FILE}`));
    }
    if (options.pdf) {
      console.log(chalk.white("- PDF: memory/audit_report.pdf"));
    }

    if (options.failOnCritical && hasCriticalFindings(findings)) {
      console.log(chalk.red("\nCritical issues detected. Failing due to --fail-on-critical."));
      process.exit(1);
    }
  } catch (err) {
    spinner.fail(chalk.red("Audit failed"));
    console.error(chalk.red(err?.message || String(err)));
    process.exit(1);
  }
};

const printReport = async () => {
  const reportPath = path.resolve(REPORT_FILE);
  if (!(await fs.pathExists(reportPath))) {
    console.log(chalk.red("No report found. Run divya scan first."));
    process.exit(1);
  }

  const report = await fs.readFile(reportPath, "utf8");
  console.log(report);
};

const printSummary = async () => {
  const summaryPath = path.resolve(SUMMARY_FILE);
  if (!(await fs.pathExists(summaryPath))) {
    console.log(chalk.red("No summary found. Run divya scan --summary first."));
    process.exit(1);
  }

  const summary = await fs.readFile(summaryPath, "utf8");
  console.log(summary);
};

const cleanMemory = async () => {
  const memoryPath = path.resolve(MEMORY_DIR);
  await fs.ensureDir(memoryPath);
  await fs.emptyDir(memoryPath);
  console.log(chalk.yellow("Memory cleared"));
};

const runFix = async (repoPathArg, options) => {
  await initLogger();

  const repoPath = path.resolve(repoPathArg || ".");
  const spinner = ora(chalk.blue("Running auto-fix workflow...")).start();

  try {
    const exists = await fs.pathExists(repoPath);
    if (!exists) {
      spinner.fail(chalk.red(`Invalid repository path: ${repoPath}`));
      process.exit(1);
    }

    let findings = null;

    if (!options.fromMemory) {
      spinner.text = chalk.cyan("Scanning project before remediation...");
      const scan = await runEngine(repoPath, {
        format: "markdown",
        skipGitManager: true,
        autoFix: false
      });

      findings = Array.isArray(scan.findings) ? scan.findings : [];
      await persistMemoryOutputs(findings, repoPath);
    }

    spinner.text = chalk.cyan("Applying automated fixes...");

    const result = await runAutoFix(repoPath, {
      findings,
      includeCritical: Boolean(options.includeCritical),
      dryRun: Boolean(options.dryRun),
      commit: Boolean(options.commit),
      push: Boolean(options.push),
      createPr: Boolean(options.pr)
    });

    spinner.succeed(chalk.green("Auto-fix completed"));

    console.log(chalk.yellow("\nAuto-Fix Summary"));
    console.log(chalk.white(`- Repo: ${repoPath}`));
    console.log(chalk.white(`- Findings Processed: ${result.totalFindings}`));
    console.log(chalk.white(`- Fixes Applied: ${result.fixedCount}`));
    console.log(chalk.white(`- Skipped: ${result.skippedCount}`));
    console.log(chalk.white(`- Report: ${result.reportPath}`));

    if (result.git?.branch) {
      console.log(chalk.white(`- Git Branch: ${result.git.branch}`));
      console.log(chalk.white(`- Pushed: ${result.git.pushed ? "yes" : "no"}`));
    }

    if (result.git?.pr) {
      console.log(chalk.white(`- Pull Request: ${result.git.pr}`));
    }
  } catch (err) {
    spinner.fail(chalk.red("Auto-fix failed"));
    console.error(chalk.red(err?.message || String(err)));
    process.exit(1);
  }
};

const runCreate = async (domain, options) => {
  await initLogger();

  const spinner = ora(chalk.blue("Running policy-driven generation pipeline...")).start();

  try {
    const repoPath = path.resolve(options.repo || ".");
    const feature = options.feature || "feature";
    const userPrompt = options.prompt || `Create ${feature} for ${domain}`;

    const result = await runAIPipeline({
      repoPath,
      userInput: `${domain} ${userPrompt}`,
      safe: Boolean(options.safe),
      feature,
      outFile: options.out,
      rulesPath: options.rules,
      model: options.model,
      provider: options.provider,
      enableGit: options.git !== false,
      createPR: Boolean(options.pr)
    });

    const auditResult = await runEngine(repoPath, {
      format: "markdown",
      skipGitManager: true
    });

    const findings = Array.isArray(auditResult.findings) ? auditResult.findings : [];
    await persistMemoryOutputs(findings, repoPath);

    if (options.summary) {
      const reportText = await fs.readFile(path.resolve(repoPath, REPORT_FILE), "utf8");
      const summary = renderSummary(reportText);
      await fs.writeFile(path.resolve(repoPath, SUMMARY_FILE), summary, "utf8");
    }

    spinner.succeed(chalk.green("Policy-driven generation completed"));

    console.log(chalk.yellow("\nGeneration Summary"));
    console.log(chalk.white(`- Domain: ${result.domain}`));
    console.log(chalk.white(`- Feature: ${result.feature}`));
    console.log(chalk.white(`- Output: ${result.outputPath}`));
    console.log(chalk.white(`- Confidence: ${result.confidence}`));
    if (result.provider) {
      console.log(chalk.white(`- Provider: ${result.provider} (${result.model})`));
    }
    console.log(chalk.white(`- Audit Report: ${path.resolve(repoPath, REPORT_FILE)}`));

    if (result.git?.branch) {
      console.log(chalk.white(`- Git Branch: ${result.git.branch}`));
    }

    if (result.git?.pr) {
      console.log(chalk.white(`- Pull Request: ${result.git.pr}`));
    }

    if (options.failOnCritical && hasCriticalFindings(findings)) {
      console.log(chalk.red("\nCritical issues detected. Failing due to --fail-on-critical."));
      process.exit(1);
    }
  } catch (err) {
    spinner.fail(chalk.red("Policy-driven generation failed"));
    console.error(chalk.red(err?.message || String(err)));
    process.exit(1);
  }
};

const program = new Command();

program
  .name("divya")
  .description("Divya Drishti AI Code Auditor CLI")
  .version("1.0.0");

program
  .command("scan")
  .argument("[repoPath]", "Path to repository", ".")
  .option("--summary", "Generate critical/high summary report")
  .option("--fail-on-critical", "Exit with code 1 when critical findings exist")
  .option("--no-git", "Disable git manager stage")
  .option("--json", "Generate JSON-formatted primary report")
  .option("--pdf", "Generate PDF report in memory/audit_report.pdf")
  .option("--verbose", "Enable verbose execution logs")
  .description("Run full audit pipeline")
  .action(runScan);

program
  .command("report")
  .description("Print the latest markdown report")
  .action(printReport);

program
  .command("summary")
  .description("Print the latest summary report")
  .action(printSummary);

program
  .command("clean")
  .description("Clear generated memory files")
  .action(cleanMemory);

program
  .command("fix")
  .argument("[repoPath]", "Path to repository", ".")
  .option("--from-memory", "Use existing memory findings instead of scanning first")
  .option("--include-critical", "Allow automatic fixes for critical findings")
  .option("--dry-run", "Preview fixes without writing files")
  .option("--commit", "Commit applied fixes")
  .option("--push", "Push autofix branch after commit")
  .option("--pr", "Create pull request after push (requires GitHub token env)")
  .description("Auto-fix detected issues and optionally commit/push/create PR")
  .action(runFix);

program
  .command("create")
  .argument("<domain>", "Generation domain such as auth, payments, api, ui")
  .option("--feature <name>", "Feature name", "feature")
  .option("--prompt <text>", "Explicit user requirement prompt")
  .option("--repo <path>", "Repository root path", ".")
  .option("--out <file>", "Output file relative to repository root")
  .option("--rules <path>", "Rules library path (reserved for compatibility)", "./rules.json")
  .option("--model <model>", "LLM model", "gpt-4o-mini")
  .option("--provider <name>", "LLM provider: openai or gemini", "openai")
  .option("--safe", "Enable strict safe mode with secure templates")
  .option("--summary", "Generate summary report after audit")
  .option("--fail-on-critical", "Exit with code 1 when critical findings exist")
  .option("--pr", "Create pull request after commit (requires GITHUB_TOKEN and GITHUB_REPOSITORY)")
  .option("--no-git", "Disable git branch and commit step")
  .description("Generate policy-compliant code, validate it, audit it, and optionally commit")
  .action(runCreate);

program.parseAsync(process.argv);
