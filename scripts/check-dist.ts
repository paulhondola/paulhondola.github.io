// Asserts on the built page. Run with `bun run test` (builds first).
import { readFileSync, readdirSync, existsSync } from "node:fs";

const html = readFileSync("dist/index.html", "utf8");
const css = readdirSync("dist/_astro")
  .filter((f) => f.endsWith(".css"))
  .map((f) => readFileSync(`dist/_astro/${f}`, "utf8"))
  .join("\n");
const text = html.replace(/<[^>]+>/g, " ");
const fails: string[] = [];
const check = (name: string, ok: boolean) => {
  if (!ok) fails.push(name);
};

// Task 1: foundation
check(
  "title",
  html.includes("<title>Paul Hondola: Backend &amp; Cloud Engineer</title>") ||
    html.includes("<title>Paul Hondola: Backend & Cloud Engineer</title>"),
);
check(
  "og:image",
  /property="og:image" content="https:\/\/paulhondola\.github\.io\/_astro\/[^"]+\.jpg"/.test(
    html,
  ),
);
check("twitter card", html.includes('content="summary_large_image"'));
check(
  "fonts",
  html.includes("Space+Grotesk") && html.includes("JetBrains+Mono"),
);
check("signal token", css.includes("#5cf2a6"));
check("no-js-hiding", !css.includes("[data-reveal]"));
check("no inter", !html.includes("family=Inter"));
check("no gemm-bench shadow", !existsSync("dist/gemm-bench"));
check("no placeholders", !/placeholder|lorem|TODO/i.test(text));

// Task 2: nav
check(
  "nav links",
  ["#work", "#experience", "#stack", "#contact"].every((h) =>
    html.includes(`href="${h}"`),
  ),
);
check("cv link", html.includes('href="/cv/Paul_Hondola_CV.pdf"'));
check("availability", text.includes("open to full-time · from Jul 2027"));
check("no react", !html.includes("astro-island"));

if (fails.length) {
  console.error("FAIL:\n  " + fails.join("\n  "));
  process.exit(1);
}
console.log("check-dist: all passed");
