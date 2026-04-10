---
name: performance-scanner
description: Identifies execution bottlenecks, inefficient algorithms, memory leaks, and resource mismanagement that impact system performance and scalability.
capabilities:
  - algorithmic_complexity_analysis
  - memory_leak_detection
  - event_loop_analysis
  - resource_lifecycle_audit
  - io_efficiency_analysis
tools:
  - CodeAnalyzer
  - SemanticSearch
  - Grep
---

# Performance Scanner Skill

## Overview

The Performance Scanner evaluates how efficiently the application runs.

Its role is to detect patterns that degrade performance, increase resource usage, or limit scalability.  
It focuses on real-world impact such as slow response times, high CPU usage, memory growth, and poor user experience.

---

## Performance Principles

- Prioritize issues that affect real users and system stability
- Focus on high-frequency execution paths ("hot paths")
- Avoid micro-optimizations unless they scale poorly
- Always balance performance with readability and maintainability
- Never recommend optimizations that compromise correctness or security

---

## Core Responsibilities

- Detect inefficient algorithms and high time complexity
- Identify memory leaks and resource mismanagement
- Detect blocking operations in asynchronous environments
- Identify redundant or repeated computations
- Detect unnecessary re-renders or DOM updates
- Identify inefficient database or API usage patterns
- Evaluate dependency impact on performance

---

## Key Detection Areas

### 1. Event Loop Blocking (JavaScript / Node.js)

- Use of synchronous operations in async environments

Examples:
- `fs.readFileSync()` in request handlers
- heavy `JSON.parse()` on large payloads

Impact:
- Blocks concurrent requests
- Degrades server throughput

---

### 2. Algorithmic Inefficiency

- High complexity operations (O(n²), O(n³))

Examples:
- Nested loops over large datasets
- repeated `.find()` or `.filter()` inside loops

Detection Logic:
- Identify repeated traversal over same dataset
- Suggest optimized structures (Map, Set, indexing)

---

### 3. Memory Leaks (CWE-401)

- Resources not released properly

Examples:
- Event listeners not removed
- `setInterval` without cleanup
- growing global caches

Impact:
- Increasing memory usage over time
- potential crashes

---

### 4. Redundant Computation

- Repeating expensive calculations unnecessarily

Examples:
- recalculating derived values on every render
- computing same result multiple times without caching

---

### 5. Unnecessary Re-Renders (Frontend)

- Frequent UI updates without need

Examples:
- functions/objects recreated inside render
- missing memoization (`useMemo`, `useCallback`)

Impact:
- UI lag
- excessive CPU usage

---

### 6. Inefficient IO / API Usage

- Repeated or unnecessary external calls

Examples:
- duplicate API calls
- N+1 query patterns

Impact:
- increased latency
- unnecessary load on backend

---

### 7. Dependency Overhead

- Heavy or unnecessary libraries

Examples:
- large libraries increasing bundle size
- deprecated or inefficient dependencies

---

## Execution Flow

### 1. Path Identification
- Identify high-frequency code paths:
  - request handlers
  - loops
  - rendering logic

---

### 2. Static Analysis
- Analyze loops and recursion
- Estimate time complexity
- Identify repeated operations

---

### 3. Resource Tracking
- Track lifecycle of:
  - memory allocations
  - listeners
  - timers

---

### 4. IO Analysis
- Detect redundant or repeated external calls
- Identify opportunities for caching or batching

---

### 5. Impact Assessment
- Determine whether issue affects:
  - CPU usage
  - memory usage
  - latency
  - user experience

---

## Output Format

Each finding must follow a strict JSON schema.

```json
{
  "type": "performance_finding",
  "id": "N_PLUS_ONE_QUERY_42",
  "category": "database | io | cpu | memory | ui | event_loop | performance",
  "severity": "critical | high | medium | low",
  "confidence": "high | medium | low",
  "impact": {
    "cpu": "high | medium | low",
    "memory": "high | medium | low",
    "latency": "high | medium | low",
    "io": "high | medium | low"
  },
  "impactScore": {
    "cpu": 0,
    "memory": 0,
    "io": 0
  },
  "location": {
    "file": "src/module.js",
    "line": 42
  },
  "issue": "N+1 query pattern",
  "reasoning": "Database call detected inside loop",
  "evidence": "await db.find() inside for loop",
  "fix": "Batch queries or use JOIN",
  "recommendation": "Batch queries or use JOIN"
}
```

Notes:
- Timer findings must be context-aware and should not mark every timer as a leak.
- `setInterval` without cleanup should be reported as possible memory leak with low confidence unless lifecycle evidence is stronger.
- Sync I/O should be severity-weighted by runtime context (server hot path vs script tooling).
- Duplicate findings for the same issue and evidence must be deduplicated.
