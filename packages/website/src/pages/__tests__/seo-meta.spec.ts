import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { defineComponent, h, ref } from 'vue';

import { createT } from './__stubs__/createT';
import en from '../../../i18n/locales/en.json';
import fr from '../../../i18n/locales/fr.json';

import { useSeoMetaMock } from '@/__tests__/setup/nuxt-macros';

// editorial per-page title/description meta, driven by i18n, with
// EN/FR parity. hreflang alternates are emitted automatically by
// i18n+seo and are proven present in the SSR head by the barrier (plan task
// 3.8), never unit-tested here, no wiring test for a module default.

type Messages = Record<string, unknown>;

const getByPath = (obj: Messages, path: string): unknown =>
  path
    .split('.')
    .reduce<unknown>((acc, key) => (acc as Messages | undefined)?.[key], obj);

const OrganismHeroStub = defineComponent({
  name: 'OrganismHero',
  setup: (): (() => ReturnType<typeof h>) => () => h('div'),
});

vi.mock('@antsask/styleguide', () => ({
  Hero: OrganismHeroStub,
  Heading: defineComponent({
    name: 'AtomHeading',
    setup:
      (_props, { slots }) =>
      (): ReturnType<typeof h> =>
        h('h1', slots.default?.()),
  }),
  Text: defineComponent({
    name: 'AtomText',
    setup:
      (_props, { slots }) =>
      (): ReturnType<typeof h> =>
        h('p', slots.default?.()),
  }),
  Link: defineComponent({
    name: 'AtomLink',
    setup:
      (_props, { slots }) =>
      (): ReturnType<typeof h> =>
        h('a', slots.default?.()),
  }),
  Watermark: defineComponent({
    name: 'AtomWatermark',
    setup: (): (() => ReturnType<typeof h>) => () => h('div'),
  }),
}));

function stubEnv(locale: 'en' | 'fr'): void {
  const t = createT(locale);

  vi.stubGlobal('useI18n', () => ({ locale: { value: locale }, t }));
  vi.stubGlobal('useLocalePath', () => vi.fn((path: string) => path));
  vi.stubGlobal('useSwitchLocalePath', () =>
    vi.fn((target: string) => `/${target}`),
  );
  vi.stubGlobal('navigateTo', vi.fn());
  vi.stubGlobal('useRoute', () => ({ path: locale === 'fr' ? '/fr' : '/' }));
  vi.stubGlobal(
    'useAsyncData',
    (_key: string, handler: () => Promise<unknown>) => {
      const data = ref<unknown>(null);

      handler()
        .then((result) => {
          data.value = result;
        })
        .catch(() => {
          data.value = null;
        });

      return {
        data,
        pending: ref(false),
        error: ref(null),
        refresh: vi.fn(),
      };
    },
  );
  vi.stubGlobal('queryCollection', vi.fn());
  vi.stubGlobal(
    'createError',
    vi.fn((input: unknown) => input),
  );
  vi.stubGlobal('showError', vi.fn());
}

describe('editorial per-page SEO meta keys exist with EN/FR parity', () => {
  const editorialKeys = [
    'home.seo.title',
    'home.seo.description',
    'about.seo.title',
    'about.seo.description',
    'blog.seo.title',
    'blog.seo.description',
    'projects.seo.title',
    'projects.seo.description',
    'legal.seo.title',
    'legal.seo.description',
  ];

  it.each(editorialKeys)('%s is defined in en.json', (key) => {
    expect(getByPath(en as Messages, key)).toEqual(expect.any(String));
  });

  it.each(editorialKeys)('%s is defined in fr.json', (key) => {
    expect(getByPath(fr as Messages, key)).toEqual(expect.any(String));
  });
});

describe('legal page consumes the new legal.seo.* editorial keys', () => {
  it('posts legal.seo.title and legal.seo.description via useSeoMeta when no document title is resolved yet', async () => {
    useSeoMetaMock.mockClear();
    stubEnv('en');

    const t = createT('en');
    const LegalPage = (await import('../legal/index.vue')).default;

    mount(LegalPage, {
      global: {
        components: {
          ContentRenderer: defineComponent({
            name: 'ContentRenderer',
            setup: (): (() => ReturnType<typeof h>) => () => h('div'),
          }),
        },
      },
    });

    const call = useSeoMetaMock.mock.calls.at(-1)?.[0] as
      Record<string, unknown> | undefined;

    expect(call).toBeDefined();
    expect(call!.title).toBe(t('legal.seo.title'));
    expect(call!.description).toBe(t('legal.seo.description'));
  });

  it('posts the French legal.seo.title and legal.seo.description in the fr locale', async () => {
    useSeoMetaMock.mockClear();
    stubEnv('fr');

    const t = createT('fr');
    const LegalPage = (await import('../legal/index.vue')).default;

    mount(LegalPage, {
      global: {
        components: {
          ContentRenderer: defineComponent({
            name: 'ContentRenderer',
            setup: (): (() => ReturnType<typeof h>) => () => h('div'),
          }),
        },
      },
    });

    const call = useSeoMetaMock.mock.calls.at(-1)?.[0] as
      Record<string, unknown> | undefined;

    expect(call).toBeDefined();
    expect(call!.title).toBe(t('legal.seo.title'));
    expect(call!.description).toBe(t('legal.seo.description'));
  });
});

// hreflang: emitted automatically by @nuxtjs/i18n + @nuxtjs/seo
// per the verified module API , no wiring
// exists to unit-test. Presence of EN/FR/x-default <link rel="alternate"
// hreflang> in the served HTML head is proven by the SSR barrier (task 3.8).

// Mounting blog/[slug].vue requires the full content-collection/TOC harness;
// invoked here the same way the page does instead: no `image` option passed
// when the article/project has no cover.
describe('detail page without a cover falls back to the brand og-default image', () => {
  it('posts the og-default.jpg fallback via useSeoMeta when useSeo is called without an image (portfolio-v1 case)', async () => {
    useSeoMetaMock.mockClear();
    vi.stubGlobal(
      'useI18n',
      vi.fn(() => ({ locale: { value: 'en' } })),
    );

    const { useSeo } = await import('../../composables/useSeo');

    useSeo({
      title: 'Portfolio v1',
      description: 'Rebuilding my portfolio from scratch',
      type: 'article',
    });

    const call = useSeoMetaMock.mock.calls.at(-1)?.[0] as
      Record<string, unknown> | undefined;

    expect(call).toBeDefined();

    const resolveValue = (value: unknown): unknown =>
      typeof value === 'function' ? (value as () => unknown)() : value;

    expect(resolveValue(call!.ogImage)).toBe(
      'https://alexisbesson.fr/img/og-default.jpg',
    );
    expect(resolveValue(call!.twitterImage)).toBe(
      'https://alexisbesson.fr/img/og-default.jpg',
    );
  });
});

// Invoked the same way [slug].vue does: an `image` option backed by a
// ref/computed that only settles after useSeo's initial call, since
// useAsyncData is not awaited before useSeo runs on the real page.
describe('detail page with a resolved cover emits the recadrée og:image variant', () => {
  it('posts the recadrée JPEG variant via useSeoMeta once the coverImage computed resolves (page-like timing)', async () => {
    useSeoMetaMock.mockClear();
    vi.stubGlobal(
      'useI18n',
      vi.fn(() => ({ locale: { value: 'en' } })),
    );

    const { useSeo } = await import('../../composables/useSeo');
    const coverImage = ref<{ src: string } | undefined>(undefined);

    useSeo({
      title: 'Portfolio v2',
      description: 'Rebuilding my portfolio with a design system',
      type: 'article',
      image: coverImage,
    });

    coverImage.value = { src: '/img/Portfolio_Arneo_Cover.jpg' };

    const call = useSeoMetaMock.mock.calls.at(-1)?.[0] as
      Record<string, unknown> | undefined;

    expect(call).toBeDefined();

    const resolveValue = (value: unknown): unknown =>
      typeof value === 'function' ? (value as () => unknown)() : value;

    expect(resolveValue(call!.ogImage)).toBe(
      'https://alexisbesson.fr/_ipx/cover_1200x630_jpeg/img/Portfolio_Arneo_Cover.jpg',
    );
    expect(resolveValue(call!.twitterImage)).toBe(
      'https://alexisbesson.fr/_ipx/cover_1200x630_jpeg/img/Portfolio_Arneo_Cover.jpg',
    );
    expect(resolveValue(call!.ogImageAlt)).toBe('Portfolio v2');
  });
});
