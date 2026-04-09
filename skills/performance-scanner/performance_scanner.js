import { parse } from "@babel/parser";
import traverse from "@babel/traverse";

const detectLanguage = (filePath) => {
  const ext = filePath.split(".").pop()?.toLowerCase();

  const map = {
    js: "javascript",
    jsx: "javascript",
    ts: "typescript",
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
    id: "INFINITE_LOOP",
    regex: /while\s*\(\s*true\s*\)|for\s*\(\s*;\s*;\s*\)/,
    severity: "critical",
    issue: "Infinite loop detected",
    impact: "CPU exhaustion and application freeze.",
    languages: ["all"]
  },
  {
    id: "SYNC_IO",
    regex: /readFileSync|writeFileSync|execSync|fs\.read|open\(/i,
    severity: "high",
    issue: "Synchronous or blocking I/O operation",
    impact: "Blocks execution thread and reduces throughput.",
    languages: ["javascript", "python", "java"]
  },
  {
    id: "UNMANAGED_TIMER",
    regex: /setInterval\(|setTimeout\(/,
    severity: "medium",
    issue: "Unmanaged timer detected",
    impact: "Potential memory leaks and repeated unnecessary execution.",
    languages: ["javascript"]
  },
  {
    id: "N_PLUS_ONE_QUERY",
    regex: /(for|while).*(await|db\.|query)/,
    severity: "high",
    issue: "Possible N+1 query pattern",
    impact: "Multiple database calls inside loop causing severe slowdown.",
    languages: ["javascript", "python", "java"]
  },
  {
    id: "EXPENSIVE_CHAIN",
    regex: /\.map\(.*\)\.filter\(.*\)|\.filter\(.*\)\.map\(.*\)/,
    severity: "medium",
    issue: "Chained array transformations",
    impact: "Creates intermediate arrays increasing memory usage.",
    languages: ["javascript", "typescript"]
  },
  {
    id: "REPEATED_COMPUTATION",
    regex: /(for|while).*\{[\s\S]*Math\.|JSON\.parse|new Date\(/,
    severity: "medium",
    issue: "Expensive computation inside loop",
    impact: "Repeated calculations degrade performance.",
    languages: ["all"]
  }
];

const getRecommendation = (id) => {
  const map = {
    INFINITE_LOOP: "Ensure loop has a proper exit condition.",
    SYNC_IO: "Replace with asynchronous or non-blocking operations.",
    UNMANAGED_TIMER: "Clear timers when not needed using clearInterval/clearTimeout.",
    N_PLUS_ONE_QUERY: "Batch database calls or use optimized queries.",
    EXPENSIVE_CHAIN: "Combine operations using a single reduce pass.",
    REPEATED_COMPUTATION: "Move heavy computations outside loops or cache results."
  };

  return map[id] || "Optimize logic to reduce computational overhead.";
};

const getLine = (node) => node?.loc?.start?.line;

const hasAwaitedDbCall = (path) => {
  let found = false;

  path.traverse({
    AwaitExpression(innerPath) {
      const call = innerPath.node.argument;
      if (call?.type === "CallExpression") {
        const callee = call.callee;
        const calleeName = callee?.property?.name || callee?.name || "";
        if (/query|find|select|db/i.test(calleeName)) {
          found = true;
          innerPath.stop();
        }
      }
    }
  });

  return found;
};

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
          findings.push({
            id: `${pattern.id}_${index + 1}`,
            category: "performance",
            severity: pattern.severity,
            confidence: "medium",
            file: filePath,
            line: index + 1,
            language,
            issue: pattern.issue,
            impact: pattern.impact,
            recommendation: getRecommendation(pattern.id),
            evidence: line.trim()
          });
        }
      }
    });
  });

  return findings;
};

export const performanceScanner = async (code, filePath) => {
  const findings = [];

  if (!code || typeof code !== "string") return findings;

  const language = detectLanguage(filePath);
  const ast = parseAst(code, language);

  if (!ast) {
    return runRegexFallback(code, language, filePath);
  }

  traverse(ast, {
    WhileStatement(path) {
      if (path.node.test?.type === "BooleanLiteral" && path.node.test.value === true) {
        findings.push({
          id: `INFINITE_LOOP_${getLine(path.node) || 0}`,
          category: "performance",
          severity: "critical",
          confidence: "high",
          file: filePath,
          line: getLine(path.node),
          language,
          issue: "Infinite loop detected",
          impact: "CPU exhaustion and application freeze.",
          recommendation: getRecommendation("INFINITE_LOOP"),
          evidence: "while (true)"
        });
      }
    },
    ForStatement(path) {
      if (!path.node.test) {
        findings.push({
          id: `INFINITE_LOOP_${getLine(path.node) || 0}`,
          category: "performance",
          severity: "critical",
          confidence: "high",
          file: filePath,
          line: getLine(path.node),
          language,
          issue: "Infinite loop detected",
          impact: "CPU exhaustion and application freeze.",
          recommendation: getRecommendation("INFINITE_LOOP"),
          evidence: "for (;;)"
        });
      }

      if (hasAwaitedDbCall(path)) {
        findings.push({
          id: `N_PLUS_ONE_QUERY_${getLine(path.node) || 0}`,
          category: "performance",
          severity: "high",
          confidence: "medium",
          file: filePath,
          line: getLine(path.node),
          language,
          issue: "Possible N+1 query pattern",
          impact: "Multiple database calls inside loop causing severe slowdown.",
          recommendation: getRecommendation("N_PLUS_ONE_QUERY"),
          evidence: "await db.* inside loop"
        });
      }
    },
    CallExpression(path) {
      const callee = path.node.callee;
      const calleeName = callee?.property?.name || callee?.name || "";

      if (["readFileSync", "writeFileSync", "execSync"].includes(calleeName)) {
        findings.push({
          id: `SYNC_IO_${getLine(path.node) || 0}`,
          category: "performance",
          severity: "high",
          confidence: "high",
          file: filePath,
          line: getLine(path.node),
          language,
          issue: "Synchronous or blocking I/O operation",
          impact: "Blocks execution thread and reduces throughput.",
          recommendation: getRecommendation("SYNC_IO"),
          evidence: calleeName
        });
      }

      if (["setInterval", "setTimeout"].includes(calleeName)) {
        findings.push({
          id: `UNMANAGED_TIMER_${getLine(path.node) || 0}`,
          category: "performance",
          severity: "medium",
          confidence: "medium",
          file: filePath,
          line: getLine(path.node),
          language,
          issue: "Unmanaged timer detected",
          impact: "Potential memory leaks and repeated unnecessary execution.",
          recommendation: getRecommendation("UNMANAGED_TIMER"),
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

export const performanceScan = performanceScanner;