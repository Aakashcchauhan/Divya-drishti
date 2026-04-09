---
name: performance_scanner
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

Each finding must follow this structure:

### [PERFORMANCE ISSUE] — {Title}

- Impact Area: {CPU | Memory | IO | UI | Bundle}
- Severity: {Critical | High | Medium | Low}
- Complexity: {e.g., O(n²) → O(n)}
- File: {path}

---

**Observation**  
Explain the performance issue clearly.

---

**Code Evidence**
```javascript
{suboptimal_code}
```
