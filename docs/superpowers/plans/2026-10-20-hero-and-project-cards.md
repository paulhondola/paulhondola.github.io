# Hero and Project Cards ("From metal to cloud") Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the hero with "From metal to cloud." and its stack ladder, drop the readouts strip, and rebuild every project card as graphs | app, followed by info tiles and a collapsible reasoning trace.

**Architecture:** Same Astro single page. Content stays in `src/data/*.ts`. `ProjectCard.astro` renders a typed list of graph blocks (left), an app panel (right), tiles and a `<details>` trace. Each graph kind is one small build-time component. `scripts/check-dist.ts` asserts on the built `dist/index.html` and is the test for every task.

**Tech Stack:** Astro 7, Tailwind 4 `@theme` tokens, npm, GSAP + ScrollTrigger + SplitText, Lenis, `astro:assets` (`<Image>`, `getImage`), `sharp` (already installed through Astro) for the one image crop.

**Spec:** `docs/superpowers/specs/2026-10-20-hero-and-project-cards-design.md`. **Every visible string and number comes from it verbatim.** This plan names where each one goes and doesn't repeat them, except where a test pins them.

## Global Constraints

- `--color-signal` (`text-signal`, `bg-signal`) goes **only** on measured values. Counts, limits, feature names and facts use `text-text`. The spec marks each value "(signal)" or "(text)". Follow those marks exactly.
- Screenshots are never `object-fit: cover` and never forced to a fixed height. They render at their own aspect ratio (`w-full h-auto`).
- No new npm dependencies. No lightbox and no client JS for the cards. `<details>` and plain `<a href>` do the work.
- All content is in the server-rendered HTML. `motion.ts` only uses `gsap.from()`/`fromTo` on content that's already final in the HTML.
- External links keep `target="_blank" rel="noopener"` (an existing assertion checks this).
- The CI gates must pass: `npm run check`, `npm run lint`, `npm run format:check`, `npm run build`, plus `npm test`.
- Don't push. Commit each task to the current branch (`main`, matching how this repo works). Paul decides when to push, because a push deploys.

## Review Focus

1. **Screenshots keep their proportions at 1024 and 1280 px wide.** For every card image, the rendered height ÷ width must equal the natural ratio within ±0.02. This is a Task 4 browser check.
2. **Phone width (375 px):** no horizontal scroll. The split stacks with graphs first, tiles go 2×2, and the EchoCare flow and Groundly pipeline wrap instead of overflowing. Task 4 checks `document.documentElement.scrollWidth <= innerWidth`.
3. **Without JS:** every bar is at its final width, and each `<details>` opens on click or keyboard. A Task 2 assertion covers the final widths in the HTML. A Task 4 browser check covers no-JS.
4. **Keyboard and screen readers:** each full-size image link is focusable and named by its image's non-empty `alt`, and every `<summary>` is reachable. This is a Task 2 assertion: no empty `alt`, and every image link wraps an `<img alt="…">`.
5. **Log-scale bars:** the smallest value (0.525) must still be visible, and 679 must sit below the peak mark. The Task 2 assertion pins `width: 18.0%` and `left: 97.3%`.

---

### Task 1: Hero ladder, readouts removed, runtime chart moved to Experience

**Files:**
- Modify: `src/data/hero.ts`: delete `readouts`, add `ladder`. Keep `runtime` and `changes` as they are.
- Modify: `src/components/Hero.astro`: new sub copy, and the ladder replaces the `<figure>`.
- Create: `src/components/RuntimeFigure.astro`: the `<figure>` moved out of `Hero.astro` unchanged (caption `trace · nokia/finance-pipeline`, `RuntimeChart`, `~18× faster · now runs every 2 h`, the `changes` list).
- Modify: `src/data/experiences.ts`: `Experience` gains `runtime?: boolean`. Set it to `true` on Nokia.
- Modify: `src/components/Experience.astro`: render `<RuntimeFigure />` under the Nokia points when `e.runtime`.
- Delete: `src/components/Readouts.astro`. Modify `src/pages/index.astro` to drop it.
- Modify: `src/scripts/motion.ts`: see Step 3.
- Modify: `src/layouts/Layout.astro`: new default `description`.
- Test: `scripts/check-dist.ts`

**Interfaces:**
- Produces: `export const ladder: { layer: string; what: string; proof: string; measured: boolean }[]` in `src/data/hero.ts`, six rows in the spec's order (metal → cloud).
- Produces: the hero's ladder list carries `data-ladder` on its `<ol>`.

- [ ] **Step 1: Update the failing assertions in `scripts/check-dist.ts`**

Replace the "hero headline", "hero sub" and "readouts" checks. Keep "runtime series", "speedup", "meta line", "cta" and "numbers as the CV states them".

```ts
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
  "ladder",
  ["metal", "binaries", "parallel", "data", "retrieval", "cloud"].every((l) => hero.includes(`>${l}<`)) &&
    ["679 GFLOPS", "5 formats", "6.8×", "~18×", "&gt;16 GB → 5.05 GB", "staging + prod"].every((v) => hero.includes(v)),
);
check("no readouts", !html.includes('aria-label="Key numbers"'));
check("runtime in experience", section("experience").includes("2h 30") && !hero.includes("2h 30"));
check(
  "meta description",
  html.includes(
    'name="description" content="From metal to cloud: I build complex systems, then take them apart to make them better. Computer Engineering at UPT, open to full-time roles from Jul 2027."',
  ),
);
```

The sub contains `they're`. If Astro escapes it to `&#39;` (it does for `{expressions}`, not literal template text), keep the sub as literal text in `Hero.astro`, or compare against the decoded form. Don't reword the copy to dodge it.

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test`
Expected: FAIL, listing `hero headline`, `hero sub`, `ladder`, `no readouts`, `runtime in experience`, `meta description`.

- [ ] **Step 3: Implement**

- `Hero.astro`: keep the meta line, CTAs and grid. The h1 is `From metal to cloud.` with `data-split`, using the same classes. The sub is the spec's sentence. The right column is a `bg-surface border border-line rounded-lg` panel with the caption row `stack · where I've worked` / `proof`, then `<ol data-ladder>` with one `<li>` per `ladder` row in a three-column grid (`layer` muted uppercase 10px, `what` in text, `proof` right-aligned and `text-signal` when `measured`, else `text-text`).
- `ladder` values are the spec's hero table, verbatim. `measured` is true for 679 GFLOPS, 6.8×, ~18× and >16 GB → 5.05 GB, and false for 5 formats and staging + prod.
- `Layout.astro`: default `description` = `From metal to cloud: I build complex systems, then take them apart to make them better. Computer Engineering at UPT, open to full-time roles from Jul 2027.`. The title stays.
- `motion.ts`:
  - The hero block animates `hero.querySelectorAll("[data-ladder] li")` (same `opacity/y/stagger` tween, `delay: 0.5`) instead of `"circle, figure li"`.
  - Move the `[data-draw]` polyline draw out of the hero block so it runs for any `[data-draw]` on the page, with `scrollTrigger: { trigger: line, start: "top 85%", once: true }` and no fixed delay. Its circles and `figure li` fade in on the same trigger.

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test`
Expected: `check-dist: all passed`

- [ ] **Step 5: Check the gates and commit**

Run: `npm run check && npm run lint && npm run format:check`. All three must pass. Then:

```bash
git add -A src scripts
git commit -m "feat: hero 'From metal to cloud' with stack ladder, runtime chart moves to Experience"
```

---

### Task 2: Card model, card layout, and four of the five cards' content

**Files:**
- Modify: `src/data/projects.ts`: new types (below) and all five projects' content. Groundly's graphs here are only its memory bars. Task 3 adds the rest.
- Modify: `src/components/ProjectCard.astro`: full rewrite to the spec's shared structure.
- Create: `src/components/GraphBlock.astro`: a switch on `graph.kind` that renders one of the components below.
- Modify: `src/components/BarChart.astro`: log scale, explicit domain, marks, detail text, note.
- Create: `src/components/FlowDiagram.astro`, `src/components/SpecTiles.astro`, `src/components/InfoTiles.astro`.
- Delete: `src/components/DeliveryPath.astro`.
- Modify: `src/assets/projects/echocare_dashboard.png`: crop it (Step 3). Add the three new PNGs to git.
- Delete: `src/assets/projects/image_processing_bench.png`.
- Test: `scripts/check-dist.ts`

**Interfaces (all exported from `src/data/projects.ts`):**

```ts
export interface Bar { label: string; value: number; display: string; detail?: string; highlight?: boolean; mark?: number }
export interface BarsGraph { kind: "bars"; caption: string; bars: Bar[]; scale?: "linear" | "log"; domain?: [number, number]; note?: string }
export interface Step { value?: string; label: string }
export interface PipelineGraph { kind: "pipeline"; caption: string; steps: Step[] }          // component lands in Task 3
export interface StackedGraph { kind: "stacked"; caption: string; max: number; rows: { label: string; display: string; parts: [number, number] }[]; legend: [string, string]; note?: string } // Task 3
export interface FlowGraph { kind: "flow"; caption: string; columns: string[][]; highlight: string }
export interface SpecsGraph { kind: "specs"; caption: string; specs: { value: string; label: string }[] }
export type Graph = BarsGraph | PipelineGraph | StackedGraph | FlowGraph | SpecsGraph;
export type App =
  | { kind: "image"; src: ImageMetadata; alt: string; caption: string; below?: PipelineGraph }
  | SpecsGraph;
export interface Tile { value: string; label: string; measured: boolean }
export interface ProofPart { text: string; measured: boolean }
export interface Project {
  title: string; context: string; period: string;
  what: string; proof: ProofPart[];
  problem: string; tried: string; measured: string; decided: string;
  tech: string[]; links: { label: string; href: string }[]; isPrivate?: boolean;
  graphs: Graph[]; app: App; tiles?: Tile[];
}
```

`metric` and `media` are removed. `Bar`'s import in `BarChart.astro` keeps working. Each component takes its graph object as props, minus `kind`.

- [ ] **Step 1: Append the failing assertions to `scripts/check-dist.ts`**

```ts
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
check("six runtimes", text.includes("sandboxed in 6 runtimes") && text.includes("Python, Node, Bun, C++, Rust, Go") && !text.includes("6 languages"));
check(
  "tiles",
  ["17% → 60%", "71% vs 67%", "0.73 h", "ElevenLabs voice", "every 15 min", "instantly", "3,538", "82%", "+22%", "4,721", "Yjs CRDT", "99 / 233"].every((v) => text.includes(v)),
);
check("gemm graphs", ["0.525", "92.8", "1,897", "2,318", "2,886"].every((v) => work.includes(v)));
check("log bars", work.includes("width: 18.0%") && work.includes("left: 97.3%"));
check("mpi scaling", ["1.82×", "3.52×", "6.51×", "91%", "88%", "81%", "8 × 1 thread"].every((v) => work.includes(v)));
check("retracted numbers gone", !text.includes("15.0 h") && !text.includes("71% vs 60%") && !text.includes("same matrix") && !text.includes("beating the GPU"));
check("flow", text.includes("AI agent calls the senior") && text.includes("DAS dispatcher takes the call"));
check("old chart png gone", !html.includes("image_processing_bench"));
check("no empty alt", !/<img [^>]*alt=""/.test(html));
check(
  "full-size image links",
  (work.match(/<a [^>]*href="\/_astro\/[^"]+"[^>]*>\s*<img [^>]*alt="[^"]+"/g) ?? []).length === 4,
);
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test`
Expected: FAIL, including at least `details per card`, `what lines`, `no tests count`, `tiles`, `log bars`, `flow`.

- [ ] **Step 3: Crop the EchoCare screenshot**

This removes the macOS menu bar (the top 65 px of the 3456×2234 original (menu bar ends at row 64; 80 px cut the window border)):

```bash
node -e "const s=require('sharp');s('src/assets/projects/echocare_dashboard.png').extract({left:0,top:65,width:3456,height:2169}).toBuffer().then(b=>s(b).toFile('src/assets/projects/echocare_dashboard.png'))"
```

Verify: `sips -g pixelHeight src/assets/projects/echocare_dashboard.png` prints `2169`. View the image's top edge: the window's rounded top border is visible, and the menu bar (Zen, File, Edit…) is gone.

- [ ] **Step 4: Implement the components**

- `BarChart.astro` takes `{ caption, bars, scale = "linear", domain, note }`.
  - Linear: width = `value / (domain?.[1] ?? max(values))`.
  - Log: width = `(log10(v) − log10(lo)) / (log10(hi) − log10(lo))` with `domain = [lo, hi]` required.
  - Render as `style={`width: ${(pct * 100).toFixed(1)}%`}`. `mark` draws a dashed vertical tick at the same scale, `style={`left: ${…toFixed(1)}%`}`.
  - `detail` renders muted after `display`. `highlight` keeps `bg-signal` / `text-signal`. `data-grow` stays on the fill.
- `FlowDiagram.astro`: columns of bordered boxes with `→` between columns on `sm+`, stacking with `↓` below `sm`. The box whose text equals `highlight` gets a `border-text` outline, **not** signal.
- `SpecTiles.astro`: a 2×2 grid of `{value (text-text, 20–22px mono), label (muted 11px)}`.
- `InfoTiles.astro`: 4 columns on `md+` and 2 below, hairline dividers. `value` is `text-signal` if `measured`, else `text-text`.
- `GraphBlock.astro`: `{ graph: Graph }`, switching on `kind`. It throws at build for `pipeline` and `stacked` until Task 3 adds them (`throw new Error(\`graph kind ${kind} not built yet\`)`). Groundly doesn't use them in this task.
- `ProjectCard.astro` uses the spec's shared structure, top to bottom:
  - meta line (as today)
  - h3 with `data-split`
  - `what` (sans, ~18px, `text-text`)
  - proof parts joined by ` · `, each `text-signal` or `text-text`
  - tech chips (as today)
  - `div` grid `lg:grid-cols-[1fr_1.35fr]` with graphs left (`flex flex-col gap-6`) and app right
  - `InfoTiles` if `tiles`
  - `<details class="border-t border-line"><summary class="font-mono text-xs text-muted cursor-pointer px-6 py-3">▸ problem · tried · measured · decided</summary>` wrapping the existing `<dl>` trace

  For an image app: compute `const full = await getImage({ src: app.src, width: Math.min(app.src.width, 2400) })`, then render `<a href={full.src}><Image src={app.src} alt={app.alt} widths={[640, 1000, 1400]} sizes="(min-width: 1024px) 560px, 100vw" class="w-full h-auto rounded border border-line" /></a>`, with `app.below` rendered through `GraphBlock` under it. An app of kind `specs` renders `SpecTiles`.
- `Projects.astro` needs no changes.

- [ ] **Step 5: Fill in `projects.ts`**

Copy everything from the spec's Card 1–5 sections:
- `what` and `proof`, split into parts with the spec's signal/text marks
- graphs in order, with the spec's exact numbers and notes
- app caption and `alt` (write alt text describing what's visible)
- tiles with their marks
- links

Concrete settings the spec implies:
- gemm-bench CPU tuning: `scale: "log", domain: [0.1, 1000]`, with `mark: 777.216` on the rayon-packed bar.
- gemm-bench engines: `domain: [0, 3538]`.
- Groundly memory: `domain: [0, 16]`.
- MPI scaling: `domain: [0, 8]`, with `mark` = 2, 4 and 8 and `detail` = `91%`, `88%`, `81%`.
- Image processing: `app` is the specs graph from the spec, and it has no `tiles`.

Trace text: in EchoCare's `measured`, drop the 194 tests sentence. In Vibecodium's `measured`, change "4 languages" to "6 runtimes". Leave every other trace string as it is.

- [ ] **Step 6: Run the test to verify it passes**

Run: `npm test`
Expected: `check-dist: all passed`

- [ ] **Step 7: Check the gates and commit**

Run: `npm run check && npm run lint && npm run format:check`. Then:

```bash
git add -A src scripts
git commit -m "feat: project cards as graphs | app, info tiles and collapsible trace"
```

---

### Task 3: Groundly's indexing pipeline, one-file bundle bars and import flow

**Files:**
- Create: `src/components/Pipeline.astro`, `src/components/StackedBars.astro`.
- Modify: `src/components/GraphBlock.astro`: route `pipeline` and `stacked` to them and drop the throw.
- Modify: `src/data/projects.ts`: Groundly gets graphs 2 and 3 and `app.below`.
- Test: `scripts/check-dist.ts`

**Interfaces:**
- Consumes: `PipelineGraph`, `StackedGraph` and `GraphBlock` from Task 2.

- [ ] **Step 1: Append the failing assertions**

```ts
check(
  "groundly local index",
  ["187", "1,193", "bge-m3", "13 MB"].every((v) => work.includes(v)),
);
check(
  "groundly bundle",
  ["42 MB", "16 MB", "apd exports in 5 s"].every((v) => work.includes(v)) &&
    work.includes("width: 61.9%") && work.includes("width: 38.1%") && work.includes("width: 23.8%") && work.includes("width: 14.3%"),
);
check(
  "groundly import",
  ["manifest validated", "zip-slip-safe extraction", "embedding pin checked, re-embed on mismatch", "fresh progress.db"].every((v) => text.includes(v)),
);
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test`
Expected: FAIL on `groundly local index`, `groundly bundle`, `groundly import`.

- [ ] **Step 3: Implement**

- `Pipeline.astro` takes `{ caption, steps }`. It renders a wrapping flex row of bordered boxes joined by muted `→`. A step with `value` shows the value (`text-text`, 14px) over its label (muted 10px). A step without one is a single-line chip. It must wrap at 375 px.
- `StackedBars.astro` takes `{ caption, max, rows, legend, note }`. Each row is a track with two adjacent fills: `parts[0]` in `bg-signal` and `parts[1]` in `bg-muted`. Widths are `(part / max * 100).toFixed(1)%`, and the second fill is offset by the first. It ends with a legend line using the two swatches, then `note`.
- Groundly data, from the spec's Card 1:
  - graph 2 is a `pipeline` with 4 valued steps
  - graph 3 is `stacked` with `max: 42`, rows apd `[26, 16]` and passc `[10, 6]`, and the spec's legend and note
  - `app.below` is the `pipeline` "groundly import" with 4 label-only steps

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test`
Expected: `check-dist: all passed`

- [ ] **Step 5: Check the gates and commit**

Run: `npm run check && npm run lint && npm run format:check`. Then:

```bash
git add -A src scripts
git commit -m "feat: groundly local indexing, one-file bundle and import flow"
```

---

### Task 4: Browser verification

There are no new files unless a check fails. A fix goes in the file that owns the problem and gets its own commit.

- [ ] **Step 1: Start the dev server**

Run: `astro dev --background`. Open `http://localhost:4321` in the browser pane.

- [ ] **Step 2: Check the screenshot proportions (Review Focus 1)**

At viewport widths 1280 and 1024, evaluate:

```js
[...document.querySelectorAll('#work a > img')].map(i => { const r = i.getBoundingClientRect(); return Math.abs(r.height / r.width - i.naturalHeight / i.naturalWidth) < 0.02; })
```

Expected: `[true, true, true, true]`. Also check that each card's two halves are within about 25% of each other's height. If one runs long, move content per the spec's "Balancing the halves", not by cropping.

- [ ] **Step 3: Check phone width (Review Focus 2)**

At 375×812, `document.documentElement.scrollWidth <= innerWidth` must be `true`. Screenshot the EchoCare and Groundly cards: graphs above the photo, tiles 2×2, flow and pipelines wrapped.

- [ ] **Step 4: Check no-JS and reduced motion (Review Focus 3)**

With JavaScript disabled, or on `/?reduced-motion`, every bar is at full width and the hero ladder is visible. Click a `<summary>` and press Space on another: both open.

- [ ] **Step 5: Check keyboard focus (Review Focus 4)**

Tab through one card: the github link, the image link and the summary each show the signal focus outline.

- [ ] **Step 6: Run the full gates**

Run: `npm run check && npm run lint && npm run format:check && npm test`
Expected: all pass, ending in `check-dist: all passed`.

- [ ] **Step 7: Stop the server and report**

Run `astro dev stop`. Report the results to Paul, with screenshots of the hero and two cards. Don't push.
