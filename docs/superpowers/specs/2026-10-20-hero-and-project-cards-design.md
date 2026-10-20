# Hero and project cards: "From metal to cloud"

Date: 2026-10-20 · Status: awaiting Paul's approval · Builds on [2026-10-19-portfolio-redesign-design.md](2026-10-19-portfolio-redesign-design.md)

## Intent

The current site works but undersells Paul. The headline ("Backend & cloud engineer who profiles first.") is narrower than his CV and wraps badly at medium widths: at ~800px "profiles" overlaps the subtitle. The project cards are walls of 13px mono text with a single visual each, and most projects have no picture of the real product.

This change does two things:

1. **The hero tells the range.** Paul's words: he enjoys *building complex things*, and enjoys *tearing them down to improve them the best he can*. The headline is "From metal to cloud.", with proof at every layer.
2. **Each project card shows the measurements and the product side by side.** Graphs on the left, the real app on the right, then a row of facts pulled from the repos.

The audience is the same as before: hiring managers. After 30 seconds they should know Paul works at every layer from SIMD kernels to cloud services, and that every claim has a number or a source behind it.

## Goals

- The headline reads as range plus a habit (build, then take apart and improve), not as a job title.
- Every project card has two halves: **graphs** (left) and **the app** (right). Where there's no app, the right half holds specs.
- Every number on the page traces to the CV, a repo doc, a results database or a measurement Paul ran. Sources are listed below.
- The cards are easier to scan than today: what it is, what proves it, and pictures first. The long reasoning goes behind a toggle.

## Non-goals

- **Experience, Stack, About, Contact, Nav and Footer are out of scope.** Paul wants to discuss them later. The only change outside the hero and the cards is that the Nokia runtime chart moves out of the hero (see below).
- No new pages, no lightbox library, no new dependencies.
- No change to the colour tokens, fonts, motion engine (GSAP + Lenis) or deploy setup.

## Anti-goals (a failure even if it works)

- **Any number without a source,** or one worded more strongly than its source allows. Examples already caught in brainstorming: "17–28% of agents don't search" was a fact about a stripped-down test setup, not the product. "Verified pixel-for-pixel" wasn't checked. "ElevenLabs does speech-to-text" isn't true. Caught in the spec review (2026-10-20): best runs at different matrix sizes presented as "same matrix", a retracted 15 h build time, GraphRAG numbers from its weakest graph build, and Node + Bun counted as two languages.
- **Green on something that isn't a measurement.** `--color-signal` is "reserved for measured results only" (`src/styles/global.css`). Counts, limits and feature names render in `text` white.
- **Screenshots stretched or zoomed to fill a box.** Brainstorming hit this twice: gemm-bench and Groundly both cropped badly when the graph column grew taller than the photo. Photos keep their own proportions, and the columns are balanced by content, not by `object-fit: cover`.
- **Personal data in screenshots.** The EchoCare dashboard's names are all seeded test data, and the dispatcher shown (Cristian Pavel) is fine to appear (Paul confirmed, 2026-10-20). Any new screenshot needs the same check before it's committed, because committing to this public repo publishes it.
- Everything from the previous spec's anti-goals still applies: no placeholders, no motion that blocks reading, Lighthouse mobile ≥ 95.

## Constraints

- **Stack:** Astro 7, Tailwind 4 `@theme` tokens, **npm**, GSAP + Lenis, oxlint, Prettier. CI runs `npm run check`, `npm run lint`, `npm run format:check`, then `npm run build`.
- **Content stays in `src/data/*.ts`,** and components read from it.
- **`scripts/check-dist.ts` (`npm test`) asserts on the built page.** Several of its checks encode the old hero and readouts and must be updated in the same change (see "Build notes").
- **Images** live in `src/assets/projects/` and go through Astro's `<Image>`, which outputs responsive WebP. Three new PNGs are there, untracked so far: `groundly.png` (help-only terminal, 2396×1326), `echocare_dashboard.png` (3456×2234), `gemm_bench.png` (3258×2636).
- **Works without JS and with reduced motion,** same as today.
- **Reference mockups (throwaway, not code to copy):** hero option A in `.superpowers/brainstorm/99530-1792443872/content/hero-headline.html`, and the cards in `.superpowers/brainstorm/26580-1792488449/content/project-split-v9.html`.

## Decided

### Hero: option A (Paul picked this)

Two columns on desktop, stacked on mobile. The existing meta line and CTAs stay.

- **Meta line:** `Timișoara, RO · Computer Engineering @ UPT · GPA 9.72/10`
- **Headline:** `From metal to cloud.` (Paul's, from an earlier CV)
- **Sub:** "I like building complex things, and I like taking them apart even more: to find where they're slow and put them back together better." *(Wording is the mockup draft. Paul liked option A as shown.)*
- **CTAs:** "See the work" → `#work`, "Download CV ↓" → `/cv/Paul_Hondola_CV.pdf`
- **Right panel: a stack ladder,** captioned `stack · where I've worked` / `proof`. One row per layer, top (metal) to bottom (cloud):

| Layer | What | Proof | Colour |
|---|---|---|---|
| metal | Rust GEMM kernels, std::simd | 648 GFLOPS | signal |
| binaries | x86 reversing, decryptors in C | 5 formats | text |
| parallel | MPI + OpenMP convolution | 6.8× | signal |
| data | Nokia finance pipelines | ~18× | signal |
| retrieval | Groundly MCP server | >16 GB → 5.05 GB | signal |
| cloud | EchoCare on Railway | staging + prod | text |

*My calls:* the cloud row's proof was "194 tests" in the mockup, but Paul removed the tests from EchoCare as irrelevant, so it becomes `staging + prod` in white. "5 formats" is a count, so it's white too. Groundly's value uses the CV's exact form `>16 GB → 5.05 GB`, which `check-dist.ts` already asserts.

- **The Nokia runtime chart (`RuntimeChart.astro` + the "what changed" list) leaves the hero.** *My call:* it moves, unchanged, into the Nokia entry in Experience, so nothing is lost while Experience waits for its own discussion. Its data, including whether it starts at "2h 30" (Paul's measured iteration) or the CV's 2 h 15 + 7 min, is part of that later discussion.

### Readouts strip: removed (Paul's decision)

`Readouts.astro` and `readouts` in `src/data/hero.ts` go. The hero ladder carries those numbers now.

### Project cards: shared structure

Every card, top to bottom:

1. **Meta line** (mono, muted): index · context · dates on the left, links or "private repo" on the right. Same as today.
2. **Name** (h3, large).
3. **What it is:** one line in `text` white, sans, ~18px. Paul's framing.
4. **Proof:** one mono line. Measured parts render in signal green and facts in `text` white, so one line can mix both (per card below). *(My call, settled after the builder check.)*
5. **Tech chips,** as today. *(My call: the mockups dropped them, but they help recruiters scanning for keywords.)*
6. **Split:** graphs on the left (~42%), the app on the right (~58%), divided by a hairline. Each half has a small uppercase mono label. On mobile it stacks with the graphs first.
7. **Info tiles:** a row of 4 (2×2 on mobile). Each tile has a value (20px mono) and one or two lines of muted explanation. The value is green only when it's a measurement.
8. **Details toggle:** the existing problem → tried → measured → decided text, behind a native `<details>`/`<summary>` labelled `▸ problem · tried · measured · decided`. Closed by default. *(My call: it keeps the reasoning one click away and needs no JS.)*

The **image-processing card has no tiles row**: its specs fill the right half instead (Paul said that card looks good as it is).

**Screenshots:** shown whole at their own proportions, never `object-fit: cover`. Each one links to its largest optimized size (`<a href>` around the `<Image>`), so a click opens it full size. *(My call: no lightbox, no JS.)* Each gets real alt text describing what's on screen.

**Balancing the halves:** the graph column holds enough graphs to roughly match the photo's height at desktop width. Where it would still run long, content moves under the photo (Groundly's import flow). The builder should check both columns at 1280px and about 1024px.

### Card 1: Groundly

- **Meta:** `01 · Bachelor thesis · Jul 2026 →` · github ↗ (https://github.com/paulhondola/groundly)
- **What:** Local-first MCP RAG server for learning progress *(Paul keeps "learning progress": it's near-future work)*
- **Proof:** `zero API keys` (text) ` · ` `flat 5.05 GB peak memory at any document size` (signal)
- **Graphs:**
  1. *peak indexing memory:* bars `before >16 GB` (muted) and `after 5.05 GB` (signal). Note: "streaming fp16 embeddings in bounded batches into SQLite".
  2. *indexed locally · apd course · no API key:* a 4-step pipeline, `187 files → 1,193 chunks → bge-m3 (fp16, on device) → 13 MB store.db`.
  3. *one course = one file · groundly export:* stacked bars on one scale (max 42 MB).
     - `apd · 187 files · 42 MB` = 26 MB index, vectors and graph (signal) + 16 MB original files (muted)
     - `passc · 15 files · 16 MB` = 10 MB + 6 MB

     Note: "index, vectors and graph · original files, so citations open the right page · apd exports in 5 s".
- **App:** `groundly.png` (help-only terminal). Under it, *groundly import* as four chips: `manifest validated → zip-slip-safe extraction → embedding pin checked, re-embed on mismatch → fresh progress.db`.
- **Tiles:**
  - **17% → 60%** (signal): how often a coding agent given only the search tool searched the course unprompted, after I rewrote the tool descriptions and server instructions together (48 questions, p = 1.9e-05)
  - **71% vs 67%** (signal): hit rate at 8 chunks, plain hybrid retrieval vs GraphRAG on its best graph build. Retrieval led at 5, 8, 10 and 20 chunks on every build, so the graph left the default path
  - **verified** (text): the agent writes flashcards, Groundly re-retrieves each one and rejects any its citations don't support, then exports to Anki
  - **0.73 h** (signal): the graph build a coursemate skips by importing the bundle instead (apd, gpt-oss-120b, measured)
- **Sources:** `groundly/docs/thesis/experiments.md` (decisions 28, 30, 31 and the tables; hit@8 0.708 vs 0.667 is decision 28's best build, gpt-oss-120b at gleanings=1); `docs/architecture/data-model.md` (export/import); `~/.groundly/{apd,passc}/manifest.json` and `du` for counts and `store.db` size; `groundly export` run on 2026-10-20 (apd 42 MB / 26 MB `--no-materials`, 5.06 s; passc 16 MB / 10 MB); `~/.groundly/apd/graph/stats.json` (`total_runtime` 2,618 s = 0.73 h, `extraction_model` gpt-oss-120b in the manifest). *Not used:* the "15.0 h" local build, which decision 28 retracts as a concurrency artifact, and the weakest build's 71% vs 60%.

### Card 2: EchoCare

- **Meta:** `02 · tech lead · team of 4 · Oct 2026 →` · private repo
- **What:** Large-scale agentic monitoring for seniors living alone *(Paul's wording, kept on purpose: the agentic part is the key feature and it's under development)*
- **Proof (text, not a measurement):** `live on Railway staging + production · calls, watch, Android app and dispatch in one system`
- **Graph half:** a flow diagram, *how an alarm reaches a human*, in three columns:
  - triggers: `weather warning` · `abnormal watch reading` · `request from the app`
  - `AI agent calls the senior` (highlighted with a `text`-white outline, not green, since it isn't a measurement) → `server scores green / yellow / red`
  - `red: incident opened` → `DAS dispatcher takes the call` → `resolved`

  Source: the EchoCare spec README.
- **App:** `echocare_dashboard.png`, with the macOS menu bar cropped off. *(My call: crop the file itself, the top 65 px of the original (the menu bar ends at row 64), rather than hiding it with CSS, so the window's top border survives.)*
- **Tiles (all text, none are measurements):**
  - **AI agent:** calls each senior in Romanian during a heatwave or frost. The server turns the answers into green / yellow / red
  - **ElevenLabs voice:** Twilio and Google transcribe the senior, ElevenLabs speaks the agent's replies. The backend only ever sees text, and no audio is stored *(Paul confirmed: ElevenLabs for the voice only)*
  - **every 15 min:** the custom Wear OS app sends a status overview: worn, battery, last reading. A watch silent for 45 min is flagged offline
  - **instantly:** a pulse, fall or inactivity spike skips the schedule, goes out immediately and starts an automated call
- **Removed (Paul's decision):** the 194 tests, the p50 latency and the "no Redis" facts.
- **Sources:** `EchoCare/docs/specs/echocare/README.md`, `01-architecture.md`, `06-operations.md` (15 min check-in, 45 min silent), `esti-bine-specificatii-v3.md` (Google transcription, ElevenLabs voice via Twilio ConversationRelay).

### Card 3: gemm-bench

- **Meta:** `03 · Rust · HPC · Sep – Oct 2026` · github ↗ · live dashboard ↗ (https://paulhondola.github.io/gemm-bench/)
- **What:** An Apple Silicon-first, hand-tuned GEMM benchmark across CPU, AMX and GPU
- **Proof (signal):** `648 GFLOPS f32 · 83% of the M1 Pro's 8 P-core NEON peak` *(Paul's decision, 2026-10-20: the 679 GFLOPS best was a 10-thread run, 8 P + 2 E cores, measured against the 8 P-core peak. 648.1 is the best 8-thread run.)*
- **Graphs:**
  1. *my CPU tuning · f32 · log scale:* `naive ijk 0.525` → `packed, 1 core 92.8` → `rayon-packed, 8 P-cores 648` (signal), with a dashed mark at the 8-core NEON peak (777 GFLOPS). Note: "dashed line = 8 P-core NEON peak · ~1,200× from naive to tuned".
  2. *best run per engine · f32:* linear bars, max 3,538:
     - CPU · my rayon-packed, 8 P-cores 648
     - AMX · Accelerate BLAS 1,897
     - AMX · Accelerate BNNS 2,318
     - GPU · my Metal simdgroup shader 2,886
     - GPU · Apple MPS 3,538 (signal)

     Note: "GFLOPS, best run per engine on the M1 Pro · BLAS at N=1024, the rest at N=4096".
  - The f16 graph was tried and **removed (Paul's decision):** it made the column too tall and zoomed the photo.
- **App:** `gemm_bench.png` (live dashboard), whole.
- **Tiles (all signal):**
  - **3,538:** GFLOPS f32 on the GPU through Apple's MPS, the fastest f32 result on the M1 Pro
  - **82%:** of MPS reached by my hand-written Metal simdgroup shader (2,886 GFLOPS f32), 97% at f16 *(Paul confirmed the shader is his)*
  - **+22%:** BNNS's best over BLAS's best on the same AMX coprocessor: 2,318 GFLOPS f32 at N=4096 vs 1,897 at N=1024
  - **4,721:** GFLOPS f16 on AMX through BNNS at N=1024, the fastest f16 result on the M1 Pro
- **Sources:** `gemm-bench/data/db/paulhondola/m1pro.sqlite` (`max(gops)` per kernel and precision), `data/peaks.csv` (777.216 f32 8-core peak), and the dashboard's optimization ladder (0.525 / 92.8 at N=4096; 648.1 is `max(gops)` for rayon-packed f32 N=4096 at `threads = 8`). *Not claimed:* "BNNS beats the GPU at f16". At N=4096 MPS wins (3,647 vs 3,184), and at matched N=4096 BNNS leads BLAS by 36%, not 22%.

### Card 4: Vibecodium

- **Meta:** `04 · co-lead · team of 4 · Mar – Jun 2026` · github ↗
- **What:** Real-time collaborative IDE · 1st place, iTEC 2026 (web dev)
- **Proof (text):** `user code sandboxed in 6 runtimes · 2 GB cap · no network · 3 s timeout` *(Paul's decision: 6, as in the repo README's six Docker images, not the CV's 4. "Runtimes", because Node and Bun both run JavaScript.)*
- **Graph half:** spec tiles, *sandbox limits*: `6` runtimes (Python, Node, Bun, C++, Rust, Go) · `2 GB` memory cap · `none` network access · `3 s` timeout. All white.
- **App:** `vibecodium_editor.png` (existing).
- **Tiles:**
  - **Yjs CRDT** (text): every keystroke merges conflict-free across clients, with per-user cursors and file focus in per-project WebSocket rooms
  - **accept / reject** (text): the AI agent's edits land as a diff overlay in the editor, and nothing is written until a person accepts it
  - **pre-scan** (text): static checks block `rm -rf /`, fork bombs and `mkfs` before a container ever starts
  - **99 / 233** (text, it's a count): commits, the most of anyone on the team
- **Sources:** `vibecodium/README.md`; `git shortlog -sn HEAD` on 2026-10-20 (Paul Hondola 99 of 233).

### Card 5: Distributed Image Processing (Paul: "looks good")

- **Meta:** `05 · Parallel Algorithms coursework · Dec 2025 – Feb 2026` · github ↗
- **What:** 2D convolution on images up to 16800×12600 px, five execution models
- **Proof (signal):** `median 6.8× speedup over all 8-process runs` (the CV's figure: a median over every 8-process configuration)
- **Graph half:** *MPI scaling · 1 thread per process · 16800×12600 px · 3×3 kernel*, redrawn from the repo's data, replacing the white seaborn PNG. Each bar has a dashed perfect-scaling mark. The labels say `× 1 thread` so the 8-process bar can't be read as the proof line's 6.8×.
  - 2 × 1 thread 1.82× · 91%
  - 4 × 1 thread 3.52× · 88%
  - 8 × 1 thread 6.51× · 81% (signal)

  Note: "dashed line = perfect scaling · % = parallel efficiency · median of 10 runs". Configurations are processes × 1 thread.
- **Right half (no app):** *the build · specs*, four white tiles:
  - `6` convolution kernels: edge, ridge, sharpen, box, gaussian, unsharp
  - `5` execution models: serial, OpenMP, MPI, shared FS, task pool
  - `212 MP` largest image, 16800×12600 px
  - `--verify` checks parallel output against serial
- **No tiles row.**
- `image_processing_bench.png` is no longer used.
- **Sources:** `MPI-OpenMP-Image-Processing/data/chrono/speedups_data.csv` (median per configuration) and the README.

### "Also on GitHub" list

Unchanged.

## Build notes

- **Data shape:** `Project.media` becomes a `graphs` part and an `app` part, with tiles and spec tiles alongside. An honest shape: a list of typed graph blocks (`bars`, `logBars`, `stackedBars`, `pipeline`, `flow`, `specs`) for the left; `app` as either an image (plus optional chips underneath) or specs; `tiles` as `{ value, label, measured }[]`, optional. A graph type used once (`flow`, `stackedBars`) can be a small component. Don't build a general chart engine.
- **Existing components to reuse:** `BarChart.astro` (add the perfect-scaling or peak mark and log mode, or make a sibling), and the `data-grow` motion hook for bars. `DeliveryPath.astro` loses its only user (EchoCare's CI path) and can go.
- **Trace text must match the new facts.** EchoCare's "measured" text mentions 194 tests: rewrite it without them. Vibecodium's "measured" says "4 languages": change it to "6 runtimes".
- **`check-dist.ts` updates:** replace "hero headline", "hero sub" and "readouts" with checks for `From metal to cloud.` and the six ladder layers. Keep "runtime series" (the chart still renders, in Experience). Add checks that `image_processing_bench` isn't referenced and that each project card has a `<details>`. The green-only-for-measurements rule is enforced by review, not by a test.
- **Page meta:** `Layout.astro`'s description says "who profiles first". Update it to the new framing: `From metal to cloud: I build complex systems, then take them apart to make them better. Computer Engineering at UPT, open to full-time roles from Jul 2027.` *(My call: keep the `<title>` "Paul Hondola: Backend & Cloud Engineer", since it's what people search for.)*
- **Commit the three new PNGs** with the change.

## Left to the builder

- Exact sizes, spacing and breakpoints, within the mockups' character.
- How the graph blocks are typed and named.
- Motion for the new graph blocks: reuse `data-grow` for bars. Anything more must keep the "final state in HTML, `gsap.from()` only" rule in `motion.ts`.
- Alt text wording.
- How much of the existing trace text to trim, as long as no claim changes.

## Open items for Paul (not blocking the build)

Resolved after the builder check: the EchoCare screenshot ships as is (see Anti-goals). Green is used only on measured parts: the agent box outline, the Vibecodium commit count and the Groundly proof line are adjusted to match.

Resolved in the spec review (2026-10-20): the Groundly tiles (0.73 h, 71% vs 67%, search-only setup named), the gemm-bench matrix sizes, Vibecodium's runtimes and commit count, and the MPI labels.

- **CV:** it still says Vibecodium ran 4 languages (the site says 6 runtimes) and gemm-bench "679 GFLOPS f32 (87% of M1 Pro NEON peak)" (the site says 648 GFLOPS, 83% of the 8 P-core peak). Update the CV to match.
- **MPI data not re-checked:** `speedups_data.csv` wasn't available locally during the review, so 1.82× / 3.52× / 6.51× and the CV's 6.8× are taken as previously extracted.
- **Experience, Stack, About, Contact:** a later discussion, including the Nokia chart's starting value.
