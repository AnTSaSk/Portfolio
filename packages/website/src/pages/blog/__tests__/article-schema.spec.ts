import { flushPromises, mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { defineComponent, h, ref, Suspense, type Component } from 'vue';

import { createT } from '../../__tests__/__stubs__/createT';

// The page uses top-level await (await useAsyncData); resolve it under a
// Suspense boundary, mirroring Nuxt's own runtime.
function mountSuspended(component: Component): ReturnType<typeof mount> {
  const Host = defineComponent({
    render: () => h(Suspense, null, { default: () => h(component) }),
  });

  return mount(Host);
}

import {
  useBreadcrumbItemsMock,
  useSchemaOrgMock,
} from '@/__tests__/setup/nuxt-macros';

// a generic Article/BlogPosting node derived from the article's
// frontmatter, never hardcoded per article. Proven by mounting two distinct
// fixtures and asserting both produce a correctly-derived node with no
// per-article wiring in the page.

interface ArticleFixture {
  title: string;
  description: string;
  date: string;
  updated?: string;
  tags: string[];
  cover?: string;
  path: string;
  body: { toc: { links: unknown[] } };
}

// useSchemaOrg entries may be plain nodes or reactive getters; resolve both
// the same way the real module consumes them.
type SchemaEntry = Record<string, unknown> | (() => Record<string, unknown>);

function resolveNode(entry: SchemaEntry): Record<string, unknown> {
  return typeof entry === 'function' ? entry() : entry;
}

// useSchemaOrg may also be called with a single reactive ref/computed of an
// array (not an array of entries); unwrap it to the array the tests expect.
function resolveEntries(arg: unknown): SchemaEntry[] {
  if (Array.isArray(arg)) {
    return arg;
  }

  if (arg && typeof arg === 'object' && 'value' in arg) {
    return (arg as { value: SchemaEntry[] }).value;
  }

  return [];
}

function makeArticle(overrides: Partial<ArticleFixture>): ArticleFixture {
  return {
    title: 'Design systems 101',
    description: 'A lede about design systems.',
    date: '2026-01-10',
    tags: ['design-systems', 'css'],
    path: '/blog/en/design-systems-101',
    body: { toc: { links: [] } },
    ...overrides,
  };
}

const HeadStub = defineComponent({
  name: 'OrganismHead',
  setup: () => (): ReturnType<typeof h> => h('header'),
});
const MediaCoverStub = defineComponent({
  name: 'MoleculeMediaCover',
  setup: (): (() => ReturnType<typeof h>) => () => h('figure'),
});
const TOCStub = defineComponent({
  name: 'MoleculeTOC',
  setup: (): (() => ReturnType<typeof h>) => () => h('nav'),
});
const AuthorStub = defineComponent({
  name: 'MoleculeAuthor',
  setup: (): (() => ReturnType<typeof h>) => () => h('aside'),
});
const RelatedStub = defineComponent({
  name: 'OrganismRelated',
  setup: (): (() => ReturnType<typeof h>) => () => h('section'),
});

vi.mock('@antsask/styleguide', () => ({
  Head: HeadStub,
  MediaCover: MediaCoverStub,
  TOC: TOCStub,
  Author: AuthorStub,
  Related: RelatedStub,
}));

vi.mock('@/composables/useTocTracking', () => ({
  useTocTracking: vi.fn(() => ({ activeId: ref(null) })),
}));

vi.mock('@/utils/readingTime', () => ({
  readingTime: vi.fn(() => 1),
}));

const createErrorMock = vi.fn((input: unknown) => input);

function createQueryCollectionMock(
  match: ArticleFixture | null,
): Record<string, unknown> {
  const builder: Record<string, unknown> = {
    where: vi.fn(() => builder),
    andWhere: vi.fn(() => builder),
    orWhere: vi.fn(() => builder),
    order: vi.fn(() => builder),
    limit: vi.fn(() => builder),
    all: vi.fn(() => Promise.resolve([])),
    first: vi.fn(() => Promise.resolve(match)),
  };

  return builder;
}

function stubEnv(
  locale: 'en' | 'fr',
  slug: string,
  match: ArticleFixture | null,
): void {
  const t = createT(locale);

  vi.stubGlobal('useI18n', () => ({ locale: { value: locale }, t }));
  vi.stubGlobal('useRoute', () => ({ params: { slug } }));
  vi.stubGlobal(
    'queryCollection',
    vi.fn(() => createQueryCollectionMock(match)),
  );
  vi.stubGlobal(
    'useAsyncData',
    async (_key: string, handler: () => Promise<unknown>) => {
      const data = ref<unknown>(null);

      try {
        data.value = await handler();
      } catch {
        data.value = null;
      }

      return {
        data,
        pending: ref(false),
        error: ref(null),
        refresh: vi.fn(),
      };
    },
  );
  vi.stubGlobal('createError', createErrorMock);
  vi.stubGlobal('showError', vi.fn());
}

describe('blog/[slug].vue, generic Article schema', () => {
  it('emits an Article/BlogPosting node with headline, datePublished, author and inLanguage derived from the frontmatter', async () => {
    useSchemaOrgMock.mockClear();
    stubEnv(
      'en',
      'design-systems-101',
      makeArticle({
        title: 'Design systems 101',
        date: '2026-01-10',
      }),
    );

    const BlogArticle = (await import('../[slug].vue')).default;

    mountSuspended(BlogArticle);
    await flushPromises();

    const call = useSchemaOrgMock.mock.calls.find((args) => {
      const entries = resolveEntries(args[0]);

      return entries.some((entry) =>
        ['Article', 'BlogPosting'].includes(
          String(resolveNode(entry)['@type']),
        ),
      );
    });

    expect(call).toBeDefined();

    const entries = resolveEntries(call![0]);
    const article = entries
      .map(resolveNode)
      .find((node) =>
        ['Article', 'BlogPosting'].includes(String(node['@type'])),
      )!;

    expect(article).toMatchObject({
      headline: 'Design systems 101',
      datePublished: '2026-01-10',
      inLanguage: 'en',
    });
    expect(article.author).toEqual({
      '@id': 'https://alexisbesson.fr/#identity',
    });
  });

  it('derives a different Article node from a second, unrelated article fixture with no per-article wiring', async () => {
    useSchemaOrgMock.mockClear();
    stubEnv(
      'en',
      'testing-vue-components',
      makeArticle({
        title: 'Testing Vue components the right way',
        description: 'A lede about testing.',
        date: '2026-03-22',
        path: '/blog/en/testing-vue-components',
      }),
    );

    const BlogArticle = (await import('../[slug].vue')).default;

    mountSuspended(BlogArticle);
    await flushPromises();

    const call = useSchemaOrgMock.mock.calls.find((args) => {
      const entries = resolveEntries(args[0]);

      return entries.some((entry) =>
        ['Article', 'BlogPosting'].includes(
          String(resolveNode(entry)['@type']),
        ),
      );
    });

    expect(call).toBeDefined();

    const entries = resolveEntries(call![0]);
    const article = entries
      .map(resolveNode)
      .find((node) =>
        ['Article', 'BlogPosting'].includes(String(node['@type'])),
      )!;

    expect(article).toMatchObject({
      headline: 'Testing Vue components the right way',
      datePublished: '2026-03-22',
      inLanguage: 'en',
    });
    expect(article.author).toBeDefined();
  });

  it('includes dateModified only when the frontmatter provides an updated date', async () => {
    useSchemaOrgMock.mockClear();
    stubEnv(
      'en',
      'design-systems-101',
      makeArticle({ date: '2026-01-10', updated: '2026-02-01' }),
    );

    const BlogArticle = (await import('../[slug].vue')).default;

    mountSuspended(BlogArticle);
    await flushPromises();

    const call = useSchemaOrgMock.mock.calls.find((args) => {
      const entries = resolveEntries(args[0]);

      return entries.some((entry) =>
        ['Article', 'BlogPosting'].includes(
          String(resolveNode(entry)['@type']),
        ),
      );
    });

    expect(call).toBeDefined();

    const entries = resolveEntries(call![0]);
    const article = entries
      .map(resolveNode)
      .find((node) =>
        ['Article', 'BlogPosting'].includes(String(node['@type'])),
      )!;

    expect(article.dateModified).toBe('2026-02-01');
  });
});

// the detail page invokes the generic route-derived breadcrumb
// mechanism (useBreadcrumbItems, auto-imported @nuxtjs/seo) instead of
// hand-wiring a per-page BreadcrumbList. Real SSR presence/validity of the
// resulting JSON-LD is proven by the SSR barrier (plan task 3.8), not here.
describe('blog/[slug].vue, generic BreadcrumbList wiring', () => {
  it('calls useBreadcrumbItems so the route-derived BreadcrumbList is generated', async () => {
    useBreadcrumbItemsMock.mockClear();
    stubEnv('en', 'design-systems-101', makeArticle({}));

    const BlogArticle = (await import('../[slug].vue')).default;

    mountSuspended(BlogArticle);
    await flushPromises();

    expect(useBreadcrumbItemsMock).toHaveBeenCalled();
  });
});
