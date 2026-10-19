# Portfolio Redesign ("Live Telemetry") Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current template-like portfolio with the single-page "Live Telemetry" design, using the new CV's content, and ship it to `main`.

**Architecture:** Astro static page. Each section is one `.astro` component that reads its content from one file in `src/data/`. Data graphics are SVG rendered at build time. One client module (`src/scripts/motion.ts`) adds GSAP + Lenis on top of fully rendered HTML. A Bun script asserts on the built `dist/index.html` and is the test for every task.

**Tech Stack:** Astro 7, Tailwind 4 (`@theme`), Bun, GSAP 3.15 (core + ScrollTrigger + SplitText), Lenis 1.3, `astro:assets` for images.

**Spec:** `docs/superpowers/specs/2026-10-19-portfolio-redesign-design.md`. Read it first; every copy fact comes from there.

## Global Constraints

- **Colours** (Tailwind `@theme` tokens):
  - `--color-base: #07090c`
  - `--color-surface: #0d1116`
  - `--color-line: #1d252c`
  - `--color-text: #e7ecef`
  - `--color-muted: #7d8a93`
  - `--color-body: #a9b4bb`
  - `--color-signal: #5cf2a6`
- **`signal` green is used only on measured results** (metrics, readout values, the chart line). Never on headlines, buttons or decoration.
- **Fonts:** Space Grotesk (400/600/700) for headlines and body, JetBrains Mono (400/600) for labels, metrics, nav and data. Both from Google Fonts with `display=swap`.
- **Numbers:** every number on the page must appear in the spec. EchoCare tests = `194`. Nokia runtime series = 2 h 30 → 1 h 30 → 15 min → 8 min. Headline speedup = `~18×`.
- **Availability copy:** "open to full-time · from Jul 2027".
- **EchoCare role:** "tech lead across backend, cloud, dashboard and Android". The repo is private: show the label "private repo" and no GitHub link.
- **No placeholders** in shipped HTML. The words "placeholder", "lorem" and "TODO" must not appear as visible content.
- **No React, no Three.js, no other smooth-scroll library.** Lenis is the only scroll engine.
- **All content is in the server-rendered HTML.** JS only animates it. No CSS hides content waiting for JS.
- **Required checks:** `bun run check` and `bun run format:check` must pass (the deploy workflow gates on both).
- **Don't create anything** at `dist/gemm-bench/`; that path belongs to a separate Pages site.
- **Icons:** interface arrows are text glyphs (`↗ ↓ →`), and the brand marks reuse the existing `public/icons/{github,linkedin,mail}.svg`. No icon library is needed. (This simplifies the spec's "Solar via Iconify" line: nothing on the page needs more icons than that.)
- **Images** on the page go through `astro:assets` `<Image>`, never raw `/public` PNGs (`paul.png` is 1.2 MB).

## Review Focus

1. **No JS / script error:** all text, metrics and graphics are visible and in their final state → Task 1's `no-js-hiding` assertion, plus a Task 6 browser check with the script blocked.
2. **Phone width (375 px):** no horizontal scroll; the hero chart and the trace grid stack and scale → a Task 7 browser check: `document.documentElement.scrollWidth <= innerWidth`.
3. **Nav anchors with Lenis and the sticky nav:** clicking `/work` lands with the section heading below the nav, not under it → a Task 6 browser check: the heading's `getBoundingClientRect().top >= nav.offsetHeight`.
4. **`prefers-reduced-motion: reduce`:** Lenis isn't created, and nothing starts from opacity 0 → a Task 6 browser check on `/?reduced-motion`.
5. **Links:** the CV PDF, `mailto:`, external links (`target="_blank" rel="noopener"`), and no EchoCare GitHub link → Task 4 and Task 5 `links` assertions.

---

### Task 1: Foundation: tokens, layout, meta, deps, test harness

**Files:**
- Modify: `src/styles/global.css`: replace everything after `@import "tailwindcss";` with the colour and font tokens, base styles (`body` uses `bg-base text-body font-sans`, headings `text-text`), a `:focus-visible` outline in `signal`, and a `.sr-only`-style skip link. Delete all old animation tokens, keyframes and utilities (`glass-panel`, `text-gradient`, `gradient-orb`, `dot-grid`, `[data-reveal]`, etc.).
- Modify: `src/layouts/Layout.astro`: Google Fonts link for both families. Props `title = "Paul Hondola: Backend & Cloud Engineer"` and `description = "Backend and cloud engineer who profiles first. Computer Engineering at UPT, open to full-time roles from Jul 2027."`. Add `og:title`, `og:description`, `og:type=website`, `og:url` (`Astro.site`), `og:image` = `new URL((await getImage({ src: paul, width: 1200, format: "jpg" })).src, Astro.site).href`, `twitter:card=summary_large_image`, and a skip link to `#main`. Remove the IntersectionObserver script.
- Modify: `src/pages/index.astro`: temporarily render only `<Layout><main id="main"></main></Layout>`. The old components stay on disk, unused, until Tasks 2–5 replace them. Nothing is pushed until Task 7.
- Move: `public/photo/paul.png` → `src/assets/paul.png` (`git mv`).
- Modify: `package.json`: add deps `gsap@^3.15.0` and `lenis@^1.3.27` (`bun add`), and script `"test": "astro build && bun scripts/check-dist.ts"`.
- Create: `scripts/check-dist.ts`: the test harness.

**Interfaces:**
- Produces: `check(name: string, ok: boolean)` assertions inside `scripts/check-dist.ts`. They read `dist/index.html` into `html: string` and the `dist/_astro/*.css` files into `css: string`, and exit 1 with the failing names. Later tasks **append** assertions to this file.
- Produces: Tailwind classes `bg-base bg-surface border-line text-text text-muted text-body text-signal font-sans font-mono`.

- [ ] **Step 1: Write the harness and the failing assertions**

```ts
// scripts/check-dist.ts
import { readFileSync, readdirSync, existsSync } from "node:fs";
const html = readFileSync("dist/index.html", "utf8");
const css = readdirSync("dist/_astro").filter((f) => f.endsWith(".css"))
  .map((f) => readFileSync(`dist/_astro/${f}`, "utf8")).join("\n");
const fails: string[] = [];
const check = (name: string, ok: boolean) => { if (!ok) fails.push(name); };

check("title", html.includes("<title>Paul Hondola: Backend &amp; Cloud Engineer</title>") || html.includes("<title>Paul Hondola: Backend & Cloud Engineer</title>"));
check("og:image", /property="og:image" content="https:\/\/paulhondola\.github\.io\/_astro\/[^"]+\.jpg"/.test(html));
check("twitter card", html.includes('content="summary_large_image"'));
check("fonts", html.includes("Space+Grotesk") && html.includes("JetBrains+Mono"));
check("signal token", css.includes("#5cf2a6"));
check("no-js-hiding", !css.includes("[data-reveal]"));
check("no inter", !html.includes("family=Inter"));
check("no gemm-bench shadow", !existsSync("dist/gemm-bench"));
check("no placeholders", !/placeholder|lorem|TODO/i.test(html.replace(/<[^>]+>/g, " ")));

if (fails.length) { console.error("FAIL:\n  " + fails.join("\n  ")); process.exit(1); }
console.log("check-dist: all passed");
```

- [ ] **Step 2: Run `bun run test`.** Expected: FAIL listing `title`, `og:image`, `twitter card`, `fonts`, `signal token`, `no inter`. (`no-js-hiding` may already pass once the old components are unmounted; that is fine.)
- [ ] **Step 3: Implement the files listed above.**
- [ ] **Step 4: Run `bun run test && bun run check`.** Expected: `check-dist: all passed`, 0 errors.
- [ ] **Step 5: Commit:** `git commit -m "feat: telemetry design tokens, meta tags and dist checks"`

### Task 2: Nav (Astro, no React)

**Files:**
- Create: `src/components/Nav.astro`
- Create: `src/data/site.ts`
- Delete: `src/components/Navbar.tsx`
- Modify: `src/pages/index.astro`, `astro.config.mjs` (drop `react()`), `tsconfig.json` (drop `jsx`/`jsxImportSource`), `package.json` (`bun remove react react-dom @astrojs/react lucide-react`)

**Interfaces:**
- Produces in `src/data/site.ts`:
  - `navLinks: { label: string; href: string }[]` = `/work → #work`, `/experience → #experience`, `/stack → #stack`, `/contact → #contact`
  - `cvHref = "/cv/Paul_Hondola_CV.pdf"`
  - `availability = "open to full-time · from Jul 2027"`
  - `email = "paulhondola@gmail.com"`
  - `socials: { label: "GitHub" | "LinkedIn" | "Email"; href: string }[]`, reusing the hrefs in `src/data/contact.ts`. Delete `contact.ts` once its callers move here in Task 5.
- Produces: `<header data-nav>` sticky at the top. Its height is read by Task 6 for the anchor offset.

- [ ] **Step 1: Append the assertions:**
  - `nav links`: all four `href="#work"`, `#experience`, `#stack`, `#contact` are present
  - `cv link`: `href="/cv/Paul_Hondola_CV.pdf"` is present
  - `availability`: the HTML contains `open to full-time · from Jul 2027`
  - `no react`: `!html.includes("astro-island")`
- [ ] **Step 2: Run `bun run test`.** Expected: FAIL on `nav links`, `cv link` and `availability`.
- [ ] **Step 3: Implement `Nav.astro`.**
  - Left: the mark `paul@hondola` in mono. Centre: the nav links in mono, muted, text on hover. Right: the availability pill (a `●` dot in `signal` is allowed here; it's a status readout) and "CV ↓".
  - Below `md`: a `<details>`/`<summary>` menu, no JS. Clicking a link inside closes it via a one-line inline script that removes `open` on link click.
  - The header is always `bg-base/85 backdrop-blur-sm border-b border-line`, with no scroll-dependent state.
- [ ] **Step 4: Run `bun run test && bun run check`.** Expected: all passed, 0 errors.
- [ ] **Step 5: Commit:** `git commit -m "feat: astro nav, drop react"`

### Task 3: Hero + readouts

**Files:**
- Create: `src/data/hero.ts`
- Create: `src/components/RuntimeChart.astro`
- Create: `src/components/Readouts.astro`
- Rewrite: `src/components/Hero.astro`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Produces in `src/data/hero.ts`:
  - `runtime: { label: string; minutes: number; display: string }[]` = `[{label:"before",minutes:150,display:"2h 30"},{label:"",minutes:90,display:"1h 30"},{label:"",minutes:15,display:"15 min"},{label:"now",minutes:8,display:"8 min"}]`
  - `changes: { from: string; to: string }[]`, 4 entries from the CV: row-by-row pandas → vectorized; sequential fetches → parallel (v2 API params + concurrent exports); two pipelines → one, run every 2 h; prod-vs-dev diff → caught silently dropped legacy entries
  - `readouts: { value: string; label: string }[]` = `18×` "Nokia pipeline" · `16 GB → 5.05 GB` "Groundly peak memory" · `679 GFLOPS` "gemm-bench, 87% of NEON peak" · `194` "EchoCare backend tests"
- Produces: `RuntimeChart.astro` with props `{ points: typeof runtime }`. It renders an `<svg viewBox="0 0 400 220" role="img" aria-labelledby>` with a `<title>` ("Nokia finance pipeline runtime: 2h 30 to 8 min, about 18× faster"), a `<polyline data-draw>` in `signal`, and a `<circle>` and value label per point. Y is linear from 0 to 150 min.
- Produces: the data attributes Task 6 animates: `data-split` on `h1`/`h2`, `data-draw` on SVG strokes, `data-grow` on bars, `data-count` on readout values.

- [ ] **Step 1: Append the assertions:**
  - `hero headline`: the text "Backend &amp; cloud engineer who profiles first." (or the unescaped form) is present
  - `hero sub`: "I take systems apart, measure where the time goes, and put them back together faster." is present
  - `runtime series`: each of `2h 30`, `1h 30`, `15 min`, `8 min` is present
  - `speedup`: `~18×` is present
  - `readouts`: `5.05 GB`, `679 GFLOPS` and `194` are present
  - `meta line`: `GPA 9.72/10` is present
  - `cta`: `href="#work"` appears at least twice (nav and hero)
- [ ] **Step 2: Run `bun run test`.** Expected: FAIL on the new hero assertions.
- [ ] **Step 3: Implement `Hero.astro`.**
  - Layout: two columns from `lg` (copy left, chart right), stacked below. The `<h1 data-split>` is in `text-text`, all of it, with no green (Global Constraints).
  - Meta line: `Timișoara, RO · Computer Engineering @ UPT · GPA 9.72/10`. CTAs: "See the work" (`#work`) and "Download CV".
  - Under the chart: a mono caption `~18× faster · now runs every 2 h`, and the `changes` list as `from → to` rows. Each row is a `<li tabindex="0">` so hover and focus styles match.
  - `Readouts.astro`: a 4-column grid (2 columns on mobile). Values in `signal` mono with `data-count` when the value is a plain number.
- [ ] **Step 4: Run `bun run test && bun run check`.** Expected: all passed.
- [ ] **Step 5: Commit:** `git commit -m "feat: telemetry hero with runtime chart and readouts"`

### Task 4: Work: long project cards + archive list

**Files:**
- Rewrite: `src/data/projects.ts`
- Rewrite: `src/components/Projects.astro`
- Create: `src/components/ProjectCard.astro`
- Create: `src/components/BarChart.astro`
- Create: `src/components/DeliveryPath.astro`
- Move: the screenshots that are still used (`vibecodium_editor.png`, `image_processing_bench.png`) → `src/assets/projects/` with `git mv`. Delete the PNGs that nothing uses any more.

**Interfaces:**
- Produces in `src/data/projects.ts`:

```ts
type Media =
  | { kind: "image"; src: ImageMetadata; alt: string }
  | { kind: "bars"; caption: string; bars: { label: string; value: number; display: string; highlight?: boolean }[] }
  | { kind: "pipeline"; caption: string; steps: string[] };
export interface Project {
  title: string; context: string; period: string; metric: string;
  problem: string; tried: string; measured: string; decided: string;
  tech: string[]; links: { label: string; href: string }[];
  isPrivate?: boolean; media: Media;
}
export interface ArchiveProject { title: string; description: string; href: string }
export const projects: Project[];   // Groundly, EchoCare, gemm-bench, Vibecodium, Distributed Image Processing, in that order
export const archive: ArchiveProject[]; // Smart Shopping Assistant, ArchLens Analyzer, AtomC Compiler, Parallel DMM Benchmark
```

  - **Copy:** write the four trace fields per project from the spec's bullet for that project. Each field is ≤ 2 sentences, and only numbers the spec states.
  - **Media:**
    - Groundly: bars `>16 GB` (value 16) and `5.05 GB` (value 5.05, highlight)
    - EchoCare: pipeline `["PR", "CI (per folder)", "staging", "release PR", "production"]`, caption "deploys never drop live calls"
    - gemm-bench: bars "packed micro-kernel" `679` (highlight), "Apple AMX" value 2300 display `1.9–2.3k`, "Metal GPU" `3.5k` (value 3500), caption "f32 GFLOPS"
    - Vibecodium and Distributed Image Processing: their image
  - **Links:**
    - gemm-bench: GitHub `https://github.com/paulhondola/gemm-bench` and "live dashboard" `https://paulhondola.github.io/gemm-bench/`
    - Groundly, Vibecodium and the image-processing project: their GitHub URLs (the latter two are already in the old `projects.ts`)
    - EchoCare: `links: []` and `isPrivate: true`
  - **Archive descriptions:** shorten the old `projects.ts` descriptions to one line each.
- Produces: `BarChart.astro` props `{ caption: string; bars: Bar[] }`. Horizontal bars, width = `value / max(values)`, `data-grow`, highlight bars in `signal` and the others in `muted`. `DeliveryPath.astro` props `{ caption: string; steps: string[] }`: mono boxes joined by `→`.

- [ ] **Step 1: Append the assertions:**
  - `five cards`: exactly 5 occurrences of `data-project`
  - `trace labels`: `problem`, `tried`, `measured` and `decided` each appear ≥ 5 times
  - `echocare private`: `private repo` is present, and `github.com/paulhondola/EchoCare` is absent
  - `gemm dashboard`: `href="https://paulhondola.github.io/gemm-bench/"` is present
  - `archive`: `Smart Shopping Assistant`, `ArchLens`, `AtomC` and `DMM` are all present
  - `external links`: every `href="https://` anchor has `target="_blank"` and `rel="noopener"`. Check it with a regex over each `<a [^>]*href="https://[^"]*"[^>]*>` match.
  - `optimized images`: no `src="/projects/` remains
- [ ] **Step 2: Run `bun run test`.** Expected: FAIL on the new work assertions.
- [ ] **Step 3: Implement.**
  - `ProjectCard.astro` (`<article data-project>`): media left at 40% and body right from `lg`, stacked below.
  - Meta line: `0N · context · period`, with links or the "private repo" label on the right. Then an `<h3 data-split>` title, the metric in `signal` mono, and the trace as a `grid-cols-[auto_1fr]` mono block, where `decided` is in `signal` only when it states a result. Then the tech chips.
  - `Projects.astro`: section `#work` with `<h2 data-split>` "Work", the cards, then "Also on GitHub" with the archive as a mono list.
- [ ] **Step 4: Run `bun run test && bun run check`.** Expected: all passed.
- [ ] **Step 5: Commit:** `git commit -m "feat: long project cards with trace blocks and data graphics"`

### Task 5: Experience, Stack, About, Contact + footer

**Files:**
- Rewrite: `src/data/experiences.ts`, `src/data/skills.ts`
- Delete: `src/data/contact.ts`, `src/data/icons.ts` (move the 3 brand SVG imports into `site.ts`, or inline them in `Contact.astro`)
- Rewrite: `src/components/Experience.astro`, `src/components/Skills.astro` (section id `stack`), `src/components/Contact.astro`
- Create: `src/components/About.astro`
- Modify: `src/pages/index.astro`. Final order: `Nav`, then `main` containing `Hero`, `Readouts`, `Projects`, `Experience`, `Skills`, `About`, `Contact`, then the footer inside `Contact.astro`.

**Interfaces:**
- `experiences.ts`: `Experience { role: string; company: string; period: string; stack: string[]; points: string[] }`, three entries with the spec's wording (Nokia, Hibyte, Bitdefender × LigaAC).
- `skills.ts`: `SkillGroup { title: string; items: string[] }`, six groups copied verbatim from the CV's Technical Skills section.
- `About.astro`: `<Image src={paul} widths={[240, 480]} sizes="240px" alt="Paul Hondola">`, the education line, coursework, and the availability.

- [ ] **Step 1: Append the assertions:**
  - `sections`: `id="experience"`, `id="stack"`, `id="about"` and `id="contact"` are all present
  - `nokia`: `~90-file` and `prod-vs-dev` are present
  - `bitdefender`: `Frida` is present
  - `skills`: `Rayon` and `DuckDB` are present
  - `education`: `Universitatea Politehnica Timișoara` (or `UPT`) and `Jul 2027` are present
  - `links`: `href="mailto:paulhondola@gmail.com"`, `linkedin.com/in/paulhondola` and `github.com/paulhondola"` are all present
  - `photo optimized`: `src="/photo/paul.png"` is absent
- [ ] **Step 2: Run `bun run test`.** Expected: FAIL on the new assertions.
- [ ] **Step 3: Implement.**
  - **Experience:** a log-style list. Mono `period` on the left, the role and company `<h3>` with stack chips, and the points as plain text.
  - **Stack:** a six-column mono list on `lg`, two columns on mobile.
  - **Contact:** `<h2 data-split>` "Got a slow system or a hard argument? Let's talk.", then the email as a large link, then the socials and the CV. Footer: `© {year} Paul Hondola`.
- [ ] **Step 4: Run `bun run test && bun run check`.** Expected: all passed.
- [ ] **Step 5: Commit:** `git commit -m "feat: experience, stack, about and contact sections"`

### Task 6: Motion: GSAP + Lenis

**Files:**
- Create: `src/scripts/motion.ts`
- Modify: `src/layouts/Layout.astro` (`<script>import { initMotion } from "../scripts/motion"; initMotion();</script>`)

**Interfaces:**
- Consumes: `data-nav`, `data-split`, `data-draw`, `data-grow` and `data-count` from Tasks 2–5.
- Produces: `initMotion(): void`.

- [ ] **Step 1: Write the browser checks this task must pass.** These run in Step 4 against `astro dev --background`, in the built-in browser:
  - **anchor offset:** click the nav `/work` link and wait 1.5 s. Then `document.querySelector('#work h2').getBoundingClientRect().top >= document.querySelector('[data-nav]').offsetHeight` → `true`.
  - **reduced motion:** load `/?reduced-motion`. Then `document.documentElement.classList.contains('lenis')` → `false`, and every `[data-split]` has computed `opacity === "1"`.
  - **no JS:** block `/src/scripts/motion.ts` (or view the `astro preview` build with the script tag removed via devtools). Then every metric is visible and every `[data-grow]` has its full width.
- [ ] **Step 2: Run the anchor check before implementing.** Expected: it may pass with native scroll. Record the result so a regression is visible after Lenis is added.
- [ ] **Step 3: Implement `initMotion()`.**
  - If `matchMedia("(prefers-reduced-motion: reduce)").matches || new URLSearchParams(location.search).has("reduced-motion")`: return immediately (`// ponytail: query flag lets the browser check exercise this path`). The HTML is already in its final state.
  - `gsap.registerPlugin(ScrollTrigger, SplitText)`. Create `new Lenis({ anchors: { offset: -navHeight } })`, then `lenis.on("scroll", ScrollTrigger.update)`, `gsap.ticker.add((t) => lenis.raf(t * 1000))` and `gsap.ticker.lagSmoothing(0)`.
  - **Hero, on load:** `SplitText.create(h1, { type: "words", aria: "auto" })`, then `gsap.from(words, { yPercent: 100, opacity: 0, stagger: 0.04 })`. Then the `data-draw` polyline goes from `strokeDashoffset = length` to 0, and the change rows fade up. The nav and CTAs are never animated.
  - **Each `h2[data-split]`/`h3[data-split]` below the hero:** a word reveal on `ScrollTrigger` `start: "top 85%"`, `once: true`. Inside each section, `[data-grow]` animates with `gsap.from(el, { scaleX: 0, transformOrigin: "left" })`, and `[data-count]` counts up from 0 to its value.
  - **Only `gsap.from`/`fromTo`,** so a failure leaves the final state.
  - After `document.fonts.ready` and `window.load`, call `ScrollTrigger.refresh()`.
- [ ] **Step 4: Run all three browser checks, plus `bun run test && bun run check`.** Expected: anchor `true`; reduced motion `false` / all `"1"`; no JS shows everything; dist checks pass.
- [ ] **Step 5: Commit:** `git commit -m "feat: gsap + lenis motion with reduced-motion and no-js fallbacks"`

### Task 7: Cleanup, verification, ship

**Files:**
- Delete: anything nothing imports any more (old icons in `public/icons/` if unused, `public/favicon.svg` only if missing, unused `public/projects/*.png`). Check with `grep -r` before each delete.
- Modify: `README.md` (stack line: drop React/lucide, add GSAP + Lenis; update the structure tree).

- [ ] **Step 1: Run `bun run format` and `bun run format:check && bun run check && bun run test`.** Expected: all clean.
- [ ] **Step 2: Do the browser pass on `astro dev --background`:**
  - 1440 px and 375 px screenshots of every section.
  - `document.documentElement.scrollWidth <= innerWidth` at 375 px → `true`.
  - Tab through the whole page: focus is visible on every link and on the hero change rows.
  - Stop the dev server when done (`astro dev stop`).
- [ ] **Step 3: Run Lighthouse** on `astro preview` (`npx lighthouse http://localhost:4321 --preset=desktop --only-categories=performance,accessibility` and the mobile default). Expected: performance ≥ 95 on mobile, accessibility ≥ 95. Fix whatever fails (usually image sizes or font loading).
- [ ] **Step 4: Search** `grep -rniE "placeholder|lorem|todo|award" src` → no visible-copy hits.
- [ ] **Step 5: Commit** (`git commit -m "chore: remove unused assets, update readme"`). Then **ask Paul before `git push origin main`**, because the push deploys the live site.
