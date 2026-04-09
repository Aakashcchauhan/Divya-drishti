import { loadYaml } from "../utils/yaml.js";
import { loadSkills } from "./loader.js";
import { runPipeline } from "./pipeline.js";
import { log } from "../utils/logger.js";

export const runEngine = async (repoPath) => {
  // Using the path where the agent.yaml exists in your workspace
  const config = loadYaml("./agent/agent.yaml");
  const skills = await loadSkills();

  log("Starting audit...");

  const result = await runPipeline(config, skills, repoPath);

  log("Audit completed");

  return result;
};
