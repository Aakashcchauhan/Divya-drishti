import fs from "fs-extra";
import path from "path";

// -------------------------
// CONFIG
// -------------------------
const LOG_DIR = path.resolve("./logs");
const LOG_FILE = path.join(LOG_DIR, "app.log");

const LEVELS = {
  INFO: "INFO",
  WARN: "WARN",
  ERROR: "ERROR",
  DEBUG: "DEBUG"
};

// ANSI Colors (for CLI)
const COLORS = {
  INFO: "\x1b[36m",   // cyan
  WARN: "\x1b[33m",   // yellow
  ERROR: "\x1b[31m",  // red
  DEBUG: "\x1b[35m",  // magenta
  RESET: "\x1b[0m"
};

// -------------------------
// INIT
// -------------------------
export const initLogger = async () => {
  await fs.ensureDir(LOG_DIR);
};

// -------------------------
// FORMATTER
// -------------------------
const formatMessage = (level, message, context = {}) => {
  const timestamp = new Date().toISOString();

  return {
    timestamp,
    level,
    message,
    context
  };
};

// -------------------------
// WRITE TO FILE
// -------------------------
const writeToFile = async (logObj) => {
  const logLine = JSON.stringify(logObj) + "\n";
  await fs.appendFile(LOG_FILE, logLine);
};

// -------------------------
// CORE LOGGER
// -------------------------
const logger = async (level, message, context = {}) => {
  const logObj = formatMessage(level, message, context);

  // Console Output (colored)
  const color = COLORS[level] || "";
  console.log(
    `${color}[${logObj.timestamp}] [${level}] ${message}${COLORS.RESET}`
  );

  // File Output (JSON structured)
  await writeToFile(logObj);
};

// -------------------------
// PUBLIC METHODS
// -------------------------
export const log = (msg, ctx) => logger(LEVELS.INFO, msg, ctx);

export const warn = (msg, ctx) => logger(LEVELS.WARN, msg, ctx);

export const error = (msg, ctx) => logger(LEVELS.ERROR, msg, ctx);

export const debug = (msg, ctx) => logger(LEVELS.DEBUG, msg, ctx);