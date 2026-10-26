# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Hiring managers and engineers screening candidates for **backend, cloud, and systems/performance roles** (infrastructure, HPC). They arrive from a CV, LinkedIn, or GitHub link, skim for roughly 30 seconds, and decide whether Paul is worth an interview. Paul is open to full-time roles from Jul 2027 (Computer Engineering @ UPT, GPA 9.72/10, graduating Jul 2027).

## Product Purpose

A one-page personal portfolio for Paul Hondola. Success: within 30 seconds a reviewer knows Paul works at every layer from SIMD kernels to cloud services, sees that each claim is measured, and can reach the CV, email, LinkedIn, or GitHub in one click.

## Positioning

Works at every layer, from metal to cloud, and every claim has a number or a source behind it. Paul builds complex things, then takes them apart to find where they're slow and puts them back together measurably better. Each project shows the judgment calls too, as problem → tried → measured → decided (e.g. GraphRAG removed because it lost to the baseline).

## Operating Context

- Static Astro 7 site, Tailwind 4, GSAP + Lenis, deployed to GitHub Pages from `main` via `.github/workflows/deploy.yml`. **A push to `main` publishes the live site.**
- Content lives in `src/data/*.ts` (one file per section); components read from it.
- `scripts/check-dist.ts` (`npm test`) asserts on the built page; CI runs `check`, `lint`, `format:check`, `build`.
- `paulhondola.github.io/gemm-bench/` is a separate Pages site (gemm-bench's live dashboard) and must not be shadowed.
- Visitors open it on desktop and phone; the CV PDF is at `/cv/Paul_Hondola_CV.pdf`.

## Capabilities and Constraints

- **Single long page.** No case-study pages, blog, CMS, analytics, i18n, or contact form.
- **Machine and search discoverable.** Sitemap index (`/sitemap-index.xml`), `robots.txt`, and standards-compliant `llms.txt` & `llms-full.txt` generated from data models.
- **Fast, works without JS.** Lighthouse mobile ≥ 95, small JS (GSAP + Lenis + glue), all content in server-rendered HTML, `prefers-reduced-motion` honoured with final states.
- English only.
- Open decision: Experience, Stack, About, and Contact sections are pending a later discussion with Paul, including the Nokia runtime chart's starting value (2h 30 measured iteration vs the CV's 2 h 15 + 7 min).

## Brand Commitments

- Name: Paul Hondola. Headline: "From metal to cloud." (Paul's, from an earlier CV).
- Voice: plain, specific, first person; numbers lead, adjectives don't.
- Page title "Paul Hondola: Backend & Cloud Engineer" is kept for search.
- Paul's photo (`src/assets/paul.png`) is the only avatar on the site.

## Evidence on Hand

- CV: `public/cv/Paul_Hondola_CV.pdf`. Site and CV must state the same numbers; when they diverge, update both.
- Project sources: Groundly (`~/Developer/groundly/docs/thesis/experiments.md`, `~/.groundly/` exports), gemm-bench (`data/db/*/m1pro.sqlite`, `data/peaks.csv`), EchoCare specs (`docs/specs/echocare/`), Vibecodium README and git history, MPI-OpenMP image processing `data/chrono/speedups_data.csv`.
- Screenshots: `src/assets/projects/` (groundly, echocare_dashboard, gemm_bench, vibecodium_editor).
- EchoCare is a **private repo**: show "private repo", never a GitHub link.
- **Absent, never fabricate:** testimonials, references, client logos, awards beyond iTEC 2026 1st place, user counts, or any benchmark Paul didn't run.

## Product Principles

1. **No unsourced claims.** Every number traces to the CV, a repo doc, a results database, or Paul's own measurement, and is never worded more strongly than its source allows (same matrix size, same setup, latest retraction checked).
2. **Measured vs. stated stays visible.** Readers must be able to tell a measurement from a count, limit, or feature.
3. **Show the reasoning, not just the result.** Decisions, including what was removed and why, are part of the proof.
4. **The site practises what it preaches.** A performance engineer's portfolio must be fast and light.
5. **Screenshot privacy.** Every screenshot is checked for personal data before commit; committing to this public repo publishes it.

## Accessibility & Inclusion

Semantic landmarks, visible keyboard focus, real alt text on every image, `prefers-reduced-motion` honoured (no smooth scroll, final states), and the full page works without JavaScript. Motion never blocks reading: nav, headline, and CTA are usable before any animation finishes.
