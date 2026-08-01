import { flushPromises, mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { defineComponent, h, ref } from 'vue';

import { formatDate } from '../../../utils/formatDate';
import { createT } from '../../__tests__/__stubs__/createT';

interface LegalDoc {
  title: string;
  lastUpdated: Date;
  path: string;
}

function makeDoc(overrides: Partial<LegalDoc> = {}): LegalDoc {
  return {
    title: 'Legal notice',
    lastUpdated: new Date('2026-01-15T00:00:00.000Z'),
    path: '/legal/en/legal-notice',
    ...overrides,
  };
}

const HeadingStub = defineComponent({
  name: 'AtomHeading',
  props: {
    level: { type: [String, Number], default: 1 },
    variant: { type: String, default: '' },
  },
  setup:
    (props, { slots }) =>
    (): ReturnType<typeof h> =>
      h('h1', { class: 'a-heading' }, slots.default?.() ?? String(props.level)),
});

const TextStub = defineComponent({
  name: 'AtomText',
  props: {
    variant: { type: String, default: 'body' },
    tone: { type: String, default: 'default' },
  },
  setup:
    (_props, { slots }) =>
    (): ReturnType<typeof h> =>
      h('p', { class: 'a-text' }, slots.default?.()),
});

vi.mock('@antsask/styleguide', () => ({
  Heading: HeadingStub,
  Text: TextStub,
}));

const ContentRendererStub = defineComponent({
  name: 'ContentRenderer',
  props: {
    value: { type: Object, default: undefined },
  },
  setup: () => (): ReturnType<typeof h> => h('div', { class: 'a-prose' }),
});

const createErrorMock = vi.fn((input: unknown) => input);

let lastQueryBuilder: Record<string, unknown> | null = null;

function createQueryCollectionMock(
  match: LegalDoc | null,
): Record<string, unknown> {
  const builder: Record<string, unknown> = {
    where: vi.fn(() => builder),
    andWhere: vi.fn(() => builder),
    orWhere: vi.fn(() => builder),
    order: vi.fn(() => builder),
    limit: vi.fn(() => builder),
    first: vi.fn(() => Promise.resolve(match)),
  };

  lastQueryBuilder = builder;

  return builder;
}

const queryCollectionMock = vi.fn();

function stubEnv(locale: 'en' | 'fr', match: LegalDoc | null): void {
  const t = createT(locale);

  vi.stubGlobal('useI18n', () => ({ locale: { value: locale }, t }));
  vi.stubGlobal('useRoute', () => ({ params: {} }));
  queryCollectionMock.mockReset();
  lastQueryBuilder = null;
  queryCollectionMock.mockImplementation(() =>
    createQueryCollectionMock(match),
  );
  vi.stubGlobal('queryCollection', queryCollectionMock);
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
  vi.stubGlobal('createError', createErrorMock);
  vi.stubGlobal('showError', vi.fn());
}

const mountOptions = {
  global: { components: { ContentRenderer: ContentRendererStub } },
};

describe('pages/legal/index.vue', () => {
  it('renders the .l-page.-legal root with the .l-container__wrapper', async () => {
    stubEnv('en', makeDoc());
    const LegalPage = (await import('../index.vue')).default;
    const wrapper = mount(LegalPage, mountOptions);

    await flushPromises();

    expect(wrapper.find('.l-page.-legal').exists()).toBe(true);
    expect(wrapper.find('.l-container__wrapper').exists()).toBe(true);
  });

  it('composes AtomHeading with the notice title', async () => {
    const doc = makeDoc({ title: 'Mentions légales' });

    stubEnv('en', doc);
    const LegalPage = (await import('../index.vue')).default;
    const wrapper = mount(LegalPage, mountOptions);

    await flushPromises();

    expect(wrapper.findComponent({ name: 'AtomHeading' }).text()).toBe(
      doc.title,
    );
  });

  it('renders the last-updated line built from formatDate interpolated in legal.lastUpdated', async () => {
    const doc = makeDoc({ lastUpdated: new Date('2026-03-02T00:00:00.000Z') });
    const t = createT('en');

    stubEnv('en', doc);
    const LegalPage = (await import('../index.vue')).default;
    const wrapper = mount(LegalPage, mountOptions);

    await flushPromises();

    const expected = t('legal.lastUpdated', {
      date: formatDate(doc.lastUpdated, 'en'),
    });

    expect(wrapper.text()).toContain(expected);
  });

  it('composes ContentRenderer.a-prose with :value bound to the resolved doc', async () => {
    const doc = makeDoc();

    stubEnv('en', doc);
    const LegalPage = (await import('../index.vue')).default;
    const wrapper = mount(LegalPage, mountOptions);

    await flushPromises();

    const renderer = wrapper.findComponent({ name: 'ContentRenderer' });

    expect(renderer.exists()).toBe(true);
    expect(renderer.classes()).toContain('a-prose');
    expect(renderer.props('value')).toEqual(doc);
  });

  it('queries the legalEn collection filtered on the legal-notice path in the EN locale', async () => {
    stubEnv('en', makeDoc());
    const LegalPage = (await import('../index.vue')).default;

    mount(LegalPage, mountOptions);
    await flushPromises();

    expect(queryCollectionMock).toHaveBeenCalledWith('legalEn');
    expect(lastQueryBuilder?.where).toHaveBeenCalledWith(
      'path',
      '=',
      '/legal/en/legal-notice',
    );
  });

  it('queries the legalFr collection filtered on the legal-notice path in the FR locale', async () => {
    stubEnv('fr', makeDoc());
    const LegalPage = (await import('../index.vue')).default;

    mount(LegalPage, mountOptions);
    await flushPromises();

    expect(queryCollectionMock).toHaveBeenCalledWith('legalFr');
    expect(lastQueryBuilder?.where).toHaveBeenCalledWith(
      'path',
      '=',
      '/legal/fr/legal-notice',
    );
  });

  it('triggers a fatal 404 createError when no legal notice is found', async () => {
    stubEnv('en', null);
    createErrorMock.mockClear();
    const LegalPage = (await import('../index.vue')).default;

    mount(LegalPage, mountOptions);
    await flushPromises();

    expect(createErrorMock).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 404, fatal: true }),
    );
  });

  it('resolves the legal.lastUpdated key in both EN and FR locale files', () => {
    expect(() => createT('en')('legal.lastUpdated')).not.toThrow();
    expect(() => createT('fr')('legal.lastUpdated')).not.toThrow();
  });

  it('sets definePageMeta layout to default', async () => {
    const { definePageMetaMock } =
      await import('../../../__tests__/setup/nuxt-macros');

    definePageMetaMock.mockClear();
    stubEnv('en', makeDoc());
    const LegalPage = (await import('../index.vue')).default;

    mount(LegalPage, mountOptions);
    await flushPromises();

    expect(definePageMetaMock).toHaveBeenCalledWith({ layout: 'default' });
  });
});
