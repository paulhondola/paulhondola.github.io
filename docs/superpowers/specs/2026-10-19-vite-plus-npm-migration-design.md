# Migrate from Bun to npm (+ Oxlint)

File name keeps "vite-plus" from the first draft; Vite+ was evaluated and dropped (see Decisions).

## Intent

Remove Bun from the project. GitHub runners already ship Node and npm, so CI
should need no extra runtime installer. Keep the toolchain minimal: npm, and
one tool per job.

## Goals

- No Bun anywhere: lockfile, CI, scripts, docs.
- `npm` is the package manager; `package-lock.json` is committed.
- Add linting with Oxlint (Prettier only formats, it does not lint).
- CI keeps its current gates (type check, format check) and adds lint.
- The site output is unchanged.

## Non-goals / anti-goals

- No change to the site, components, content or styling.
- No Vite+ (`vp`). Evaluated by spike and dropped: it wraps npm, `vp build`
  and `vp dev` cannot drive Astro, Oxfmt (`vp fmt`) skips `.astro` files, and
  its only useful part is Oxlint, which installs directly. It is pre-1.0.
  Revisit if Oxfmt gains `.astro` support.
- No custom lint rules or type-aware linting. Oxlint defaults only.
- No third-party CI actions beyond official `actions/*`.
- No Vitest conversion of `scripts/check-dist.ts`.

## Findings behind the design (spike in a scratch copy)

- Oxlint parses `.astro` files (flagged `debugger` in both frontmatter and
  `<script>`), and the repo lints clean at defaults.
- `scripts/check-dist.ts` runs under plain Node 24 (type stripping).
- Prettier with `prettier-plugin-astro` already passes on all `.astro` files
  and is the only formatter found that formats Astro templates.

## Design

### Commands

| Task | Command | Underlying |
|---|---|---|
| Install | `npm install` (CI: `npm ci`) | npm |
| Dev | `npm run dev` | `astro dev` |
| Build | `npm run build` | `astro build` |
| Preview | `npm run preview` | `astro preview` |
| Type check | `npm run check` | `astro check` |
| Lint | `npm run lint` | `oxlint` |
| Format | `npm run format` / `npm run format:check` | Prettier |
| Test | `npm test` | `astro build && node scripts/check-dist.ts` |

### `package.json`

- Add devDependency `oxlint`; add script `"lint": "oxlint"`.
- Change `test` to `astro build && node scripts/check-dist.ts`.
- Bump `engines.node` to `>=22.18.0` (type stripping on by default; my
  belief, builder to confirm the exact version).
- Everything else unchanged.

### Files

- Delete `bun.lock`; commit `package-lock.json`.
- `.prettierignore`: replace `bun.lock` with `package-lock.json`.
- `scripts/check-dist.ts`: header comment `bun run test` -> `npm test`.
- `README.md`: replace the Bun bullet and the Dev section with the table
  above (npm), and update the Deploy step text (`npm run build`; check job
  also lints).
- `docs/superpowers/plans/` and the older spec mention Bun historically;
  leave them.

### CI (`.github/workflows/deploy.yml`)

Replace `oven-sh/setup-bun` and `bun ...` steps with, in each job:
`actions/setup-node@v4` (`node-version: 24`, `cache: npm`) then `npm ci`.
(Runner-preinstalled Node is older than Astro 7's `>=22.12`, so a Node
version is still selected, with an official action.)

- check job: `npm run check`, `npm run lint`, `npm run format:check`
- build job: `npm run build`

Job structure (`check -> build -> deploy`) and permissions unchanged.

## Verification (definition of done)

- `npm ci` from a clean checkout succeeds, with no Bun installed.
- `npm run check`, `lint`, `format:check`, `build` and `npm test` pass.
- `grep -ri bun` over tracked files outside `docs/` finds nothing.
- A branch push runs the workflow green through `check` and `build`.

## Left to the builder

- Confirm the first Node 22 release with default type stripping and set
  `engines` accordingly.
- Handle any Oxlint warning that appears with the installed version: fix or
  silence the smallest amount.

## My calls (not discussed with you)

- Standalone `oxlint` with defaults and no config file.
- `actions/setup-node` Node 24 with npm cache in CI.
- Lint runs in CI as a gate beside type check and format check.
- Plain Node runs `check-dist.ts`.
- `engines.node` bump to `>=22.18.0`.
