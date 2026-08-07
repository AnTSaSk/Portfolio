// @vitest-environment node
// nuxt.config.ts resolves sibling files through `import.meta.url`, which the
// jsdom environment does not expose as a file: URL.
import { beforeAll, describe, expect, it, vi } from 'vitest';

vi.stubGlobal('defineNuxtConfig', (config: unknown) => config);

interface HeadLink {
  rel?: string;
  as?: string;
  href?: string;
  crossorigin?: string;
}

interface HeadStyle {
  innerHTML?: string;
}

let preloadedFonts: string[];
let criticalCss: string;

beforeAll(async () => {
  const config = (await import('../../nuxt.config')).default as {
    app: { head: { link: HeadLink[]; style: HeadStyle[] } };
  };

  preloadedFonts = config.app.head.link
    .filter((link) => link.rel === 'preload' && link.as === 'font')
    .map((link) => link.href ?? '');

  criticalCss = config.app.head.style
    .map((style) => style.innerHTML ?? '')
    .join('\n');
});

describe('fonts preloaded in the document head', () => {
  it('preloads at least one font, otherwise the rest of this suite is vacuous', () => {
    expect(preloadedFonts.length).toBeGreaterThan(0);
  });

  it('declares every preloaded font in the critical CSS, so the browser claims the file it just downloaded', () => {
    for (const href of preloadedFonts) {
      expect(criticalCss).toContain(href);
    }
  });

  it('points every critical @font-face at an absolute URL, so it resolves the same on a nested route', () => {
    const sources = [...criticalCss.matchAll(/src:\s*url\(['"]?([^'")]+)/g)]
      .map((match) => match[1])
      .filter((source): source is string => source !== undefined);

    expect(sources.length).toBeGreaterThan(0);

    for (const source of sources) {
      expect(source.startsWith('/')).toBe(true);
    }
  });

  it('serves the critical @font-face under the base layer, so the external stylesheet keeps the same cascade', () => {
    const fontsLayer = criticalCss.indexOf('@layer fonts');
    const baseLayer = criticalCss.indexOf('@layer base {');

    expect(baseLayer).toBeGreaterThanOrEqual(0);
    expect(fontsLayer).toBeGreaterThan(baseLayer);
  });
});
