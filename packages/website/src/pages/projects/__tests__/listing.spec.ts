import { flushPromises, mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { defineComponent, h, ref } from 'vue';

import { createT } from '../../__tests__/__stubs__/createT';

import '@/__tests__/setup/nuxt-macros';

// --- Minimal structural stubs for the barrel components this page composes.
// Prop names mirror the real DS component APIs read from source this session.
const HeadStub = defineComponent({
  name: 'OrganismHead',
  props: {
    variant: { type: String, default: '' },
    title: { type: String, default: '' },
    lede: { type: String, default: '' },
    eyebrow: { type: String, default: '' },
  },
  setup: (props) => () =>
    h('header', { class: 'o-head' }, [props.title, props.lede]),
});

const FilterStub = defineComponent({
  name: 'MoleculeFilter',
  props: {
    items: { type: Array, default: () => [] },
    ariaLabel: { type: String, default: '' },
  },
  emits: ['toggle'],
  setup: () => () => h('div', { class: 'm-filter' }),
});

const FeatureStub = defineComponent({
  name: 'OrganismFeature',
  props: {
    href: { type: String, default: '' },
    label: { type: String, default: '' },
    meta: { type: String, default: '' },
    title: { type: String, default: '' },
    lead: { type: String, default: '' },
    stack: { type: Array, default: () => [] },
    ctaLabel: { type: String, default: '' },
    image: { type: Object, default: undefined },
  },
  setup: (props) => () => h('a', { class: 'o-feature' }, props.title),
});

const CardProjectStub = defineComponent({
  name: 'MoleculeCardProject',
  props: {
    href: { type: String, default: '' },
    title: { type: String, default: '' },
    meta: { type: String, default: '' },
    stack: { type: Array, default: () => [] },
    desc: { type: String, default: undefined },
    image: { type: Object, default: undefined },
    placeholderVariant: { type: String, default: undefined },
    sizes: { type: String, default: undefined },
    fetchpriority: { type: String, default: undefined },
    loading: { type: String, default: undefined },
  },
  setup: (props) => () => h('a', { class: 'm-cardProject' }, props.title),
});

const ListingStub = defineComponent({
  name: 'OrganismListing',
  props: { gridVariant: { type: String, default: '' } },
  setup:
    (_props, { slots }) =>
    () =>
      h('div', { class: 'o-listing' }, [
        slots.filter?.(),
        slots.preGrid?.(),
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

vi.mock('@antsask/styleguide', () => ({
  Head: HeadStub,
  Filter: FilterStub,
  Feature: FeatureStub,
  CardProject: CardProjectStub,
  Listing: ListingStub,
  Heading: HeadingStub,
}));

interface ProjectFixture {
  title: string;
  shortDescription: string;
  description: string;
  year: number;
  stack: string[];
  role?: string;
  client?: string;
  cover?: { src: string; width: number; height: number };
  draft?: boolean;
  highlight?: boolean;
  path: string;
}

function makeProject(overrides: Partial<ProjectFixture>): ProjectFixture {
  return {
    title: 'Untitled',
    shortDescription: 'short',
    description: 'full',
    year: 2020,
    stack: ['Vue'],
    role: 'Engineer',
    cover: { src: '/img/cover.jpg', width: 2560, height: 1440 },
    path: '/projects/en/untitled',
    ...overrides,
  };
}

// Chainable + thenable stand-in for @nuxt/content's CollectionQueryBuilder,
// so the page's own sorting/filtering (not @nuxt/content's query engine) is
// what gets exercised by the assertions below.
function createQueryCollectionMock(
  items: ProjectFixture[],
): Record<string, unknown> {
  const builder: Record<string, unknown> = {
    where: vi.fn(() => builder),
    andWhere: vi.fn(() => builder),
    orWhere: vi.fn(() => builder),
    order: vi.fn(() => builder),
    limit: vi.fn(() => builder),
    all: vi.fn(() => Promise.resolve(items)),
    first: vi.fn(() => Promise.resolve(items[0] ?? null)),
    then: (resolve: (value: ProjectFixture[]) => unknown) =>
      Promise.resolve(items).then(resolve),
  };

  return builder;
}

function stubEnv(locale: 'en' | 'fr', items: ProjectFixture[]): void {
  const t = createT(locale);

  vi.stubGlobal('useI18n', () => ({ locale: { value: locale }, t }));
  vi.stubGlobal('useRoute', () => ({ path: '/projects' }));
  vi.stubGlobal(
    'queryCollection',
    vi.fn(() => createQueryCollectionMock(items)),
  );
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

// Sorted (year DESC) order: Aurora(2026,highlight), Nimbus(2025), Glacier(2024),
// Solstice(2023). Ghost is draft and must never surface anywhere.
const PROJECTS: ProjectFixture[] = [
  makeProject({
    title: 'Aurora Platform',
    year: 2026,
    stack: ['Vue', 'TypeScript'],
    role: 'Lead front-end',
    highlight: true,
    path: '/projects/en/aurora-platform',
  }),
  makeProject({
    title: 'Nimbus Dashboard',
    year: 2025,
    stack: ['React'],
    role: 'Front-end engineer',
    path: '/projects/en/nimbus-dashboard',
  }),
  makeProject({
    title: 'Glacier Design System',
    year: 2024,
    stack: ['Svelte'],
    role: 'Design systems lead',
    path: '/projects/en/glacier-design-system',
  }),
  makeProject({
    title: 'Solstice Storefront',
    year: 2023,
    stack: ['Astro'],
    role: 'Front-end engineer',
    path: '/projects/en/solstice-storefront',
  }),
  makeProject({
    title: 'Ghost Project',
    year: 2025,
    stack: ['Ember'],
    role: 'Ghost',
    draft: true,
    path: '/projects/en/ghost-project',
  }),
];

describe('pages/projects/index.vue', () => {
  it('composes Head(listing) + Filter + Listing(2up) + Feature + CardProject, no Pagination', async () => {
    stubEnv('en', PROJECTS);
    const ProjectsListing = (await import('../index.vue')).default;
    const wrapper = mount(ProjectsListing);

    await flushPromises();

    expect(
      wrapper.findComponent({ name: 'OrganismHead' }).props('variant'),
    ).toBe('listing');
    expect(
      wrapper.findComponent({ name: 'OrganismListing' }).props('gridVariant'),
    ).toBe('2up');
    expect(wrapper.findComponent({ name: 'MoleculeFilter' }).exists()).toBe(
      true,
    );
    expect(wrapper.findComponent({ name: 'MoleculePagination' }).exists()).toBe(
      false,
    );
  });

  it('resolves Head title, lede and eyebrow from projects.listing.* translations', async () => {
    stubEnv('en', PROJECTS);
    const t = createT('en');
    const ProjectsListing = (await import('../index.vue')).default;
    const wrapper = mount(ProjectsListing);

    await flushPromises();

    const head = wrapper.findComponent({ name: 'OrganismHead' });

    expect(head.props('title')).toBe(t('projects.listing.title'));
    expect(head.props('lede')).toBe(t('projects.listing.lede'));
    expect(head.props('eyebrow')).toBe(t('projects.listing.eyebrow'));
  });

  // threshold 1 for projects, so every stack is kept
  it('builds Filter items ranked by frequency then alpha, each carrying a count', async () => {
    stubEnv('en', PROJECTS);
    const t = createT('en');
    const ProjectsListing = (await import('../index.vue')).default;
    const wrapper = mount(ProjectsListing);

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
      label: t('projects.listing.filter.all'),
      pressed: true,
    });
    // Frequencies across non-draft projects (highlight included): every stack
    // appears once, so pure alphabetical order; Ember (draft) excluded.
    expect(items.slice(1).map((item) => item.id)).toEqual([
      'Astro',
      'React',
      'Svelte',
      'TypeScript',
      'Vue',
    ]);
    expect(items.slice(1).every((item) => item.count === 1)).toBe(true);
    expect(filter.props('ariaLabel')).toBe(t('projects.listing.filter.label'));
  });

  it('hides the filter bar when at most one stack qualifies', async () => {
    stubEnv('en', [
      makeProject({
        title: 'Solo',
        year: 2026,
        stack: ['Vue'],
        path: '/projects/en/solo',
      }),
    ]);
    const ProjectsListing = (await import('../index.vue')).default;
    const wrapper = mount(ProjectsListing);

    await flushPromises();

    expect(wrapper.findComponent({ name: 'MoleculeFilter' }).exists()).toBe(
      false,
    );
  });

  it('narrows the CardProject grid to the toggled stack and reflects it as pressed', async () => {
    stubEnv('en', PROJECTS);
    const ProjectsListing = (await import('../index.vue')).default;
    const wrapper = mount(ProjectsListing);

    await flushPromises();

    const filter = wrapper.findComponent({ name: 'MoleculeFilter' });

    await filter.vm.$emit('toggle', 'Svelte');
    await flushPromises();

    const cards = wrapper.findAllComponents({ name: 'MoleculeCardProject' });
    const itemsAfter = wrapper
      .findComponent({ name: 'MoleculeFilter' })
      .props('items') as { id: string; pressed: boolean }[];

    expect(cards.map((c) => c.props('title'))).toEqual([
      'Glacier Design System',
    ]);
    expect(itemsAfter.find((item) => item.id === 'Svelte')?.pressed).toBe(true);
    expect(itemsAfter.find((item) => item.id === 'all')?.pressed).toBe(false);
  });

  it('resets the grid to the full non-highlighted list when toggling all', async () => {
    stubEnv('en', PROJECTS);
    const ProjectsListing = (await import('../index.vue')).default;
    const wrapper = mount(ProjectsListing);

    await flushPromises();

    const filter = wrapper.findComponent({ name: 'MoleculeFilter' });

    await filter.vm.$emit('toggle', 'Svelte');
    await flushPromises();
    await filter.vm.$emit('toggle', 'all');
    await flushPromises();

    const cards = wrapper.findAllComponents({ name: 'MoleculeCardProject' });

    expect(cards.map((c) => c.props('title'))).toEqual([
      'Nimbus Dashboard',
      'Glacier Design System',
      'Solstice Storefront',
    ]);
  });

  it('renders the highlighted project as Feature with composed props', async () => {
    stubEnv('en', PROJECTS);
    const t = createT('en');
    const ProjectsListing = (await import('../index.vue')).default;
    const wrapper = mount(ProjectsListing);

    await flushPromises();

    const feature = wrapper.findComponent({ name: 'OrganismFeature' });

    expect(feature.exists()).toBe(true);
    expect(feature.props('label')).toBe(t('projects.listing.feature.label'));
    expect(feature.props('meta')).toBe(
      t('projects.card.meta', { year: 2026, role: 'Lead front-end' }),
    );
    expect(feature.props('stack')).toEqual(['Vue', 'TypeScript']);
    expect(feature.props('ctaLabel')).toBe(t('projects.project.seeProject'));
    expect(feature.props('href')).toBe('/projects/aurora-platform');
  });

  it('renders no Feature when no project is highlighted', async () => {
    const noHighlight = PROJECTS.filter((project) => !project.highlight);

    stubEnv('en', noHighlight);
    const ProjectsListing = (await import('../index.vue')).default;
    const wrapper = mount(ProjectsListing);

    await flushPromises();

    expect(wrapper.findComponent({ name: 'OrganismFeature' }).exists()).toBe(
      false,
    );
  });

  it('renders one CardProject per non-highlighted non-draft project with composed meta, href and alternating placeholder', async () => {
    stubEnv('en', PROJECTS);
    const t = createT('en');
    const ProjectsListing = (await import('../index.vue')).default;
    const wrapper = mount(ProjectsListing);

    await flushPromises();

    const cards = wrapper.findAllComponents({ name: 'MoleculeCardProject' });

    expect(cards).toHaveLength(3);
    expect(cards.map((c) => c.props('title'))).toEqual([
      'Nimbus Dashboard',
      'Glacier Design System',
      'Solstice Storefront',
    ]);
    expect(cards.map((c) => c.props('meta'))).toEqual([
      t('projects.card.meta', { year: 2025, role: 'Front-end engineer' }),
      t('projects.card.meta', { year: 2024, role: 'Design systems lead' }),
      t('projects.card.meta', { year: 2023, role: 'Front-end engineer' }),
    ]);
    expect(cards.map((c) => c.props('href'))).toEqual([
      '/projects/nimbus-dashboard',
      '/projects/glacier-design-system',
      '/projects/solstice-storefront',
    ]);
    expect(cards.map((c) => c.props('placeholderVariant'))).toEqual([
      undefined,
      '-topRight',
      undefined,
    ]);
  });

  it('excludes draft projects from the grid, the feature and the filter stack union', async () => {
    stubEnv('en', PROJECTS);
    const ProjectsListing = (await import('../index.vue')).default;
    const wrapper = mount(ProjectsListing);

    await flushPromises();

    const cardTitles = wrapper
      .findAllComponents({ name: 'MoleculeCardProject' })
      .map((c) => c.props('title'));
    const filterIds = (
      wrapper.findComponent({ name: 'MoleculeFilter' }).props('items') as {
        id: string;
      }[]
    ).map((item) => item.id);

    expect(cardTitles).not.toContain('Ghost Project');
    expect(filterIds).not.toContain('Ember');
    expect(
      wrapper.findComponent({ name: 'OrganismFeature' }).props('title'),
    ).not.toBe('Ghost Project');
  });

  it('sorts projects by year descending regardless of collection order', async () => {
    const shuffled: ProjectFixture[] = [
      makeProject({
        title: 'Solstice Storefront',
        year: 2023,
        path: '/projects/en/solstice-storefront',
      }),
      makeProject({
        title: 'Aurora Platform',
        year: 2026,
        path: '/projects/en/aurora-platform',
      }),
      makeProject({
        title: 'Glacier Design System',
        year: 2024,
        path: '/projects/en/glacier-design-system',
      }),
    ];

    stubEnv('en', shuffled);
    const ProjectsListing = (await import('../index.vue')).default;
    const wrapper = mount(ProjectsListing);

    await flushPromises();

    const cards = wrapper.findAllComponents({ name: 'MoleculeCardProject' });

    expect(cards.map((c) => c.props('title'))).toEqual([
      'Aurora Platform',
      'Glacier Design System',
      'Solstice Storefront',
    ]);
  });

  // A stack with no match renders the noResults copy as a Heading
  // (replacing the grid), not as a <p class="l-page__state">.
  it('renders the noResults copy as a Heading and drops the cards when the filter matches no project', async () => {
    stubEnv('en', PROJECTS);
    const t = createT('en');
    const ProjectsListing = (await import('../index.vue')).default;
    const wrapper = mount(ProjectsListing);

    await flushPromises();

    const filter = wrapper.findComponent({ name: 'MoleculeFilter' });

    await filter.vm.$emit('toggle', 'no-such-stack');
    await flushPromises();

    const heading = wrapper.findComponent({ name: 'AtomHeading' });

    expect(heading.exists()).toBe(true);
    expect(heading.text()).toBe(t('projects.listing.noResults'));
    expect(wrapper.find('p.l-page__state').exists()).toBe(false);
    expect(
      wrapper.findAllComponents({ name: 'MoleculeCardProject' }),
    ).toHaveLength(0);
  });

  // The filter bar stays mounted in the no-results view so the user
  // can still clear the active filter.
  it('keeps the filter bar mounted while showing the noResults state', async () => {
    stubEnv('en', PROJECTS);
    const ProjectsListing = (await import('../index.vue')).default;
    const wrapper = mount(ProjectsListing);

    await flushPromises();

    const filter = wrapper.findComponent({ name: 'MoleculeFilter' });

    await filter.vm.$emit('toggle', 'no-such-stack');
    await flushPromises();

    expect(wrapper.findComponent({ name: 'MoleculeFilter' }).exists()).toBe(
      true,
    );
  });

  it('renders the empty copy as a Heading when the project collection has no items', async () => {
    stubEnv('en', []);
    const t = createT('en');
    const ProjectsListing = (await import('../index.vue')).default;
    const wrapper = mount(ProjectsListing);

    await flushPromises();

    const heading = wrapper.findComponent({ name: 'AtomHeading' });

    expect(heading.exists()).toBe(true);
    expect(heading.text()).toBe(t('projects.listing.empty'));
    expect(wrapper.find('p.l-page__state').exists()).toBe(false);
  });

  it('renders the Feature and the full grid while no filter is active', async () => {
    stubEnv('en', PROJECTS);
    const ProjectsListing = (await import('../index.vue')).default;
    const wrapper = mount(ProjectsListing);

    await flushPromises();

    expect(wrapper.findComponent({ name: 'OrganismFeature' }).exists()).toBe(
      true,
    );
    expect(
      wrapper.findAllComponents({ name: 'MoleculeCardProject' }),
    ).toHaveLength(3);
  });

  it('keeps the Feature when the active filter matches the highlighted project stack', async () => {
    stubEnv('en', PROJECTS);
    const ProjectsListing = (await import('../index.vue')).default;
    const wrapper = mount(ProjectsListing);

    await flushPromises();

    const filter = wrapper.findComponent({ name: 'MoleculeFilter' });

    // Aurora (highlight) carries TypeScript in its stack.
    await filter.vm.$emit('toggle', 'TypeScript');
    await flushPromises();

    expect(wrapper.findComponent({ name: 'OrganismFeature' }).exists()).toBe(
      true,
    );
  });

  it('hides the Feature and never moves the highlighted project into the grid when the filter does not match it', async () => {
    stubEnv('en', PROJECTS);
    const ProjectsListing = (await import('../index.vue')).default;
    const wrapper = mount(ProjectsListing);

    await flushPromises();

    const filter = wrapper.findComponent({ name: 'MoleculeFilter' });

    // Svelte belongs to Glacier only; Aurora (highlight) does not carry it.
    await filter.vm.$emit('toggle', 'Svelte');
    await flushPromises();

    expect(wrapper.findComponent({ name: 'OrganismFeature' }).exists()).toBe(
      false,
    );

    const cardTitles = wrapper
      .findAllComponents({ name: 'MoleculeCardProject' })
      .map((c) => c.props('title'));

    expect(cardTitles).toEqual(['Glacier Design System']);
    expect(cardTitles).not.toContain('Aurora Platform');
  });

  it('shows no noResults message when only the Feature matches the active filter', async () => {
    // Only the highlighted project carries "Vue"; no other project does.
    stubEnv('en', [
      makeProject({
        title: 'Aurora Platform',
        year: 2026,
        stack: ['Vue', 'TypeScript'],
        highlight: true,
        path: '/projects/en/aurora-platform',
      }),
      makeProject({
        title: 'Nimbus Dashboard',
        year: 2025,
        stack: ['React'],
        path: '/projects/en/nimbus-dashboard',
      }),
    ]);
    const t = createT('en');
    const ProjectsListing = (await import('../index.vue')).default;
    const wrapper = mount(ProjectsListing);

    await flushPromises();

    const filter = wrapper.findComponent({ name: 'MoleculeFilter' });

    await filter.vm.$emit('toggle', 'Vue');
    await flushPromises();

    expect(wrapper.findComponent({ name: 'OrganismFeature' }).exists()).toBe(
      true,
    );
    expect(
      wrapper.findAllComponents({ name: 'MoleculeCardProject' }),
    ).toHaveLength(0);
    expect(wrapper.text()).not.toContain(t('projects.listing.noResults'));
  });

  it('shows noResults when the filter matches neither the grid nor the Feature', async () => {
    stubEnv('en', PROJECTS);
    const t = createT('en');
    const ProjectsListing = (await import('../index.vue')).default;
    const wrapper = mount(ProjectsListing);

    await flushPromises();

    const filter = wrapper.findComponent({ name: 'MoleculeFilter' });

    // React matches Nimbus (grid) but not Aurora; conversely a stack no card
    // and not the Feature carries triggers noResults. Use an absent value.
    await filter.vm.$emit('toggle', 'no-such-stack');
    await flushPromises();

    expect(wrapper.findComponent({ name: 'OrganismFeature' }).exists()).toBe(
      false,
    );
    expect(
      wrapper.findAllComponents({ name: 'MoleculeCardProject' }),
    ).toHaveLength(0);
    expect(wrapper.text()).toContain(t('projects.listing.noResults'));
  });

  // The listing page passes sizes + width/height and prioritizes the above-fold cover.
  describe('responsive image passthrough', () => {
    it('passes a non-empty sizes plus width/height to every CardProject cover', async () => {
      stubEnv('en', PROJECTS);
      const ProjectsListing = (await import('../index.vue')).default;
      const wrapper = mount(ProjectsListing);

      await flushPromises();

      const cards = wrapper.findAllComponents({ name: 'MoleculeCardProject' });

      expect(cards.length).toBeGreaterThan(0);
      cards.forEach((card) => {
        expect(card.props('sizes')).toBeTruthy();
        const image = card.props('image') as
          { width?: number; height?: number } | undefined;

        expect(image?.width).toBeTruthy();
        expect(image?.height).toBeTruthy();
      });
    });

    it('gives the first (above-fold) card fetchpriority=high and loading=eager, keeping the rest lazy', async () => {
      stubEnv('en', PROJECTS);
      const ProjectsListing = (await import('../index.vue')).default;
      const wrapper = mount(ProjectsListing);

      await flushPromises();

      const cards = wrapper.findAllComponents({ name: 'MoleculeCardProject' });

      expect(cards.length).toBeGreaterThan(1);
      expect(cards[0]?.props('fetchpriority')).toBe('high');
      expect(cards[0]?.props('loading')).toBe('eager');
      cards.slice(1).forEach((card) => {
        expect(card.props('loading')).toBe('lazy');
      });
    });
  });
});
