export const loadSkills = async () => {
  return {
    file_reader: (await import("../skills/file-reader/file_reader.js")).fileReader,
    security_scanner: (await import("../skills/security-scan/security_scanner.js")).securityScan,
    logic_scanner: (await import("../skills/logic-scanner/logic_scanner.js")).logicScan,
    performance_scanner: (await import("../skills/performance-scanner/performance_scanner.js")).performanceScan,
    ui_skeleton_generator: (await import("../skills/ui-skeleton-generator/ui_skeleton_generator.js")).uiSkeletonGenerator,
    report_generator: (await import("../skills/report-generator/report_generator.js")).generateReport,
    git_manager: (await import("../skills/git-manager/git_manager.js")).gitManager
  };
};
