import path from "path";
import fs from "fs-extra";
import { exec } from "child_process";
import util from "util";
import OpenAI from "openai";

import { runEngine } from "./engine.js";

const execAsync = util.promisify(exec);

const DEFAULT_MODEL = "gpt-4o-mini";

const normalizeDomain = (domain = "") => {
  const value = String(domain).trim().toLowerCase();

  if (["auth", "authentication", "login", "session"].includes(value)) return "authentication";
  if (["payment", "payments", "checkout", "billing"].includes(value)) return "payments";
  if (["api", "backend", "service"].includes(value)) return "api";
  if (["ui", "ux", "frontend", "component"].includes(value)) return "ui";
  if (["performance", "perf", "optimization", "optimisation"].includes(value)) return "performance";

  return value || "default";
};

const slugify = (value = "") => {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || "feature";
};

const readRules = async (rulesPath = "./rules/policies.json") => {
  const fullPath = path.resolve(rulesPath);
  return fs.readJson(fullPath);
};

const mapIntentToCategories = ({ domain = "", feature = "", prompt = "" }) => {
  const text = `${domain} ${feature} ${prompt}`.toLowerCase();
  const categories = new Set(["default"]);

  if (/auth|login|session|token|jwt|password/.test(text)) categories.add("authentication");
  if (/pay|checkout|invoice|billing|subscription|webhook/.test(text)) categories.add("payments");
  if (/api|endpoint|route|controller|service/.test(text)) categories.add("api");
  if (/ui|ux|page|component|react|layout|skeleton/.test(text)) categories.add("ui");
  if (/perf|performance|cache|latency|optimiz/.test(text)) categories.add("performance");

  if (domain && ["authentication", "payments", "api", "ui", "performance"].includes(domain)) {
    categories.add(domain);
  }

  return [...categories];
};

const flattenRules = (rulesLibrary, categories, safeMode) => {
  const rules = [];

  for (const category of categories) {
    const list = Array.isArray(rulesLibrary[category]) ? rulesLibrary[category] : [];
    for (const item of list) {
      rules.push(`[${category}] ${item}`);
    }
  }

  if (safeMode) {
    rules.push("[safe] Only secure and conservative implementation patterns are allowed.");
    rules.push("[safe] If a requirement conflicts with security, prioritize security and explain why.");
  }

  return rules;
};

const buildMasterPrompt = ({ domain, feature, userPrompt, categories, rules, safeMode, language }) => {
  const numberedRules = rules.map((rule, index) => `${index + 1}. ${rule}`).join("\n");

  return [
    "You are generating production-ready code for Divya Drishti.",
    "Return markdown output with:",
    "1) A short implementation summary",
    "2) One fenced code block with final code only",
    "3) Optional notes section",
    "",
    `Requested domain: ${domain || "generic"}`,
    `Requested feature: ${feature || "unspecified"}`,
    `Target language: ${language || "JavaScript"}`,
    `Safe mode: ${safeMode ? "enabled" : "disabled"}`,
    `Detected categories: ${categories.join(", ")}`,
    "",
    "Mandatory policy rules:",
    numberedRules,
    "",
    "User request:",
    userPrompt,
    "",
    "Do not generate insecure patterns such as eval, unsanitized HTML injection, or raw JWT exposure in browser storage.",
    "Prefer modular structure and explicit validation.",
    "Output must be valid markdown."
  ].join("\n");
};

const extractCodeBlock = (markdown) => {
  const match = String(markdown || "").match(/```[a-zA-Z0-9_-]*\n([\s\S]*?)```/);
  if (match && match[1]) {
    return match[1].trim();
  }
  return String(markdown || "").trim();
};

const safeTemplates = {
  authentication: `import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const SESSION_COOKIE = "session";

export const login = async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ message: "email and password are required" });
  }

  const user = await req.userStore.findByEmail(email);
  if (!user) {
    return res.status(401).json({ message: "invalid credentials" });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ message: "invalid credentials" });
  }

  const token = jwt.sign(
    { sub: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );

  res.cookie(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/"
  });

  return res.status(200).json({ ok: true });
};
`
};

const generateWithLlm = async ({ prompt, model = DEFAULT_MODEL, safeMode, domain, provider = "openai" }) => {
  if (safeMode && safeTemplates[domain]) {
    return {
      provider: "safe-template",
      model: "template-v1",
      markdown: [
        "### Secure Template Output",
        "",
        "```js",
        safeTemplates[domain].trim(),
        "```"
      ].join("\n")
    };
  }

  if (provider === "gemini") {
    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (!geminiApiKey) {
      throw new Error("GEMINI_API_KEY is required for Gemini generation.");
    }

    const geminiModel = model || "gemini-1.5-flash";
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${geminiApiKey}`;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ]
      })
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Gemini API call failed: ${body}`);
    }

    const data = await response.json();
    const markdown =
      data?.candidates?.[0]?.content?.parts?.map((part) => part.text).join("\n") || "";

    return {
      provider: "gemini",
      model: geminiModel,
      markdown
    };
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is required for OpenAI generation when --safe is not used.");
  }

  const client = new OpenAI({ apiKey });

  const response = await client.responses.create({
    model,
    input: prompt
  });

  return {
    provider: "openai",
    model,
    markdown: response.output_text || ""
  };
};

const validateRules = ({ code, categories, safeMode }) => {
  const violations = [];
  const source = String(code || "");

  const pushViolation = (rule, reason) => {
    violations.push({ rule, reason });
  };

  if (/\beval\s*\(|new\s+Function\s*\(/i.test(source)) {
    pushViolation("No dynamic code execution", "Found eval or Function constructor usage");
  }

  if (/innerHTML\s*=|dangerouslySetInnerHTML/i.test(source) && !/sanitize|dompurify/i.test(source)) {
    pushViolation("Sanitize untrusted HTML", "Unsanitized HTML sink detected");
  }

  if (categories.includes("authentication")) {
    if (/jwt\.sign\s*\(/i.test(source) && !/httpOnly\s*:\s*true/i.test(source)) {
      pushViolation("Use HttpOnly cookie for session", "JWT token generation without HttpOnly cookie usage");
    }

    if (/password/i.test(source) && !/bcrypt|argon2/i.test(source)) {
      pushViolation("Use bcrypt or argon2", "Password handling found without strong hashing");
    }
  }

  if (safeMode) {
    if (/localStorage\.setItem\s*\([^\n]*token/i.test(source)) {
      pushViolation("Safe mode token handling", "Token appears to be stored in localStorage");
    }
  }

  return {
    ok: violations.length === 0,
    violations
  };
};

const scoreConfidence = ({ validation, categories, safeMode, markdown }) => {
  let score = 100;

  score -= validation.violations.length * 30;
  if (!/```/.test(markdown || "")) score -= 10;
  if (categories.includes("authentication")) score -= 5;
  if (safeMode) score += 5;

  if (score >= 80) return "high";
  if (score >= 55) return "medium";
  return "low";
};

const generateOutputPath = ({ domain, feature, outFile }) => {
  if (outFile) return outFile;

  const fileName = `${slugify(domain || "module")}-${slugify(feature || "feature")}.js`;
  return path.join("generated", fileName);
};

const writeGeneratedCode = async ({ repoPath, outFile, code }) => {
  const absPath = path.resolve(repoPath, outFile);
  await fs.ensureDir(path.dirname(absPath));
  await fs.writeFile(absPath, code, "utf8");
  return absPath;
};

const runPostAudit = async (repoPath, skipGitManager = true) => {
  return runEngine(repoPath, {
    format: "markdown",
    skipGitManager
  });
};

const runGit = async (command, cwd) => {
  const { stdout, stderr } = await execAsync(command, { cwd });
  if (stderr && !stderr.toLowerCase().includes("warning")) {
    throw new Error(stderr);
  }
  return stdout.trim();
};

const createGitHubPullRequest = async ({ repo, branch, base = "main", title, body, token }) => {
  const response = await fetch(`https://api.github.com/repos/${repo}/pulls`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      title,
      head: branch,
      base,
      body
    })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to create pull request: ${text}`);
  }

  return response.json();
};

const commitGeneratedChanges = async ({ repoPath, files, message, createPR = false }) => {
  await runGit("git rev-parse --is-inside-work-tree", repoPath);

  const branch = `ai/${Date.now()}`;
  await runGit(`git checkout -b ${branch}`, repoPath);

  const normalizedFiles = files.map((file) => path.relative(repoPath, file).replace(/\\/g, "/"));
  for (const file of normalizedFiles) {
    await runGit(`git add -- \"${file}\"`, repoPath);
  }

  await runGit(`git commit -m \"${message}\"`, repoPath);

  let pushed = false;
  let pr = null;

  try {
    await runGit(`git push origin ${branch} --set-upstream`, repoPath);
    pushed = true;
  } catch {
    pushed = false;
  }

  if (createPR && pushed) {
    const repo = process.env.GITHUB_REPOSITORY;
    const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;

    if (repo && token) {
      const base = process.env.GITHUB_BASE_REF || "main";
      pr = await createGitHubPullRequest({
        repo,
        branch,
        base,
        title: "AI Generated Secure Code",
        body: "Automated code generated and validated by Divya Drishti.",
        token
      });
    }
  }

  return { branch, files: normalizedFiles, pushed, pr: pr?.html_url || null };
};

export const createWithPolicy = async ({
  domain,
  feature,
  prompt,
  repoPath,
  outFile,
  rulesPath,
  safeMode = false,
  model = DEFAULT_MODEL,
  provider = "openai",
  enableGit = false,
  createPR = false
}) => {
  const normalizedDomain = normalizeDomain(domain);
  const projectPath = path.resolve(repoPath || process.cwd());

  const rulesLibrary = await readRules(rulesPath);
  const categories = mapIntentToCategories({ domain: normalizedDomain, feature, prompt });
  const rules = flattenRules(rulesLibrary, categories, safeMode);

  const masterPrompt = buildMasterPrompt({
    domain: normalizedDomain,
    feature,
    userPrompt: prompt,
    categories,
    rules,
    safeMode,
    language: "JavaScript"
  });

  const generation = await generateWithLlm({
    prompt: masterPrompt,
    model,
    safeMode,
    domain: normalizedDomain,
    provider
  });

  const generatedCode = extractCodeBlock(generation.markdown);

  const validation = validateRules({
    code: generatedCode,
    categories,
    safeMode
  });

  if (!validation.ok) {
    const violationsText = validation.violations
      .map((item, index) => `${index + 1}. ${item.rule}: ${item.reason}`)
      .join("\n");
    throw new Error(`Rule violation detected:\n${violationsText}`);
  }

  const confidence = scoreConfidence({
    validation,
    categories,
    safeMode,
    markdown: generation.markdown
  });

  const resolvedOutFile = generateOutputPath({ domain, feature, outFile });
  const generatedPath = await writeGeneratedCode({
    repoPath: projectPath,
    outFile: resolvedOutFile,
    code: generatedCode
  });

  const auditResult = await runPostAudit(projectPath, true);

  const reportPath = path.resolve(projectPath, "AUDIT_REPORT.md");
  await fs.writeFile(reportPath, String(auditResult.report || ""), "utf8");

  let gitResult = null;
  if (enableGit) {
    gitResult = await commitGeneratedChanges({
      repoPath: projectPath,
      files: [generatedPath, reportPath],
      message: `feat(ai): generate ${normalizedDomain || "module"} ${feature || "feature"}`,
      createPR
    });
  }

  return {
    domain: normalizedDomain,
    feature,
    categories,
    rules,
    prompt: masterPrompt,
    provider: generation.provider,
    model: generation.model,
    outputFile: resolvedOutFile,
    outputPath: generatedPath,
    confidence,
    validation,
    audit: {
      findings: Array.isArray(auditResult.findings) ? auditResult.findings : [],
      reportPath
    },
    git: gitResult
  };
};
