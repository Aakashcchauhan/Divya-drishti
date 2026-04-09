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

Its responsibility is to locate, filter, and retrieve source code in a safe, structured, and predictable manner.  
It prepares clean input for downstream skills (security, logic, performance) while strictly enforcing security boundaries and privacy constraints.

This skill is read-only and does not perform any analysis.

---

## Security & Scope

This skill must strictly control what is read and what is ignored.

### In Scope (Allowed)

- Source Code:
  `.js, .jsx, .ts, .tsx, .py, .java, .go, .rs, .c, .cpp, .php, .rb`
- Configuration Files:
  `package.json`, `tsconfig.json`, `dockerfile`, `.yml`, `.yaml`, `.toml`
- Documentation:
  `README.md`, `SECURITY.md`, `CONTRIBUTING.md`
- Environment Templates:
  `.env.example` (only templates, never real secrets)

---

### Out of Scope (Forbidden)

- Sensitive Files:
  `.env`, `.pem`, `.key`, `.crt`, `id_rsa`, `id_ed25519`
- Binary / Media:
  `.jpg, .png, .gif, .pdf, .zip, .exe, .dll, .so`
- Dependency Directories:
  `node_modules/`, `vendor/`, `bower_components/`
- Build Outputs:
  `dist/`, `build/`, `out/`, `target/`, `bin/`, `obj/`
- Version Control:
  `.git/`, `.svn/`, `.hg/`
- Logs / Temp:
  `*.log`, `tmp/`, `temp/`, `.cache/`

---

## Core Responsibilities

- Traverse repository recursively
- Identify relevant files using extension and naming patterns
- Read file content safely without modification
- Skip sensitive or irrelevant data automatically
- Return structured output for downstream processing

---

## Input Parameters

- `target_path` → root directory or specific file
- `file_types` → allowed extensions (default provided above)
- `depth` → recursion depth (optional)

---

## Execution Flow

1. **Discovery**
   - Traverse directories using Glob or equivalent
   - Generate file list

2. **Filtering**
   - Exclude forbidden paths and files
   - Prioritize critical files:
     - `auth.*`
     - `api.*`
     - `routes.*`
     - `db.*`
     - `config.*`

3. **Validation**
   - Ensure file type is allowed
   - Ensure file is text-based
   - Ensure file is within size limits

4. **Safe Read**
   - Read file in read-only mode
   - Preserve encoding and structure
   - Do not execute or interpret content

5. **Formatting**
   - Attach metadata
   - Return structured output

---

## Output Format

All output must follow this exact structure:

### File: {relative_path}

Metadata:
- Size: {size_in_kb} KB
- Extension: {file_extension}
- Encoding: {encoding}
- Permissions: {mode}
- Security Status: Safe / Skipped

```language
{raw_file_content}