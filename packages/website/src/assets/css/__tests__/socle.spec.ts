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

  describe('sprite host : symbol store, never part of the layout', () => {
    it('takes no space and is anchored, so it cannot lengthen the document', () => {
      const rule =
        readCss('layout.css').match(/\.l-spriteHost\s*\{[^}]*\}/)?.[0] ?? '';

      expect(rule).toMatch(/position:\s*absolute/);
      expect(rule).toMatch(/width:\s*0/);
      expect(rule).toMatch(/height:\s*0/);
      expect(rule).toMatch(/overflow:\s*hidden/);
      // Without an offset an absolute box keeps its static position and still
      // occupies a line in the flow.
      expect(rule).toMatch(/top:\s*0/);
      expect(rule).toMatch(/left:\s*0/);
    });
  });

  describe('fullscreen layouts : content fills, scroll only when it overflows', () => {
    const fullscreenRule = (): string =>
      readCss('layout.css').match(
        /\.l-layoutLanding\.-fullscreen[^{]*\{[^}]*\}/,
      )?.[0] ?? '';

    it('sizes every layout frame as a minimum, so real content can grow past it', () => {
      const layoutCss = readCss('layout.css');

      expect(layoutCss).toMatch(/min-block-size:\s*100dvh/);
      expect(layoutCss).not.toMatch(/block-size:\s*100svh/);
      // 100vh counts the mobile browser bars, guaranteeing an overflow.
      expect(layoutCss).not.toMatch(/:\s*100vh/);
    });

    it('never traps the overflow, so the page scrolls when content exceeds the viewport', () => {
      const rule = fullscreenRule();

      expect(rule).not.toMatch(/overflow-y:\s*hidden/);
      // Horizontal clipping stays: the full-bleed watermark must not widen the page.
      expect(rule).toMatch(/overflow-x:\s*clip/);
    });

    it('does not lock scrolling on html or body', () => {
      const layoutCss = readCss('layout.css');

      expect(layoutCss).not.toMatch(/html:has\(/);
      expect(layoutCss).not.toMatch(/body:has\(/);
    });

    it('lets the content block grow instead of pinning it to a percentage height', () => {
      const pageCss = readCss('page.css');

      expect(pageCss).not.toMatch(/min-block-size:\s*100%/);
    });

    it('lets the content band breathe elastically so decorative margins alone never force a scroll', () => {
      const rule =
        readCss('layout.css').match(
          /\.-fullscreen\s+\.l-container__wrapper\s*\{[^}]*\}/,
        )?.[0] ?? '';

      // Fixed 80px top+bottom margins overflow a viewport-height frame on their
      // own; the band must shrink before the real content is pushed out.
      expect(rule).toMatch(/margin-block:\s*clamp\(/);
    });

    it.each(['-home', '-about', '-error'])(
      'never clips %s, whose decorations overflow it on purpose',
      (page) => {
        const rule =
          readCss('page.css').match(
            new RegExp(`\\.l-page\\.\\${page}\\s*\\{[^}]*\\}`),
          )?.[0] ?? '';

        // The radial glow reaches above the block by design; clipping the block
        // would cut that bleed off with a visible hard edge.
        expect(rule).not.toMatch(/overflow:/);
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
