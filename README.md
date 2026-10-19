# paulhondola.github.io

Personal portfolio site built with Astro, Tailwind CSS v4, GSAP and Lenis.

Live at [paulhondola.github.io](https://paulhondola.github.io)

## Stack

- **Astro 7** — static site generation, `.astro` components
- **Tailwind CSS v4** — via `@tailwindcss/vite`, `@theme` tokens, `@utility` blocks
- **GSAP + Lenis** — scroll reveals, chart drawing, smooth scroll (`src/scripts/motion.ts`); skipped under `prefers-reduced-motion`
- **npm** — package manager; **Oxlint** for linting, **Prettier** for formatting

## Dev

```sh
npm install
npm run dev        # http://localhost:4321
npm run build      # output → dist/
npm run preview    # preview dist/ locally
npm run check      # TypeScript / Astro type check
npm run lint       # oxlint (runs in CI)
npm run format     # prettier --write
npm run format:check  # prettier --check (runs in CI)
npm test           # build, then assert on dist/index.html (scripts/check-dist.ts)
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

1. **check** — `astro check` + `oxlint` + `prettier --check`
2. **build** — `npm run build` → uploads `dist/`
3. **deploy** — publishes to GitHub Pages
