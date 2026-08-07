# @antsask/cv

A standalone, ATS-friendly resume as a static HTML/CSS page, built with Vite. Isolated from the rest of the monorepo: it has no dependency on the website or the styleguide, and it deliberately **stays in SCSS** while the other packages moved to native CSS.

Part of the [portfolio monorepo](../../README.md): run scripts from the repo root with `--filter @antsask/cv`, or locally from this directory.

## Stack

| Category | Technologies |
|----------|-------------|
| Build | Vite 7, TypeScript 6 (strict) |
| Styles | SCSS (Sass) |
| Testing | Vitest 4, jsdom |

## Structure

```
index.html        English resume (entry point)
fr/index.html     French resume
src/
  assets/         Fonts and logo
  styles/         SCSS partials (_vars, _base, _header, _sections, _print) + main.scss
  __tests__/      Tests
dist/             Build output
```

## Scripts

| Command | Description |
|---------|-------------|
| `dev` | Start the Vite dev server |
| `build` | Type-check and build to `dist/` |
| `lint` | ESLint |
| `lint:style` | Stylelint over `src/**/*.scss` |
| `lint:markup` | TypeScript type checking |
| `test` | Run tests |

## Notes

- **ATS-friendly.** Semantic HTML and print-oriented styles (`_print.scss`) so the resume parses cleanly through applicant tracking systems and prints well.
- **Print-safe gradient titles.** `background-clip: text` breaks in the browser print pipeline, so titles emulate the gradient with per-letter solid colors on static spans, and text stays fully extractable.
- **Bilingual.** English at the root, French under `fr/`.
- **SCSS by design.** This package is intentionally left in SCSS; do not migrate it to native CSS.

## License

Code is released under the [MIT License](../../LICENSE) like the rest of the monorepo. The editorial content of this package (resume text, personal layout, photograph) is the property of Alexis Besson and is all rights reserved, see [NOTICE](../../NOTICE).
