import { flushPromises, mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { defineComponent, h, ref } from 'vue';

import { createT } from '../../__tests__/__stubs__/createT';

interface ProjectLink {
  label: string;
  href: string;
}

interface ProjectFixture {
  title: string;
  year: number;
  stack: string[];
  shortDescription: string;
  description: string;
  period?: string;
  role?: string;
  client?: string;
  links?: ProjectLink[];
  cover?: { src: string; width: number; height: number };
  gallery?: ProjectGalleryItem[];
  draft?: boolean;
  path: string;
}

interface ProjectGalleryItem {
  src: string;
  width: number;
  height: number;
  caption?: string;
}

function makeProject(overrides: Partial<ProjectFixture>): ProjectFixture {
  return {
    title: 'Design system tokens',
    year: 2025,
    stack: ['Vue', 'TypeScript', 'Nuxt'],
    shortDescription: 'A token-driven component library.',
    description: 'Full case study body.',
    period: '2024-2025',
    role: 'Lead front-end · design systems',
    client: 'Acme Corp',
    links: [
      { label: 'GitHub', href: 'https://github.com/example/tokens' },
      { label: 'Live', href: 'https://example.com/tokens' },
    ],
    cover: { src: '/img/projects/cover.webp', width: 2560, height: 1440 },
    gallery: [
      {
        src: '/img/projects/g1.webp',
        width: 2560,
        height: 1440,
        caption: 'Hero shot',
      },
      {
        src: '/img/projects/g2.webp',
        width: 1600,
        height: 1200,
        caption: 'Detail · component',
      },
      { src: '/img/projects/g3.webp', width: 1600, height: 1200 },
    ],
    draft: false,
    path: '/projects/en/design-system-tokens',
    ...overrides,
  };
}

// Mixes a draft project with the highest year (must be excluded) and more
// than 3 non-draft candidates (must be sliced to 3, ordered by year DESC).
const RELATED_FIXTURES: ProjectFixture[] = [
  makeProject({ title: 'Related A', year: 2024, path: '/projects/en/other-a' }),
  makeProject({
    title: 'Related B (draft)',
    year: 2026,
    draft: true,
    path: '/projects/en/other-b',
  }),
  makeProject({ title: 'Related C', year: 2023, path: '/projects/en/other-c' }),
  makeProject({ title: 'Related D', year: 2022, path: '/projects/en/other-d' }),
  makeProject({ title: 'Related E', year: 2021, path: '/projects/en/other-e' }),
];

// --- Minimal structural stubs for the barrel components this page composes.
// Aligned to the real DS prop APIs read this session (Head/MediaCover/
// MetaList/Gallery/Related/CardProject) so the page's wiring is observable.
const HeadStub = defineComponent({
  name: 'OrganismHead',
  props: {
    variant: { type: String, default: '' },
    backHref: { type: String, default: '' },
    backLabel: { type: String, default: '' },
    title: { type: String, default: '' },
    lede: { type: String, default: '' },
    tags: { type: Array, default: () => [] },
    metaDate: { type: String, default: undefined },
    metaDuration: { type: String, default: undefined },
  },
  setup: (props) => (): ReturnType<typeof h> =>
    h('header', { class: 'o-head' }, props.title),
});

const MediaCoverStub = defineComponent({
  name: 'MoleculeMediaCover',
  props: {
    variant: { type: String, default: '' },
    image: { type: Object, default: undefined },
    category: { type: String, default: undefined },
    placeholderHeading: { type: Boolean, default: false },
  },
  setup: (): (() => ReturnType<typeof h>) => () =>
    h('figure', { class: 'm-cover' }),
});

const MetaListStub = defineComponent({
  name: 'MoleculeMetaList',
  props: {
    items: { type: Array, default: () => [] },
    ariaLabel: { type: String, default: '' },
    links: { type: Array, default: undefined },
    linksLabel: { type: String, default: '' },
  },
  setup: (): (() => ReturnType<typeof h>) => () =>
    h('aside', { class: 'm-facts' }),
});

const GalleryStub = defineComponent({
  name: 'MoleculeGallery',
  props: {
    items: { type: Array, default: () => [] },
    ariaLabel: { type: String, default: '' },
    variant: { type: String, default: 'styleA' },
  },
  setup: (): (() => ReturnType<typeof h>) => () =>
    h('section', { class: 'm-gallery' }),
});

const CardProjectStub = defineComponent({
  name: 'MoleculeCardProject',
  props: {
    href: { type: String, default: '' },
    title: { type: String, default: '' },
    meta: { type: String, default: '' },
    stack: { type: Array, default: () => [] },
    desc: { type: String, default: '' },
    image: { type: Object, default: undefined },
  },
  setup: (props) => (): ReturnType<typeof h> =>
    h('li', { class: 'm-project-card' }, props.title),
});

const RelatedStub = defineComponent({
  name: 'OrganismRelated',
  props: {
    eyebrow: { type: String, default: '' },
    ariaLabel: { type: String, default: '' },
  },
  setup:
    (_props, { slots }) =>
    (): ReturnType<typeof h> =>
      h('section', { class: 'o-related' }, slots.default?.()),
});

vi.mock('@antsask/styleguide', () => ({
  Head: HeadStub,
  MediaCover: MediaCoverStub,
  MetaList: MetaListStub,
  Gallery: GalleryStub,
  Related: RelatedStub,
  CardProject: CardProjectStub,
}));

const createErrorMock = vi.fn((input: unknown) => input);

function createQueryCollectionMock(
  match: ProjectFixture | null,
  related: ProjectFixture[],
): Record<string, unknown> {
  const builder: Record<string, unknown> = {
    where: vi.fn(() => builder),
    andWhere: vi.fn(() => builder),
    orWhere: vi.fn(() => builder),
    order: vi.fn(() => builder),
    limit: vi.fn(() => builder),
    all: vi.fn(() => Promise.resolve(match ? related : [])),
    first: vi.fn(() => Promise.resolve(match)),
  };

  return builder;
}

function stubEnv(
  locale: 'en' | 'fr',
  slug: string,
  match: ProjectFixture | null,
  related: ProjectFixture[] = RELATED_FIXTURES,
): void {
  const t = createT(locale);

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
  vi.stubGlobal('showError', vi.fn());
}

describe('pages/projects/[slug].vue', () => {
  it('composes Head(article) + MediaCover(poster) + MetaList + prose + Gallery, never Feature', async () => {
    stubEnv('en', 'design-system-tokens', makeProject({}));
    const CaseStudy = (await import('../[slug].vue')).default;
    const wrapper = mount(CaseStudy);

    await flushPromises();

    expect(
      wrapper.findComponent({ name: 'OrganismHead' }).props('variant'),
    ).toBe('article');
    expect(
      wrapper.findComponent({ name: 'MoleculeMediaCover' }).props('variant'),
    ).toBe('poster');
    expect(wrapper.findComponent({ name: 'MoleculeMetaList' }).exists()).toBe(
      true,
    );
    expect(wrapper.find('.a-prose').exists()).toBe(true);
    expect(wrapper.findComponent({ name: 'MoleculeGallery' }).exists()).toBe(
      true,
    );
    expect(wrapper.findComponent({ name: 'OrganismFeature' }).exists()).toBe(
      false,
    );
  });

  it('maps backHref/backLabel/tags/title/lede onto Head and omits the meta row', async () => {
    const project = makeProject({});

    stubEnv('en', 'design-system-tokens', project);
    const CaseStudy = (await import('../[slug].vue')).default;
    const wrapper = mount(CaseStudy);

    await flushPromises();

    const head = wrapper.findComponent({ name: 'OrganismHead' });

    expect(head.props('backHref')).toBe('/projects');
    expect(head.props('backLabel')).toBe(
      createT('en')('projects.project.backToList'),
    );
    expect(head.props('tags')).toEqual(project.stack);
    expect(head.props('title')).toBe(project.title);
    expect(head.props('lede')).toBe(project.shortDescription);
    expect(head.props('metaDate')).toBeUndefined();
    expect(head.props('metaDuration')).toBeUndefined();
  });

  it('builds the 5 facts (year/role/client/period/stack), links and ariaLabel for MetaList', async () => {
    const project = makeProject({});
    const t = createT('en');

    stubEnv('en', 'design-system-tokens', project);
    const CaseStudy = (await import('../[slug].vue')).default;
    const wrapper = mount(CaseStudy);

    await flushPromises();

    const metaList = wrapper.findComponent({ name: 'MoleculeMetaList' });

    expect(metaList.props('items')).toEqual([
      { term: t('projects.project.facts.year'), value: String(project.year) },
      { term: t('projects.project.facts.role'), value: project.role },
      { term: t('projects.project.facts.client'), value: project.client },
      { term: t('projects.project.facts.period'), value: project.period },
      { term: t('projects.project.facts.stack'), tags: project.stack },
    ]);
    expect(metaList.props('links')).toEqual(project.links);
    expect(metaList.props('linksLabel')).toBe(
      t('projects.project.facts.links'),
    );
    expect(metaList.props('ariaLabel')).toBe(
      t('projects.project.factsAriaLabel'),
    );
  });

  it('maps project.gallery images onto Gallery items with variant styleA and the translated ariaLabel', async () => {
    const project = makeProject({});
    const t = createT('en');

    stubEnv('en', 'design-system-tokens', project);
    const CaseStudy = (await import('../[slug].vue')).default;
    const wrapper = mount(CaseStudy);

    await flushPromises();

    const gallery = wrapper.findComponent({ name: 'MoleculeGallery' });

    expect(gallery.props('items')).toEqual(
      project.gallery?.map((g) => ({
        image: {
          src: g.src,
          alt: g.caption ?? project.title,
          width: g.width,
          height: g.height,
        },
        caption: g.caption,
      })),
    );
    expect(gallery.props('variant')).toBe('styleA');
    expect(gallery.props('ariaLabel')).toBe(
      t('projects.project.galleryAriaLabel'),
    );
  });

  it('renders a placeholder gallery item when the project has no gallery images', async () => {
    stubEnv('en', 'design-system-tokens', makeProject({ gallery: undefined }));
    const CaseStudy = (await import('../[slug].vue')).default;
    const wrapper = mount(CaseStudy);

    await flushPromises();

    const items = wrapper
      .findComponent({ name: 'MoleculeGallery' })
      .props('items') as Array<{ image?: unknown }>;

    expect(items.length).toBeGreaterThan(0);
    expect(items.every((item) => item.image === undefined)).toBe(true);
  });

  it('maps project.cover onto the poster MediaCover image when present', async () => {
    const project = makeProject({});

    stubEnv('en', 'design-system-tokens', project);
    const CaseStudy = (await import('../[slug].vue')).default;
    const wrapper = mount(CaseStudy);

    await flushPromises();

    expect(
      wrapper.findComponent({ name: 'MoleculeMediaCover' }).props('image'),
    ).toEqual({
      src: project.cover?.src,
      alt: project.title,
      width: project.cover?.width,
      height: project.cover?.height,
    });
  });

  it('leaves the poster MediaCover image undefined (placeholder) when project.cover is absent', async () => {
    stubEnv('en', 'design-system-tokens', makeProject({ cover: undefined }));
    const CaseStudy = (await import('../[slug].vue')).default;
    const wrapper = mount(CaseStudy);

    await flushPromises();

    expect(
      wrapper.findComponent({ name: 'MoleculeMediaCover' }).props('image'),
    ).toBeUndefined();
  });

  it('maps project.title onto the poster MediaCover category (placeholder label)', async () => {
    const project = makeProject({});

    stubEnv('en', 'design-system-tokens', project);
    const CaseStudy = (await import('../[slug].vue')).default;
    const wrapper = mount(CaseStudy);

    await flushPromises();

    expect(
      wrapper.findComponent({ name: 'MoleculeMediaCover' }).props('category'),
    ).toBe(project.title);
  });

  // the project poster placeholder shows the big title style, unlike the blog poster
  it('enables the poster MediaCover placeholderHeading for the project title', async () => {
    stubEnv('en', 'design-system-tokens', makeProject({}));
    const CaseStudy = (await import('../[slug].vue')).default;
    const wrapper = mount(CaseStudy);

    await flushPromises();

    expect(
      wrapper
        .findComponent({ name: 'MoleculeMediaCover' })
        .props('placeholderHeading'),
    ).toBe(true);
  });

  it('triggers a fatal 404 createError when no project matches the slug', async () => {
    stubEnv('en', 'unknown-slug', null);
    createErrorMock.mockClear();
    const CaseStudy = (await import('../[slug].vue')).default;

    mount(CaseStudy);
    await flushPromises();

    expect(createErrorMock).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 404, fatal: true }),
    );
  });

  it('renders a visible state instead of an empty page when the project is null', async () => {
    stubEnv('en', 'unknown-slug', null);
    const CaseStudy = (await import('../[slug].vue')).default;
    const wrapper = mount(CaseStudy);

    await flushPromises();

    expect(wrapper.find('article').exists()).toBe(false);
    expect(wrapper.find('p.a-prose').text()).toBe(
      createT('en')('error.description.default'),
    );
  });
});
