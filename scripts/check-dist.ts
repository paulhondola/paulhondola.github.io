// Asserts on the built page. Run with `npm test` (builds first).
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
// Fonts are self-hosted by Astro: no render-blocking Google stylesheet.
check("fonts self-hosted", !html.includes("fonts.googleapis.com"));
check(
  "fonts preloaded",
  /<link rel="preload" href="[^"]+" as="font"/.test(html),
);
check(
  "font families",
  html.includes("Space Grotesk") && html.includes("JetBrains Mono"),
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

// Task 3: hero (From metal to cloud) + ladder
const section = (id: string) => {
  const start = html.indexOf(`id="${id}"`);
  return html.slice(start, html.indexOf("</section>", start));
};
const hero = section("hero");
check("hero headline", text.includes("From metal to cloud."));
check(
  "hero sub",
  text.includes(
    "I like building complex things, and I like taking them apart even more: to find where they're slow and put them back together better.",
  ),
);
check(
  "runtime series",
  ["2h 30", "1h 30", "15 min", "8 min"].every((v) => text.includes(v)),
);
check("speedup", text.includes("~18×"));
check(
  "ladder",
  ["metal", "binaries", "parallel", "data", "retrieval", "cloud"].every((l) =>
    hero.includes(`>${l}<`),
  ) &&
    [
      "648 GFLOPS",
      "5 formats",
      "6.8×",
      "~18×",
      "&gt;16 GB → 5.05 GB",
      "staging + prod",
    ].every((v) => hero.includes(v)),
);
check("no readouts", !html.includes('aria-label="Key numbers"'));
check(
  "runtime in experience",
  section("experience").includes("2h 30") && !hero.includes("2h 30"),
);
check(
  "meta description",
  html.includes(
    'name="description" content="From metal to cloud: I build complex systems, then take them apart to make them better. Computer Engineering at UPT, open to full-time roles from Jul 2027."',
  ),
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

// Hero and project cards: graphs | app, tiles, collapsible trace
const work = section("work");
check("details per card", (work.match(/<details/g) ?? []).length === 5);
check(
  "what lines",
  [
    "Local-first MCP RAG server for learning progress",
    "Large-scale agentic monitoring for seniors living alone",
    "An Apple Silicon-first, hand-tuned GEMM benchmark across CPU, AMX and GPU",
    "Real-time collaborative IDE · 1st place, iTEC 2026 (web dev)",
    "2D convolution on images up to 16800×12600 px, five execution models",
  ].every((w) => text.includes(w)),
);
check("no tests count", !/\b194\b/.test(text));
check(
  "six runtimes",
  text.includes("sandboxed in 6 runtimes") &&
    text.includes("Python, Node, Bun, C++, Rust, Go") &&
    !text.includes("6 languages"),
);
check(
  "tiles",
  [
    "17% → 60%",
    "71% vs 67%",
    "0.73 h",
    "ElevenLabs voice",
    "every 15 min",
    "instantly",
    "3,538",
    "82%",
    "+22%",
    "4,721",
    "Yjs CRDT",
    "99 / 233",
  ].every((v) => text.includes(v)),
);
check(
  "gemm graphs",
  ["0.525", "92.8", "1,897", "2,318", "2,886"].every((v) => work.includes(v)),
);
check(
  "log bars",
  work.includes("width: 18.0%") && work.includes("left: 97.3%"),
);
check(
  "mpi scaling",
  ["1.82×", "3.52×", "6.51×", "91%", "88%", "81%", "8 × 1 thread"].every((v) =>
    work.includes(v),
  ),
);
// 679 GFLOPS was a 10-thread run (8 P + 2 E cores) against the 8 P-core
// peak. The site states the 8 P-core run: 648 GFLOPS, 83% of that peak.
check(
  "gemm on 8 P-cores",
  !text.includes("679") &&
    !text.includes("87%") &&
    html.includes(
      "648 GFLOPS f32 · 83% of the M1 Pro&#39;s 8 P-core NEON peak",
    ) &&
    work.includes("width: 95.3%") &&
    text.includes("~1,200× from naive to tuned"),
);
check(
  "retracted numbers gone",
  !text.includes("15.0 h") &&
    !text.includes("71% vs 60%") &&
    !text.includes("same matrix") &&
    !text.includes("beating the GPU"),
);
check(
  "flow",
  text.includes("AI agent calls the senior") &&
    text.includes("DAS dispatcher takes the call"),
);
check("old chart png gone", !html.includes("image_processing_bench"));
check("no empty alt", !/<img [^>]*alt=""/.test(html));
check(
  "full-size image links",
  (
    work.match(
      /<a [^>]*href="\/_astro\/[^"]+"[^>]*>\s*<img [^>]*alt="[^"]+"/g,
    ) ?? []
  ).length === 4,
);

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

// Groundly: local index pipeline, one-file bundle, import flow
check(
  "groundly local index",
  ["187", "1,193", "bge-m3", "13 MB"].every((v) => work.includes(v)),
);
check(
  "groundly bundle",
  ["42 MB", "16 MB", "apd exports in 5 s"].every((v) => work.includes(v)) &&
    ["61.9", "38.1", "23.8", "14.3"].every((w) =>
      work.includes(`width: ${w}%`),
    ),
);
check(
  "groundly import",
  [
    "manifest validated",
    "zip-slip-safe extraction",
    "embedding pin checked, re-embed on mismatch",
    "fresh progress.db",
  ].every((v) => text.includes(v)),
);

// Final review fixes
check(
  "own favicon",
  readFileSync("dist/favicon.svg", "utf8").includes("#5cf2a6") &&
    !html.includes("favicon.ico"),
);
check("vibecodium claim backed", !text.includes("Every run gets its own"));
check(
  "numbers as the CV states them",
  html.includes("&gt;16 GB → 5.05 GB") && !/[^~]18×/.test(text),
);

if (fails.length) {
  console.error("FAIL:\n  " + fails.join("\n  "));
  process.exit(1);
}
console.log("check-dist: all passed");
