# @antsask/website

The public portfolio site, server-side rendered with Nuxt. It consumes [`@antsask/styleguide`](../styleguide/README.md) as a workspace dependency and reads its editorial content from `@nuxt/content` collections.

Part of the [portfolio monorepo](../../README.md): run scripts from the repo root with `--filter @antsask/website`, or locally from this directory.

## Stack

| Category | Technologies |
|----------|-------------|
| Framework | Nuxt 4.4 (SSR), Vue 3.5, Vite 7, TypeScript 6 (strict) |
| Content | @nuxt/content v3 (bilingual collections, SQLite via better-sqlite3), @nuxt/image |
| i18n | @nuxtjs/i18n, `prefix_except_default` (EN at `/`, FR at `/fr`) |
| SEO & meta | @nuxtjs/seo (sitemap, robots, Open Graph, JSON-LD) |
| Observability | Sentry (@sentry/nuxt) |
| Testing | Vitest 4 + Vue Test Utils |

## Structure

```
content/          Editorial content (about, blog, legal, projects), bilingual
i18n/             i18n locale configuration and messages
public/           Static assets served as-is
server/           Nitro server routes
src/
  assets/         CSS entry and static assets
  components/      Site-specific Vue components
  composables/    Reusable composition functions
  config/         App configuration
  constants/      Shared constants
  layouts/        Nuxt layouts
  pages/          File-based routes
  types/          TypeScript types
  utils/          Utilities
```

## Scripts

| Command | Description |
|---------|-------------|
| `dev` | Start the Nuxt dev server |
| `build` | Type-check (`vue-tsc`) and build for production |
| `generate` | Static site generation |
| `preview` | Preview the production build |
| `lint` | ESLint |
| `lint:style` | Stylelint over `src/**/*.css` |
| `lint:markup` | `vue-tsc` type checking (builds styleguide types first) |
| `test` | Run unit tests |
| `test:watch` | Run unit tests in watch mode |
| `test:coverage` | Run unit tests with coverage |

## Notes

- **Styleguide dependency.** Type checking and building both run `build:types` on `@antsask/styleguide` first, so the consumed component types are up to date.
- **i18n routing.** English is the default locale served at the root (`/`); French is prefixed (`/fr`).
- **Content.** Pages pull from `@nuxt/content` collections under `content/`, one folder per collection, bilingual.

## License

See the root [LICENSE](../../LICENSE). This package is declared `SEE LICENSE IN LICENSE`: code is MIT, editorial content and images are all rights reserved (see [NOTICE](../../NOTICE)).
