import { flushPromises, mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { defineComponent, h, ref } from 'vue';

import { createT } from '../../__tests__/__stubs__/createT';

import { definePageMetaMock } from '@/__tests__/setup/nuxt-macros';

// --- Minimal structural stubs for the barrel components this page composes.
// Prop names are chosen to make the page's own wiring (sorting, filtering,
// pagination) observable without asserting on real component internals.
const HeadStub = defineComponent({
  name: 'OrganismHead',
  props: {
    variant: { type: String, default: '' },
    title: { type: String, default: '' },
    lede: { type: String, default: '' },
  },
  setup: (props) => () =>
    h('header', { class: 'o-head' }, [props.title, props.lede]),
});

// Aligned to the real MoleculeFilter API (items: FilterItem[], emits 'toggle')
// which differs from the prop-keys originally stubbed here.
const FilterStub = defineComponent({
  name: 'MoleculeFilter',
  props: {
    items: { type: Array, default: () => [] },
  },
  emits: ['toggle'],
  setup: () => () => h('div', { class: 'm-filter' }),
});

// Aligned to the real MoleculePagination API (pages/hasPrev/hasNext, emits
// 'select'/'prev'/'next') which differs from the prop-keys originally
// stubbed here.
const PaginationStub = defineComponent({
  name: 'MoleculePagination',
  props: {
    current: { type: Number, default: 1 },
    pages: { type: Number, default: 1 },
    hasPrev: { type: Boolean, default: false },
    hasNext: { type: Boolean, default: false },
  },
  emits: ['select', 'prev', 'next'],
  setup: () => () => h('nav', { class: 'm-pagination' }),
});

const ListingStub = defineComponent({
  name: 'OrganismListing',
  props: { gridVariant: { type: String, default: '' } },
  setup:
    (_props, { slots }) =>
    () =>
      h('div', { class: 'o-listing' }, [
        slots.filter?.() &&
          h('div', { class: 'o-listing__filter' }, slots.filter()),
        slots.default?.(),
        slots.pagination?.(),
      ]),
});

const HeadingStub = defineComponent({
  name: 'AtomHeading',
  props: {
    level: { type: String, default: 'h2' },
    tag: { type: String, default: undefined },
    tone: { type: String, default: 'default' },
  },
  setup:
    (props, { slots }) =>
    () =>
      h(props.tag ?? props.level, { class: 'a-heading' }, slots.default?.()),
});

const CardArticleStub = defineComponent({
  name: 'MoleculeCardArticle',
  props: {
    title: { type: String, default: '' },
    date: { type: [String, Date], default: '' },
    tags: { type: Array, default: () => [] },
  },
  setup: (props) => () => h('a', { class: 'm-article-card' }, props.title),
});

vi.mock('@antsask/styleguide', () => ({
  Head: HeadStub,
  Filter: FilterStub,
  Pagination: PaginationStub,
  Listing: ListingStub,
  CardArticle: CardArticleStub,
  Heading: HeadingStub,
}));

interface ArticleFixture {
  title: string;
  description: string;
  date: string;
  tags: string[];
  draft?: boolean;
  path: string;
}

function makeArticle(overrides: Partial<ArticleFixture>): ArticleFixture {
  return {
    title: 'Untitled',
    description: 'lede',
    date: '2026-01-01',
    tags: ['css'],
    path: '/blog/en/untitled',
    ...overrides,
  };
}

// Chainable + thenable stand-in for @nuxt/content's CollectionQueryBuilder,
// so the page's own sorting/filtering (not @nuxt/content's query engine) is
// what gets exercised by the assertions below.
function createQueryCollectionMock(
  items: ArticleFixture[],
): Record<string, unknown> {
  const builder: Record<string, unknown> = {
    where: vi.fn(() => builder),
    andWhere: vi.fn(() => builder),
    orWhere: vi.fn(() => builder),
    order: vi.fn(() => builder),
    limit: vi.fn(() => builder),
    all: vi.fn(() => Promise.resolve(items)),
    first: vi.fn(() => Promise.resolve(items[0] ?? null)),
    then: (resolve: (value: ArticleFixture[]) => unknown) =>
      Promise.resolve(items).then(resolve),
  };

  return builder;
}

let queryCollectionMock: ReturnType<typeof vi.fn>;

function stubEnv(locale: 'en' | 'fr', items: ArticleFixture[]): void {
  const t = createT(locale);

  vi.stubGlobal('useI18n', () => ({ locale: { value: locale }, t }));
  vi.stubGlobal('useRoute', () => ({ path: '/blog' }));
  queryCollectionMock = vi.fn(() => createQueryCollectionMock(items));
  vi.stubGlobal('queryCollection', queryCollectionMock);
  vi.stubGlobal(
    'useAsyncData',
    (_key: string, handler: () => Promise<unknown>) => {
      // A real ref, like Nuxt's own return, so the page's computeds react
      // when the async data resolves.
      const data = ref<unknown>(null);

      handler().then((result) => {
        data.value = result;
      });

      return {
        data,
        pending: ref(false),
        error: ref(null),
        refresh: vi.fn(),
      };
    },
  );
}

// PAGE_SIZE mirrors the design contract (mockup: 6 CardArticle on page 1 +
// a page "02"). 8 published articles => ceil(8/6) = 2 pages, page 2 holds
// the 2 oldest. Dates are strictly ordered so sort order is unambiguous.
const PAGE_SIZE = 6;

// Tag frequencies (published only): css 3, architecture 2, motion 2,
// design-systems 1. With the blog threshold of 2, css/architecture/motion
// qualify (bar visible); design-systems is dropped.
const ARTICLES: ArticleFixture[] = [
  makeArticle({
    title: 'Article 8',
    date: '2026-08-01',
    tags: ['css'],
    path: '/blog/en/article-8',
  }),
  makeArticle({
    title: 'Article 7',
    date: '2026-07-01',
    tags: ['css'],
    path: '/blog/en/article-7',
  }),
  makeArticle({
    title: 'Article 6',
    date: '2026-06-01',
    tags: ['architecture'],
    path: '/blog/en/article-6',
  }),
  makeArticle({
    title: 'Article 5',
    date: '2026-05-01',
    tags: ['motion'],
    path: '/blog/en/article-5',
  }),
  makeArticle({
    title: 'Article 4',
    date: '2026-04-01',
    tags: ['css'],
    path: '/blog/en/article-4',
  }),
  makeArticle({
    title: 'Article 3',
    date: '2026-03-01',
    tags: ['architecture'],
    path: '/blog/en/article-3',
  }),
  makeArticle({
    title: 'Article 2',
    date: '2026-02-01',
    tags: ['motion'],
    path: '/blog/en/article-2',
  }),
  makeArticle({
    title: 'Article 1',
    date: '2026-01-01',
    tags: ['design-systems'],
    path: '/blog/en/article-1',
  }),
  makeArticle({
    title: 'Draft one',
    date: '2026-05-15',
    draft: true,
    path: '/blog/en/draft-one',
  }),
];

describe('pages/blog/index.vue', () => {
  it('renders CardArticle in date-descending order excluding draft items', async () => {
    stubEnv('en', ARTICLES);
    definePageMetaMock.mockClear();
    const BlogListing = (await import('../index.vue')).default;
    const wrapper = mount(BlogListing);

    await flushPromises();

    const cards = wrapper.findAllComponents({ name: 'MoleculeCardArticle' });

    expect(cards).toHaveLength(PAGE_SIZE);
    expect(cards.map((c) => c.props('title'))).toEqual([
      'Article 8',
      'Article 7',
      'Article 6',
      'Article 5',
      'Article 4',
      'Article 3',
    ]);
  });

  it('filters the rendered CardArticle set to the tag selected via Filter', async () => {
    stubEnv('en', ARTICLES);
    const BlogListing = (await import('../index.vue')).default;
    const wrapper = mount(BlogListing);

    await flushPromises();

    const filter = wrapper.findComponent({ name: 'MoleculeFilter' });

    await filter.vm.$emit('toggle', 'motion');
    await flushPromises();

    const cards = wrapper.findAllComponents({ name: 'MoleculeCardArticle' });

    expect(cards.map((c) => c.props('title'))).toEqual([
      'Article 5',
      'Article 2',
    ]);
  });

  it('passes the selected tag back to Filter as the selected prop', async () => {
    stubEnv('en', ARTICLES);
    const BlogListing = (await import('../index.vue')).default;
    const wrapper = mount(BlogListing);

    await flushPromises();

    const filter = wrapper.findComponent({ name: 'MoleculeFilter' });

    await filter.vm.$emit('toggle', 'motion');
    await flushPromises();

    const items = wrapper
      .findComponent({ name: 'MoleculeFilter' })
      .props('items') as { id: string; pressed: boolean }[];

    expect(items.find((item) => item.id === 'motion')?.pressed).toBe(true);
  });

  // Filter items ranked by frequency then alpha, each carrying a count;
  // tags below the blog threshold of 2 are dropped.
  it('builds Filter items ranked by frequency then alpha, dropping tags below threshold', async () => {
    stubEnv('en', ARTICLES);
    const t = createT('en');
    const BlogListing = (await import('../index.vue')).default;
    const wrapper = mount(BlogListing);

    await flushPromises();

    const filter = wrapper.findComponent({ name: 'MoleculeFilter' });
    const items = filter.props('items') as {
      id: string;
      label: string;
      pressed: boolean;
      count?: number;
    }[];

    expect(items[0]).toEqual({
      id: 'all',
      label: t('blog.listing.filter.all'),
      pressed: true,
    });
    // css 3, then architecture/motion tied at 2, alphabetical;
    // design-systems (1) dropped by the threshold.
    expect(items.slice(1)).toEqual([
      { id: 'css', label: 'css', pressed: false, count: 3 },
      { id: 'architecture', label: 'architecture', pressed: false, count: 2 },
      { id: 'motion', label: 'motion', pressed: false, count: 2 },
    ]);
  });

  it('hides the filter bar when at most one tag reaches the threshold', async () => {
    stubEnv('en', [
      makeArticle({
        title: 'Only css A',
        date: '2026-02-01',
        tags: ['css'],
        path: '/blog/en/only-css-a',
      }),
      makeArticle({
        title: 'Only css B',
        date: '2026-01-01',
        tags: ['css'],
        path: '/blog/en/only-css-b',
      }),
    ]);
    const BlogListing = (await import('../index.vue')).default;
    const wrapper = mount(BlogListing);

    await flushPromises();

    expect(wrapper.findComponent({ name: 'MoleculeFilter' }).exists()).toBe(
      false,
    );
  });

  it('slices the list to a page size and disables the previous control on page 1', async () => {
    stubEnv('en', ARTICLES);
    const BlogListing = (await import('../index.vue')).default;
    const wrapper = mount(BlogListing);

    await flushPromises();

    const pagination = wrapper.findComponent({ name: 'MoleculePagination' });
    const cards = wrapper.findAllComponents({ name: 'MoleculeCardArticle' });

    expect(pagination.props('pages')).toBe(2);
    expect(pagination.props('current')).toBe(1);
    expect(pagination.props('hasPrev')).toBe(false);
    expect(pagination.props('hasNext')).toBe(true);
    expect(cards).toHaveLength(PAGE_SIZE);
    expect(cards.map((c) => c.props('title'))).toEqual([
      'Article 8',
      'Article 7',
      'Article 6',
      'Article 5',
      'Article 4',
      'Article 3',
    ]);
  });

  it('advances to the next page and updates the rendered CardArticle slice', async () => {
    stubEnv('en', ARTICLES);
    const BlogListing = (await import('../index.vue')).default;
    const wrapper = mount(BlogListing);

    await flushPromises();

    const paginationBefore = wrapper.findComponent({
      name: 'MoleculePagination',
    });

    await paginationBefore.vm.$emit('select', 2);
    await flushPromises();

    const paginationAfter = wrapper.findComponent({
      name: 'MoleculePagination',
    });
    const cards = wrapper.findAllComponents({ name: 'MoleculeCardArticle' });

    expect(paginationAfter.props('current')).toBe(2);
    expect(paginationAfter.props('hasPrev')).toBe(true);
    expect(paginationAfter.props('hasNext')).toBe(false);
    expect(cards).toHaveLength(2);
    expect(cards.map((c) => c.props('title'))).toEqual([
      'Article 2',
      'Article 1',
    ]);
  });

  // Filtering to a non-matching tag renders the noResults copy as a Heading
  // (replacing the grid), not as a <p class="l-page__state">.
  it('renders the noResults copy as a Heading and drops the cards when the filter matches no article', async () => {
    stubEnv('en', ARTICLES);
    const t = createT('en');
    const BlogListing = (await import('../index.vue')).default;
    const wrapper = mount(BlogListing);

    await flushPromises();

    const filter = wrapper.findComponent({ name: 'MoleculeFilter' });

    await filter.vm.$emit('toggle', 'no-such-tag');
    await flushPromises();

    const heading = wrapper.findComponent({ name: 'AtomHeading' });

    expect(heading.exists()).toBe(true);
    expect(heading.text()).toBe(t('blog.listing.noResults'));
    expect(wrapper.find('p.l-page__state').exists()).toBe(false);
    expect(
      wrapper.findAllComponents({ name: 'MoleculeCardArticle' }),
    ).toHaveLength(0);
  });

  // The filter bar stays mounted in the no-results view so the user
  // can still clear the active filter.
  it('keeps the filter bar mounted while showing the noResults state', async () => {
    stubEnv('en', ARTICLES);
    const BlogListing = (await import('../index.vue')).default;
    const wrapper = mount(BlogListing);

    await flushPromises();

    const filter = wrapper.findComponent({ name: 'MoleculeFilter' });

    await filter.vm.$emit('toggle', 'no-such-tag');
    await flushPromises();

    expect(wrapper.findComponent({ name: 'MoleculeFilter' }).exists()).toBe(
      true,
    );
  });

  it('renders the empty copy as a Heading when the collection has no articles', async () => {
    stubEnv('en', []);
    const t = createT('en');
    const BlogListing = (await import('../index.vue')).default;
    const wrapper = mount(BlogListing);

    await flushPromises();

    const heading = wrapper.findComponent({ name: 'AtomHeading' });

    expect(heading.exists()).toBe(true);
    expect(heading.text()).toBe(t('blog.listing.empty'));
    expect(wrapper.find('p.l-page__state').exists()).toBe(false);
  });

  it('composes Head(listing) + Filter + Listing + Pagination from the barrel', async () => {
    stubEnv('en', ARTICLES);
    const BlogListing = (await import('../index.vue')).default;
    const wrapper = mount(BlogListing);

    await flushPromises();

    expect(
      wrapper.findComponent({ name: 'OrganismHead' }).props('variant'),
    ).toBe('listing');
    expect(wrapper.findComponent({ name: 'MoleculeFilter' }).exists()).toBe(
      true,
    );
    expect(wrapper.findComponent({ name: 'OrganismListing' }).exists()).toBe(
      true,
    );
    expect(wrapper.findComponent({ name: 'MoleculePagination' }).exists()).toBe(
      true,
    );
  });

  it('resolves Head title and lede from blog.listing.* translations', async () => {
    stubEnv('en', ARTICLES);
    const t = createT('en');
    const BlogListing = (await import('../index.vue')).default;
    const wrapper = mount(BlogListing);

    await flushPromises();

    const head = wrapper.findComponent({ name: 'OrganismHead' });

    expect(head.props('title')).toBe(t('blog.listing.title'));
    expect(head.props('lede')).toBe(t('blog.listing.lede'));
  });
});
