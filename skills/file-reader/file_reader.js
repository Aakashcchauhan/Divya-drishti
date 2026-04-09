import { glob } from "glob";
import fs from "fs-extra";
import path from "path";
import os from "os";
import pLimit from "p-limit";
import ignore from "ignore";

const DEFAULT_EXTENSIONS = [
  "js", "jsx", "ts", "tsx",
  "json", "py", "java", "go", "rs"
];

const DEFAULT_IGNORE_DIRS = [
  "node_modules",
  ".git",
  "dist",
  "build",
  "coverage",
  "vendor"
];

const MAX_FILE_SIZE = 1024 * 1024; // 1MB
const CONCURRENCY = Math.max(4, os.cpus().length);
const READ_TIMEOUT = 5000; // ms

// -------------------------
// Load .gitignore rules
// -------------------------
const loadGitignore = async (dir) => {
  const ig = ignore();

  try {
    const gitignorePath = path.join(dir, ".gitignore");
    if (await fs.pathExists(gitignorePath)) {
      const content = await fs.readFile(gitignorePath, "utf8");
      ig.add(content);
    }
  } catch {}

  return ig;
};

// -------------------------
// Binary Detection (basic)
// -------------------------
const isBinary = (content) => {
  return content.includes("\u0000");
};

// -------------------------
// Safe File Read with Timeout
// -------------------------
const readFileWithTimeout = async (file) => {
  return Promise.race([
    fs.readFile(file, "utf8"),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Read timeout")), READ_TIMEOUT)
    )
  ]);
};

// -------------------------
// Chunk Reader (for large files)
// -------------------------
const readFileChunk = async (file, size = 4096) => {
  const fd = await fs.open(file, "r");
  const buffer = Buffer.alloc(size);
  await fs.read(fd, buffer, 0, size, 0);
  await fs.close(fd);
  return buffer.toString("utf8");
};

// -------------------------
// Main Reader
// -------------------------
export const fileReader = async (dir, options = {}) => {
  const {
    extensions = DEFAULT_EXTENSIONS,
    maxSize = MAX_FILE_SIZE,
    includeMetadata = true,
    useGitignore = true
  } = options;

  const pattern = `${dir}/**/*.{${extensions.join(",")}}`;

  const ignorePatterns = DEFAULT_IGNORE_DIRS.map(d => `**/${d}/**`);

  const limiter = pLimit(CONCURRENCY);

  const ig = useGitignore ? await loadGitignore(dir) : null;

  let files = [];

  try {
    files = await glob(pattern, {
      ignore: ignorePatterns,
      nodir: true
    });
  } catch (err) {
    throw new Error(`File discovery failed: ${err.message}`);
  }

  const results = [];

  await Promise.all(
    files.map(file =>
      limiter(async () => {
        try {
          const relativePath = path.relative(dir, file);

          if (ig && ig.ignores(relativePath)) return;

          const stats = await fs.stat(file);

          if (!stats.isFile()) return;

          // Large file handling
          if (stats.size > maxSize) {
            const preview = await readFileChunk(file);

            results.push({
              path: relativePath,
              skipped: true,
              reason: "File too large",
              preview
            });

            return;
          }

          const content = await readFileWithTimeout(file);

          // Binary detection
          if (isBinary(content)) {
            results.push({
              path: relativePath,
              skipped: true,
              reason: "Binary file"
            });
            return;
          }

          const fileData = {
            path: relativePath,
            content
          };

          if (includeMetadata) {
            fileData.metadata = {
              size: stats.size,
              extension: path.extname(file),
              modifiedAt: stats.mtime,
              createdAt: stats.ctime
            };
          }

          results.push(fileData);

        } catch (err) {
          results.push({
            path: file,
            error: true,
            type: err.name,
            message: err.message
          });
        }
      })
    )
  );

  return results;
};