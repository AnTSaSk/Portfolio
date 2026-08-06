import { flushPromises, mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import {
  type Component,
  defineComponent,
  h,
  ref,
  Suspense,
  toValue,
} from 'vue';

import { createT } from '../../__tests__/__stubs__/createT';

// The page has an async setup (awaited useAsyncData); VTU 2.x only resolves
// it when mounted under a Suspense boundary, mirroring Nuxt's own runtime.
function mountSuspended(component: Component): ReturnType<typeof mount> {
  const Host = defineComponent({
    setup: () => (): ReturnType<typeof h> =>
      h(Suspense, null, { default: () => h(component) }),
  });

  return mount(Host);
}

interface TocLinkFixture {
  id: string;
  text: string;
  depth: number;
}

interface ArticleFixture {
  title: string;
  description: string;
  date: string;
  tags: string[];
  cover?: { src: string; width: number; height: number; caption?: string };
  path: string;
  body: { toc: { links: TocLinkFixture[] } };
}

function makeArticle(overrides: Partial<ArticleFixture>): ArticleFixture {
  return {
    title: 'Design systems 101',
    description: 'A lede about design systems.',
    date: '2026-01-10',
    tags: ['design-systems', 'css'],
    cover: {
      src: '/img/cover.jpg',
      width: 2560,
      height: 1440,
      caption: 'A caption for the cover.',
    },
    path: '/blog/en/design-systems-101',
    body: {
      toc: {
        links: [
          { id: 'intro', text: 'Intro', depth: 2 },
          { id: 'principles', text: 'Principles', depth: 2 },
          { id: 'tokens', text: 'Tokens', depth: 2 },
        ],
      },
    },
    ...overrides,
  };
}

const RELATED_FIXTURES: ArticleFixture[] = [
  makeArticle({ title: 'Related one', path: '/blog/en/related-one' }),
  makeArticle({ title: 'Related two', path: '/blog/en/related-two' }),
];

// --- Minimal structural stubs for the barrel components this page composes.
// Aligned to the real OrganismHead API (metaDate/metaDuration strings, not a
// generic `meta` array) so the page's reading-time wiring is observable.
const HeadStub = defineComponent({
  name: 'OrganismHead',
  props: {
    variant: { type: String, default: '' },
    title: { type: String, default: '' },
    lede: { type: String, default: '' },
    tags: { type: Array, default: () => [] },
    metaDate: { type: String, default: '' },
    metaDuration: { type: String, default: '' },
  },
  setup: (props) => (): ReturnType<typeof h> =>
    h('header', { class: 'o-head' }, [
      props.title,
      props.metaDate,
      props.metaDuration,
    ]),
});

const MediaCoverStub = defineComponent({
  name: 'MoleculeMediaCover',
  props: {
    src: { type: String, default: '' },
    image: { type: Object, default: undefined },
    caption: { type: String, default: undefined },
  },
  setup: (): (() => ReturnType<typeof h>) => () =>
    h('figure', { class: 'm-cover' }),
});

const TOCStub = defineComponent({
  name: 'MoleculeTOC',
  props: {
    links: { type: Array, default: () => [] },
    activeId: { type: String, default: null },
  },
  setup: (): (() => ReturnType<typeof h>) => () => h('nav', { class: 'm-toc' }),
});

const AuthorStub = defineComponent({
  name: 'MoleculeAuthor',
  props: { name: { type: String, default: '' } },
  setup: (): (() => ReturnType<typeof h>) => () =>
    h('aside', { class: 'm-author' }),
});

const RelatedStub = defineComponent({
  name: 'OrganismRelated',
  props: { items: { type: Array, default: () => [] } },
  setup: (): (() => ReturnType<typeof h>) => () =>
    h('section', { class: 'o-related' }),
});

vi.mock('@antsask/styleguide', () => ({
  Head: HeadStub,
  MediaCover: MediaCoverStub,
  TOC: TOCStub,
  Author: AuthorStub,
  Related: RelatedStub,
}));

const useTocTrackingMock = vi.fn(() => ({ activeId: ref('principles') }));

vi.mock('@/composables/useTocTracking', () => ({
  useTocTracking: useTocTrackingMock,
}));

const readingTimeMock = vi.fn(() => 4);

vi.mock('@/utils/readingTime', () => ({
  readingTime: readingTimeMock,
}));

const createErrorMock = vi.fn((input: unknown) => input);
const showErrorMock = vi.fn();

function createQueryCollectionMock(
  match: ArticleFixture | null,
  related: ArticleFixture[],
): Record<string, unknown> {
  const builder: Record<string, unknown> = {
    where: vi.fn(() => builder),
    andWhere: vi.fn(() => builder),
    orWhere: vi.fn(() => builder),
    order: vi.fn(() => builder),
    limit: vi.fn(() => builder),
    all: vi.fn(() => Promise.resolve(match ? related : [])),
    first: vi.fn(() => Promise.resolve(match)),
    then: (resolve: (value: ArticleFixture[]) => unknown) =>
      Promise.resolve(match ? [match] : []).then(resolve),
  };

  return builder;
}

function stubEnv(
  locale: 'en' | 'fr',
  slug: string,
  match: ArticleFixture | null,
  related: ArticleFixture[] = RELATED_FIXTURES,
): void {
  const rawT = createT(locale);
  const t = (key: string, params?: Record<string, unknown>): string => {
    const raw = rawT(key);

    if (!params) {
      return raw;
    }

    return Object.entries(params).reduce(
      (acc, [name, value]) => acc.replaceAll(`{${name}}`, String(value)),
      raw,
    );
  };

  vi.stubGlobal('useI18n', () => ({ locale: { value: locale }, t }));
  vi.stubGlobal('useRoute', () => ({ params: { slug } }));
  vi.stubGlobal(
    'queryCollection',
    vi.fn(() => createQueryCollectionMock(match, related)),
  );
  vi.stubGlobal(
    'useAsyncData',
    (_key: string, handler: () => Promise<unknown>) => {
      // A real ref, like Nuxt's own return, so the page's computeds react
      // when the async data resolves.
      const data = ref<unknown>(null);

      // Mirror Nuxt: a handler that throws (404 via createError) rejects into
      // the error ref rather than surfacing as an unhandled rejection.
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
  vi.stubGlobal('createError', createErrorMock);
  vi.stubGlobal('showError', showErrorMock);
}

describe('pages/blog/[slug].vue', () => {
  it('passes the cover caption to MediaCover and as the figure title attribute', async () => {
    stubEnv('en', 'design-systems-101', makeArticle({}));
    const BlogArticle = (await import('../[slug].vue')).default;
    const wrapper = mountSuspended(BlogArticle);

    await flushPromises();

    const cover = wrapper.findComponent({ name: 'MoleculeMediaCover' });

    expect(cover.props('caption')).toBe('A caption for the cover.');
    expect(cover.attributes('title')).toBe('A caption for the cover.');
  });

  it('omits the caption when the cover declares none', async () => {
    stubEnv(
      'en',
      'design-systems-101',
      makeArticle({
        cover: { src: '/img/cover.jpg', width: 2560, height: 1440 },
      }),
    );
    const BlogArticle = (await import('../[slug].vue')).default;
    const wrapper = mountSuspended(BlogArticle);

    await flushPromises();

    const cover = wrapper.findComponent({ name: 'MoleculeMediaCover' });

    expect(cover.props('caption')).toBeUndefined();
    expect(cover.attributes('title')).toBeUndefined();
  });

  it('composes Head(article) + MediaCover + Prose + Author + Related from the barrel', async () => {
    stubEnv('en', 'design-systems-101', makeArticle({}));
    const BlogArticle = (await import('../[slug].vue')).default;
    const wrapper = mountSuspended(BlogArticle);

    await flushPromises();

    expect(
      wrapper.findComponent({ name: 'OrganismHead' }).props('variant'),
    ).toBe('article');
    expect(wrapper.findComponent({ name: 'MoleculeMediaCover' }).exists()).toBe(
      true,
    );
    expect(wrapper.find('.a-prose').exists()).toBe(true);
    expect(wrapper.findComponent({ name: 'MoleculeAuthor' }).exists()).toBe(
      true,
    );
    expect(wrapper.findComponent({ name: 'OrganismRelated' }).exists()).toBe(
      true,
    );
  });

  it('maps the fetched article title, lede and tags onto Head', async () => {
    const article = makeArticle({
      title: 'Design systems 101',
      description: 'A lede.',
    });

    stubEnv('en', 'design-systems-101', article);
    const BlogArticle = (await import('../[slug].vue')).default;
    const wrapper = mountSuspended(BlogArticle);

    await flushPromises();

    const head = wrapper.findComponent({ name: 'OrganismHead' });

    expect(head.props('title')).toBe('Design systems 101');
    expect(head.props('lede')).toBe('A lede.');
    expect(head.props('tags')).toEqual(['design-systems', 'css']);
  });

  it('passes the article TOC heading ids to useTocTracking', async () => {
    stubEnv('en', 'design-systems-101', makeArticle({}));
    const BlogArticle = (await import('../[slug].vue')).default;

    mountSuspended(BlogArticle);
    await flushPromises();

    // useTocTracking is called synchronously in setup with a reactive source
    // (getter/ref), so it wires to the heading ids once the article resolves.
    const headingSource = (
      useTocTrackingMock.mock.calls.at(-1) as unknown[] | undefined
    )?.[0];

    expect(toValue(headingSource)).toEqual(['intro', 'principles', 'tokens']);
  });

  it('renders TOC with the activeId resolved from useTocTracking', async () => {
    stubEnv('en', 'design-systems-101', makeArticle({}));
    const BlogArticle = (await import('../[slug].vue')).default;
    const wrapper = mountSuspended(BlogArticle);

    await flushPromises();

    expect(
      wrapper.findComponent({ name: 'MoleculeTOC' }).props('activeId'),
    ).toBe('principles');
  });

  it('hides TOC when the article has fewer than 3 headings', async () => {
    const shortArticle = makeArticle({
      body: {
        toc: {
          links: [
            { id: 'intro', text: 'Intro', depth: 2 },
            { id: 'outro', text: 'Outro', depth: 2 },
          ],
        },
      },
    });

    stubEnv('en', 'design-systems-101', shortArticle);
    const BlogArticle = (await import('../[slug].vue')).default;
    const wrapper = mountSuspended(BlogArticle);

    await flushPromises();

    expect(wrapper.findComponent({ name: 'MoleculeTOC' }).exists()).toBe(false);
  });

  it('shows TOC when the article has 3 or more headings', async () => {
    stubEnv('en', 'design-systems-101', makeArticle({}));
    const BlogArticle = (await import('../[slug].vue')).default;
    const wrapper = mountSuspended(BlogArticle);

    await flushPromises();

    expect(wrapper.findComponent({ name: 'MoleculeTOC' }).exists()).toBe(true);
  });

  it('renders the reading time computed via readingTime() through blog.article.readingTime', async () => {
    stubEnv('en', 'design-systems-101', makeArticle({}));
    const BlogArticle = (await import('../[slug].vue')).default;
    const wrapper = mountSuspended(BlogArticle);

    await flushPromises();

    expect(readingTimeMock).toHaveBeenCalled();
    expect(wrapper.text()).toContain('4 min read');
  });

  it('triggers a 404 createError when no article matches the slug', async () => {
    stubEnv('en', 'unknown-slug', null);
    createErrorMock.mockClear();
    const BlogArticle = (await import('../[slug].vue')).default;

    mountSuspended(BlogArticle);
    await flushPromises();

    expect(createErrorMock).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 404 }),
    );
  });

  it('renders a visible state instead of an empty page when the article is null', async () => {
    stubEnv('en', 'unknown-slug', null);
    const BlogArticle = (await import('../[slug].vue')).default;
    const wrapper = mountSuspended(BlogArticle);

    await flushPromises();

    expect(wrapper.find('article').exists()).toBe(false);
    expect(wrapper.find('p.a-prose').text()).toBe(
      createT('en')('error.description.default'),
    );
  });
});
