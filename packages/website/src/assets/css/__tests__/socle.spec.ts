import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

const cssDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const readCss = (filename: string): string =>
  readFileSync(path.join(cssDir, filename), 'utf-8');

describe('website socle CSS', () => {
  describe('socle files exist', () => {
    it.each(['app.css', 'base.css', 'layout.css', 'utilities.css'])(
      '%s exists in src/assets/css',
      (filename) => {
        expect(existsSync(path.join(cssDir, filename))).toBe(true);
      },
    );
  });

  describe('cascade layers declared in app.css', () => {
    it('declares base, components, layout, utilities layers in that order', () => {
      const appCss = readCss('app.css');

      expect(appCss).toMatch(
        /@layer\s+base\s*,\s*components\s*,\s*layout\s*,\s*utilities\s*;/,
      );
    });
  });

  describe('single-source design tokens', () => {
    it('imports design tokens from @antsask/styleguide/tokens.css', () => {
      const appCss = readCss('app.css');

      expect(appCss).toMatch(
        /@import\s+['"]@antsask\/styleguide\/tokens\.css['"]/,
      );
    });
  });

  describe('spacing scale : no effective px drift on existing usages', () => {
    const tokensCss = readFileSync(
      path.resolve(cssDir, '../../../../styleguide/src/assets/css/tokens.css'),
      'utf-8',
    );
    const scale = new Map<string, string>();

    for (const match of tokensCss.matchAll(/--space-(\d+):\s*([^;]+);/g)) {
      const [, index, value] = match;

      if (index === undefined || value === undefined) {
        throw new Error(`Unparsable --space token: ${match[0]}`);
      }

      scale.set(index, value.trim());
    }

    // px values the pre-renumbering usages resolved to, in source order.
    // Asserted as a subsequence: later passes may add new tokenized usages,
    // but none of these historical ones may shift.
    const EXPECTED_USAGES: Array<[string, string[]]> = [
      ['layout.css', ['24px', '80px', '96px']],
      [
        'page.css',
        ['24px', '8px', '32px', '8px', '16px', '64px', '80px', '80px', '112px'],
      ],
    ];

    it.each(EXPECTED_USAGES)(
      '%s keeps its effective px values',
      (file, sizes) => {
        const resolved = [
          ...readCss(file).matchAll(/var\(\s*--space-(\d+)\s*\)/g),
        ].map(([, index]) =>
          index === undefined ? undefined : scale.get(index),
        );

        let cursor = 0;

        for (const size of sizes) {
          cursor = resolved.indexOf(size, cursor) + 1;

          expect(cursor, `missing ${size} in ${file}`).toBeGreaterThan(0);
        }
      },
    );
  });

  describe('content-band wrapper composed, not re-authored', () => {
    it('layout.css does not define its own .container selector', () => {
      const layoutCss = readCss('layout.css');

      expect(layoutCss).not.toMatch(/\.container\b/);
    });

    it('layout.css does not declare its own max-inline-size: var(--container-max)', () => {
      const layoutCss = readCss('layout.css');

      expect(layoutCss).not.toMatch(
        /max-inline-size:\s*var\(--container-max\)/,
      );
    });
  });
});
