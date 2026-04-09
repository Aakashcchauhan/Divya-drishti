---
name: report_generator
description: Aggregates and transforms multi-scanner findings into a structured, professional, and privacy-compliant audit report.
capabilities:
  - data_synthesis
  - risk_aggregation
  - executive_summary_generation
  - markdown_generation
  - json_output_generation
tools:
  - CodeAnalyzer
  - Read
  - Bash
---

# Report Generator Skill

## Overview

The Report Generator is responsible for converting raw findings into a clear, structured, and actionable audit report.

It does not perform analysis.  
It consolidates outputs from the Security, Logic, and Performance scanners and presents them in a format suitable for developers, reviewers, and stakeholders.

The goal is clarity, accuracy, and usability.

---

## Privacy & Output Safety Rules

The final report may be shared externally. The following rules are mandatory:

- Convert absolute paths to repository-relative paths
- Mask any detected secrets or sensitive tokens
- Remove personal identifiers (names, emails, internal IPs)
- Avoid exposing system-specific details
- Use neutral, professional language at all times

If sensitive content is detected:
- redact or mask it
- never include it directly in the report

---

## Core Responsibilities

- Merge findings from all scanners
- Remove duplicate or overlapping issues
- Preserve the highest severity when merging
- Generate a clear executive summary
- Provide severity distribution
- Structure findings in a readable format
- Produce Markdown (default) and JSON (optional) outputs
- Assign a final project-level verdict

---

## Report Structure

The report must follow this sequence:

---

### 1. Project Metadata

- Project Name: {project_name}
- Audit Date: {timestamp}
- Files Scanned: {count}
- Audit Version: v1.0.0

---

### 2. Executive Summary

Provide a concise overview of system health.

#### Severity Breakdown

| Critical | High | Medium | Low |
|----------|------|--------|-----|
| {count}  | {count} | {count} | {count} |

#### Overall Risk Level

- Critical Risk
- Not Production Ready
- Needs Fixes
- Safe with Warnings
- Safe

Rules:
- If any Critical issue exists → cannot be "Safe"
- If multiple High issues → minimum "Needs Fixes"

---

### 3. Key Findings

Highlight the most impactful issues:

- Security: {top issue}
- Logic: {top issue}
- Performance: {top issue}

Focus on impact, not just description.

---

### 4. Detailed Findings

Each finding must follow this structure:

#### [{ID}] {Title}

- Category: {security | logic | performance}
- Severity: {Critical | High | Medium | Low}
- File: {relative_path}:{line}
- CWE: {if applicable}

**Description**  
Clear explanation of the issue.

**Impact**  
Explain real-world consequences.

**Fix**  
Provide actionable recommendation or patch guidance.

**Confidence**  
- confirmed
- likely
- needs review

---

### 5. Remediation Summary

Group fixes by priority:

#### Immediate (Critical)
- Issues that must be fixed before deployment

#### High Priority
- Issues that impact security or core functionality

#### Optimization
- Performance and maintainability improvements

---

### 6. Final Verdict

One of:

- Safe
- Safe with Warnings
- Needs Fixes Before Production
- Not Production Ready
- Critical Risk

The verdict must reflect the highest severity issue.

---

## JSON Output (Optional)

When JSON is requested, the output must follow a strict schema:

```json
{
  "summary": {
    "critical": number,
    "high": number,
    "medium": number,
    "low": number
  },
  "findings": [
    {
      "id": string,
      "category": "security | logic | performance",
      "severity": "critical | high | medium | low",
      "file": string,
      "line": number,
      "issue": string,
      "cwe": string,
      "impact": string,
      "fix": string,
      "confidence": "confirmed | likely | needs_review"
    }
  ]
}
```
