# paulhondola.github.io

Personal portfolio site built with Astro, Tailwind CSS v4, and React.

Live at [paulhondola.github.io](https://paulhondola.github.io)

## Stack

- **Astro 7** — static site generation, `.astro` components
- **Tailwind CSS v4** — via `@tailwindcss/vite`, `@theme` tokens, `@utility` blocks
- **React 19** — used only for the Navbar (scroll state + mobile menu)
- **lucide-react** — icons, SSR-only (no client JS)
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
```

## Structure

```
src/
├── components/
│   ├── Navbar.tsx       # React island (client:load)
│   ├── Hero.astro
│   ├── Experience.astro
│   ├── Projects.astro
│   ├── Skills.astro
│   └── Contact.astro
├── layouts/
│   └── Layout.astro     # base HTML, IntersectionObserver reveal
├── pages/
│   └── index.astro
└── styles/
    └── global.css       # Tailwind @theme tokens + @utility blocks
public/
└── Paul_Hondola_CV.pdf
```

## Deploy

Pushes to `main` auto-deploy via GitHub Actions (`.github/workflows/deploy.yml`):

1. **check** — `astro check` + `prettier --check`
2. **build** — `bun run build` → uploads `dist/`
3. **deploy** — publishes to GitHub Pages
