Divya Drishti Automated Workflow

1. Introduction

This document defines the complete execution workflow of the Divya Drishti system.

Divya Drishti is a modular, multi-stage auditing pipeline designed to analyze codebases for security vulnerabilities, logic flaws, performance bottlenecks, and production-readiness.

The system is designed to operate as an automated agent pipeline suitable for real-world engineering environments and competitive hackathon deployment.

---

2. Workflow Objective

The objective of this workflow is to:

- Analyze source code systematically
- Detect critical issues before production
- Generate structured audit reports
- Provide actionable remediation
- Integrate with version control systems

---

3. Execution Pipeline

The workflow follows a strict sequential pipeline:

Input (Repository Path)
→ File Reader
→ Security Scanner
→ Logic Scanner
→ Performance Scanner
→ UI Skeleton Generator
→ Memory Storage
→ Report Generator
→ Git Manager
→ Final Output

Each stage processes structured data and passes results through the memory layer.

---

4. System Components

4.1 File Reader

Purpose:
Extract and prepare source code for analysis.

Responsibilities:
- Traverse repository
- Filter supported file types
- Ignore irrelevant directories
- Read files safely with size and format validation

Output:
memory/files.json

---

4.2 Security Scanner

Purpose:
Detect vulnerabilities and insecure patterns.

Responsibilities:
- Identify injection risks
- Detect unsafe execution (eval, exec)
- Detect hardcoded secrets
- Analyze authentication and authorization logic

Output:
memory/security.json

---

4.3 Logic Scanner

Purpose:
Validate correctness of code behavior.

Responsibilities:
- Detect incorrect conditions
- Identify race conditions
- Validate async flow
- Detect missing error handling

Output:
memory/logic.json

---

4.4 Performance Scanner

Purpose:
Identify performance bottlenecks.

Responsibilities:
- Detect inefficient algorithms
- Identify blocking operations
- Detect memory leaks
- Identify redundant computations

Output:
memory/performance.json

---

4.5 UI Skeleton Generator

Purpose:
Improve perceived performance of UI.

Responsibilities:
- Identify UI components
- Detect slow rendering areas
- Generate skeleton placeholders
- Suggest animation for loading states

Input:
memory/files.json  
memory/performance.json  

Output:
memory/ui.json

---

4.6 Memory System

Purpose:
Act as central data layer.

Structure:

memory/
files.json  
security.json  
logic.json  
performance.json  
ui.json  
final-report.json  

Responsibilities:
- Store intermediate outputs
- Enable loose coupling between modules
- Provide traceability

---

4.7 Report Generator

Purpose:
Create final audit report.

Responsibilities:
- Merge findings from all scanners
- Deduplicate issues
- Assign severity levels
- Generate structured output

Output:
AUDIT_REPORT.md  
memory/final-report.json

---

4.8 Git Manager

Purpose:
Integrate audit results into version control.

Responsibilities:
- Validate repository state
- Create isolated audit branch
- Stage report file only
- Commit with traceable message
- Verify commit signature
- Push changes (optional)
- Create pull request (optional)
- Log repository state before and after execution

Output:
- commit hash
- branch name
- pull request link
- repository status logs

---

5. Data Flow Model

All modules communicate via memory files.

Example flow:

files.json → scanners  
security.json → report generator  
performance.json → UI generator and report  

This ensures modular independence and scalability.

---

6. Logging and Observability

The system logs:

- processed files
- detected issues
- skipped files
- errors
- git operations
- repository state changes

Logs are structured and stored for debugging and auditing.

---

7. Error Handling Strategy

Each module must:

- handle internal failures independently
- log errors without stopping the pipeline
- continue execution for remaining files

Failures are recorded in memory for traceability.

---

8. Execution Modes

The workflow supports:

Manual Mode:
Triggered via CLI command

Automated Mode:
Triggered via CI/CD or Git hooks

---

9. Extensibility

The system supports future expansion:

- additional scanners
- AI-based reasoning modules
- incremental scanning
- multi-repository analysis
- dashboard integration

New modules can be added without modifying existing pipeline logic.

---

10. Final Output

The system produces:

- structured audit report (Markdown)
- machine-readable data (JSON)
- optional Git commit and pull request

---

11. Final Principle

The workflow ensures that code is:

- secure
- logically correct
- performant
- maintainable
- production-ready

The system acts as a validation layer before deployment and a safeguard against critical failures.