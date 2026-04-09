export const runPipeline = async (config, skills, inputPath) => {
  let context = {
    files: [],
    findings: []
  };

  for (const step of config.execution.pipeline) {
    const skill = skills[step];

    if (!skill) continue;

    if (step === "file_reader") {
      context.files = await skill(inputPath);
    }

    else if (step.includes("scanner")) {
      for (const file of context.files) {
        const results = await skill(file.content, file.path);
        context.findings.push(...results);
      }
    }

    else if (step === "report_generator") {
      context.report = skill(context.findings, "markdown");
    }

    else if (step === "git_manager") {
      await skill(context.report);
    }
  }

  return context;
};
