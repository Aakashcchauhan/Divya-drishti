import { parse } from "@babel/parser";
import babelTraverse from "@babel/traverse";
const traverse = babelTraverse.default || babelTraverse;

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

const getContext = (code, filePath) => {
  const lowerPath = filePath.toLowerCase();
  const serverRegex = /\b(app|router)\.(get|post|put|delete|patch)\s*\(|\b(req\s*,\s*res|res\.)|\bexpress\s*\(/i;
  const scriptRegex = /(scripts?[\\/]|tools?[\\/]|bin[\\/]|cli)/i;

  const apiCallCount = (code.match(/\bfetch\s*\(|\baxios\s*\(|\baxios\.(get|post|put|delete|patch)\s*\(/g) || []).length;

  return {
    isServerContext: serverRegex.test(code),
    isScriptContext: scriptRegex.test(lowerPath),
    hasTimerCleanup: /\bclearInterval\s*\(|\bclearTimeout\s*\(/.test(code),
    hasMemoization: /\buseMemo\s*\(|\buseCallback\s*\(/.test(code),
    hasCacheLayer: /\bcache\b|\bredis\b|\blru\b|\bmemoize\b|\bqueryClient\b|\bswr\b/i.test(code),
    isReactFile: /\buseEffect\s*\(|\buseMemo\s*\(|\buseCallback\s*\(|\bReact\./.test(code),
    hasLargePayloadRisk: code.length > 10000,
    apiCallCount
  };
};

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

const getSeverity = (id, context) => {
  if (id === "SYNC_IO") {
    if (context.isServerContext) return "high";
    if (context.isScriptContext) return "low";
    return "medium";
  }

  if (id === "MEMORY_LEAK_TIMER") return "medium";
  if (id === "UNMANAGED_TIMER") return "low";
  if (id === "N_PLUS_ONE_QUERY") return "high";
  if (id === "HIGH_TIME_COMPLEXITY") return "high";
  if (id === "EVENT_LOOP_BLOCKING") return "medium";
  if (id === "RENDER_THRASH") return "medium";
  if (id === "API_CALL_BURST") return "medium";
  if (id === "MISSING_MEMO") return "medium";
  if (id === "CACHE_OPPORTUNITY") return "medium";
  return null;
};

const getConfidence = (id) => {
  if (["INFINITE_LOOP", "SYNC_IO", "N_PLUS_ONE_QUERY", "HIGH_TIME_COMPLEXITY"].includes(id)) {
    return "high";
  }

  if (["EVENT_LOOP_BLOCKING", "API_CALL_BURST", "RENDER_THRASH"].includes(id)) {
    return "medium";
  }

  if (["MISSING_MEMO", "CACHE_OPPORTUNITY", "REPEATED_COMPUTATION"].includes(id)) {
    return "medium";
  }

  return "low";
};

const getImpactProfile = (id) => {
  const profiles = {
    INFINITE_LOOP: {
      cpu: "high",
      memory: "medium",
      latency: "high",
      io: "low"
    },
    SYNC_IO: {
      cpu: "low",
      memory: "low",
      latency: "high",
      io: "high"
    },
    UNMANAGED_TIMER: {
      cpu: "medium",
      memory: "low",
      latency: "medium",
      io: "low"
    },
    MEMORY_LEAK_TIMER: {
      cpu: "medium",
      memory: "high",
      latency: "medium",
      io: "low"
    },
    N_PLUS_ONE_QUERY: {
      cpu: "medium",
      memory: "low",
      latency: "high",
      io: "high"
    },
    EXPENSIVE_CHAIN: {
      cpu: "medium",
      memory: "medium",
      latency: "medium",
      io: "low"
    },
    REPEATED_COMPUTATION: {
      cpu: "medium",
      memory: "low",
      latency: "medium",
      io: "low"
    },
    HIGH_TIME_COMPLEXITY: {
      cpu: "high",
      memory: "medium",
      latency: "high",
      io: "low"
    },
    EVENT_LOOP_BLOCKING: {
      cpu: "high",
      memory: "medium",
      latency: "high",
      io: "low"
    },
    RENDER_THRASH: {
      cpu: "medium",
      memory: "low",
      latency: "medium",
      io: "low"
    },
    API_CALL_BURST: {
      cpu: "low",
      memory: "low",
      latency: "high",
      io: "high"
    },
    MISSING_MEMO: {
      cpu: "medium",
      memory: "low",
      latency: "medium",
      io: "low"
    },
    CACHE_OPPORTUNITY: {
      cpu: "low",
      memory: "medium",
      latency: "high",
      io: "high"
    }
  };

  return profiles[id] || {
    cpu: "medium",
    memory: "medium",
    latency: "medium",
    io: "medium"
  };
};

const getImpactScore = (id) => {
  const scores = {
    INFINITE_LOOP: { cpu: 9, memory: 6, io: 2 },
    SYNC_IO: { cpu: 3, memory: 2, io: 8 },
    UNMANAGED_TIMER: { cpu: 5, memory: 4, io: 2 },
    MEMORY_LEAK_TIMER: { cpu: 5, memory: 8, io: 1 },
    N_PLUS_ONE_QUERY: { cpu: 6, memory: 3, io: 9 },
    EXPENSIVE_CHAIN: { cpu: 6, memory: 6, io: 1 },
    REPEATED_COMPUTATION: { cpu: 6, memory: 3, io: 1 },
    HIGH_TIME_COMPLEXITY: { cpu: 8, memory: 5, io: 2 },
    EVENT_LOOP_BLOCKING: { cpu: 7, memory: 5, io: 3 },
    RENDER_THRASH: { cpu: 6, memory: 3, io: 1 },
    API_CALL_BURST: { cpu: 3, memory: 2, io: 8 },
    MISSING_MEMO: { cpu: 5, memory: 2, io: 1 },
    CACHE_OPPORTUNITY: { cpu: 3, memory: 5, io: 8 }
  };

  return scores[id] || { cpu: 5, memory: 5, io: 5 };
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
    SYNC_IO: "Replace with asynchronous or non-blocking operations on hot server paths.",
    UNMANAGED_TIMER: "Clear timers when not needed using clearInterval/clearTimeout.",
    MEMORY_LEAK_TIMER: "Always keep interval handle and clear it during teardown.",
    N_PLUS_ONE_QUERY: "Batch database calls or use optimized queries.",
    EXPENSIVE_CHAIN: "Combine operations using a single reduce pass.",
    REPEATED_COMPUTATION: "Move heavy computations outside loops or cache results.",
    HIGH_TIME_COMPLEXITY: "Reduce nested loops by indexing data with Map/Set or precomputed lookups.",
    EVENT_LOOP_BLOCKING: "Move large JSON parsing to background worker or chunk processing.",
    RENDER_THRASH: "Provide stable dependency array and memoize expensive values.",
    API_CALL_BURST: "Batch API calls or use a bulk endpoint to reduce network overhead.",
    MISSING_MEMO: "Memoize derived computations with useMemo/useCallback when dependencies are stable.",
    CACHE_OPPORTUNITY: "Add request-level caching (HTTP cache, memoization, or Redis) for repeated external calls."
  };

  return map[id] || "Optimize logic to reduce computational overhead.";
};

const getLine = (node) => node?.loc?.start?.line;

const getCalleeName = (callee) => {
  if (!callee) return "";
  if (callee.type === "Identifier") return callee.name;
  if (callee.type === "MemberExpression") return callee.property?.name || "";
  return "";
};

const shouldFlagSyncIo = (calleeName, context) => {
  if (calleeName === "execSync") return true;
  if (!context.isServerContext) return false;
  return ["readFileSync", "writeFileSync"].includes(calleeName);
};

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

const runRegexFallback = (code, language, filePath, context) => {
  const findings = [];
  const seen = new Set();
  const lines = code.split("\n");

  const pushFinding = (pattern, line, lineNumber, overrides = {}) => {
    const evidence = (overrides.evidence || line || "").trim();
    const key = `${pattern.id}-${evidence}`;
    if (seen.has(key)) return;
    seen.add(key);

    const severity = overrides.severity || getSeverity(pattern.id, context) || pattern.severity;
    const confidence = overrides.confidence || getConfidence(pattern.id);
    const impactProfile = overrides.impact || getImpactProfile(pattern.id);

    findings.push({
      type: "performance_finding",
      id: `${pattern.id}_${lineNumber}`,
      category: overrides.category || "performance",
      severity,
      confidence,
      impact: impactProfile,
      impactScore: getImpactScore(pattern.id),
      location: {
        file: filePath,
        line: lineNumber
      },
      file: filePath,
      line: lineNumber,
      language,
      issue: overrides.issue || pattern.issue,
      reasoning: overrides.reasoning || pattern.impact,
      evidence,
      fix: overrides.fix || getRecommendation(pattern.id),
      recommendation: overrides.fix || getRecommendation(pattern.id)
    });
  };

  const isComment = (line) => {
    const t = line.trim();
    return t.startsWith("//") || t.startsWith("#") || t.startsWith("/*") || t.startsWith("*");
  };

  lines.forEach((line, index) => {
    if (isComment(line)) return;

    PATTERNS.forEach((pattern) => {
      if (pattern.languages.includes("all") || pattern.languages.includes(language)) {
        if (pattern.id === "UNMANAGED_TIMER") {
          const hasTimer = /setInterval\s*\(|setTimeout\s*\(/.test(line);
          if (!hasTimer || context.hasTimerCleanup) return;
          if (/setTimeout\s*\(/.test(line) && !/while|for/.test(line)) return;
        }

        if (pattern.id === "SYNC_IO") {
          const syncNameMatch = line.match(/readFileSync|writeFileSync|execSync/);
          const syncName = syncNameMatch ? syncNameMatch[0] : "";
          if (!syncName || !shouldFlagSyncIo(syncName, context)) return;
        }

        if (pattern.regex.test(line)) {
          pushFinding(pattern, line, index + 1, {
            category: pattern.id === "N_PLUS_ONE_QUERY" ? "database" : "performance",
            reasoning: pattern.impact
          });

          if (pattern.id === "UNMANAGED_TIMER" && /setInterval\s*\(/.test(line) && !context.hasTimerCleanup) {
            pushFinding(
              {
                id: "MEMORY_LEAK_TIMER",
                issue: "Possible memory leak from interval lifecycle",
                impact: "Interval appears without corresponding cleanup.",
                severity: "medium"
              },
              line,
              index + 1,
              {
                confidence: "low",
                category: "memory",
                issue: "Possible memory leak",
                reasoning: "setInterval detected but clearInterval/clearTimeout was not found in file.",
                fix: getRecommendation("MEMORY_LEAK_TIMER")
              }
            );
          }
        }
      }
    });
  });

  if (context.apiCallCount > 3) {
    const firstApiLine = lines.findIndex((line) => /\bfetch\s*\(|\baxios\s*\(|\baxios\.(get|post|put|delete|patch)\s*\(/.test(line));
    const lineNumber = firstApiLine >= 0 ? firstApiLine + 1 : 1;
    pushFinding(
      {
        id: "API_CALL_BURST",
        issue: "Multiple API calls detected",
        impact: "Repeated outbound calls can increase latency and backend load.",
        severity: "medium"
      },
      lines[lineNumber - 1] || "",
      lineNumber,
      {
        category: "io",
        reasoning: `Detected ${context.apiCallCount} API call sites in one file.`,
        fix: getRecommendation("API_CALL_BURST")
      }
    );
  }

  return findings;
};

export const performanceScanner = async (code, filePath) => {
  const findings = [];
  const seen = new Set();

  if (!code || typeof code !== "string") return findings;

  const language = detectLanguage(filePath);
  const context = getContext(code, filePath);
  const ast = parseAst(code, language);

  const pushFinding = (id, line, issue, evidence, options = {}) => {
    const normalizedEvidence = (evidence || "").trim() || issue;
    const key = `${id}-${line}-${normalizedEvidence}`;
    if (seen.has(key)) return;
    seen.add(key);

    const severity = options.severity || getSeverity(id, context) || "medium";
    const confidence = options.confidence || getConfidence(id);

    findings.push({
      type: "performance_finding",
      id: `${id}_${line || 0}`,
      category: options.category || "performance",
      severity,
      confidence,
      impact: options.impact || getImpactProfile(id),
      impactScore: options.impactScore || getImpactScore(id),
      location: {
        file: filePath,
        line: line || 0
      },
      file: filePath,
      line: line || 0,
      language,
      issue,
      reasoning: options.reasoning || "Detected by static performance analysis.",
      evidence: normalizedEvidence,
      fix: options.fix || getRecommendation(id),
      recommendation: options.fix || getRecommendation(id)
    });
  };

  if (!ast) {
    return runRegexFallback(code, language, filePath, context);
  }

  traverse(ast, {
    WhileStatement(path) {
      if (path.node.test?.type === "BooleanLiteral" && path.node.test.value === true) {
        pushFinding(
          "INFINITE_LOOP",
          getLine(path.node),
          "Infinite loop detected",
          "while (true)",
          {
            severity: "critical",
            confidence: "high",
            category: "cpu",
            reasoning: "Loop condition is a constant true and no termination check is visible."
          }
        );
      }
    },
    ForStatement(path) {
      if (!path.node.test) {
        pushFinding("INFINITE_LOOP", getLine(path.node), "Infinite loop detected", "for (;;)", {
          severity: "critical",
          confidence: "high",
          category: "cpu",
          reasoning: "For-loop has no test condition and can run indefinitely."
        });
      }

      if (hasAwaitedDbCall(path)) {
        pushFinding(
          "N_PLUS_ONE_QUERY",
          getLine(path.node),
          "Possible N+1 query pattern",
          "await db.* inside loop",
          {
            category: "database",
            reasoning: "Database-like awaited call found inside loop body.",
            confidence: "medium"
          }
        );
      }

      let nestedLoops = 0;
      path.traverse({
        ForStatement() {
          nestedLoops += 1;
        },
        WhileStatement() {
          nestedLoops += 1;
        },
        DoWhileStatement() {
          nestedLoops += 1;
        }
      });

      if (nestedLoops >= 2) {
        pushFinding(
          "HIGH_TIME_COMPLEXITY",
          getLine(path.node),
          "High time complexity pattern detected",
          "Nested loop structure suggests O(n^2) or worse",
          {
            category: "cpu",
            confidence: "high",
            reasoning: "Loop traversal contains nested loop constructs.",
            fix: getRecommendation("HIGH_TIME_COMPLEXITY")
          }
        );
      }
    },
    CallExpression(path) {
      const callee = path.node.callee;
      const calleeName = getCalleeName(callee);
      const insideLoop = Boolean(
        path.findParent((p) => p.isForStatement() || p.isWhileStatement() || p.isDoWhileStatement())
      );

      if (["readFileSync", "writeFileSync", "execSync"].includes(calleeName) && shouldFlagSyncIo(calleeName, context)) {
        pushFinding("SYNC_IO", getLine(path.node), "Synchronous or blocking I/O operation", calleeName, {
          category: "io",
          reasoning: context.isServerContext
            ? "Blocking call appears in server context and can degrade request throughput."
            : "Synchronous subprocess call can block the event loop."
        });
      }

      if (["setInterval", "setTimeout"].includes(calleeName)) {
        if (calleeName === "setInterval" && !context.hasTimerCleanup) {
          pushFinding("MEMORY_LEAK_TIMER", getLine(path.node), "Possible memory leak", "setInterval without cleanup", {
            category: "memory",
            confidence: "low",
            reasoning: "Interval registration found but clearInterval/clearTimeout was not detected."
          });
        } else if (calleeName === "setTimeout" && !context.hasTimerCleanup && context.isServerContext) {
          pushFinding("UNMANAGED_TIMER", getLine(path.node), "Unmanaged timer detected", "setTimeout without visible cleanup", {
            category: "runtime",
            confidence: "low",
            reasoning: "Server-side timer exists without explicit cleanup hints in file."
          });
        }
      }

      if (
        callee.type === "MemberExpression" &&
        callee.object?.name === "JSON" &&
        callee.property?.name === "parse" &&
        context.hasLargePayloadRisk
      ) {
        pushFinding(
          "EVENT_LOOP_BLOCKING",
          getLine(path.node),
          "Heavy JSON parsing may block event loop",
          "JSON.parse on potentially large input",
          {
            category: "event_loop",
            confidence: "medium",
            reasoning: "File size is large and synchronous JSON parsing appears in code path."
          }
        );
      }

      // Expensive calls inside loops are a strong repeated-computation signal.
      if (
        insideLoop &&
        callee.type === "MemberExpression" &&
        ["Math", "JSON", "Date"].includes(callee.object?.name || "")
      ) {
        pushFinding(
          "REPEATED_COMPUTATION",
          getLine(path.node),
          "Expensive computation inside loop",
          `${callee.object?.name}.${callee.property?.name || "call"} in loop`,
          {
            category: "cpu",
            confidence: "medium",
            reasoning: "Repeated heavy utility call detected within an iterative loop body."
          }
        );
      }

      if (calleeName === "useEffect" && context.isReactFile) {
        const args = path.node.arguments || [];
        const dependencyArg = args[1];

        if (!dependencyArg) {
          pushFinding(
            "RENDER_THRASH",
            getLine(path.node),
            "Frequent re-render risk due to missing dependency array",
            "useEffect(...) without dependency array",
            {
              category: "ui",
              reasoning: "useEffect without dependency array runs on every render cycle.",
              confidence: "medium"
            }
          );
        }
      }
    }
  });

  if (context.apiCallCount > 3) {
    const lines = code.split("\n");
    const firstApiLine = lines.findIndex((line) => /\bfetch\s*\(|\baxios\s*\(|\baxios\.(get|post|put|delete|patch)\s*\(/.test(line));
    const targetLine = firstApiLine >= 0 ? firstApiLine + 1 : 1;
    pushFinding(
      "API_CALL_BURST",
      targetLine,
      "Multiple API calls detected",
      `Detected ${context.apiCallCount} API call sites in this file`,
      {
        category: "io",
        reasoning: "High count of outbound API invocations suggests batching opportunity.",
        confidence: "medium"
      }
    );
  }

  if (context.isReactFile && /\bconst\s+\w+\s*=/.test(code) && /\buseEffect\s*\(/.test(code) && !context.hasMemoization) {
    const lines = code.split("\n");
    const constLine = lines.findIndex((line) => /\bconst\s+\w+\s*=/.test(line));
    const memoLine = constLine >= 0 ? constLine + 1 : 1;
    pushFinding(
      "MISSING_MEMO",
      memoLine,
      "Potential missing memoization for derived values",
      lines[memoLine - 1] || "const derived = ...",
      {
        category: "ui",
        confidence: "medium",
        reasoning: "React effect and local derived assignments detected without useMemo/useCallback guards."
      }
    );
  }

  if (context.apiCallCount > 1 && !context.hasCacheLayer) {
    const lines = code.split("\n");
    const firstApiLine = lines.findIndex((line) => /\bfetch\s*\(|\baxios\s*\(|\baxios\.(get|post|put|delete|patch)\s*\(/.test(line));
    const cacheLine = firstApiLine >= 0 ? firstApiLine + 1 : 1;
    pushFinding(
      "CACHE_OPPORTUNITY",
      cacheLine,
      "Cache opportunity for repeated external calls",
      lines[cacheLine - 1] || "fetch(...)",
      {
        category: "io",
        confidence: "medium",
        reasoning: "Multiple outbound calls were detected without visible cache/memoization layer."
      }
    );
  }

  if (findings.length === 0) {
    return runRegexFallback(code, language, filePath, context);
  }

  return findings;
};

export const performanceScan = performanceScanner;