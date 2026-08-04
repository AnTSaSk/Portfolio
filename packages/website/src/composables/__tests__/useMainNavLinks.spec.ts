import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const localePathEn = (path: string): string => path;
const localePathFr = (path: string): string =>
  path === '/' ? '/fr' : `/fr${path}`;

const stubRoute = (path: string): void => {
  vi.stubGlobal(
    'useRoute',
    vi.fn(() => ({ path })),
  );
};

const stubLocalePath = (resolve: (path: string) => string): void => {
  vi.stubGlobal(
    'useLocalePath',
    vi.fn(() => resolve),
  );
};

const currentLabels = (
  links: ReadonlyArray<{ label: string; current: boolean }>,
): string[] => links.filter((link) => link.current).map((link) => link.label);

describe('useMainNavLinks', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'useI18n',
      vi.fn(() => ({ t: (key: string) => key })),
    );
    stubLocalePath(localePathEn);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('exposes the nav items in order: home, blog, projects, about', async () => {
    stubRoute('/');

    const { useMainNavLinks } = await import('../useMainNavLinks');
    const links = useMainNavLinks();

    expect(links.value.map((link) => link.href)).toEqual([
      '/',
      '/blog',
      '/projects',
      '/about',
    ]);
    expect(links.value.map((link) => link.label)).toEqual([
      'layouts.nav.home',
      'layouts.nav.blog',
      'layouts.nav.projects',
      'layouts.nav.about',
    ]);
  });

  it('marks only home as current on the home route', async () => {
    stubRoute('/');

    const { useMainNavLinks } = await import('../useMainNavLinks');

    expect(currentLabels(useMainNavLinks().value)).toEqual([
      'layouts.nav.home',
    ]);
  });

  it('marks only blog as current on the blog listing route', async () => {
    stubRoute('/blog');

    const { useMainNavLinks } = await import('../useMainNavLinks');

    expect(currentLabels(useMainNavLinks().value)).toEqual([
      'layouts.nav.blog',
    ]);
  });

  it('marks only blog as current on an article route', async () => {
    stubRoute('/blog/mon-article');

    const { useMainNavLinks } = await import('../useMainNavLinks');

    expect(currentLabels(useMainNavLinks().value)).toEqual([
      'layouts.nav.blog',
    ]);
  });

  it('marks only projects as current on a case study route', async () => {
    stubRoute('/projects/mon-projet');

    const { useMainNavLinks } = await import('../useMainNavLinks');

    expect(currentLabels(useMainNavLinks().value)).toEqual([
      'layouts.nav.projects',
    ]);
  });

  it('marks only blog as current on a locale-prefixed article route', async () => {
    stubLocalePath(localePathFr);
    stubRoute('/fr/blog/mon-article');

    const { useMainNavLinks } = await import('../useMainNavLinks');

    expect(currentLabels(useMainNavLinks().value)).toEqual([
      'layouts.nav.blog',
    ]);
  });

  it('marks only home as current on the locale-prefixed home route', async () => {
    stubLocalePath(localePathFr);
    stubRoute('/fr');

    const { useMainNavLinks } = await import('../useMainNavLinks');

    expect(currentLabels(useMainNavLinks().value)).toEqual([
      'layouts.nav.home',
    ]);
  });

  it('marks no item as current on a route with no nav ancestor', async () => {
    stubRoute('/legal');

    const { useMainNavLinks } = await import('../useMainNavLinks');

    expect(currentLabels(useMainNavLinks().value)).toEqual([]);
  });

  it('does not mark a section current for a sibling sharing its string prefix', async () => {
    stubRoute('/blogroll');

    const { useMainNavLinks } = await import('../useMainNavLinks');

    expect(currentLabels(useMainNavLinks().value)).toEqual([]);
  });

  it('does not mark home current on a nested route', async () => {
    stubRoute('/blog/mon-article');

    const { useMainNavLinks } = await import('../useMainNavLinks');
    const home = useMainNavLinks().value[0];

    expect(home?.current).toBe(false);
  });
});
