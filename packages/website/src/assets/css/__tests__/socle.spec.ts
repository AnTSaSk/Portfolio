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
