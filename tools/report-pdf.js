import fs from "fs-extra";
import path from "path";
import { marked } from "marked";
import puppeteer from "puppeteer";

const WINDOWS_BROWSER_PATHS = [
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe"
];

const launchBrowser = async () => {
  const launchOptions = {
    headless: true,
    protocolTimeout: 600000,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  };

  try {
    return await puppeteer.launch(launchOptions);
  } catch (bundledError) {
    for (const candidate of WINDOWS_BROWSER_PATHS) {
      if (await fs.pathExists(candidate)) {
        try {
          return await puppeteer.launch({
            ...launchOptions,
            executablePath: candidate
          });
        } catch {
          // Try next candidate.
        }
      }
    }

    throw bundledError;
  }
};

const wrapHtml = (reportMarkdown) => {
  const content = marked.parse(reportMarkdown || "No report content available.");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Divya Drishti Audit Report</title>
  <style>
    :root {
      --bg: #f5f1ea;
      --paper: #fffdf9;
      --ink: #1f1a17;
      --muted: #6b5f55;
      --accent: #0f766e;
      --rule: #e4d9cc;
      --code-bg: #f2eee7;
    }

    * { box-sizing: border-box; }

    body {
      margin: 0;
      font-family: "Georgia", "Times New Roman", serif;
      color: var(--ink);
      background:
        radial-gradient(circle at 10% 0%, #fff3df 0, transparent 30%),
        radial-gradient(circle at 100% 10%, #e6f4f1 0, transparent 35%),
        var(--bg);
      line-height: 1.65;
    }

    .page {
      width: 100%;
      max-width: 980px;
      margin: 38px auto;
      background: var(--paper);
      border: 1px solid var(--rule);
      border-radius: 18px;
      box-shadow: 0 18px 45px rgba(28, 22, 15, 0.11);
      overflow: hidden;
    }

    .hero {
      padding: 30px 40px 24px;
      border-bottom: 1px solid var(--rule);
      background: linear-gradient(120deg, #fff7eb, #ebf8f6);
    }

    .hero h1 {
      margin: 0;
      font-size: 34px;
      letter-spacing: 0.2px;
    }

    .hero p {
      margin: 8px 0 0;
      color: var(--muted);
      font-family: "Segoe UI", system-ui, sans-serif;
      font-size: 14px;
    }

    .content {
      padding: 28px 40px 36px;
    }

    h1, h2, h3 {
      color: var(--ink);
      line-height: 1.25;
      page-break-after: avoid;
    }

    h1 { font-size: 30px; margin-top: 14px; }
    h2 {
      margin-top: 28px;
      padding-bottom: 6px;
      border-bottom: 1px solid var(--rule);
      font-size: 22px;
    }
    h3 { margin-top: 22px; font-size: 18px; }

    p, li {
      font-size: 14px;
      font-family: "Segoe UI", system-ui, sans-serif;
      color: #2c2621;
    }

    ul { padding-left: 20px; }

    table {
      width: 100%;
      border-collapse: collapse;
      margin: 16px 0 20px;
      font-family: "Segoe UI", system-ui, sans-serif;
      font-size: 13px;
    }

    th, td {
      border: 1px solid var(--rule);
      padding: 9px 10px;
      text-align: left;
      vertical-align: top;
    }

    th {
      background: #f7f3ec;
      color: #302821;
      font-weight: 600;
    }

    tr:nth-child(even) td { background: #fffaf3; }

    code {
      font-family: "Consolas", "Courier New", monospace;
      background: var(--code-bg);
      padding: 2px 6px;
      border-radius: 5px;
      font-size: 12px;
    }

    pre {
      background: #f7f2ea;
      border: 1px solid var(--rule);
      border-radius: 10px;
      padding: 14px;
      overflow-x: auto;
    }

    blockquote {
      border-left: 4px solid var(--accent);
      margin: 16px 0;
      padding: 4px 0 4px 12px;
      color: #4b4138;
      background: #f6fbfa;
    }

    .footer {
      padding: 14px 40px 24px;
      color: var(--muted);
      border-top: 1px solid var(--rule);
      font-family: "Segoe UI", system-ui, sans-serif;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <main class="page">
    <section class="hero">
      <h1>Divya Drishti Audit Report</h1>
      <p>Generated on ${new Date().toLocaleString()}</p>
    </section>
    <section class="content">
      ${content}
    </section>
    <footer class="footer">
      Styled and exported with Puppeteer.
    </footer>
  </main>
</body>
</html>`;
};

export const exportReportPdf = async (
  reportMarkdown,
  outputPath = "./memory/audit_report.pdf"
) => {
  const absoluteOutputPath = path.resolve(outputPath);
  await fs.ensureDir(path.dirname(absoluteOutputPath));

  const browser = await launchBrowser();

  try {
    const page = await browser.newPage();
    const html = wrapHtml(reportMarkdown);

    await page.setContent(html, {
      waitUntil: "domcontentloaded",
      timeout: 0
    });

    await page.pdf({
      path: absoluteOutputPath,
      format: "A4",
      timeout: 0,
      printBackground: true,
      margin: {
        top: "16mm",
        right: "12mm",
        bottom: "16mm",
        left: "12mm"
      }
    });

    return absoluteOutputPath;
  } finally {
    await browser.close();
  }
};