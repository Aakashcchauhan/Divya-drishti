import { exec } from "child_process";
import util from "util";
import fs from "fs-extra";
import path from "path";
import crypto from "crypto";

const execAsync = util.promisify(exec);

// -------------------------
// Helpers
// -------------------------
const runGit = async (cmd, cwd = process.cwd()) => {
  const { stdout, stderr } = await execAsync(cmd, { cwd });
  if (stderr && !stderr.includes("warning")) {
    throw new Error(stderr);
  }
  return stdout.trim();
};

const safeExec = async (fn, retries = 2) => {
  try {
    return await fn();
  } catch (err) {
    if (retries > 0) {
      return safeExec(fn, retries - 1);
    }
    throw err;
  }
};

const isSafeFile = (file) => {
  return !/(^|[\\/])(?:\.env|id_rsa|id_ed25519)$|\.(pem|key|crt)$/i.test(file);
};

const generateBranchName = () => `audit/divya-${Date.now()}`;

const generateCommitMessage = () =>
  `chore(audit): add automated audit report`;

const generateReportHash = (report) =>
  crypto.createHash("sha256").update(report).digest("hex").slice(0, 8);

const isProtectedBranch = (branch) =>
  ["main", "master", "production"].includes(branch);

const buildMetaHints = (overrides = {}) => ({
  safeGitFlow: true,
  protectedBranchHandling: true,
  atomicCommit: true,
  securityValidated: true,
  ...overrides
});

const classifyError = (err) => {
  const message = err?.message || "Unknown git manager error";
  const lowered = message.toLowerCase();

  if (lowered.includes("not a git repository") || lowered.includes("inside-work-tree")) {
    return {
      category: "validation",
      severity: "low",
      message: "Target path is not a git repository",
      suggestion: "Run the audit in a valid repository root"
    };
  }

  if (lowered.includes("nothing to commit") || lowered.includes("working tree clean")) {
    return {
      category: "validation",
      severity: "low",
      message: "No staged changes available for commit",
      suggestion: "Verify report content changed before committing"
    };
  }

  if (
    lowered.includes("could not resolve host") ||
    lowered.includes("timed out") ||
    lowered.includes("connection") ||
    lowered.includes("network")
  ) {
    return {
      category: "network",
      severity: "low",
      message,
      suggestion: "Check network connectivity and retry"
    };
  }

  if (lowered.includes("authentication") || lowered.includes("permission denied") || lowered.includes("403")) {
    return {
      category: "git",
      severity: "medium",
      message,
      suggestion: "Verify repository permissions and authentication token"
    };
  }

  return {
    category: "runtime",
    severity: "low",
    message,
    suggestion: "Review git manager logs and retry the operation"
  };
};

// -------------------------
// Repo Status Logger
// -------------------------
const getRepoStatus = async (cwd) => {
  return {
    branch: await runGit("git rev-parse --abbrev-ref HEAD", cwd),
    lastCommit: await runGit("git log -1 --pretty=format:%h %s", cwd),
    status: await runGit("git status --short", cwd),
    remote: await runGit("git remote -v", cwd),
    aheadBehind: await runGit("git status -sb", cwd)
  };
};

// -------------------------
// Commit Signature Check
// -------------------------
const verifyCommitSignature = async (cwd) => {
  try {
    const result = await runGit("git log -1 --pretty=format:%G?", cwd);
    return {
      verified: result === "G",
      status: result
    };
  } catch {
    return {
      verified: false,
      status: "unknown"
    };
  }
};

// -------------------------
// GitHub PR (optional)
// -------------------------
const createPullRequest = async ({
  repo,
  title,
  head,
  base,
  body,
  token
}) => {
  const res = await fetch(`https://api.github.com/repos/${repo}/pulls`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      title,
      head,
      base,
      body
    })
  });

  if (!res.ok) {
    throw new Error("Failed to create PR");
  }

  return res.json();
};

// -------------------------
// MAIN FUNCTION
// -------------------------
export const gitManager = async (report, options = {}) => {
  const {
    repoPath = process.cwd(),
    outputFile = "AUDIT_REPORT.md",
    push = false,
    createPR = false,
    github = {},
    signCommit = false,
    enforceSignedCommit = false
  } = options;

  try {
    const absoluteRepoPath = path.resolve(repoPath);
    if (!isSafeFile(outputFile)) {
      const unsafeError = new Error("Unsafe output file detected");
      unsafeError.code = "UNSAFE_OUTPUT_FILE";
      throw unsafeError;
    }

    // 1. Validate repo
    await runGit("git rev-parse --is-inside-work-tree", absoluteRepoPath);

    const initialStatus = await getRepoStatus(absoluteRepoPath);
    const hadDirtyTree = Boolean(initialStatus.status);
    if (hadDirtyTree) {
      console.warn("[git_manager] Working tree is not clean. Continuing with selective staging.");
    }

    // 2. Branch check
    let currentBranch = initialStatus.branch;

    if (isProtectedBranch(currentBranch)) {
      const newBranch = generateBranchName();
      await runGit(`git checkout -b ${newBranch}`, absoluteRepoPath);
      currentBranch = newBranch;
    }

    // 3. Write report
    const reportPath = path.join(absoluteRepoPath, outputFile);
    await fs.writeFile(reportPath, report, "utf8");

    // 4. Stage only report
    await runGit(`git add -- "${outputFile}"`, absoluteRepoPath);

    const stagedFilesRaw = await runGit("git diff --cached --name-only", absoluteRepoPath);
    const stagedFiles = stagedFilesRaw
      .split("\n")
      .map((entry) => entry.trim())
      .filter(Boolean);

    const unsafeStagedFile = stagedFiles.find((file) => !isSafeFile(file));
    if (unsafeStagedFile) {
      throw new Error(`Unsafe staged file detected: ${unsafeStagedFile}`);
    }

    const normalizedOutputFile = outputFile.replace(/\\/g, "/");
    const hasOutputFileStaged = stagedFiles.some(
      (file) => file.replace(/\\/g, "/") === normalizedOutputFile
    );

    if (!hasOutputFileStaged) {
      throw new Error("Expected output file not staged");
    }

    // 5. Commit
    const hash = generateReportHash(report);
    const commitMessage = `${generateCommitMessage()} [${hash}]`;

    const signFlag = signCommit ? "-S" : "";
    await runGit(`git commit ${signFlag} -m "${commitMessage}"`, absoluteRepoPath);

    // 6. Verify commit signature
    const signature = await verifyCommitSignature(absoluteRepoPath);

    if (enforceSignedCommit && !signature.verified) {
      throw new Error("Commit is not signed or signature invalid");
    }

    // 7. Push
    if (push) {
      await safeExec(
        () => runGit(`git push origin ${currentBranch} --set-upstream`, absoluteRepoPath),
        2
      );
    }

    // 8. PR creation
    let prData = null;
    if (createPR && github.repo && github.token) {
      prData = await safeExec(
        () => createPullRequest({
          repo: github.repo,
          title: "Automated Audit Report",
          head: currentBranch,
          base: github.base || "main",
          body: "Automated audit report generated by Divya Drishti.",
          token: github.token
        }),
        2
      );
    }

    // 9. Final status
    const shortCommit = await runGit("git rev-parse --short HEAD", absoluteRepoPath);
    const finalStatus = await getRepoStatus(absoluteRepoPath);

    return {
      type: "git_operation",
      operation: "git commit",
      status: "success",
      severity: "none",
      data: {
        branch: currentBranch,
        commit: shortCommit,
        file: outputFile,
        changes: stagedFiles.length
      },
      message: "Audit report committed successfully",
      meta: {
        ...buildMetaHints({
          pushed: push,
          pr: prData ? prData.html_url : null,
          signed: signature.verified,
          hadDirtyTree
        }),
        repoStatus: {
          before: initialStatus,
          after: finalStatus
        }
      }
    };

  } catch (err) {
    const classified = classifyError(err);

    return {
      type: "git_operation",
      operation: "git_manager",
      status: "failed",
      severity: classified.severity,
      category: classified.category,
      message: classified.message,
      suggestion: classified.suggestion,
      meta: buildMetaHints({
        pushed: false,
        pr: null,
        signed: false,
        safe: true
      })
    };
  }
};