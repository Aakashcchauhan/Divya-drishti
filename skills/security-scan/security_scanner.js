import { parse } from "@babel/parser";
import babelTraverse from "@babel/traverse";
const traverse = babelTraverse.default || babelTraverse;

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

const PATH_SINK_REGEX = /(readFile|readFileSync|writeFile|writeFileSync|open|createReadStream|createWriteStream|sendFile|download|unlink|readdir|stat|lstat|access|path\.join|path\.resolve|path\.normalize)/i;
const PATH_SOURCE_REGEX = /(req\.(params|query|body|headers|cookies)|request\.(params|query|body|headers|cookies)|process\.argv|argv\[|input\(|userInput|userPath|filePath|filename)/i;
const TRAVERSAL_LITERAL_REGEX = /(\.\.\/|\.\.\\)/;

const isLikelyPathTraversalLine = (line) => {
  if (!PATH_SINK_REGEX.test(line)) return false;

  const hasTraversalLiteral = TRAVERSAL_LITERAL_REGEX.test(line);
  const hasDynamicConstruction = /\+|`[^`]*\$\{/.test(line);
  const hasUntrustedSource = PATH_SOURCE_REGEX.test(line);

  return hasUntrustedSource || (hasTraversalLiteral && hasDynamicConstruction);
};

const hasTraversalLiteral = (node) => {
  if (!node) return false;

  if (node.type === "StringLiteral") {
    return TRAVERSAL_LITERAL_REGEX.test(node.value);
  }

  if (node.type === "TemplateLiteral") {
    return node.quasis.some((q) => TRAVERSAL_LITERAL_REGEX.test(q.value.raw));
  }

  if (node.type === "BinaryExpression" && node.operator === "+") {
    return hasTraversalLiteral(node.left) || hasTraversalLiteral(node.right);
  }

  if (node.type === "CallExpression") {
    return (node.arguments || []).some((arg) => hasTraversalLiteral(arg));
  }

  if (node.type === "ArrayExpression") {
    return (node.elements || []).some((el) => hasTraversalLiteral(el));
  }

  return false;
};

const isSanitizedPathNode = (node) => {
  if (!node || node.type !== "CallExpression") return false;

  const callee = node.callee;
  const calleeName = callee?.property?.name || callee?.name || "";
  return /normalize|resolve|basename|sanitize/i.test(calleeName);
};

const getCalleeObjectName = (callee) => {
  if (!callee || callee.type !== "MemberExpression") return "";

  if (callee.object?.type === "Identifier") {
    return callee.object.name;
  }

  if (callee.object?.type === "MemberExpression") {
    return callee.object.property?.name || "";
  }

  return "";
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

const isTainted = (node, tainted, depth = 0) => {
  if (depth > 3) return false;
  if (!node) return false;
  if (node.type === "Identifier") return tainted.has(node.name);
  if (isSourceNode(node)) return true;
  if (node.type === "MemberExpression") return isTainted(node.object, tainted, depth + 1);
  if (node.type === "CallExpression") {
    return node.arguments.some((arg) => isTainted(arg, tainted, depth + 1));
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

const hasHighEntropy = (value) => {
  if (!value || value.length < 20) return false;

  const hasUpper = /[A-Z]/.test(value);
  const hasLower = /[a-z]/.test(value);
  const hasDigit = /\d/.test(value);
  const hasSymbol = /[^A-Za-z0-9]/.test(value);

  return [hasUpper, hasLower, hasDigit, hasSymbol].filter(Boolean).length >= 3;
};

const getSeverity = (id, context = {}) => {
  if (id === "CMD_INJECTION") return "critical";
  if (id === "CODE_EXECUTION") return "critical";
  if (id === "SQL_INJECTION") return context.isDbContext ? "high" : "medium";
  if (id === "MISSING_AUTH_CHECK") return "high";
  if (id === "JWT_WEAK_SECRET") return "high";
  if (id === "NO_RATE_LIMIT") return "medium";
  if (id === "MISSING_SECURITY_HEADERS") return "low";
  return null;
};

const isLikelyUserControlledLine = (line) => {
  return /(req\.(body|params|query|headers|cookies)|request\.(body|params|query|headers|cookies)|userInput|input\(|argv\[|process\.env)/i.test(line);
};

const runRegexFallback = (code, language, filePath) => {
  const findings = [];
  const seen = new Set();
  const context = {
    isDbContext: /\b(query|select|insert|update|delete|sequelize|typeorm|prisma|knex)\b/i.test(code)
  };
  const lines = code.split("\n");

  const pushFinding = (pattern, lineNumber, evidence, overrides = {}) => {
    const issue = overrides.issue || pattern.issue;
    const dedupeKey = `${filePath}-${lineNumber}-${issue}`;
    if (seen.has(dedupeKey)) return;
    seen.add(dedupeKey);

    findings.push({
      type: "security_finding",
      id: overrides.id || `${pattern.id}_${lineNumber}`,
      category: "security",
      severity: overrides.severity || getSeverity(pattern.id, context) || pattern.severity,
      confidence: overrides.confidence || "medium",
      cwe: overrides.cwe || pattern.cwe,
      location: {
        file: filePath,
        line: lineNumber
      },
      file: filePath,
      line: lineNumber,
      language,
      issue,
      reasoning: overrides.reasoning || pattern.impact,
      exploit: overrides.exploit || [],
      impact: overrides.impact || pattern.impact,
      fix: overrides.fix || getRecommendation(pattern.id),
      recommendation: overrides.fix || getRecommendation(pattern.id),
      evidence
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
        if (pattern.id === "PATH_TRAVERSAL" && !isLikelyPathTraversalLine(line)) {
          return;
        }

        if (pattern.id === "CODE_EXECUTION" && !isLikelyUserControlledLine(line)) {
          return;
        }

        if (pattern.id === "HARDCODED_SECRET") {
          const match = line.match(/(['"`])([^'"`]{12,})\1/);
          if (!match || !hasHighEntropy(match[2])) {
            return;
          }
        }

        if (pattern.id === "SQL_INJECTION") {
          const hasTemplateInterpolation = /\b(query|execute)\s*\([^)]*`[^`]*\$\{[^}]+\}[^`]*`/.test(line);
          const hasConcatenatedQuery = pattern.regex.test(line);
          if (!hasTemplateInterpolation && !hasConcatenatedQuery) {
            return;
          }

          if (hasTemplateInterpolation && !hasConcatenatedQuery) {
            pushFinding(pattern, index + 1, line.trim(), {
              severity: getSeverity("SQL_INJECTION", context) || "high",
              confidence: "medium",
              reasoning: "Template literal query interpolation can introduce SQL injection risk."
            });
            return;
          }
        }

        if (pattern.regex.test(line)) {
          let evidence = line.trim();

          if (pattern.id === "HARDCODED_SECRET") {
            evidence = maskSecrets(evidence);
          }

          pushFinding(pattern, index + 1, evidence);
        }
      }
    });
  });

  if (/\bapp\.post\s*\(/.test(code) && !/\brateLimit\s*\(/i.test(code)) {
    pushFinding(
      {
        id: "NO_RATE_LIMIT",
        severity: "medium",
        cwe: "CWE-770",
        issue: "Missing rate limiting on API endpoint",
        impact: "Brute-force and abuse attacks become easier against exposed endpoints."
      },
      1,
      "app.post(...) without rateLimit(...)",
      {
        confidence: "low",
        reasoning: "POST route detected but no explicit rate limiter reference found.",
        fix: "Apply request rate limiting middleware to sensitive API routes."
      }
    );
  }

  return findings;
};

export const securityScanner = async (code, filePath) => {
  const findings = [];
  const seen = new Set();

  if (!code || typeof code !== "string") return findings;

  const language = detectLanguage(filePath);
  const ast = parseAst(code, language);

  const context = {
    isDbContext: /\b(query|select|insert|update|delete|sequelize|typeorm|prisma|knex)\b/i.test(code)
  };

  const pushFinding = (config) => {
    const issue = config.issue;
    const line = config.line || 0;
    const dedupeKey = `${filePath}-${line}-${issue}`;

    if (seen.has(dedupeKey)) return;
    seen.add(dedupeKey);

    findings.push({
      type: "security_finding",
      id: config.id,
      category: "security",
      severity: config.severity,
      confidence: config.confidence,
      cwe: config.cwe,
      location: {
        file: filePath,
        line
      },
      file: filePath,
      line,
      language,
      issue,
      reasoning: config.reasoning,
      exploit: config.exploit || [],
      impact: config.impact,
      fix: config.fix,
      recommendation: config.fix,
      evidence: config.evidence
    });
  };

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
        if (/key|secret|token|password/i.test(id.name) && hasHighEntropy(init.value)) {
          pushFinding({
            id: `HARDCODED_SECRET_${getLine(path.node) || 0}`,
            severity: "critical",
            confidence: "high",
            line: getLine(path.node),
            issue: "Hardcoded Credential Detected",
            cwe: "CWE-798",
            impact: "Sensitive credentials exposed in source code.",
            reasoning: "High-entropy credential-like literal assigned to sensitive variable name.",
            fix: getRecommendation("HARDCODED_SECRET"),
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
          pushFinding({
            id: `XSS_DOM_${getLine(path.node) || 0}`,
            severity: "high",
            confidence: "high",
            line: getLine(path.node),
            issue: "DOM-based XSS Risk",
            cwe: "CWE-79",
            impact: "Execution of malicious scripts in client environment.",
            reasoning: "Tainted input reaches innerHTML assignment without sanitization.",
            fix: getRecommendation("XSS_DOM"),
            evidence: "innerHTML = [tainted]"
          });
        }
      }
    },
    CallExpression(path) {
      const calleeName = getCalleeName(path.node.callee);
      const calleeObject = getCalleeObjectName(path.node.callee);
      const args = path.node.arguments || [];
      const taintedArgs = args.some((arg) => isSourceNode(arg) || isTainted(arg, tainted));
      const hasTraversalArg = args.some((arg) => hasTraversalLiteral(arg));
      const hasSanitizedArg = args.some((arg) => isSanitizedPathNode(arg));

      if (["eval", "Function"].includes(calleeName) && taintedArgs) {
        pushFinding({
          id: `CODE_EXECUTION_${getLine(path.node) || 0}`,
          severity: getSeverity("CODE_EXECUTION", context) || "critical",
          confidence: "high",
          line: getLine(path.node),
          issue: "Dynamic Code Execution",
          cwe: "CWE-95",
          impact: "Remote Code Execution vulnerability.",
          reasoning: "User-controlled data reaches dynamic execution sink.",
          fix: getRecommendation("CODE_EXECUTION"),
          evidence: calleeName,
          exploit: [
            "Attacker injects crafted payload into user-controlled input",
            "Payload reaches dynamic execution sink",
            "Server executes attacker-provided code"
          ]
        });
      }

      if (["exec", "execSync", "spawn", "system"].includes(calleeName) && taintedArgs) {
        pushFinding({
          id: `CMD_INJECTION_${getLine(path.node) || 0}`,
          severity: getSeverity("CMD_INJECTION", context) || "critical",
          confidence: "confirmed",
          line: getLine(path.node),
          issue: "OS Command Injection Risk",
          cwe: "CWE-78",
          impact: "Execution of arbitrary system commands.",
          reasoning: "User-controlled input is passed to command execution API.",
          fix: getRecommendation("CMD_INJECTION"),
          evidence: calleeName,
          exploit: [
            "Attacker supplies shell metacharacters in input",
            "Application forwards input to command execution sink",
            "Arbitrary command executes on host"
          ]
        });
      }

      if (/query|execute|raw/i.test(calleeName)) {
        const hasTemplateLiteral = args.some((arg) => arg.type === "TemplateLiteral");
        const hasStringConcat = args.some(
          (arg) => arg.type === "BinaryExpression" && arg.operator === "+"
        );
        if ((hasTemplateLiteral || hasStringConcat) && taintedArgs) {
          pushFinding({
            id: `SQL_INJECTION_${getLine(path.node) || 0}`,
            severity: getSeverity("SQL_INJECTION", context) || "high",
            confidence: "medium",
            line: getLine(path.node),
            issue: "Potential SQL Injection",
            cwe: "CWE-89",
            impact: "Database compromise due to unsafe query construction.",
            reasoning: "User-influenced data is interpolated into SQL execution call.",
            fix: getRecommendation("SQL_INJECTION"),
            evidence: "query/execute with interpolated input"
          });
        }
      }

      const isPathSink = [
        "readFile",
        "readFileSync",
        "writeFile",
        "writeFileSync",
        "open",
        "createReadStream",
        "createWriteStream",
        "sendFile",
        "download",
        "unlink",
        "readdir",
        "stat",
        "lstat",
        "access",
        "join",
        "resolve",
        "normalize"
      ].includes(calleeName);

      if (isPathSink && (calleeObject === "fs" || calleeObject === "path" || !calleeObject)) {
        if (!hasSanitizedArg && (taintedArgs || hasTraversalArg)) {
          pushFinding({
            id: `PATH_TRAVERSAL_${getLine(path.node) || 0}`,
            severity: "high",
            confidence: taintedArgs ? "high" : "medium",
            line: getLine(path.node),
            issue: "Path Traversal Risk",
            cwe: "CWE-22",
            impact: "Unauthorized file access outside intended directories.",
            reasoning: "Path sink receives unsanitized tainted or traversal-like path segment.",
            fix: getRecommendation("PATH_TRAVERSAL"),
            evidence: calleeName
          });
        }
      }

      if (calleeObject === "jwt" && calleeName === "sign") {
        const secretArg = args[1];
        const weakLiteralSecret = secretArg?.type === "StringLiteral" && secretArg.value.length < 32;
        const weakIdentifierSecret = secretArg?.type === "Identifier" && /secret/i.test(secretArg.name);

        if (weakLiteralSecret || weakIdentifierSecret) {
          pushFinding({
            id: `JWT_WEAK_SECRET_${getLine(path.node) || 0}`,
            severity: getSeverity("JWT_WEAK_SECRET", context) || "high",
            confidence: "medium",
            line: getLine(path.node),
            issue: "Weak JWT secret handling",
            cwe: "CWE-321",
            impact: "Weak JWT signing secrets can allow token forgery.",
            reasoning: "JWT signing call uses weak or potentially hardcoded secret source.",
            fix: "Use strong, rotated secrets from secure secret storage and minimum length >= 32.",
            evidence: "jwt.sign(..., secret)"
          });
        }
      }
    }
  });

  const hasUserIdentityReference = /\breq\.user\b|\brequest\.user\b/.test(code);
  const hasAuthGuard = /\b(auth|authenticate|authorization|verify(Token|Auth)?|isAuthenticated)\b/i.test(code);
  if (hasUserIdentityReference && !hasAuthGuard) {
    pushFinding({
      id: "MISSING_AUTH_CHECK_1",
      severity: getSeverity("MISSING_AUTH_CHECK", context) || "high",
      confidence: "medium",
      line: 1,
      issue: "Missing authentication check",
      cwe: "CWE-287",
      impact: "Unauthorized users may access protected functionality.",
      reasoning: "User identity appears in code path without visible authentication guard.",
      fix: "Apply authentication middleware and verify identity before protected operations.",
      evidence: "req.user usage without auth/verify guards"
    });
  }

  if (/\bapp\.post\s*\(/.test(code) && !/\brateLimit\s*\(/i.test(code)) {
    pushFinding({
      id: "NO_RATE_LIMIT_1",
      severity: getSeverity("NO_RATE_LIMIT", context) || "medium",
      confidence: "low",
      line: 1,
      issue: "No rate limiting on API",
      cwe: "CWE-770",
      impact: "Brute-force and abuse attacks become easier against exposed endpoints.",
      reasoning: "POST endpoint detected without explicit rate limiting middleware.",
      fix: "Add route-level rate limiting for authentication and sensitive operations.",
      evidence: "app.post(...) without rateLimit(...)"
    });
  }

  if (/\bres\.(send|json|end)\s*\(/.test(code) && !/\bhelmet\s*\(/.test(code)) {
    pushFinding({
      id: "MISSING_SECURITY_HEADERS_1",
      severity: getSeverity("MISSING_SECURITY_HEADERS", context) || "low",
      confidence: "low",
      line: 1,
      issue: "Missing security headers middleware",
      cwe: "CWE-693",
      impact: "Lack of hardening headers can increase browser-side attack surface.",
      reasoning: "Response writing detected but no helmet/security header middleware reference found.",
      fix: "Enable helmet or equivalent security header middleware for HTTP responses.",
      evidence: "res.send/json usage without helmet"
    });
  }

  if (findings.length === 0) {
    return runRegexFallback(code, language, filePath);
  }

  return findings;
};

export const securityScan = securityScanner;