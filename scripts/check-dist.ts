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
// `text-base` is a Tailwind font-size class; a `base` colour token hijacks it.
check("no base colour token", !css.includes("--color-base"));
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

// Task 3: hero + readouts
check(
  "hero headline",
  text.includes("Backend &amp; cloud engineer who profiles first.") ||
    text.includes("Backend & cloud engineer who profiles first."),
);
check(
  "hero sub",
  text.includes(
    "I take systems apart, measure where the time goes, and put them back together faster.",
  ),
);
check(
  "runtime series",
  ["2h 30", "1h 30", "15 min", "8 min"].every((v) => text.includes(v)),
);
check("speedup", text.includes("~18×"));
check(
  "readouts",
  ["5.05 GB", "679 GFLOPS", "194"].every((v) => text.includes(v)),
);
check("meta line", text.includes("GPA 9.72/10"));
check("cta", (html.match(/href="#work"/g) ?? []).length >= 3);

// Task 4: work
check("five cards", (html.match(/data-project/g) ?? []).length === 5);
check(
  "trace labels",
  ["problem", "tried", "measured", "decided"].every(
    (w) => (text.match(new RegExp(`\\b${w}\\b`, "g")) ?? []).length >= 5,
  ),
);
check(
  "echocare private",
  text.includes("private repo") &&
    !html.includes("github.com/paulhondola/EchoCare"),
);
check(
  "gemm dashboard",
  html.includes('href="https://paulhondola.github.io/gemm-bench/"'),
);
check(
  "archive",
  ["Smart Shopping Assistant", "ArchLens", "AtomC", "DMM"].every((v) =>
    text.includes(v),
  ),
);
check(
  "external links",
  (html.match(/<a [^>]*href="https:\/\/[^"]*"[^>]*>/g) ?? []).every(
    (a) => a.includes('target="_blank"') && a.includes('rel="noopener"'),
  ),
);
check("optimized images", !html.includes('src="/projects/'));

// Task 5: experience, stack, about, contact
check(
  "sections",
  ["experience", "stack", "about", "contact"].every((id) =>
    html.includes(`id="${id}"`),
  ),
);
check("nokia", text.includes("~90-file") && text.includes("prod-vs-dev"));
check("bitdefender", text.includes("Frida"));
check("skills", text.includes("Rayon") && text.includes("DuckDB"));
check(
  "education",
  (text.includes("Universitatea Politehnica Timișoara") ||
    text.includes("UPT")) &&
    text.includes("Jul 2027"),
);
check(
  "links",
  html.includes('href="mailto:paulhondola@gmail.com"') &&
    html.includes("linkedin.com/in/paulhondola") &&
    html.includes('github.com/paulhondola"'),
);
check("photo optimized", !html.includes('src="/photo/paul.png"'));

if (fails.length) {
  console.error("FAIL:\n  " + fails.join("\n  "));
  process.exit(1);
}
console.log("check-dist: all passed");
