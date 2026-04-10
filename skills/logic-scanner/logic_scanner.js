export const logicScanner = async (code, filePath) => {
  const findings = [];
  const seen = new Set();

  if (!code || typeof code !== "string") return findings;

  const lines = code.split("\n");

  const context = {
    hasAuthCheck: /\b(auth|authorize|isAuthenticated|requireAuth|checkPermission)\b/i.test(code),
    hasValidation: /\b(validate|sanitize|schema|joi|zod|validator)\b/i.test(code),
    hasOwnershipCheck: /(user\.id\s*===|owner[_\.]?id\s*===|where\s*\([^)]*(user_id|owner_id)|resource\.(ownerId|userId))\b/i.test(code),
    hasRoleVerification: /\b(verifyRole|authorizeRole|hasRole|rbac|checkPermission|can\()\b/i.test(code),
    hasPaymentValidation: /\b(payment|isPaid|paid|paymentStatus|verifyPayment)\b/i.test(code),
    hasUserIdentityReference: /\breq\.user\b|\brequest\.user\b/i.test(code)
  };

  const isAllowedLooseEquality = (line) => {
    const normalized = line.replace(/\s+/g, " ");

    // Common intentional nullish check pattern.
    if (/\b(==|!=)\s*null\b|\bnull\s*(==|!=)\b/.test(normalized)) {
      return true;
    }

    if (/\b(==|!=)\s*undefined\b|\bundefined\s*(==|!=)\b/.test(normalized)) {
      return true;
    }

    // typeof checks are a conventional and predictable pattern.
    if (/\btypeof\s+[^=]+\s*==\s*['"][a-zA-Z]+['"]/.test(normalized)) {
      return true;
    }

    return false;
  };

  // -------------------------
  // Language-Agnostic Patterns
  // -------------------------
  const PATTERNS = [
    {
      id: "LOOSE_EQUALITY",
      regex: /(^|[^!=])==([^=]|$)/,
      severity: "medium",
      issue: "Loose equality detected",
      gap: "Non-strict comparison can cause implicit type coercion leading to unpredictable behavior.",
      impact: "Incorrect conditional evaluation and logic bypass.",
      languages: ["js", "ts", "php", "java", "c", "cpp"]
    },
    {
      id: "MISSING_AWAIT_OR_ASYNC",
      regex: /\b(fetch|axios|query|db\.|execute|call)\s*\(/,
      severity: "high",
      issue: "Potential unhandled asynchronous operation",
      gap: "Async call may not be awaited or properly handled.",
      impact: "Race conditions, unresolved promises, inconsistent application state.",
      languages: ["js", "ts", "python", "java"]
    },
    {
      id: "DIRECT_OBJECT_REFERENCE",
      regex: /(req\.params|req\.query|params\[|request\.getParameter|input\(|argv\[)/i,
      severity: "medium",
      issue: "Direct object reference without validation",
      gap: "User-controlled identifiers are used without validation or authorization checks.",
      impact: "Unauthorized data access or IDOR vulnerability.",
      languages: ["js", "ts", "java", "python", "php"]
    },
    {
      id: "MISSING_ERROR_HANDLING",
      regex: /\.(then|map|forEach)\(/,
      severity: "medium",
      issue: "Missing error handling",
      gap: "Operation lacks proper error handling mechanism.",
      impact: "Silent failures or unexpected crashes in production.",
      languages: ["js", "ts"]
    },
    {
      id: "INFINITE_LOOP_RISK",
      regex: /while\s*\(\s*true\s*\)|for\s*\(\s*;\s*;\s*\)/,
      severity: "high",
      issue: "Potential infinite loop",
      gap: "Loop has no clear exit condition.",
      impact: "CPU exhaustion and application freeze.",
      languages: ["all"]
    },
    {
      id: "NULL_REFERENCE_RISK",
      regex: /\b\w+\.\w+\.\w+/,
      severity: "low",
      issue: "Possible null or undefined dereference",
      gap: "Chained property access without null checks.",
      impact: "Runtime crashes due to null or undefined values.",
      languages: ["all"]
    }
  ];

  // -------------------------
  // Helpers
  // -------------------------
  const isComment = (line) => {
    const trimmed = line.trim();
    return (
      trimmed.startsWith("//") ||
      trimmed.startsWith("#") ||
      trimmed.startsWith("/*") ||
      trimmed.startsWith("*")
    );
  };

  const detectLanguage = (filePath) => {
    const ext = filePath.split(".").pop()?.toLowerCase();

    const map = {
      js: "js",
      jsx: "js",
      ts: "ts",
      tsx: "ts",
      py: "python",
      java: "java",
      php: "php",
      c: "c",
      cpp: "cpp",
      go: "go",
      rs: "rust"
    };

    return map[ext] || "unknown";
  };

  const calculateConfidence = (id, line) => {
    if (id === "INFINITE_LOOP_RISK") return "high";
    if (id === "DIRECT_OBJECT_REFERENCE" && /req\.(params|query)\.(id|userId|accountId)/i.test(line)) {
      return "high";
    }
    if (id === "LOOSE_EQUALITY") return "medium";
    if (id === "MISSING_AWAIT_OR_ASYNC") return "low";
    if (id === "MISSING_ERROR_HANDLING") return "low";
    if (id === "NULL_REFERENCE_RISK") return "low";
    return "medium";
  };

  const shouldFlagAsync = (line) => {
    if (!/\b(fetch|axios|query|db\.|execute|call)\s*\(/.test(line)) return false;
    if (/\bawait\b/.test(line)) return false;
    if (/\.then\s*\(/.test(line)) return false;
    return true;
  };

  const shouldFlagMissingErrorHandling = (line) => {
    if (/\.then\s*\(/.test(line)) {
      return !/\.catch\s*\(/.test(line);
    }

    if (/\.forEach\s*\(\s*async\b/.test(line)) {
      return true;
    }

    if (/\.map\s*\(\s*async\b/.test(line) && !/Promise\.all\s*\(/.test(line)) {
      return true;
    }

    return false;
  };

  const shouldFlagNullReferenceRisk = (line) => {
    if (!/\b\w+\.\w+\.\w+/.test(line)) return false;
    if (/\?\./.test(line)) return false;
    if (/\bif\s*\(/.test(line)) return false;
    if (/\b&&\b|\?\?/.test(line)) return false;
    return true;
  };

  const pushFinding = (base, lineNumber, line, overrides = {}) => {
    const evidence = (overrides.evidence || line || "").trim();
    const dedupeKey = `${base.id}-${evidence}`;

    if (seen.has(dedupeKey)) return;
    seen.add(dedupeKey);

    const confidence = overrides.confidence || calculateConfidence(base.id, line || "");
    const category = overrides.category || "logic";
    const recommendation = overrides.recommendation || getRecommendation(base.id);

    findings.push({
      type: "logic_finding",
      id: `${base.id}_${lineNumber}`,
      category,
      severity: overrides.severity || base.severity,
      confidence,
      location: {
        file: filePath,
        line: lineNumber
      },
      file: filePath,
      line: lineNumber,
      issue: overrides.issue || base.issue,
      gap: overrides.gap || base.gap,
      impact: overrides.impact || base.impact,
      language,
      evidence,
      reasoning: overrides.reasoning || base.gap,
      exploit: overrides.exploit || [],
      fix: recommendation,
      recommendation
    });
  };

  const detectFlowBasedIssues = () => {
    if (context.hasUserIdentityReference && !context.hasAuthCheck) {
      const authRefLine = lines.findIndex((line) => /\breq\.user\b|\brequest\.user\b/i.test(line));
      pushFinding(
        {
          id: "AUTH_BYPASS_POSSIBLE",
          severity: "high",
          issue: "Possible authentication bypass",
          gap: "User identity reference appears without explicit authentication guard.",
          impact: "Protected actions may be reachable without verified authentication."
        },
        authRefLine >= 0 ? authRefLine + 1 : 1,
        authRefLine >= 0 ? lines[authRefLine] : "req.user",
        {
          confidence: "medium",
          category: "access_control",
          reasoning: "Code references authenticated user context, but no auth middleware or guard pattern was detected.",
          exploit: [
            "Attacker calls endpoint directly without valid session",
            "Endpoint path evaluates user context without guard",
            "Privileged flow executes without authentication"
          ],
          recommendation: "Add explicit authentication middleware before accessing user-scoped operations."
        }
      );
    }

    const shippedLine = lines.findIndex((line) => /\bstatus\s*=\s*['"]shipped['"]/i.test(line));
    if (shippedLine >= 0 && !context.hasPaymentValidation) {
      pushFinding(
        {
          id: "WORKFLOW_BYPASS",
          severity: "high",
          issue: "Workflow bypass risk",
          gap: "Shipment status appears without payment validation.",
          impact: "Orders may be shipped before payment verification."
        },
        shippedLine + 1,
        lines[shippedLine],
        {
          confidence: "medium",
          category: "workflow",
          reasoning: "State transition to shipped is present without payment checks in the same file.",
          exploit: [
            "Trigger endpoint that sets order to shipped",
            "Bypass payment-related checks",
            "Order progresses to an invalid business state"
          ],
          recommendation: "Enforce payment verification before allowing shipped state transitions."
        }
      );
    }

    const stateTransitionMap = {
      paid: ["shipped", "delivered", "refunded"],
      shipped: ["delivered"],
      verified: ["active"]
    };

    const stateLineMap = {};
    const stateRegex = /\b(status|state)\s*=\s*['"](paid|shipped|delivered|refunded|verified|active)['"]/i;

    lines.forEach((line, index) => {
      const match = line.match(stateRegex);
      if (!match) return;

      const value = match[2].toLowerCase();
      if (stateLineMap[value] === undefined) {
        stateLineMap[value] = index + 1;
      }
    });

    Object.entries(stateTransitionMap).forEach(([requiredState, dependentStates]) => {
      dependentStates.forEach((dependentState) => {
        if (stateLineMap[dependentState] !== undefined && stateLineMap[requiredState] === undefined) {
          pushFinding(
            {
              id: "STATE_INCONSISTENCY",
              severity: "high",
              issue: "State transition inconsistency",
              gap: `State '${dependentState}' appears without required prior state '${requiredState}'.`,
              impact: "Invalid business state progression can cause authorization and workflow failures."
            },
            stateLineMap[dependentState],
            lines[stateLineMap[dependentState] - 1],
            {
              confidence: "medium",
              category: "state",
              reasoning: `Detected '${dependentState}' assignment without evidence of '${requiredState}' in the same file.`,
              exploit: [
                "Attacker invokes endpoint that sets a later business state directly",
                "Required prior validation step is skipped",
                "System stores an invalid or unsafe state transition"
              ],
              recommendation: "Enforce state machine guards that validate allowed prior states before transition."
            }
          );
        }
      });
    });
  };

  const language = detectLanguage(filePath);

  detectFlowBasedIssues();

  // -------------------------
  // Scan Execution
  // -------------------------
  lines.forEach((line, index) => {
    if (isComment(line)) return;

    PATTERNS.forEach((pattern) => {
      if (
        pattern.languages.includes("all") ||
        pattern.languages.includes(language)
      ) {
        if (pattern.id === "LOOSE_EQUALITY" && isAllowedLooseEquality(line)) {
          return;
        }

        if (pattern.id === "MISSING_AWAIT_OR_ASYNC" && !shouldFlagAsync(line)) {
          return;
        }

        if (pattern.id === "MISSING_ERROR_HANDLING" && !shouldFlagMissingErrorHandling(line)) {
          return;
        }

        if (pattern.id === "NULL_REFERENCE_RISK" && !shouldFlagNullReferenceRisk(line)) {
          return;
        }

        if (pattern.regex.test(line)) {
          pushFinding(pattern, index + 1, line);

          if (
            pattern.id === "DIRECT_OBJECT_REFERENCE" &&
            /req\.(params|query)\.(id|userId|accountId)|request\.getParameter\(/i.test(line) &&
            !context.hasOwnershipCheck
          ) {
            pushFinding(
              {
                id: "IDOR_POSSIBLE",
                severity: "high",
                issue: "Insecure Direct Object Reference",
                gap: "User-controlled identifier is used without ownership validation.",
                impact: "Unauthorized access to another user's records."
              },
              index + 1,
              line,
              {
                confidence: "high",
                category: "access_control",
                reasoning: "ID-like request input is used and no ownership check was detected in this file.",
                exploit: [
                  "Attacker alters identifier in the request",
                  "Server fetches resource using the altered identifier",
                  "Unauthorized data becomes accessible"
                ],
                recommendation: "Enforce ownership validation before fetching or mutating resources."
              }
            );
          }

          if (
            /req\.(body|query)\.role/i.test(line) &&
            !context.hasRoleVerification
          ) {
            pushFinding(
              {
                id: "PRIVILEGE_ESCALATION_POSSIBLE",
                severity: "high",
                issue: "Privilege escalation risk",
                gap: "Role input appears to be sourced from the client without backend verification.",
                impact: "Attackers may escalate privileges by tampering with role values."
              },
              index + 1,
              line,
              {
                confidence: "high",
                category: "access_control",
                reasoning: "Client role input is present and role verification controls were not detected in this file.",
                exploit: [
                  "Attacker submits elevated role in request body",
                  "Backend trusts client-supplied role",
                  "Privileged action executes without authorization"
                ],
                recommendation: "Resolve effective role on the server and enforce permission checks before action execution."
              }
            );
          }
        }
      }
    });

    if (/\breq\.(body|query)\.(price|amount|discount|quantity|role)\b/i.test(line) && !context.hasValidation) {
      pushFinding(
        {
          id: "PARAMETER_TAMPERING_POSSIBLE",
          severity: "high",
          issue: "Parameter tampering risk",
          gap: "Critical user-controlled value appears without validation safeguards.",
          impact: "Attackers may manipulate financial or privilege-sensitive inputs."
        },
        index + 1,
        line,
        {
          confidence: "medium",
          category: "data_integrity",
          reasoning: "Critical request parameter is consumed and no validation framework signals were detected.",
          exploit: [
            "Attacker modifies price, amount, discount, quantity, or role in request payload",
            "Server accepts manipulated value without strict validation",
            "Business logic executes with tampered input"
          ],
          recommendation: "Validate and recalculate critical values server-side before processing the action."
        }
      );
    }
  });

  return findings;
};

// -------------------------
// Recommendations Engine
// -------------------------
const getRecommendation = (id) => {
  const fixes = {
    LOOSE_EQUALITY: "Use strict equality (===) to avoid type coercion issues.",
    MISSING_AWAIT_OR_ASYNC:
      "Ensure async operations are awaited or handled with proper promise resolution.",
    DIRECT_OBJECT_REFERENCE:
      "Validate and authorize all user-controlled identifiers before use.",
    IDOR_POSSIBLE:
      "Add ownership constraints (for example user.id === resource.userId) before data access.",
    PRIVILEGE_ESCALATION_POSSIBLE:
      "Do not trust client-provided roles; enforce role checks on the backend.",
    AUTH_BYPASS_POSSIBLE:
      "Apply authentication guards and reject unauthenticated requests before business logic execution.",
    PARAMETER_TAMPERING_POSSIBLE:
      "Validate and recalculate sensitive parameters on the server.",
    STATE_INCONSISTENCY:
      "Use an explicit state machine and enforce allowed transitions.",
    WORKFLOW_BYPASS:
      "Enforce mandatory state transitions with explicit server-side guards.",
    MISSING_ERROR_HANDLING:
      "Add proper error handling using try/catch or .catch().",
    INFINITE_LOOP_RISK:
      "Ensure loop has a valid exit condition.",
    NULL_REFERENCE_RISK:
      "Add null checks or optional chaining before accessing nested properties."
  };

  return fixes[id] || "Review logic and apply defensive programming practices.";
};

// Alias
export const logicScan = logicScanner;