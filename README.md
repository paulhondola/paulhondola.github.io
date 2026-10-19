# paulhondola.github.io

Personal portfolio site built with Astro, Tailwind CSS v4, GSAP and Lenis.

Live at [paulhondola.github.io](https://paulhondola.github.io)

## Stack

- **Astro 7** — static site generation, `.astro` components
- **Tailwind CSS v4** — via `@tailwindcss/vite`, `@theme` tokens, `@utility` blocks
- **GSAP + Lenis** — scroll reveals, chart drawing, smooth scroll (`src/scripts/motion.ts`); skipped under `prefers-reduced-motion`
- **Bun** — package manager and runtime

## Dev

```sh
bun install
bun run dev        # http://localhost:4321
bun run build      # output → dist/
bun run preview    # preview dist/ locally
bun run check      # TypeScript / Astro type check
bun run format     # prettier --write
bun run format:check  # prettier --check (runs in CI)
bun run test       # build, then assert on dist/index.html (scripts/check-dist.ts)
```

## Structure

```
src/
├── data/                # all page content, one file per section
├── components/          # one .astro per section, plus the SVG charts
├── layouts/Layout.astro # head, meta/OG tags, motion script
├── scripts/motion.ts    # GSAP + Lenis
├── assets/              # images optimized by astro:assets
├── pages/index.astro
└── styles/global.css    # Tailwind @theme tokens
public/cv/Paul_Hondola_CV.pdf
scripts/check-dist.ts    # built-page assertions
```

## Deploy

Pushes to `main` auto-deploy via GitHub Actions (`.github/workflows/deploy.yml`):

1. **check** — `astro check` + `prettier --check`
2. **build** — `bun run build` → uploads `dist/`
3. **deploy** — publishes to GitHub Pages
