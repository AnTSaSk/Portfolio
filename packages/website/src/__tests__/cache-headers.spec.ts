// @vitest-environment node
// nuxt.config.ts resolves sibling files through `import.meta.url`, which the
// jsdom environment does not expose as a file: URL.
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';

import { beforeAll, describe, expect, it, vi } from 'vitest';

// nuxt.config.ts calls the auto-imported `defineNuxtConfig` macro, which has no
// runtime outside the Nuxt build: stubbing it to identity yields the raw config.
vi.stubGlobal('defineNuxtConfig', (config: unknown) => config);

interface RouteRule {
  headers?: Record<string, string>;
}

// Nitro resolves route rules through rou3, a transitive dependency reachable
// only from the nuxt package.
const requireFromNuxt = createRequire(
  createRequire(`${process.cwd()}/index.js`).resolve('nuxt/package.json'),
);

type Rou3 = {
  createRouter: () => object;
  addRoute: (
    router: object,
    method: string,
    path: string,
    data: RouteRule,
  ) => void;
  findAllRoutes: (
    router: object,
    method: string,
    path: string,
  ) => Array<{ data: RouteRule }>;
};

let resolveHeaders: (url: string) => Record<string, string>;

beforeAll(async () => {
  const { createRouter, addRoute, findAllRoutes } = (await import(
    pathToFileURL(requireFromNuxt.resolve('rou3')).href
  )) as Rou3;

  const { routeRules } = (await import('../../nuxt.config')).default as {
    routeRules: Record<string, RouteRule>;
  };

  const router = createRouter();

  for (const [pattern, rule] of Object.entries(routeRules)) {
    addRoute(router, '', pattern, rule);
  }

  // findAllRoutes returns matches from least to most specific; Nitro merges
  // them in that order, so the most specific rule wins.
  resolveHeaders = (url) =>
    findAllRoutes(router, '', url).reduce<Record<string, string>>(
      (headers, match) => ({ ...headers, ...match.data.headers }),
      {},
    );
});

describe('cache headers served for static assets', () => {
  it('serves hashed build assets with a one-year immutable cache', () => {
    expect(resolveHeaders('/_nuxt/entry.B3xK9dQz.js')['Cache-Control']).toBe(
      'public, max-age=31536000, immutable',
    );
  });

  it.each([
    '/img/Projects/_gen/Arneo_Cover-1280w.avif',
    '/img/Projects/_gen/Arneo_Gallery_Hero-632w.webp',
    '/img/Blog/_gen/author-600w.webp',
    '/img/_gen/og-default-1200w.avif',
  ])('serves the generated image variant %s with a 30-day cache', (url) => {
    expect(resolveHeaders(url)['Cache-Control']).toBe(
      'public, max-age=2592000',
    );
  });

  it('serves fonts with a 30-day cache', () => {
    expect(
      resolveHeaders('/fonts/inter-latin-400-normal.woff2')['Cache-Control'],
    ).toBe('public, max-age=2592000');
  });

  it.each([
    '/img/Projects/_gen/Arneo_Cover-1280w.avif',
    '/fonts/inter-latin-400-normal.woff2',
  ])('keeps %s revalidatable, so a regenerated asset can replace it', (url) => {
    expect(resolveHeaders(url)['Cache-Control']).not.toContain('immutable');
  });

  it('leaves HTML pages uncached so content updates are picked up', () => {
    expect(resolveHeaders('/blog/design-systems-101')['Cache-Control']).toBe(
      undefined,
    );
  });

  it('applies the baseline security headers to every URL', () => {
    expect(
      resolveHeaders('/img/Projects/_gen/Arneo_Cover-1280w.avif'),
    ).toMatchObject({ 'X-Content-Type-Options': 'nosniff' });
    expect(resolveHeaders('/blog')).toMatchObject({
      'X-Content-Type-Options': 'nosniff',
    });
  });
});

describe('image runtime configuration', () => {
  it('does not route requests through the IPX runtime transformer', async () => {
    const config = (await import('../../nuxt.config')).default as {
      routeRules: Record<string, RouteRule>;
      modules: string[];
    };

    expect(Object.keys(config.routeRules)).not.toContain('/_ipx/**');
    expect(config.modules).not.toContain('@nuxt/image');
  });
});
