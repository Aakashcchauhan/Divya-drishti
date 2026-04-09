import fs from "fs-extra";
import path from "path";
import yaml from "js-yaml";
import crypto from "crypto";

const MEMORY_DIR = path.resolve("./memory");
const INDEX_FILE = path.join(MEMORY_DIR, "index.yaml");
const HISTORY_FILE = path.join(MEMORY_DIR, "audit_history.json");

const DEFAULT_INDEX = {
  metadata: {
    agent_name: "Divya Drishti",
    agent_mode: "Deep-Audit",
    last_updated: new Date().toISOString().slice(0, 10),
    schema_version: "1.0.0"
  },
  preferences: {
    priority_files: ["src/auth/**", "src/api/**"],
    ignore_list: ["node_modules", "dist", "build", ".git", "coverage", "vendor"],
    auto_fix_enabled: false,
    report_format: "markdown",
    severity_policy: "strict"
  },
  knowledge_base: {
    patterns_to_watch: [],
    resolved_issues: [],
    ignored_paths: []
  },
  state: {
    last_commit_audited: "",
    last_audit_at: "",
    total_audits: 0,
    total_vulnerabilities_found: 0,
    total_high_risk_findings: 0,
    last_run_status: "idle"
  }
};

const DEFAULT_HISTORY = {
  audits: []
};

function ensureObject(value, fallback) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : fallback;
}

function stableId(input) {
  return crypto.createHash("sha1").update(String(input)).digest("hex").slice(0, 12);
}

async function atomicWriteJson(filePath, data) {
  const tempPath = `${filePath}.tmp`;
  await fs.writeJson(tempPath, data, { spaces: 2 });
  await fs.move(tempPath, filePath, { overwrite: true });
}

async function atomicWriteYaml(filePath, data) {
  const tempPath = `${filePath}.tmp`;
  await fs.writeFile(tempPath, yaml.dump(data, { lineWidth: 120 }), "utf8");
  await fs.move(tempPath, filePath, { overwrite: true });
}

export class MemoryManager {
  constructor() {
    this.memoryDir = MEMORY_DIR;
    this.indexFile = INDEX_FILE;
    this.historyFile = HISTORY_FILE;
  }

  async init() {
    await fs.ensureDir(this.memoryDir);

    if (!(await fs.pathExists(this.indexFile))) {
      await atomicWriteYaml(this.indexFile, DEFAULT_INDEX);
    }

    if (!(await fs.pathExists(this.historyFile))) {
      await atomicWriteJson(this.historyFile, DEFAULT_HISTORY);
    }
  }

  async loadMemory() {
    try {
      const raw = await fs.readFile(this.indexFile, "utf8");
      const parsed = yaml.load(raw);
      return ensureObject(parsed, DEFAULT_INDEX);
    } catch {
      return structuredClone(DEFAULT_INDEX);
    }
  }

  async saveMemory(nextMemory) {
    const current = await this.loadMemory();
    const merged = {
      ...current,
      ...ensureObject(nextMemory, {}),
      metadata: {
        ...current.metadata,
        ...(nextMemory?.metadata || {}),
        last_updated: new Date().toISOString().slice(0, 10)
      },
      preferences: {
        ...current.preferences,
        ...(nextMemory?.preferences || {})
      },
      knowledge_base: {
        ...current.knowledge_base,
        ...(nextMemory?.knowledge_base || {})
      },
      state: {
        ...current.state,
        ...(nextMemory?.state || {})
      }
    };

    await atomicWriteYaml(this.indexFile, merged);
    return merged;
  }

  async updateState(patch) {
    const memory = await this.loadMemory();
    memory.state = {
      ...memory.state,
      ...ensureObject(patch, {}),
      last_updated: new Date().toISOString()
    };
    await atomicWriteYaml(this.indexFile, memory);
    return memory.state;
  }

  async addLearning(pattern) {
    if (!pattern || typeof pattern !== "object") {
      throw new Error("Pattern must be an object");
    }

    const memory = await this.loadMemory();
    const kb = ensureObject(memory.knowledge_base, { patterns_to_watch: [], resolved_issues: [], ignored_paths: [] });
    const patterns = Array.isArray(kb.patterns_to_watch) ? kb.patterns_to_watch : [];

    const fingerprint = stableId(
      `${pattern.name || ""}|${pattern.category || ""}|${pattern.pattern || ""}|${pattern.cwe || ""}`
    );

    const existingIndex = patterns.findIndex((item) => {
      const itemFingerprint = stableId(
        `${item.name || ""}|${item.category || ""}|${item.pattern || ""}|${item.cwe || ""}`
      );
      return itemFingerprint === fingerprint;
    });

    const nextItem = {
      id: fingerprint,
      count: 1,
      last_seen_at: new Date().toISOString(),
      ...pattern
    };

    if (existingIndex >= 0) {
      const existing = patterns[existingIndex];
      patterns[existingIndex] = {
        ...existing,
        ...pattern,
        id: existing.id || fingerprint,
        count: (existing.count || 0) + 1,
        last_seen_at: new Date().toISOString()
      };
    } else {
      patterns.push(nextItem);
    }

    memory.knowledge_base.patterns_to_watch = patterns;
    await atomicWriteYaml(this.indexFile, memory);
    return nextItem;
  }

  async markResolvedIssue(issue) {
    if (!issue || typeof issue !== "object") {
      throw new Error("Issue must be an object");
    }

    const memory = await this.loadMemory();
    const kb = ensureObject(memory.knowledge_base, { patterns_to_watch: [], resolved_issues: [], ignored_paths: [] });
    const resolved = Array.isArray(kb.resolved_issues) ? kb.resolved_issues : [];

    resolved.push({
      id: issue.id || stableId(`${issue.title || ""}|${issue.date || ""}`),
      status: "resolved",
      ...issue
    });

    memory.knowledge_base.resolved_issues = resolved;
    await atomicWriteYaml(this.indexFile, memory);
    return resolved[resolved.length - 1];
  }

  async getPreferences() {
    const memory = await this.loadMemory();
    return ensureObject(memory.preferences, structuredClone(DEFAULT_INDEX.preferences));
  }

  async getKnowledgeBase() {
    const memory = await this.loadMemory();
    return ensureObject(memory.knowledge_base, structuredClone(DEFAULT_INDEX.knowledge_base));
  }

  async appendAuditHistory(entry) {
    if (!entry || typeof entry !== "object") {
      throw new Error("Audit history entry must be an object");
    }

    const current = await this.loadHistory();
    current.audits.push({
      id: entry.id || stableId(`${entry.commit || ""}|${entry.timestamp || Date.now()}`),
      timestamp: entry.timestamp || new Date().toISOString(),
      ...entry
    });

    await atomicWriteJson(this.historyFile, current);
    return current.audits[current.audits.length - 1];
  }

  async loadHistory() {
    try {
      const data = await fs.readJson(this.historyFile);
      return ensureObject(data, structuredClone(DEFAULT_HISTORY));
    } catch {
      return structuredClone(DEFAULT_HISTORY);
    }
  }

  async getLastAudit() {
    const history = await this.loadHistory();
    const audits = Array.isArray(history.audits) ? history.audits : [];
    return audits.length ? audits[audits.length - 1] : null;
  }

  async clearSessionState() {
    const memory = await this.loadMemory();
    memory.state = {
      ...DEFAULT_INDEX.state,
      last_audit_at: new Date().toISOString(),
      last_run_status: "cleared"
    };
    await atomicWriteYaml(this.indexFile, memory);
    return memory.state;
  }
}

export const memoryManager = new MemoryManager();
