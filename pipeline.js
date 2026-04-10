import fs from "fs-extra";
import path from "path";

import { createWithPolicy } from "./core/ai-orchestrator.js";

const loadRules = async (rulesPath = "./rules.json") => {
  const resolved = path.resolve(rulesPath);

  if (!(await fs.pathExists(resolved))) {
    throw new Error("rules.json not found");
  }

  return fs.readJson(resolved);
};

const detectIntent = (input = "") => {
  const text = String(input).toLowerCase();

  if (text.includes("auth") || text.includes("login")) {
    return "authentication";
  }

  if (text.includes("payment")) {
    return "payment";
  }

  return "general";
};

const buildPrompt = (userInput, rules = []) => {
  return [
    "You are a senior backend engineer.",
    "",
    "User request:",
    `\"${userInput}\"`,
    "",
    "You MUST follow these rules strictly:",
    ...rules.map((rule, i) => `${i + 1}. ${rule}`),
    "",
    "Generate secure and production-ready Node.js code.",
    "Return only Markdown code."
  ].join("\n");
};

const validateCode = (code, rules = []) => {
  const violations = [];
  const source = String(code || "");

  const requiresBcrypt = rules.some((rule) => /bcrypt|argon2/i.test(rule));
  const requiresHttpOnly = rules.some((rule) => /http-only|httponly/i.test(rule));

  if (requiresBcrypt && !/bcrypt|argon2/i.test(source)) {
    violations.push("Password hashing rule violated");
  }

  if (requiresHttpOnly && !/httpOnly\s*:\s*true/i.test(source)) {
    violations.push("HTTP-only cookie rule missing");
  }

  return violations;
};

export const runAIPipeline = async ({
  repoPath = process.cwd(),
  userInput,
  safe = false,
  feature = "feature",
  outFile,
  enableGit = true,
  createPR = false,
  provider = "openai",
  model,
  rulesPath = "./rules.json"
}) => {
  if (!userInput) {
    throw new Error("userInput is required");
  }

  console.log("Starting AI Code Generation Pipeline...");

  const rulesLib = await loadRules(rulesPath);
  const intent = detectIntent(userInput);
  const rules = rulesLib[intent] || rulesLib.general || [];
  const prompt = buildPrompt(userInput, rules);

  console.log("Detected intent:", intent);
  console.log("Calling AI...");

  const result = await createWithPolicy({
    domain: intent,
    feature,
    prompt,
    repoPath,
    outFile,
    rulesPath,
    safeMode: safe,
    model,
    provider,
    enableGit,
    createPR
  });

  const generatedCode = await fs.readFile(result.outputPath, "utf8");
  const violations = validateCode(generatedCode, rules);

  if (violations.length > 0) {
    throw new Error(`AI output failed validation: ${violations.join("; ")}`);
  }

  console.log("Code saved at:", result.outputPath);
  console.log("Pipeline completed");

  return {
    filePath: result.outputPath,
    outputPath: result.outputPath,
    domain: intent,
    feature,
    provider: result.provider,
    model: result.model,
    intent,
    confidence: result.confidence,
    status: "success",
    git: result.git || null
  };
};

export default runAIPipeline;
