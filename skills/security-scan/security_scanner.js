import { parse } from "@babel/parser";
import traverse from "@babel/traverse";

const detectLanguage = (filePath) => {
  const ext = filePath.split(".").pop()?.toLowerCase();

  const map = {
    js: "javascript",
    ts: "typescript",
    jsx: "javascript",
    tsx: "typescript",
    py: "python",
    java: "java",
    php: "php",
    go: "go",
    rs: "rust",
    cpp: "cpp",
    c: "c"
  };

  return map[ext] || "unknown";
};

const isJsLike = (language) => ["javascript", "typescript"].includes(language);

const parseAst = (code, language) => {
  if (!isJsLike(language)) return null;

  try {
    const plugins = ["jsx"];
    if (language === "typescript") plugins.push("typescript");

    return parse(code, {
      sourceType: "unambiguous",
      plugins,
      errorRecovery: true,
      ranges: true
    });
  } catch {
    return null;
  }
};

const PATTERNS = [
  {
    id: "CMD_INJECTION",
    regex: /\b(exec|spawn|system|popen|execSync)\s*\(/,
    severity: "critical",
    cwe: "CWE-78",
    issue: "OS Command Injection Risk",
    impact: "Execution of arbitrary system commands.",
    languages: ["all"]
  },
  {
    id: "SQL_INJECTION",
    regex: /(SELECT|INSERT|UPDATE|DELETE).*['"`]\s*\+\s*\w+/i,
    severity: "high",
    cwe: "CWE-89",
    issue: "Potential SQL Injection",
    impact: "Database compromise due to unsafe query construction.",
    languages: ["all"]
  },
  {
    id: "HARDCODED_SECRET",
    regex: /(api[_-]?key|secret|password|token)\s*(=|:)\s*(['"`])[a-zA-Z0-9\-_]{12,}\3/i,
    severity: "critical",
    cwe: "CWE-798",
    issue: "Hardcoded Credential Detected",
    impact: "Sensitive credentials exposed in source code.",
    languages: ["all"]
  },
  {
    id: "INSECURE_CRYPTO",
    regex: /(md5|sha1)\s*\(/i,
    severity: "high",
    cwe: "CWE-327",
    issue: "Weak Cryptographic Algorithm",
    impact: "Susceptible to collision attacks and data compromise.",
    languages: ["all"]
  },
  {
    id: "XSS_DOM",
    regex: /(innerHTML\s*=|dangerouslySetInnerHTML|document\.write\()/i,
    severity: "high",
    cwe: "CWE-79",
    issue: "DOM-based XSS Risk",
    impact: "Execution of malicious scripts in client environment.",
    languages: ["javascript", "typescript"]
  },
  {
    id: "CODE_EXECUTION",
    regex: /\beval\s*\(|new\s+Function\s*\(/,
    severity: "critical",
    cwe: "CWE-95",
    issue: "Dynamic Code Execution",
    impact: "Remote Code Execution vulnerability.",
    languages: ["all"]
  },
  {
    id: "PATH_TRAVERSAL",
    regex: /\.\.\/|\.\.\\/,
    severity: "high",
    cwe: "CWE-22",
    issue: "Path Traversal Risk",
    impact: "Unauthorized file access outside intended directories.",
    languages: ["all"]
  },
  {
    id: "INSECURE_RANDOM",
    regex: /Math\.random\(/,
    severity: "medium",
    cwe: "CWE-338",
    issue: "Insecure Random Generator",
    impact: "Predictable values in security-sensitive contexts.",
    languages: ["javascript"]
  }
];

const maskSecrets = (line) => {
  return line.replace(/(['"`])[a-zA-Z0-9\-_]{12,}\1/g, '"[MASKED_SECRET]"');
};

const getRecommendation = (id) => {
  const fixes = {
    CMD_INJECTION: "Sanitize inputs and avoid direct system command execution.",
    SQL_INJECTION: "Use parameterized queries or ORM.",
    HARDCODED_SECRET: "Move secrets to environment variables or secure vault.",
    INSECURE_CRYPTO: "Use secure algorithms like SHA-256 or bcrypt.",
    XSS_DOM: "Sanitize input or use safe rendering methods.",
    CODE_EXECUTION: "Avoid eval; use safe parsing methods.",
    PATH_TRAVERSAL: "Validate and normalize file paths.",
    INSECURE_RANDOM: "Use crypto-secure random generators."
  };

  return fixes[id] || "Follow secure coding best practices.";
};

const isSourceNode = (node) => {
  if (!node) return false;

  if (node.type === "MemberExpression") {
    const objectName = node.object?.name || node.object?.property?.name;
    const propertyName = node.property?.name;
    const isReq = objectName === "req" || objectName === "request";
    const isSourceProp = ["body", "params", "query", "headers", "cookies"].includes(propertyName);
    return isReq && isSourceProp;
  }

  return false;
};

const isTainted = (node, tainted) => {
  if (!node) return false;
  if (node.type === "Identifier") return tainted.has(node.name);
  if (isSourceNode(node)) return true;
  if (node.type === "MemberExpression") return isTainted(node.object, tainted);
  if (node.type === "CallExpression") {
    return node.arguments.some((arg) => isTainted(arg, tainted));
  }
  return false;
};

const getCalleeName = (callee) => {
  if (!callee) return "";
  if (callee.type === "Identifier") return callee.name;
  if (callee.type === "MemberExpression") return callee.property?.name || "";
  return "";
};

const getLine = (node) => node?.loc?.start?.line;

const runRegexFallback = (code, language, filePath) => {
  const findings = [];
  const lines = code.split("\n");

  const isComment = (line) => {
    const t = line.trim();
    return t.startsWith("//") || t.startsWith("#") || t.startsWith("/*") || t.startsWith("*");
  };

  lines.forEach((line, index) => {
    if (isComment(line)) return;

    PATTERNS.forEach((pattern) => {
      if (pattern.languages.includes("all") || pattern.languages.includes(language)) {
        if (pattern.regex.test(line)) {
          let evidence = line.trim();

          if (pattern.id === "HARDCODED_SECRET") {
            evidence = maskSecrets(evidence);
          }

          findings.push({
            id: `${pattern.id}_${index + 1}`,
            category: "security",
            severity: pattern.severity,
            confidence: "medium",
            file: filePath,
            line: index + 1,
            language,
            issue: pattern.issue,
            cwe: pattern.cwe,
            impact: pattern.impact,
            recommendation: getRecommendation(pattern.id),
            evidence
          });
        }
      }
    });
  });

  return findings;
};

export const securityScanner = async (code, filePath) => {
  const findings = [];

  if (!code || typeof code !== "string") return findings;

  const language = detectLanguage(filePath);
  const ast = parseAst(code, language);

  if (!ast) {
    return runRegexFallback(code, language, filePath);
  }

  const tainted = new Set();

  traverse(ast, {
    VariableDeclarator(path) {
      const id = path.node.id;
      const init = path.node.init;

      if (id?.type === "Identifier" && (isSourceNode(init) || isTainted(init, tainted))) {
        tainted.add(id.name);
      }

      if (id?.type === "Identifier" && init?.type === "StringLiteral") {
        if (/key|secret|token|password/i.test(id.name) && init.value.length >= 12) {
          findings.push({
            id: `HARDCODED_SECRET_${getLine(path.node) || 0}`,
            category: "security",
            severity: "critical",
            confidence: "high",
            file: filePath,
            line: getLine(path.node),
            language,
            issue: "Hardcoded Credential Detected",
            cwe: "CWE-798",
            impact: "Sensitive credentials exposed in source code.",
            recommendation: getRecommendation("HARDCODED_SECRET"),
            evidence: '"[MASKED_SECRET]"'
          });
        }
      }
    },
    AssignmentExpression(path) {
      const left = path.node.left;
      const right = path.node.right;

      if (left?.type === "Identifier" && (isSourceNode(right) || isTainted(right, tainted))) {
        tainted.add(left.name);
      }

      if (left?.type === "MemberExpression") {
        const property = left.property?.name;
        if (property === "innerHTML" && (isSourceNode(right) || isTainted(right, tainted))) {
          findings.push({
            id: `XSS_DOM_${getLine(path.node) || 0}`,
            category: "security",
            severity: "high",
            confidence: "high",
            file: filePath,
            line: getLine(path.node),
            language,
            issue: "DOM-based XSS Risk",
            cwe: "CWE-79",
            impact: "Execution of malicious scripts in client environment.",
            recommendation: getRecommendation("XSS_DOM"),
            evidence: "innerHTML = [tainted]"
          });
        }
      }
    },
    CallExpression(path) {
      const calleeName = getCalleeName(path.node.callee);
      const args = path.node.arguments || [];
      const taintedArgs = args.some((arg) => isSourceNode(arg) || isTainted(arg, tainted));

      if (["eval", "Function"].includes(calleeName) && taintedArgs) {
        findings.push({
          id: `CODE_EXECUTION_${getLine(path.node) || 0}`,
          category: "security",
          severity: "critical",
          confidence: "high",
          file: filePath,
          line: getLine(path.node),
          language,
          issue: "Dynamic Code Execution",
          cwe: "CWE-95",
          impact: "Remote Code Execution vulnerability.",
          recommendation: getRecommendation("CODE_EXECUTION"),
          evidence: calleeName
        });
      }

      if (["exec", "execSync", "spawn", "system"].includes(calleeName) && taintedArgs) {
        findings.push({
          id: `CMD_INJECTION_${getLine(path.node) || 0}`,
          category: "security",
          severity: "critical",
          confidence: "high",
          file: filePath,
          line: getLine(path.node),
          language,
          issue: "OS Command Injection Risk",
          cwe: "CWE-78",
          impact: "Execution of arbitrary system commands.",
          recommendation: getRecommendation("CMD_INJECTION"),
          evidence: calleeName
        });
      }
    }
  });

  if (findings.length === 0) {
    return runRegexFallback(code, language, filePath);
  }

  return findings;
};

export const securityScan = securityScanner;