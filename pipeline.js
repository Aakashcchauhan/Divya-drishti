import fs from "fs-extra";
import path from "path";
import { fileReader } from "./skills/file-reader/fileReader.js";
import { securityScanner } from "./skills/security-scanner/securityScanner.js";
import { logicScanner } from "./skills/logic-scanner/logicScanner.js";
import { performanceScanner } from "./skills/performance-scanner/performanceScanner.js";
import { uiSkeletonGenerator } from "./skills/ui-skeleton-generator/uiSkeletonGenerator.js";
import { reportGenerator } from "./skills/report-generator/reportGenerator.js";
import { gitManager } from "./skills/git-manager/gitManager.js";

const memoryPath = "./memory";

// Ensure memory directory exists
await fs.ensureDir(memoryPath);

const runPipeline = async (repoPath) => {
  try {
    console.log("Starting Divya Drishti audit pipeline...");

    // Step 1: File Reader
    console.log("[1/7] Reading files from repository...");
    const files = await fileReader(repoPath);
    await fs.writeJson(path.join(memoryPath, "files.json"), { files });

    // Step 2: Security Scanner
    console.log("[2/7] Running security scan...");
    const securityFindings = [];
    for (const file of files) {
      const results = await securityScanner(file.content, file.path);
      securityFindings.push(...results);
    }
    await fs.writeJson(path.join(memoryPath, "security.json"), { findings: securityFindings });

    // Step 3: Logic Scanner
    console.log("[3/7] Running logic scan...");
    const logicFindings = [];
    for (const file of files) {
      const results = await logicScanner(file.content, file.path);
      logicFindings.push(...results);
    }
    await fs.writeJson(path.join(memoryPath, "logic.json"), { findings: logicFindings });

    // Step 4: Performance Scanner
    console.log("[4/7] Running performance scan...");
    const performanceFindings = [];
    for (const file of files) {
      const results = await performanceScanner(file.content, file.path);
      performanceFindings.push(...results);
    }
    await fs.writeJson(path.join(memoryPath, "performance.json"), { findings: performanceFindings });

    // Step 5: UI Skeleton Generator
    console.log("[5/7] Generating UI skeletons...");
    const uiSkeletons = await uiSkeletonGenerator(files, performanceFindings);
    await fs.writeJson(path.join(memoryPath, "ui.json"), { skeletons: uiSkeletons });

    // Step 6: Report Generator
    console.log("[6/7] Generating final report...");
    const report = await reportGenerator(memoryPath);
    await fs.writeFile("AUDIT_REPORT.md", report);

    // Step 7: Git Manager
    console.log("[7/7] Managing Git operations...");
    const gitResult = await gitManager(report, { push: true, createPR: true });

    console.log("Pipeline completed successfully!");
    console.log("Git Result:", gitResult);
  } catch (error) {
    console.error("Pipeline failed:", error);
  }
};
