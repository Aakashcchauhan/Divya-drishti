---
name: file_reader
description: Responsible for repository traversal, file discovery, and safe extraction of source code for downstream analysis.
capabilities:
  - filesystem_introspection
  - recursive_traversal
  - selective_retrieval
  - pattern_matching
tools:
  - Read
  - Glob
  - Grep
  - Ls
---

# File Reader Skill

## Overview

The File Reader is the data acquisition layer of Divya Drishti.

Its responsibility is to locate, filter, and retrieve source code from the repository in a safe, structured, and predictable way.  
It does not perform analysis. It prepares clean input for downstream skills such as security, logic, and performance scanners.

---

## Core Responsibilities

- Traverse the repository recursively and map the project structure
- Identify relevant source files based on extension and naming patterns
- Read file contents safely without modifying them
- Exclude irrelevant or non-source directories automatically
- Provide structured output for downstream processing

---

## Input Parameters

The skill operates with the following inputs:

- `target_path`  
  Root directory or specific file to scan

- `file_types`  
  File extensions to include  
  Default:
  `.js, .jsx, .ts, .tsx, .json, .py, .java, .go, .rs`

- `depth`  
  Maximum recursion depth (optional)

---

## Execution Flow

1. **Discovery**
   - Traverse directories using `Glob` or equivalent
   - Build a list of candidate files

2. **Filtering**
   - Exclude non-relevant paths:
     - `node_modules`
     - `.git`
     - `dist`
     - `build`
     - `coverage`
     - `vendor`
   - Prioritize files likely to contain logic or security-sensitive code:
     - `auth.*`
     - `api.*`
     - `routes.*`
     - `db.*`
     - `config.*`

3. **Validation**
   - Ensure file type is supported
   - Ensure file is not binary
   - Ensure file size is within limits

4. **Reading**
   - Read file contents safely
   - Preserve encoding and formatting
   - Do not alter file metadata

5. **Formatting**
   - Wrap each file in a structured output format
   - Include metadata for traceability

---

## Output Format

All output must follow this structure exactly:

### File: {relative_path}

Metadata:
- Size: {size_in_kb}
- Extension: {file_extension}
- Encoding: {encoding}
- Permissions: {mode}

```language
{raw_file_content}
```
