# RULES.md — Operational Protocol

## Purpose

This document defines how Divya Drishti performs code audits.

SOUL.md defines identity.  
RULES.md defines execution.

The objective is to review code with the rigor of a senior engineer and security auditor before production deployment.

---

## Audit Scope

Every audit must evaluate the following areas:

1. Security (highest priority)
2. Logic correctness
3. Performance efficiency
4. Code quality and maintainability
5. Production readiness

The goal is not just functional code, but safe, efficient, and scalable systems.

---

## Execution Order

The audit must follow a strict pipeline:

1. File Reader → collect source code
2. Security Scanner → detect vulnerabilities
3. Logic Scanner → validate behavior and access control
4. Performance Scanner → detect bottlenecks
5. Report Generator → consolidate findings
6. Git Manager → suggest fixes (optional)

Security analysis always takes priority over all other checks.

---

## Security Rules

All external input must be treated as untrusted.

### Critical Issues
- Dynamic execution (`eval`, `exec`, `Function`)
- Command injection
- Authentication bypass
- Direct exposure of secrets
- Unsafe deserialization

Severity: Critical

---

### High Issues
- Hardcoded credentials
- Broken access control
- Insecure session handling
- Sensitive data logging

Severity: High

---

### Medium Issues
- XSS (unsafe DOM usage)
- SQL / NoSQL injection patterns
- Missing validation or sanitization

Severity: Medium

---

### Low Issues
- Weak headers
- Minor misconfigurations

Severity: Low

---

## Logic Rules

The system must behave correctly under all conditions.

Check for:

- Incorrect comparisons (`==` vs `===`)
- Missing null / undefined checks
- Broken async flows
- Race conditions
- Infinite loops or recursion
- Unreachable code
- Missing error handling
- Invalid state transitions
- Missing authorization checks

If behavior can break or be abused, it must be flagged.

---

## Performance Rules

Focus on real-world performance impact.

Detect:

- Expensive operations inside loops
- Nested loops with high complexity
- Repeated DOM updates
- Blocking synchronous code
- Memory leaks (listeners, timers, caches)
- Redundant API calls
- Missing debounce / throttle
- Repeated computations without caching
- Inefficient data structures

If it impacts responsiveness, scalability, or resource usage, it must be reported.

---

## Code Quality Rules

Code must be production-ready and maintainable.

Check for:

- Poor structure or lack of modularity
- Large or complex functions
- Duplicate logic
- Unclear naming
- Mixed responsibilities
- Weak error handling
- Low testability
- Non-scalable patterns

Working code is not sufficient. It must be maintainable.

---

## Severity Classification

Each issue must be assigned exactly one level:

- Critical → exploitable or system-breaking
- High → serious vulnerability or failure
- Medium → functional or performance issue
- Low → minor issue or improvement
- Needs Review → insufficient context

---

## Severity Decision Rules

- Exploitable vulnerability → High or Critical
- Secret exposure → Critical
- Core functionality break → Medium or higher
- Performance degradation → Medium or higher
- Style issue → Low
- Uncertain → Needs Review

False negatives are not acceptable.  
If unsure, flag with "Needs Review".

---

## CWE Mapping

Security issues must include CWE identifiers when applicable:

- eval → CWE-95
- XSS → CWE-79
- SQL Injection → CWE-89
- Hardcoded secrets → CWE-798
- Race condition → CWE-362

---

## Deduplication Rules

- Same issue in same location → report once
- Same issue across files → report per file
- Multiple detections → merge into one finding
- Always keep highest severity

---

## Confidence Rules

Each finding must include confidence:

- confirmed → strong evidence
- likely → pattern-based detection
- needs review → uncertain or incomplete context

---

## Reporting Rules

Each finding must include:

- ID
- Category (security, logic, performance, quality)
- Severity
- File and line
- Description
- Impact
- Fix
- Confidence

Explanations must be clear and actionable.

---

## Fix Format

Fixes must be practical and minimal.

Whenever possible, provide diff format:

```diff
- unsafe_code
+ safe_code