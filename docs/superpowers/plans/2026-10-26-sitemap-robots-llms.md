# Sitemap, Robots.txt, and LLMs.txt Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a search engine and LLM discovery suite consisting of `sitemap-index.xml`, `robots.txt`, `llms.txt`, and `llms-full.txt` to Paul Hondola's portfolio.

**Architecture:** Integrate `@astrojs/sitemap` with `customPages` for the CV PDF and gemm-bench dashboard, provide a static `public/robots.txt`, and generate standards-compliant `llms.txt` and `llms-full.txt` endpoints at build time pulling from `src/data/*.ts` as the single source of truth. Add full verification assertions to `scripts/check-dist.ts` to ensure zero drift.

**Tech Stack:** Astro 7, `@astrojs/sitemap`, TypeScript, Node.js (`scripts/check-dist.ts`), Prettier, Oxlint.

**Spec:** `docs/superpowers/specs/2026-10-26-sitemap-robots-llms-design.md`

## Global Constraints

- Output must remain 100% static SSG (`dist/`), deployed to GitHub Pages at `https://paulhondola.github.io`.
- Single source of truth: `llms.txt` and `llms-full.txt` must pull from `src/data/*.ts`; no hardcoded duplicated metrics or unsourced claims (`PRODUCT.md` Principle #1).
- EchoCare must be stated as a `private repo` without a fabricated GitHub repository link.
- `https://paulhondola.github.io/gemm-bench/` and `https://paulhondola.github.io/cv/Paul_Hondola_CV.pdf` must be included in `sitemap-0.xml` via `customPages`.
- All quality gates (`npm run check`, `npm run lint`, `npm run format:check`, `npm test`) must pass cleanly.

## Review Focus

- Sitemap XML correctly formats all URLs using canonical `https://paulhondola.github.io` without trailing slash double-slashes.
- `public/robots.txt` points to `sitemap-index.xml` (Astro sitemap default output), not `sitemap.xml`.
- `dist/llms.txt` adheres to `/llmstxt.org` markdown structure: H1 title, summary blockquote, contact/CV, active projects, experience, skills, and link to `/llms-full.txt`.
- `dist/llms-full.txt` preserves complete Problem → Tried → Measured → Decided traces for all 5 projects.
- No `TODO`, `TBD`, or placeholder text in any generated file.

---

### Task 1: Setup `@astrojs/sitemap`, `robots.txt`, and Head Link

**Files:**
- Modify: `package.json:19-26`
- Modify: `astro.config.mjs:1-31`
- Modify: `src/layouts/Layout.astro:32-36`
- Create: `public/robots.txt`
- Modify: `scripts/check-dist.ts:275-283`

**Interfaces:**
- Produces: `dist/sitemap-index.xml`, `dist/sitemap-0.xml`, `dist/robots.txt`, `<link rel="sitemap" ...>` in `dist/index.html`.

- [ ] **Step 1: Write failing assertions in `scripts/check-dist.ts`**

Add checks for sitemap and robots.txt in `scripts/check-dist.ts`:
```ts
// Task: Sitemap & robots.txt
check("sitemap-index exists", existsSync("dist/sitemap-index.xml"));
check("sitemap-0 exists", existsSync("dist/sitemap-0.xml"));
if (existsSync("dist/sitemap-0.xml")) {
  const sitemap0 = readFileSync("dist/sitemap-0.xml", "utf8");
  check("sitemap includes root", sitemap0.includes("https://paulhondola.github.io/"));
  check("sitemap includes cv", sitemap0.includes("https://paulhondola.github.io/cv/Paul_Hondola_CV.pdf"));
  check("sitemap includes gemm-bench", sitemap0.includes("https://paulhondola.github.io/gemm-bench/"));
}
check("layout sitemap link", html.includes('<link rel="sitemap" href="/sitemap-index.xml"'));
check("robots.txt exists", existsSync("dist/robots.txt"));
if (existsSync("dist/robots.txt")) {
  const robots = readFileSync("dist/robots.txt", "utf8");
  check("robots user-agent", robots.includes("User-agent: *"));
  check("robots allow", robots.includes("Allow: /"));
  check("robots sitemap", robots.includes("Sitemap: https://paulhondola.github.io/sitemap-index.xml"));
}
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node scripts/check-dist.ts`
Expected: FAIL with `sitemap-index exists`, `robots.txt exists`, etc.

- [ ] **Step 3: Install `@astrojs/sitemap` and update configuration**

Run: `npm install @astrojs/sitemap`
Update `astro.config.mjs` to import `sitemap` from `@astrojs/sitemap` and register under `integrations`:
```ts
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://paulhondola.github.io",
  integrations: [
    sitemap({
      customPages: [
        "https://paulhondola.github.io/cv/Paul_Hondola_CV.pdf",
        "https://paulhondola.github.io/gemm-bench/",
      ],
    }),
  ],
  // ... existing fonts and vite config
});
```

- [ ] **Step 4: Create `public/robots.txt` and add link to `src/layouts/Layout.astro`**

Create `public/robots.txt`:
```txt
User-agent: *
Allow: /

Sitemap: https://paulhondola.github.io/sitemap-index.xml
```

In `src/layouts/Layout.astro`, add in `<head>`:
```html
<link rel="sitemap" href="/sitemap-index.xml" />
```

- [ ] **Step 5: Run tests and verify they pass**

Run: `npm test`
Expected: PASS with all sitemap and robots assertions passing.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json astro.config.mjs src/layouts/Layout.astro public/robots.txt scripts/check-dist.ts
git commit -m "feat: add @astrojs/sitemap integration and robots.txt"
```

---

### Task 2: Implement LLMs Generator and Endpoints (`llms.txt`, `llms-full.txt`)

**Files:**
- Create: `src/utils/llms.ts`
- Create: `src/pages/llms.txt.ts`
- Create: `src/pages/llms-full.txt.ts`

**Interfaces:**
- Consumes: `src/data/site.ts`, `src/data/hero.ts`, `src/data/projects.ts`, `src/data/experiences.ts`, `src/data/skills.ts`.
- Produces: `generateLlmsTxt(): string` and `generateLlmsFullTxt(): string` in `src/utils/llms.ts`, and endpoints `/llms.txt` and `/llms-full.txt`.

- [ ] **Step 1: Create `src/utils/llms.ts` generator functions**

Implement `generateLlmsTxt(): string` and `generateLlmsFullTxt(): string` exporting markdown adhering to `https://llmstxt.org`:
1. `generateLlmsTxt()`:
   - Header: `# Paul Hondola`
   - Blockquote: `> From metal to cloud: Backend, cloud, and systems/performance engineer (Computer Engineering @ UPT, graduating Jul 2027).`
   - Key info: CV (`https://paulhondola.github.io/cv/Paul_Hondola_CV.pdf`), Email (`paulhondola@gmail.com`), GitHub, LinkedIn, Availability (`open to full-time · from Jul 2027`).
   - `## Projects`: iterates `projects` from `src/data/projects.ts`, outputting title, description (`project.what`), headline numbers, and links (for EchoCare: explicitly `(private repo)`).
   - `## Experience`: iterates `experiences` from `src/data/experiences.ts` with company, role, dates, and summary.
   - `## Stack`: iterates `skillCategories` from `src/data/skills.ts`.
   - `## Full Details`: link to `https://paulhondola.github.io/llms-full.txt`.
2. `generateLlmsFullTxt()`:
   - Includes everything in `llms.txt`.
   - Adds full `trace` for each project:
     - `### [Project Name]`
     - `**Problem**: ...`
     - `**Tried**: ...`
     - `**Measured**: ...`
     - `**Decided**: ...`
   - Adds full benchmark/stats details from `project.stats` and `project.metrics`.
   - Adds `## Archive Projects` from `archiveProjects` in `src/data/projects.ts`.
   - Adds full Education & background details.

- [ ] **Step 2: Create endpoints `src/pages/llms.txt.ts` and `src/pages/llms-full.txt.ts`**

`src/pages/llms.txt.ts`:
```ts
import type { APIRoute } from "astro";
import { generateLlmsTxt } from "../utils/llms";

export const prerender = true;

export const GET: APIRoute = () => {
  return new Response(generateLlmsTxt(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
```

`src/pages/llms-full.txt.ts`:
```ts
import type { APIRoute } from "astro";
import { generateLlmsFullTxt } from "../utils/llms";

export const prerender = true;

export const GET: APIRoute = () => {
  return new Response(generateLlmsFullTxt(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
```

- [ ] **Step 3: Build to verify compilation and static generation**

Run: `npm run build`
Expected: Output includes `dist/llms.txt` and `dist/llms-full.txt`.

- [ ] **Step 4: Commit**

```bash
git add src/utils/llms.ts src/pages/llms.txt.ts src/pages/llms-full.txt.ts
git commit -m "feat: add build-time llms.txt and llms-full.txt endpoints"
```

---

### Task 3: Verification Suite Assertions, Documentation & CI Checks

**Files:**
- Modify: `scripts/check-dist.ts`
- Modify: `PRODUCT.md:29-35`

**Interfaces:**
- Consumes: `dist/llms.txt`, `dist/llms-full.txt`.
- Produces: Complete passing test suite with zero warnings.

- [ ] **Step 1: Add comprehensive `llms.txt` and `llms-full.txt` assertions to `scripts/check-dist.ts`**

In `scripts/check-dist.ts`:
```ts
// Task: LLMs discovery
check("llms.txt exists", existsSync("dist/llms.txt"));
check("llms-full.txt exists", existsSync("dist/llms-full.txt"));

if (existsSync("dist/llms.txt") && existsSync("dist/llms-full.txt")) {
  const llms = readFileSync("dist/llms.txt", "utf8");
  const llmsFull = readFileSync("dist/llms-full.txt", "utf8");

  check("llms title", llms.includes("# Paul Hondola"));
  check("llms headline", llms.includes("From metal to cloud"));
  check("llms full link", llms.includes("https://paulhondola.github.io/llms-full.txt"));
  check("llms cv link", llms.includes("https://paulhondola.github.io/cv/Paul_Hondola_CV.pdf"));
  check("llms projects", ["Groundly", "EchoCare", "gemm-bench", "Vibecodium"].every((p) => llms.includes(p)));
  check("llms echocare private", llms.includes("private repo") && !llms.includes("github.com/paulhondola/EchoCare"));

  // Full traces in llms-full.txt
  check("llms-full traces", ["Problem", "Tried", "Measured", "Decided"].every((t) => llmsFull.includes(t)));
  check("llms-full numbers", ["648 GFLOPS", "187", "1,193", "6.51×"].every((n) => llmsFull.includes(n)));
  check("llms-full archive", ["Smart Shopping Assistant", "ArchLens", "AtomC", "DMM"].every((a) => llmsFull.includes(a)));
  check("llms no placeholders", !/placeholder|lorem|TODO|TBD/i.test(llms) && !/placeholder|lorem|TODO|TBD/i.test(llmsFull));
}
```

- [ ] **Step 2: Update `PRODUCT.md` capabilities**

In `PRODUCT.md`, under Capabilities and Constraints:
Update single long page capabilities to document discoverability:
`- **Single long page.** No case-study pages, blog, CMS, analytics, i18n, or contact form.`
`- **Machine and search discoverable.** Sitemap index (`/sitemap-index.xml`), `robots.txt`, and standards-compliant `llms.txt` & `llms-full.txt` generated from data models.`

- [ ] **Step 3: Run full verification suite**

Run:
```bash
npm run check
npm run lint
npm run format:check
npm test
```
Expected: All commands exit with code 0.

- [ ] **Step 4: Commit**

```bash
git add scripts/check-dist.ts PRODUCT.md
git commit -m "test: assert on sitemap, robots, and llms endpoints in check-dist"
```
