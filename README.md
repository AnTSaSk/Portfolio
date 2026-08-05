# Alexis Besson - Portfolio

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Uptime status](https://img.shields.io/uptimerobot/status/m803620872-2ec4021f1d2e736b52148d33)](https://alexisbesson.fr)
[![Uptime ratio (30d)](https://img.shields.io/uptimerobot/ratio/30/m803620872-2ec4021f1d2e736b52148d33)](https://alexisbesson.fr)

Personal portfolio with an integrated design system, built as a server-side rendered PNPM monorepo.

Live at [alexisbesson.fr](https://alexisbesson.fr). Design system at [styleguide.alexisbesson.fr](https://styleguide.alexisbesson.fr)

## Stack

| Category      | Technologies                                                        |
| ------------- | ------------------------------------------------------------------- |
| Frontend      | Vue 3.5, Nuxt 4.4 (SSR), Vite 7, TypeScript 6 (strict)              |
| Design System | Storybook 10, Atomic Design, ABEM                                   |
| Styles        | Modern native CSS (`@layer`, nesting, `light-dark()`), ABEM         |
| Content       | @nuxt/content v3 (bilingual collections), @nuxt/image               |
| SEO & meta    | @nuxtjs/seo (sitemap, robots, Open Graph, JSON-LD)                  |
| i18n          | @nuxtjs/i18n, `prefix_except_default` (EN at `/`, FR at `/fr`)      |
| Observability | Sentry (@sentry/nuxt)                                               |
| Quality       | ESLint 10, Stylelint 17, Prettier, Commitlint, Husky, lint-staged   |
| Testing       | Vitest 4 (unit + component)                                         |
| Production    | Node >= 24, PNPM >= 11, Docker, GitHub Actions                      |

## Architecture

PNPM monorepo with three packages:

```
packages/
  website/      @antsask/website    - Nuxt SSR site
  styleguide/   @antsask/styleguide - Component library + Storybook
  cv/           @antsask/cv         - Static HTML/CSS ATS resume
```

The website consumes the styleguide as a workspace dependency. Components follow Atomic Design (Atoms, Molecules, Organisms, Layouts) with ABEM class naming.

Each package has its own README:

- [`packages/website`](packages/website/README.md): Nuxt SSR site
- [`packages/styleguide`](packages/styleguide/README.md): component library and Storybook
- [`packages/cv`](packages/cv/README.md): static ATS resume

## Code Quality

- Linting: ESLint with TypeScript strict rules, Vue accessibility plugin, enforced import ordering
- Styles: Stylelint enforces ABEM naming, max 2-level nesting, property ordering (native CSS)
- Formatting: Prettier (single quotes, trailing commas)
- Git hooks: Husky + lint-staged on every commit, Commitlint on messages
- Type checking: `vue-tsc` across the packages
- Testing: unit and component tests with Vitest + Vue Test Utils
- CI/CD: GitHub Actions pipeline (lint, type-check, audit, build, deploy)

## Getting Started

### Prerequisites

- Node.js >= 24
- PNPM >= 11

### Install and run

```bash
pnpm install
pnpm dev:website        # Nuxt dev server
pnpm dev:styleguide     # Storybook on port 6006
```

### Scripts

| Command                    | Description                                             |
| -------------------------- | ------------------------------------------------------- |
| `pnpm dev:website`         | Start the Nuxt dev server                               |
| `pnpm dev:styleguide`      | Start Storybook on port 6006                            |
| `pnpm build:website`       | Type-check and build Nuxt for production                |
| `pnpm build:styleguide`    | Build Storybook                                         |
| `pnpm lint`                | Run ESLint across all packages                          |
| `pnpm lint:style`          | Run Stylelint across all packages                       |
| `pnpm lint:markup`         | Run `vue-tsc` type checking                             |
| `pnpm test`                | Run Vitest across all packages                          |
| `pnpm test:coverage`       | Run Vitest with coverage across all packages            |
| `pnpm generate:components` | Auto-generate styleguide component exports              |
| `pnpm perf:audit`          | Build the site and run Lighthouse CI (mobile + desktop) |

Most tasks also have a per-package variant, filtered with `--filter` (e.g. `pnpm lint:website`, `pnpm test:styleguide`).

## License

Code is released under the [MIT License](LICENSE). Editorial content, design, brand identity and images are all rights reserved, see [NOTICE](NOTICE).
