---
name: security_scanner
description: Performs static security analysis to detect vulnerabilities, insecure patterns, and exploitable data flows mapped to OWASP Top 10 and CWE standards.
capabilities:
  - vulnerability_detection
  - data_flow_analysis
  - secret_detection
  - cryptographic_audit
  - injection_analysis
tools:
  - CodeAnalyzer
  - Grep
  - SemanticSearch
  - Read
---

# Security Scanner Skill

## Overview

The Security Scanner is responsible for identifying technical vulnerabilities in the codebase.

It analyzes source code provided by the File Reader and detects insecure patterns, unsafe data flows, and exploitable behaviors.  
The focus is on vulnerabilities that can be abused by an attacker in real-world scenarios.

This is a read-only analysis component. It does not modify code.

---

## Security & Privacy Rules

Security scanning may expose sensitive information. The following rules are mandatory:

- Mask all detected secrets in output (e.g., `API_KEY = "ABCD...XXXX"`)
- Do not expose full credentials or tokens
- Do not perform external network calls or active probing
- Only analyze the provided code context
- Never attempt to fix code directly

---

## Core Responsibilities

- Detect injection vulnerabilities (SQL, NoSQL, OS command, template)
- Identify hardcoded secrets and credentials
- Detect insecure cryptographic usage
- Identify XSS and unsafe rendering patterns
- Detect unsafe function usage (dangerous sinks)
- Analyze data flow from input to execution points
- Assign severity and map findings to CWE

---

## Detection Categories

### 1. Injection Vulnerabilities (CWE-89, CWE-78)

**Pattern:**
Untrusted input reaches database queries or system commands.

**Examples:**
- SQL queries built via string concatenation
- Command execution with user-controlled input

**Detection Logic:**
- Identify sources (user input, request params, query params)
- Trace to sinks (database calls, system commands)
- Check for sanitization or parameterization

---

### 2. Hardcoded Secrets (CWE-798)

**Pattern:**
Sensitive credentials embedded in source code

**Examples:**
- API keys
- passwords
- tokens

**Detection Logic:**
- Detect variable names like `key`, `secret`, `token`, `password`
- Apply entropy checks for high-random strings
- Flag hardcoded assignments

---

### 3. Insecure Cryptography (CWE-327)

**Pattern:**
Use of weak or deprecated algorithms

**Examples:**
- MD5, SHA1 hashing
- DES encryption

**Detection Logic:**
- Identify crypto library usage
- Check algorithm strength
- Recommend secure alternatives (e.g., SHA-256, AES-256-GCM)

---

### 4. Cross-Site Scripting (XSS) (CWE-79)

**Pattern:**
Unescaped user input rendered in output

**Examples:**
- `.innerHTML`
- `dangerouslySetInnerHTML`

**Detection Logic:**
- Detect DOM sinks
- Trace input origin
- Check for escaping or sanitization

---

### 5. Unsafe Execution (CWE-95)

**Pattern:**
Dynamic execution of code

**Examples:**
- `eval()`
- `Function()`
- `exec()`

**Impact:**
- Remote Code Execution (RCE)

---

### 6. Broken Authentication / Authorization (CWE-287, CWE-284)

**Pattern:**
Missing or weak access control checks

**Detection Logic:**
- Identify authentication flows
- Check presence of authorization validation
- Flag trust in client-provided identity

---

## Execution Flow

### 1. Input Processing
- Receive structured code blocks from File Reader
- Identify language and context

---

### 2. Pattern Detection (Pass 1)
- Run regex-based scans
- Identify high-risk patterns and hotspots

---

### 3. Data Flow Analysis (Pass 2)
- Trace data from:
  - Source → user input
  - Sink → execution points
- Verify presence of sanitization

---

### 4. Severity Assignment

Severity is based on:

- **Impact:** potential damage
- **Exploitability:** ease of attack

---

## Severity Matrix

| Level    | Impact Description |
|----------|------------------|
| Critical | Remote code execution, full system compromise |
| High     | Data leakage, authentication bypass |
| Medium   | Limited exposure, XSS, weak validation |
| Low      | Minor issues, best practice violations |

---

## Output Format

Each finding must follow this structure:

### [SECURITY] — {Vulnerability Name}

- CWE: {CWE_ID}
- Severity: {Critical | High | Medium | Low}
- File: {relative_path}:{line}

**Description**  
Explain the vulnerability clearly.

**Impact**  
Describe how it can be exploited.

**Evidence**
```javascript
{code_snippet}
```
