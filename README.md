# Alexis Besson — Portfolio

Personal portfolio with an integrated design system, built as a server-side rendered monorepo.

Live at [alexisbesson.fr](https://alexisbesson.fr)

## Stack

| Category | Technologies |
|----------|-------------|
| Frontend | Vue 3, Nuxt 4 (SSR), TypeScript 5 (strict) |
| Design System | Storybook 10, Atomic Design, ABEM |
| Styles | SCSS/Sass, CSS custom properties |
| i18n | English (en-US), French (fr-FR) |
| Quality | ESLint 9, Stylelint 17, Prettier, Husky |
| Testing | Vitest (unit), Playwright (e2e), Lighthouse CI |
| Production | Docker Swarm, Traefik, GitHub Actions, GHCR |

## Architecture

PNPM monorepo with two packages:

```
packages/
  styleguide/   @antsask/styleguide — Component library + Storybook
  website/      @antsask/website    — Nuxt SSR site
```

The website consumes the styleguide as a workspace dependency. Components follow Atomic Design (Atoms, Molecules, Organisms, Templates) with ABEM class naming.

## Code Quality

- **Linting** — ESLint with TypeScript strict rules, Vue accessibility plugin, and enforced import ordering
- **Styles** — Stylelint enforces ABEM naming, max 2-level nesting, and property ordering
- **Formatting** — Prettier (80 chars, single quotes, trailing commas)
- **Git hooks** — Husky + lint-staged runs linters on every commit
- **Type checking** — `vue-tsc --noEmit` across all packages
- **Testing** — Unit tests with Vitest + Vue Test Utils, e2e with Nuxt Test Utils + Playwright
- **CI/CD** — GitHub Actions pipeline: lint, type-check, audit, build, Trivy scan, deploy, Lighthouse CI
- **Lighthouse thresholds** — Performance 85%, Accessibility 90%, SEO 90%

## Getting Started

### Prerequisites

- Node.js >= 24
- PNPM >= 10

### Install and run

```bash
pnpm install
pnpm dev:website        # Nuxt dev server
pnpm dev:styleguide     # Storybook on port 6006
```

### Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev:website` | Start Nuxt dev server |
| `pnpm dev:styleguide` | Start Storybook on port 6006 |
| `pnpm build:website` | Type-check and build Nuxt for production |
| `pnpm build:styleguide` | Build Storybook |
| `pnpm lint` | Run ESLint across all packages |
| `pnpm lint:style` | Run Stylelint on SCSS files |
| `pnpm lint:markup` | Run vue-tsc type checking |
| `pnpm generate:components` | Auto-generate styleguide component exports |

## License

[MIT](LICENSE)
