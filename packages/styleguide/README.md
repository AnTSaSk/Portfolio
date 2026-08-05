# @antsask/styleguide

The design system: a Vue component library organised by Atomic Design, documented and previewed in Storybook. Consumed by [`@antsask/website`](../website/README.md) as a workspace dependency.

Live Storybook: [styleguide.alexisbesson.fr](https://styleguide.alexisbesson.fr)

Part of the [portfolio monorepo](../../README.md): run scripts from the repo root with `--filter @antsask/styleguide`, or locally from this directory.

## Stack

| Category | Technologies |
|----------|-------------|
| Components | Vue 3.5, TypeScript 6 (strict), Atomic Design, ABEM |
| Documentation | Storybook 10 (Vue 3 + Vite), a11y, docs, themes addons |
| Styles | Modern native CSS (`@layer`, nesting, `light-dark()`) |
| Testing | Vitest 4 + Vue Test Utils, jsdom |

## Structure

```
src/
  assets/         CSS layers (tokens, base, utilities, app) and the icon sprite
  components/
    Atoms/        Smallest building blocks
    Molecules/    Compositions of atoms
    Organisms/    Compositions of molecules
  docs/           Storybook documentation pages
bin/              Build scripts (icon sprite, component export generation)
types/            Emitted type declarations (build output)
```

## Exports

The package exposes the component barrel plus individual CSS layers, importable by consumers:

| Export | Path |
|--------|------|
| `.` | Component library (`src/index.ts`) |
| `./tokens.css` | Design tokens |
| `./base.css` | Base styles |
| `./utilities.css` | Utility classes |
| `./app.css` | Composed app stylesheet |

## Scripts

| Command | Description |
|---------|-------------|
| `dev` | Start Storybook on port 6006 |
| `build` | Type-check, emit types, and build Storybook to `storybook-static` |
| `build:types` | Emit `.d.ts` declarations (used by the website before its build) |
| `generate:icons` | Rebuild the SVG sprite from source icons |
| `lint` | ESLint |
| `lint:style` | Stylelint over `src/**/*.css` |
| `lint:markup` | `vue-tsc` type checking |
| `test` | Run unit and component tests |
| `test:watch` | Run tests in watch mode |
| `test:coverage` | Run tests with coverage |

The component export barrel is regenerated from the repo root with `pnpm generate:components`.

## Conventions

- **Atomic Design.** Components live under `Atoms/`, `Molecules/`, or `Organisms/`; an organism may compose molecules and atoms, never the reverse.
- **ABEM.** Class naming follows ABEM (`a-`/`m-`/`o-`/`l-`/`u-` prefixes, compound modifiers `.block.-mod`), enforced by Stylelint.
- **File layout.** Each component is a `Name/` folder with `index.vue`, `index.ts`, `style.css`, `index.stories.ts`, and `__tests__/`.

## License

[MIT](../../LICENSE).
