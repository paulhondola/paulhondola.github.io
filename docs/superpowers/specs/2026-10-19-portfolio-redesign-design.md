# Portfolio redesign: "Live Telemetry"

Date: 2026-10-19 · Status: awaiting Paul's approval

## Intent

The site is for **hiring managers for backend and cloud roles**. After about 30 seconds they should think: *this person goes after problems that need hard thinking and argument, and can't leave a system alone until it's measurably better.* (Paul's words: "down for any task that requires complex thinking and debating", "obsessing over performance numbers and constantly improving the systems I work on".)

The current site (Astro 7, Tailwind 4, dark navy with a `#409cff` accent) reads like a generic developer template. Its content is also behind the new CV (`public/cv/Paul_Hondola_CV.pdf`): old Nokia bullets, no Groundly, EchoCare or gemm-bench, no education or availability.

## Goals

1. **Numbers lead.** Each piece of work is headlined by a measured result, not a role or a tool list.
2. **Show the reasoning.** Each project is told as **problem → tried → measured → decided**, so the judgment calls are visible (GraphRAG removed because it lost; hotfix first, then a proposed rewrite; deploys that never drop live calls).
3. **Backend, cloud and performance first.** Groundly, EchoCare, gemm-bench and the Nokia work dominate.
4. **Hiring basics take one click:** availability (Jul–Sep 2027), CV download, email, LinkedIn, GitHub.
5. **The site practises what it preaches:** fast and light. A performance engineer's portfolio must not be slow.

## Non-goals

- No per-project case-study pages. It's **one long scrolling page** (Paul's decision).
- No blog, CMS, analytics, i18n or contact form.
- No Three.js or WebGL. A 3D scene would be decoration, not data (my call, per the awwwards skill's "only with purpose" rule).

## Anti-goals (a failure even if it works)

- Any number, claim or label that isn't backed by the CV or the project repos. That includes flame-graph stage names presented as a real profile when they're illustrative.
- Placeholder boxes in the shipped page (the current hero has empty grey cards).
- A logo wall or skill-icon grid, gradient blobs, glassmorphism, award claims, generic "I am a Software Engineer" copy.
- Motion that blocks reading. Nav, headline and CTA must be usable before any animation finishes.
- A heavy page. Lighthouse performance should stay ≥ 95 on mobile, with JS kept small (GSAP + Lenis + a little glue).

## Constraints

- **Stack stays:** Astro 7, Tailwind 4 (`@theme` tokens in `src/styles/global.css`), Bun, GitHub Pages via `.github/workflows/deploy.yml` (`astro check` + `prettier --check` must pass).
- **Content data stays in `src/data/*.ts`,** the pattern this repo already uses. Component markup reads from it.
- **Single page:** `src/pages/index.astro`.
- `paulhondola.github.io/gemm-bench/` is a separate Pages site (gemm-bench's live dashboard). Don't break or shadow that path.
- **Accessibility basics:** semantic landmarks, visible keyboard focus, alt text, `prefers-reduced-motion` honoured (final states, no smooth scroll), and the full page works without JS.

## Decided

### Visual direction: B, "Live Telemetry" (Paul picked this)

A profiler or monitoring dashboard turned into a portfolio.

- **Colour:** near-black base `#07090c`, surface `#0d1116`, hairline `#1d252c`, text `#e7ecef`, muted `#7d8a93`, body-muted `#a9b4bb`. One accent, signal green `#5cf2a6`, **reserved for measured results** (speedups, memory saved, GFLOPS) so the colour itself means "proof". *(Values are from the approved mockup. Keeping green for results only is my call.)*
- **Type:** Space Grotesk for headlines and body, JetBrains Mono for labels, metrics, nav and data. Both from Google Fonts. Tight tracking on large headlines.
- **Reference mockups:** `.superpowers/brainstorm/*/content/directions-v2.html` (option B) and `project-cards.html` (option C). These are throwaway mockups, not code to copy.

### Page structure: one long page (Paul's decision)

Section order and content are my call, built from the CV.

1. **Nav (sticky):** "paul@hondola" mark, anchors `/work /experience /stack /contact`, a "CV ↓" link to `/cv/Paul_Hondola_CV.pdf`, and a status pill "● open to full-time · from Jul 2027". Mobile: a compact menu.
2. **Hero:**
   - Headline (draft): "Backend & cloud engineer who **profiles first**."
   - Sub (draft): "I take systems apart, measure where the time goes, and put them back together faster."
   - Meta line: Timișoara, RO · Computer Engineering @ UPT · GPA 9.72/10.
   - CTAs: "See the work" (→ #work) and "Download CV".
   - **Focal graphic:** the Nokia finance pipeline as data. A runtime chart through Paul's real iterations, **2 h 30 → 1 h 30 → 15 min → 8 min** (Paul's numbers), labelled "~18× faster · now runs every 2 h". The points carry values only. They are *not* tied to specific changes, because we don't know which change produced which drop (my call). Beside it, a short stack naming what changed, taken from the CV (row-by-row pandas → vectorized; sequential fetch → parallel via v2 API params + concurrent exports). It is drawn as a list of changes, **not** a to-scale flame graph, since there are no per-stage timings.
3. **Readouts strip:** four telemetry-style counters with green values: `18×` Nokia pipeline · `16 GB → 5.05 GB` Groundly peak memory · `679 GFLOPS` gemm-bench (87% of NEON peak) · `194` EchoCare backend tests.
4. **Work: option C, one long card per project** (Paul picked this). If the long cards feel thin in review, the fallback is option D (long cards for the top 3, a compact row for the rest). Each card:
   - Meta line: index, context (thesis / team of 4 / …), dates, links.
   - Name, one green headline metric.
   - A `problem / tried / measured / decided` trace block in mono.
   - Tech chips.
   - A media slot. **Until Paul adds photos, the slot shows an authored data graphic of that project's key numbers**, never a placeholder. Projects with existing screenshots in `public/projects/` use them.
   - Order and content (all from the CV unless noted):
     1. **Groundly (bachelor thesis, Jul 2026 →).** MCP server (tested with Claude Code and Codex) that indexes course materials into single-file knowledge bases. Hybrid retrieval: bge-m3 dense + learned sparse + BM25, RRF, cross-encoder rerank, zero API keys. Tried 3 GraphRAG strategies vs the reranked hybrid baseline on 124 gold questions across 2 corpora. GraphRAG didn't win, so query-time GraphRAG and the external-model answer pipeline were removed (MCP-first, zero-key). Peak indexing memory went from >16 GB to a flat 5.05 GB (memray profiling, streaming fp16 embeddings in bounded batches into SQLite). Graphic: memory before/after bars. Link: github.com/paulhondola/groundly.
     2. **EchoCare (team of 4, Oct 2026 →, formerly "Sentinela").** Safety checks for seniors living alone. Twilio check-in calls detect alarm phrases and open incidents on a dispatch team's (DAS) Svelte dashboard, refreshed every 15 s. A Wear OS watch monitors pulse and steps. One Android app serves 4 roles (senior, caregiver, medic, DAS). Consent is recorded as append-only, auditable history. FastAPI + PostgreSQL on Railway, staging and production. Infra as code in `.railway/railway.ts`. Per-folder CI that Railway waits on before deploying. Watch paths keep a docs, dashboard or Android change from redeploying the API, which would drop live calls. Release via merge-commit PRs. 4 ADRs (monorepo & delivery, git hooks, Svelte dashboard, API runtime). Tests: **194**, matching the CV linked from the same page (my call; the repo has about 310 test functions today, so bump the CV and the site together later). Paul's role (Paul's answer): **tech lead across backend, cloud, dashboard and Android** in a team of 4. Graphic: the PR → CI → staging → release → production delivery path. Repo is **private**, so show a "private repo" label instead of a GitHub link.
     3. **gemm-bench (Sep–Oct 2026).** 9 Rust CPU GEMM kernels: cache tiling, Rayon work-stealing, static thread pools, a BLIS-style packed micro-kernel with `std::simd` register blocking. Benchmarked at 5 precisions against Apple AMX and Metal GPU. 679 GFLOPS f32 (87% of M1 Pro NEON peak) vs 1.9–2.3 TFLOPS AMX vs 3.5 TFLOPS GPU. Results from 8 machines and 4 contributors in strict-schema SQLite, CI on Ubuntu, Windows and macOS (147 Rust tests). Graphic: GFLOPS bars. Links: GitHub and the live dashboard at paulhondola.github.io/gemm-bench/.
     4. **Vibecodium (1st place, iTEC 2026, Mar–Jun 2026).** Co-led a 4-person team building a real-time collaborative IDE (Yjs CRDT). Owned the workspace UI and REST APIs. Built a Docker code-execution sandbox: 4 languages, 2 GB memory cap, no network, 3 s timeout. Media: existing `vibecodium_editor.png` / `vibecodium_repo.png`. Link: GitHub.
     5. **Distributed Image Processing (Parallel Algorithms coursework, Dec 2025–Feb 2026).** 2D convolution on images up to 16800×12600 px across 5 execution models (serial, OpenMP, MPI message passing, shared-file I/O, master-worker task pool). Median 6.8× speedup with 8 MPI processes. Media: existing `image_processing_bench.png`. Link: GitHub.
   - **Also on GitHub:** a short text-only list after the cards for the older projects already on the site (Smart Shopping Assistant, ArchLens Analyzer, AtomC Compiler, Parallel DMM Benchmark): one line and a link each, reusing the descriptions in `src/data/projects.ts`. *(My call: they don't have enough measured data for a long card.)*
5. **Experience:** a log/trace-style timeline, newest first, using the CV's wording:
   - **Nokia, Software Engineer Intern (Mar 2026 →).** Python, pandas, MariaDB, Jenkins, GitLab, Power BI. Two financial pipelines (2 h 15 + 7 min) merged into one 8-minute pipeline run every 2 h (~18×) by vectorizing row-by-row pandas and parallelizing fetches; a prod-vs-dev diff caught silently dropped legacy entries. Restored 3 pipelines broken by an upstream access change with a minimal hotfix (HTML → XML export parsing), then proposed and executed a ~90-file rewrite into a shared module layer with a uniform index/parser/pipeline structure.
   - **Hibyte, Full Stack Developer Intern (Jul–Oct 2025).** Role-based auth layer (Supabase JWTs validated by NestJS guards across admin, staff and customer roles) and backend routes, in a 5-person team. 7 Payload CMS collections; Supabase migrations.
   - **Bitdefender × LigaAC, Reverse Engineering & Malware Analysis Trainee (Apr–Jun 2025).** Reversed a file-encryption routine in IDA Pro and wrote C decryptors for 5 formats plus a keygen. Unpacked dynamically loaded Android DEX payloads with Frida hooks across 8 labs.
6. **Stack:** the CV's skill groups as plain mono lists, no logos: Languages · Parallel & HPC · Systems & Tools · Data · Web · Spoken languages.
7. **About / education:** Paul's photo (`public/photo/paul.png`, the only avatar on the site), BSc Computer Engineering at UPT (Oct 2023–Jul 2027 expected, GPA 9.72/10), relevant coursework, and availability: open to full-time roles from Jul 2027 (Paul's answer; the CV's "Jul–Sep 2027" is the earliest window, not an end date).
8. **Contact + footer:** a big final line (draft: "Got a slow system or a hard argument? Let's talk."), email, LinkedIn, GitHub, CV. Footer with name and year.

### Motion and tech (my calls)

These follow the `build-awwwards-quality-sites` skill. The design skill used alongside it is `frontend-design`.

- **GSAP + ScrollTrigger** for all choreography. **Lenis** is the only smooth-scroll engine (lighter than Locomotive; standard ScrollTrigger integration via `lenis.on('scroll', ScrollTrigger.update)` and the GSAP ticker).
- **Hero intro:** the headline is revealed word by word, then the runtime chart line draws and the flame bars grow. Nav and CTA are visible immediately.
- **Sections:** headings revealed word by word (with an unsplit accessible name; split words `aria-hidden`), then supporting copy, then the card's data graphic animates (bars grow, counters tick). No pinned or scrubbed sequences in the MVP.
- **Hover/focus:** plain CSS. Flame bars and graphic elements show their label on hover *and* focus.
- **Reduced motion or no JS:** Lenis isn't initialised and everything renders in its final state. Content is in the HTML, never injected by JS.
- **Data graphics** are hand-authored inline SVG driven by the numbers in `src/data/*.ts` (the skill allows authored data graphics).
- **Icons:** Solar set via Iconify, inlined as SVG at build time. Real-brand marks (GitHub, LinkedIn) via Iconify `logos`/`simple-icons`. No client icon runtime.
- React is currently used only for the navbar. The new nav is plain Astro + a small script, so React, `@astrojs/react` and `lucide-react` can be removed if nothing else needs them.

## MVP vs final

Paul wants an MVP to react to before accepting the final look.

- **Where it goes (Paul's decision):** the MVP ships to `main`, which deploys the live site. So the MVP has to be hiring-ready from day one: no half-cut-over sections, and real `<title>`, meta description, OG/Twitter tags and favicon are in the MVP. The deploy workflow's `astro check` and `format:check` must pass before pushing.
- **MVP:** every section above with real content; the colour and type system; responsive layout (mobile and desktop); hero with the runtime chart and flame stack; all 5 long project cards with data graphics or existing screenshots; Lenis + GSAP reveals; reduced-motion and no-JS paths; build, `astro check` and `format:check` passing.
- **After the look is accepted (not in the MVP):** Paul's project photos in the media slots; richer hover detail on the flame graph; per-section choreography polish; a custom OG/social image (the MVP uses a simple static one); final copy pass.

## Left to the builder

- Exact spacing scale, breakpoints and type sizes, within the mockup's character.
- The exact shape of each project's data graphic.
- How the data files are reshaped. `projects.ts` gains `problem/tried/measured/decided/metric` fields; `skills.ts` and `experiences.ts` are rewritten from the CV. Keep it simple: one data file per section, as today.
- Whether to remove now-unused assets and dependencies (current hero ribbon, `lucide-react`, React).
- Add `.superpowers/` to `.gitignore`.

## Resolved after the builder check

- Hero data: Paul supplied the intermediate runtimes (2 h 30 → 1 h 30 → 15 min → 8 min).
- Availability: full-time from Jul 2027.
- EchoCare: Paul was tech lead overall.
- MVP ships straight to `main` and the live site.
- EchoCare tests: 194, to match the CV (my call).
