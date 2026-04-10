import path from "path";
import process from "process";
import fs from "fs-extra";
import ora from "ora";
import chalk from "chalk";
import inquirer from "inquirer";

import { runEngine } from "./core/engine.js";
import { exportReportPdf } from "./tools/report-pdf.js";
import { log, error, initLogger } from "./utils/logger.js";

// -------------------------
// HELP
// -------------------------
const showHelp = () => {
  console.log(`
${chalk.cyan("Divya Drishti — AI Code Auditor")}

Usage:
  node index.js [project_path]

Options:
  --help       Show help
  --json       Output report in JSON
  --verbose    Enable debug logs
  --watch      Watch mode (future)

Examples:
  node index.js ./project
  node index.js ./project --json
`);
};

// -------------------------
// PARSE ARGS
// -------------------------
const args = process.argv.slice(2);

if (args.includes("--help")) {
  showHelp();
  process.exit(0);
}

let projectPath = args[0];
const isJSON = args.includes("--json");
const isVerbose = args.includes("--verbose");
const isCI = process.env.CI === "true" || process.env.GITHUB_ACTIONS === "true";
const shouldGeneratePdfInCI = process.env.GENERATE_PDF_IN_CI === "true";

// -------------------------
// INTERACTIVE MODE
// -------------------------
const askProjectPath = async () => {
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "path",
      message: "Enter project path:",
      default: "./"
    }
  ]);

  return answers.path;
};

// -------------------------
// MAIN EXECUTION
// -------------------------
const start = async () => {
  try {
    await initLogger();

    if (!projectPath) {
      projectPath = isCI ? process.cwd() : await askProjectPath();
    }

    const resolvedPath = path.resolve(projectPath);

    console.log(
      chalk.blue("\n🚀 Starting Divya Drishti Audit...\n")
    );

    const spinner = ora("Analyzing codebase...").start();

    const startTime = Date.now();

    const result = await runEngine(resolvedPath, {
      format: isJSON ? "json" : "markdown",
      verbose: isVerbose,
      skipGitManager: isCI
    });

    spinner.succeed("Analysis complete");

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    console.log(
      chalk.green(`\n✔ Audit Completed in ${duration}s\n`)
    );

    // -------------------------
    // OUTPUT
    // -------------------------
    console.log(chalk.yellow("========== FINAL REPORT ==========\n"));

    console.log(result.report);

    await fs.writeFile("AUDIT_REPORT.md", result.report, "utf8");
    console.log(chalk.cyan("\n📄 Markdown report saved to: AUDIT_REPORT.md"));

    if (!isCI || shouldGeneratePdfInCI) {
      const pdfPath = await exportReportPdf(result.report, "./memory/audit_report.pdf");
      console.log(chalk.cyan(`\n📄 Styled PDF saved to: ${pdfPath}`));
    }

    console.log(chalk.yellow("\n==================================\n"));

    process.exit(0);

  } catch (err) {
    console.log(chalk.red("\n✖ Audit Failed\n"));

    error("CLI Failure", { message: err.message });

    console.error(chalk.red(err.message));

    process.exit(1);
  }
};

// Run
start();