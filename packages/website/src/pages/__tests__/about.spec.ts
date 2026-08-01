import { flushPromises, mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { defineComponent, h, ref } from 'vue';

import AtomButtonStub from './__stubs__/AtomButtonStub';
import AtomWatermarkStub from './__stubs__/AtomWatermarkStub';
import { createT } from './__stubs__/createT';

import { definePageMetaMock } from '@/__tests__/setup/nuxt-macros';

interface AboutDoc {
  title: string;
  path: string;
}

function makeDoc(overrides: Partial<AboutDoc> = {}): AboutDoc {
  return {
    title: 'About',
    path: '/about/en/about',
    ...overrides,
  };
}

vi.mock('@antsask/styleguide', () => ({
  Watermark: AtomWatermarkStub,
  Button: AtomButtonStub,
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
  match: AboutDoc | null,
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

function stubEnv(locale: 'en' | 'fr', match: AboutDoc | null): void {
  const t = createT(locale);

  vi.stubGlobal('useI18n', () => ({ locale: { value: locale }, t }));
  vi.stubGlobal('useLocalePath', () =>
    vi.fn((path: string) => (locale === 'fr' ? `/fr${path}` : path)),
  );
  vi.stubGlobal('useRoute', () => ({ path: '/about' }));
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

describe('pages/about/index.vue', () => {
  it('nests .l-page.-about > .l-container > .l-container__wrapper > .l-page__note', async () => {
    stubEnv('en', makeDoc());
    const AboutPage = (await import('../about/index.vue')).default;
    const wrapper = mount(AboutPage, mountOptions);

    await flushPromises();

    expect(wrapper.classes()).toContain('l-page');
    expect(wrapper.classes()).toContain('-about');
    expect(
      wrapper
        .find(
          '.l-page.-about > .l-container > .l-container__wrapper > .l-page__note',
        )
        .exists(),
    ).toBe(true);
  });

  it('composes ContentRenderer.a-prose with :value bound to the resolved doc', async () => {
    const doc = makeDoc();

    stubEnv('en', doc);
    const AboutPage = (await import('../about/index.vue')).default;
    const wrapper = mount(AboutPage, mountOptions);

    await flushPromises();

    const renderer = wrapper.findComponent({ name: 'ContentRenderer' });

    expect(renderer.exists()).toBe(true);
    expect(renderer.classes()).toContain('a-prose');
    expect(renderer.props('value')).toEqual(doc);
  });

  it('queries the aboutEn collection filtered on the about path in the EN locale', async () => {
    stubEnv('en', makeDoc());
    const AboutPage = (await import('../about/index.vue')).default;

    mount(AboutPage, mountOptions);
    await flushPromises();

    expect(queryCollectionMock).toHaveBeenCalledWith('aboutEn');
    expect(lastQueryBuilder?.where).toHaveBeenCalledWith(
      'path',
      '=',
      '/about/en/about',
    );
  });

  it('queries the aboutFr collection filtered on the about path in the FR locale', async () => {
    stubEnv('fr', makeDoc({ path: '/about/fr/about' }));
    const AboutPage = (await import('../about/index.vue')).default;

    mount(AboutPage, mountOptions);
    await flushPromises();

    expect(queryCollectionMock).toHaveBeenCalledWith('aboutFr');
    expect(lastQueryBuilder?.where).toHaveBeenCalledWith(
      'path',
      '=',
      '/about/fr/about',
    );
  });

  it('triggers a fatal 404 createError when no about document is found', async () => {
    stubEnv('en', null);
    createErrorMock.mockClear();
    const AboutPage = (await import('../about/index.vue')).default;

    mount(AboutPage, mountOptions);
    await flushPromises();

    expect(createErrorMock).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 404, fatal: true }),
    );
  });

  it('passes the English about.marquee translation to Watermark', async () => {
    stubEnv('en', makeDoc());
    const t = createT('en');
    const AboutPage = (await import('../about/index.vue')).default;
    const wrapper = mount(AboutPage, mountOptions);

    await flushPromises();

    const watermark = wrapper.findComponent({ name: 'AtomWatermark' });

    expect(watermark.props('text')).toBe(t('about.marquee'));
  });

  it('passes the French about.marquee translation to Watermark', async () => {
    stubEnv('fr', makeDoc({ path: '/about/fr/about' }));
    const t = createT('fr');
    const AboutPage = (await import('../about/index.vue')).default;
    const wrapper = mount(AboutPage, mountOptions);

    await flushPromises();

    const watermark = wrapper.findComponent({ name: 'AtomWatermark' });

    expect(watermark.props('text')).toBe(t('about.marquee'));
  });

  it('renders a ghost legal Button (type link) inside .l-page__note, pointing to the localized /legal route', async () => {
    stubEnv('en', makeDoc());
    const AboutPage = (await import('../about/index.vue')).default;
    const wrapper = mount(AboutPage, mountOptions);

    await flushPromises();

    const button = wrapper.findComponent({ name: 'AtomButton' });

    expect(button.exists()).toBe(true);
    expect(button.props('variant')).toBe('ghost');
    expect(button.props('type')).toBe('link');
    expect(button.props('href')).toBe('/legal');
    expect(button.text()).toBe(createT('en')('about.legal'));
    expect(
      wrapper
        .find('.l-page__note')
        .findComponent({ name: 'AtomButton' })
        .exists(),
    ).toBe(true);
  });

  it('localizes the legal Button route in French', async () => {
    stubEnv('fr', makeDoc({ path: '/about/fr/about' }));
    const AboutPage = (await import('../about/index.vue')).default;
    const wrapper = mount(AboutPage, mountOptions);

    await flushPromises();

    const button = wrapper.findComponent({ name: 'AtomButton' });

    expect(button.props('href')).toBe('/fr/legal');
    expect(button.text()).toBe(createT('fr')('about.legal'));
  });

  it('renders the radial decoration', async () => {
    stubEnv('en', makeDoc());
    const AboutPage = (await import('../about/index.vue')).default;
    const wrapper = mount(AboutPage, mountOptions);

    await flushPromises();

    expect(wrapper.find('.u-radial').exists()).toBe(true);
  });

  it('declares the landing layout via definePageMeta', async () => {
    stubEnv('en', makeDoc());
    definePageMetaMock.mockClear();
    const AboutPage = (await import('../about/index.vue')).default;

    mount(AboutPage, mountOptions);
    await flushPromises();

    expect(definePageMetaMock).toHaveBeenCalledWith(
      expect.objectContaining({ layout: 'landing' }),
    );
  });
});
