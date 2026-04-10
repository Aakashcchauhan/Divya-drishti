export const uiSkeletonGenerator = async (files, performanceFindings = []) => {
  const skeletons = [];

  const slowFiles = new Set(
    performanceFindings
      .filter((finding) => String(finding.category || "").toLowerCase() === "performance")
      .map((finding) => finding.file)
  );

  for (const file of files) {
    const { content, path } = file;

    if (!/\.(html|jsx|tsx|vue)$/i.test(path)) {
      continue;
    }

    const patterns = {
      images: /<img|<Image/gi,
      text: /<(p|h[1-6]|span|label)/gi,
      buttons: /<button|onClick=/gi,
      containers: /<(div|section|main|article)/gi,
      inputs: /<input|<textarea|<select/gi
    };

    const components = {
      images: (content.match(patterns.images) || []).length,
      text: (content.match(patterns.text) || []).length,
      buttons: (content.match(patterns.buttons) || []).length,
      containers: (content.match(patterns.containers) || []).length,
      inputs: (content.match(patterns.inputs) || []).length
    };

    const hasUI = Object.values(components).some((count) => count > 0);
    if (!hasUI) {
      continue;
    }

    const layoutType =
      components.containers > 10 ? "complex-grid" :
      components.containers > 5 ? "grid" :
      "simple";

    const priority = slowFiles.has(path) ? "high" : "normal";

    skeletons.push({
      file: path,
      priority,
      layout: layoutType,
      components,
      recommendation:
        priority === "high"
          ? "Apply skeleton immediately to improve perceived performance."
          : "Optional enhancement for better UX."
    });
  }

  return skeletons;
};
