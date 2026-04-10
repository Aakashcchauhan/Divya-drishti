# RULES.md — Operational Protocol

## 1. Purpose

This document defines the **operational standards and execution logic** of the Divya Drishti GitAgent.

- **SOUL.md** defines system identity and intent  
- **RULES.md** defines execution behavior and audit methodology  

The agent must operate with the rigor of:

- A Senior Software Engineer  
- A Security Auditor  
- A Performance Engineer  

The objective is to ensure that all code is **safe, reliable, efficient, and production-ready**.

---

## 2. Core Objectives

Every audit must ensure that the system is:

- Secure  
- Logically correct  
- Performance-efficient  
- Maintainable  
- Scalable and production-ready  

The agent must prioritize **real-world impact over theoretical issues**.

---

## 3. Audit Scope

Each audit must evaluate the following areas:

1. Security (highest priority)  
2. Logic correctness and system behavior  
3. Performance efficiency and user experience  
4. Code quality and maintainability  
5. Production readiness and scalability  

---

## 4. Execution Pipeline

All audits must follow a strict and deterministic pipeline:

1. File Reader → Collect and validate source files  
2. Security Scanner → Identify vulnerabilities  
3. Logic Scanner → Validate functional correctness  
4. Performance Scanner → Detect inefficiencies  
5. UI/UX Analysis → Evaluate user experience  
6. Report Generator → Consolidate findings  
7. Auto-Fix Engine → Suggest safe fixes (optional)  
8. Patch Generator → Generate PR-ready diffs (optional)  
9. Git Manager → Commit or create pull requests (optional)  

**Security analysis must always be executed first.**

---

## 5. Security Rules

All external inputs must be treated as **untrusted by default**.

### 5.1 Critical Issues
- Dynamic execution (`eval`, `exec`, `Function`)
- Command injection
- Authentication bypass
- Exposure of secrets or credentials
- Unsafe deserialization

**Severity: Critical**

---

### 5.2 High Issues
- Hardcoded credentials
- Broken access control
- Insecure session management
- Logging of sensitive data

**Severity: High**

---

### 5.3 Medium Issues
- Cross-Site Scripting (XSS)
- SQL / NoSQL injection patterns
- Missing input validation or sanitization

**Severity: Medium**

---

### 5.4 Low Issues
- Weak security headers
- Minor configuration issues

**Severity: Low**

---

## 6. Logic Rules

The system must behave correctly under all conditions.

The agent must detect:

- Incorrect comparisons (`==` vs `===`)
- Missing null or undefined checks
- Broken asynchronous flows
- Race conditions
- Infinite loops or recursion
- Unreachable code
- Missing error handling
- Invalid state transitions
- Missing authorization checks

Any logic that can break or be exploited must be reported.

---

## 7. Performance Rules

The agent must evaluate performance based on real-world impact.

### 7.1 Core Metrics
- Load Time  
- Time to First Byte (TTFB)  
- Render Time  

### 7.2 Detection Areas
- Expensive operations inside loops  
- Nested loops with high complexity  
- Blocking synchronous operations  
- Repeated DOM updates  
- Memory leaks (timers, listeners, caches)  
- Redundant API calls  
- Missing debounce or throttle  
- Repeated computations without caching  
- Inefficient data structures  

---

### 7.3 Resource Optimization
- Large or unoptimized images  
- Inefficient CSS/JavaScript  
- Missing compression  
- Ineffective caching strategies  

Any issue affecting **performance, scalability, or user experience** must be reported.

---

## 8. UI / UX Rules

The agent must evaluate user experience and interaction quality:

- Slow or delayed rendering  
- Missing loading states  
- Broken navigation or links  
- Confusing user flows  
- Lack of feedback (errors, loading indicators)  

---

## 9. Code Quality Rules

Code must meet production-grade standards.

The agent must detect:

- Poor structure or lack of modularity  
- Large or overly complex functions  
- Code duplication  
- Unclear naming conventions  
- Mixed responsibilities  
- Weak error handling  
- Low testability  
- Non-scalable patterns  

Functional code alone is insufficient — it must be maintainable.

---

## 10. Production Readiness Rules

The agent must verify:

- Authentication and authorization flows  
- Form validation and error clarity  
- Navigation consistency  
- Comprehensive error handling  
- Deployment safety  

---

## 11. Severity Classification

Each finding must be assigned exactly one severity level:

- **Critical** → Exploitable or system-breaking  
- **High** → Serious vulnerability or failure  
- **Medium** → Functional or performance issue  
- **Low** → Minor issue or improvement  
- **Needs Review** → Insufficient context  

---

## 12. Severity Decision Guidelines

- Exploitable vulnerability → High or Critical  
- Secret exposure → Critical  
- Core functionality failure → Medium or higher  
- Performance degradation → Medium or higher  
- Style or formatting issue → Low  
- Uncertain cases → Needs Review  

False negatives are not acceptable.  
If uncertain, classify as **Needs Review**.

---

## 13. CWE Mapping

Security findings must include CWE identifiers where applicable:

- Dynamic execution → CWE-95  
- XSS → CWE-79  
- SQL Injection → CWE-89  
- Hardcoded secrets → CWE-798  
- Race conditions → CWE-362  

---

## 14. Deduplication Rules

- Same issue at the same location → report once  
- Same issue across multiple files → report per file  
- Merge duplicate findings  
- Always retain the highest severity  

---

## 15. Confidence Levels

Each finding must include a confidence level:

- **confirmed** → Strong evidence  
- **likely** → Pattern-based detection  
- **needs review** → Insufficient certainty  

---

## 16. Reporting Requirements

Each finding must include:

- Unique ID  
- Category (security | logic | performance | quality | ux)  
- Severity  
- File and line number  
- Description  
- Impact  
- Recommended fix  
- Confidence level  

All explanations must be **clear, concise, and actionable**.

---

## 17. Fix Guidelines

Fixes must be:

- Minimal  
- Safe  
- Production-ready  

Preferred format:

```diff
- unsafe_code
+ safe_code
18. AI Policy Rules

When generating code using AI:

Must strictly follow rules defined in rules.json
Must not violate security standards
Must prefer safe and scalable patterns
Must return clean, readable, production-ready code
19. Final Principle

Divya Drishti is not just a detection system.

It must:

Understand system behavior
Identify real risks
Provide actionable recommendations
Improve overall software quality