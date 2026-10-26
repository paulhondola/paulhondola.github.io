# Sitemap, Robots.txt, and LLMs.txt Discovery Suite

A machine-readability and discoverability suite for Paul Hondola's portfolio (`https://paulhondola.github.io`).

## Intent

Make the portfolio discoverable and indexable by search engines, web crawlers, and AI agents/LLMs (Perplexity, ChatGPT, Claude, Cursor) while adhering strictly to `PRODUCT.md` principles: zero metric drift from source data, no fabricated links, and direct, measured claims.

## Goals

1. **Sitemap (`sitemap-index.xml` + `sitemap-0.xml`)**:
   - Integrated via `@astrojs/sitemap`.
   - Indexes `https://paulhondola.github.io/`.
   - Indexes `https://paulhondola.github.io/cv/Paul_Hondola_CV.pdf`.
   - Indexes `https://paulhondola.github.io/gemm-bench/` (Paul's live dashboard project hosted on the same domain).
   - Discovery link added to `<head>` in `src/layouts/Layout.astro`.

2. **Robots Directives (`robots.txt`)**:
   - Placed in `public/robots.txt`.
   - Allows all search engines and AI web crawlers.
   - Points to `https://paulhondola.github.io/sitemap-index.xml`.

3. **Machine Readability (`llms.txt` and `llms-full.txt`)**:
   - Conforms to the standard specification at `https://llmstxt.org`.
   - Dynamic build-time endpoints (`src/pages/llms.txt.ts`, `src/pages/llms-full.txt.ts`) pulling directly from `src/data/*.ts`.
   - Single source of truth: ensures 0% metric drift when projects or stats are updated.
   - `llms.txt` provides an overview with headline metrics, contact info, CV link, and core project links.
   - `llms-full.txt` contains full engineering traces (Problem → Tried → Measured → Decided), benchmark stats, and project archive.
   - Strictly enforces `PRODUCT.md`: EchoCare is annotated as a private repository (never a fabricated link).

4. **Testing and CI**:
   - New assertions added to `scripts/check-dist.ts` (`npm test`).
   - All quality gates (`npm run check`, `npm run lint`, `npm run format:check`, `npm test`) pass cleanly in CI.

## Non-goals / Anti-goals

- No server-side dynamic runtime: everything is pre-rendered at build time (`output: 'static'`).
- No separate CMS or external API dependencies.
- No RSS feed (the portfolio is a single-page site with no blog posts or articles).
- No blocking or paywalling AI agents.

## Decisions

1. **`@astrojs/sitemap` integration**:
   - Selected over manual XML templating to use the standard Astro ecosystem integration.
   - Configured with `customPages` to include `/cv/Paul_Hondola_CV.pdf` and `/gemm-bench/`.
2. **Build-time endpoint generation for `llms.txt` & `llms-full.txt`**:
   - Generating from `src/data/*.ts` prevents duplicate data entry and eliminates divergence between the rendered HTML and the LLM text representation.
3. **Static `public/robots.txt`**:
   - Kept as a simple static file in `public/` rather than a dynamic endpoint to ensure zero overhead and direct access.

## Technical Design

### 1. Sitemap Configuration

In `astro.config.mjs`:
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
  // ... rest of config
});
```

In `src/layouts/Layout.astro`:
```html
<link rel="sitemap" href="/sitemap-index.xml" />
```

### 2. Robots Directives

In `public/robots.txt`:
```txt
User-agent: *
Allow: /

Sitemap: https://paulhondola.github.io/sitemap-index.xml
```

### 3. LLMs Endpoints

#### Generator Helper (`src/utils/llms.ts`)
Creates two formatters:
- `generateLlmsTxt()`:
  - Header: `# Paul Hondola`
  - Blockquote: `> From metal to cloud: Backend, cloud, and systems/performance engineer...`
  - Availability & Contact details (CV, email, GitHub, LinkedIn).
  - High-level list of active projects with headline metrics:
    - Groundly (Local-first MCP RAG, 187 chunks, 5 s bundle)
    - EchoCare (Large-scale agentic monitoring, private repo)
    - gemm-bench (Apple Silicon GEMM benchmark, 648 GFLOPS f32 NEON, 83% peak)
    - Vibecodium (Real-time collaborative IDE, iTEC 2026 1st place, Yjs CRDT)
    - 2D Convolution (MPI-OpenMP, 6.51× scaling)
  - Core Experience & Technical Stack summary.
  - Link to `/llms-full.txt`.
- `generateLlmsFullTxt()`:
  - All content from `llms.txt`.
  - Detailed Problem → Tried → Measured → Decided breakdown for each project.
  - Key measurements table/lists from `src/data/projects.ts` (e.g., Groundly 187/1193 chunks, gemm-bench NEON vs naive 1200×, MPI 8×1 threads 81% efficiency).
  - Archived projects section (Smart Shopping Assistant, ArchLens, AtomC, DMM).
  - Education details (Universitatea Politehnica Timișoara, GPA 9.72/10).

#### Endpoints
- `src/pages/llms.txt.ts`:
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
- `src/pages/llms-full.txt.ts`:
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

### 4. File Layout

| File | Action | Purpose |
|---|---|---|
| `package.json` | Edit | Add `@astrojs/sitemap` dependency |
| `astro.config.mjs` | Edit | Register `sitemap()` integration with `customPages` |
| `src/layouts/Layout.astro` | Edit | Add `<link rel="sitemap" href="/sitemap-index.xml" />` |
| `public/robots.txt` | Create | Crawler directives & sitemap location |
| `src/utils/llms.ts` | Create | Generator functions for `llms.txt` and `llms-full.txt` |
| `src/pages/llms.txt.ts` | Create | Astro static route for `/llms.txt` |
| `src/pages/llms-full.txt.ts` | Create | Astro static route for `/llms-full.txt` |
| `scripts/check-dist.ts` | Edit | Assertions for sitemap, robots.txt, and llms endpoints |
| `PRODUCT.md` | Edit | Note sitemap, robots, and llms.txt discoverability capabilities |

## Verification (Definition of Done)

1. `npm run check` and `npm run lint` pass without errors or warnings.
2. `npm run format:check` passes across all files.
3. `npm test` (`astro build && node scripts/check-dist.ts`) succeeds with new assertions:
   - `dist/sitemap-index.xml` and `dist/sitemap-0.xml` exist.
   - `sitemap-0.xml` contains entries for `https://paulhondola.github.io/`, `https://paulhondola.github.io/cv/Paul_Hondola_CV.pdf`, and `https://paulhondola.github.io/gemm-bench/`.
   - `dist/index.html` includes `<link rel="sitemap" href="/sitemap-index.xml" />`.
   - `dist/robots.txt` exists and contains valid crawler directives.
   - `dist/llms.txt` exists and conforms to the llmstxt.org structure.
   - `dist/llms-full.txt` exists and contains full traces without placeholder text.
   - EchoCare in `llms.txt`/`llms-full.txt` contains `private repo` and no GitHub link.
