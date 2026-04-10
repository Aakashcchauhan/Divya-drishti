import fs from "fs-extra";
import yaml from "js-yaml";
import path from "path";

// -------------------------
// SAFE YAML LOADER
// -------------------------
export const loadYaml = async (filePath, options = {}) => {
  const {
    fallback = null,
    validate = null, // function to validate schema
    required = true
  } = options;

  try {
    const resolvedPath = path.resolve(filePath);

    // Check existence
    const exists = await fs.pathExists(resolvedPath);
    if (!exists) {
      if (required) {
        throw new Error(`YAML file not found: ${resolvedPath}`);
      }
      return fallback;
    }

    // Read file
    const fileContent = await fs.readFile(resolvedPath, "utf8");

    // Parse YAML safely
    const data = yaml.load(fileContent, {
      schema: yaml.FAILSAFE_SCHEMA
    });

    // Validate if validator provided
    if (validate && typeof validate === "function") {
      const isValid = validate(data);
      if (!isValid) {
        throw new Error(`YAML validation failed for: ${resolvedPath}`);
      }
    }

    return data;

  } catch (err) {
    console.error(`[YAML ERROR] ${err.message}`);

    if (required) {
      throw err;
    }

    return fallback;
  }
};

// -------------------------
// SYNC VERSION (FAST PATH)
// -------------------------
export const loadYamlSync = (filePath, options = {}) => {
  const {
    fallback = null,
    validate = null,
    required = true
  } = options;

  try {
    const resolvedPath = path.resolve(filePath);

    if (!fs.existsSync(resolvedPath)) {
      if (required) {
        throw new Error(`YAML file not found: ${resolvedPath}`);
      }
      return fallback;
    }

    const fileContent = fs.readFileSync(resolvedPath, "utf8");

    const data = yaml.load(fileContent, {
      schema: yaml.FAILSAFE_SCHEMA
    });

    if (validate && typeof validate === "function") {
      if (!validate(data)) {
        throw new Error(`YAML validation failed for: ${resolvedPath}`);
      }
    }

    return data;

  } catch (err) {
    console.error(`[YAML ERROR] ${err.message}`);

    if (required) throw err;

    return fallback;
  }
};