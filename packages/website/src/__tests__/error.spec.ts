import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { defineComponent, h } from 'vue';

import AtomLinkStub from '../pages/__tests__/__stubs__/AtomLinkStub';
import AtomTextStub from '../pages/__tests__/__stubs__/AtomTextStub';
import AtomWatermarkStub from '../pages/__tests__/__stubs__/AtomWatermarkStub';
import { createT } from '../pages/__tests__/__stubs__/createT';

// Test-only stand-in for the real styleguide AtomButton.
const AtomButtonStub = defineComponent({
  name: 'AtomButton',
  props: {
    variant: { type: String, default: 'primary' },
    type: { type: String, default: 'button' },
    href: { type: String, default: undefined },
  },
  emits: ['click'],
  setup(props, { slots, emit }) {
    return () =>
      h(
        'a',
        {
          class: 'a-button',
          href: props.href,
          onClick: (event: MouseEvent) => emit('click', event),
        },
        slots.default?.(),
      );
  },
});

// Test-only stand-in for the real styleguide AtomHeading.
const AtomHeadingStub = defineComponent({
  name: 'AtomHeading',
  props: {
    tag: { type: String, default: 'h2' },
    level: { type: String, default: 'h2' },
  },
  setup(props, { slots }) {
    return () => h(props.tag, { class: 'a-heading' }, slots.default?.());
  },
});

// Stand-in for the Nuxt-provided NuxtLayout wrapper, exposing the `name`
// prop so specs can assert which layout the error page requests.
const NuxtLayoutStub = defineComponent({
  name: 'NuxtLayout',
  props: {
    name: { type: String, default: undefined },
  },
  setup(props, { slots }) {
    return () =>
      h(
        'div',
        { class: 'nuxt-layout-stub', 'data-layout-name': props.name },
        slots.default?.(),
      );
  },
});

vi.mock('@antsask/styleguide', () => ({
  Button: AtomButtonStub,
  Heading: AtomHeadingStub,
  Link: AtomLinkStub,
  Text: AtomTextStub,
  Watermark: AtomWatermarkStub,
}));

const mockClearError = vi.fn();
const mockUseLocalePath = vi.fn((path: string) => path);

function stubI18n(locale: 'en' | 'fr'): void {
  const t = createT(locale);

  vi.stubGlobal('useI18n', () => ({ locale: { value: locale }, t }));
  vi.stubGlobal('useLocalePath', () => mockUseLocalePath);
  vi.stubGlobal('useRoute', () => ({ path: locale === 'fr' ? '/fr' : '/' }));
  vi.stubGlobal('clearError', mockClearError);
}

async function mountError(
  statusCode?: number,
): Promise<ReturnType<typeof mount>> {
  stubI18n('en');
  const ErrorPage = (await import('../error.vue')).default;

  return mount(ErrorPage, {
    props: { error: { statusCode } },
    global: {
      stubs: { NuxtLayout: NuxtLayoutStub },
    },
  });
}

describe('error.vue', () => {
  beforeEach(() => {
    mockClearError.mockClear();
    mockUseLocalePath.mockClear();
  });

  it('defaults statusCode to 500 and renders the default sub/lead copy when error.statusCode is absent', async () => {
    const t = createT('en');
    const wrapper = await mountError(undefined);

    expect(wrapper.findComponent({ name: 'AtomHeading' }).text()).toContain(
      '500',
    );
    const textNodes = wrapper.findAllComponents({ name: 'AtomText' });
    const rendered = textNodes.map((node) => node.text());

    expect(rendered).toContain(t('error.sub.default'));
    expect(rendered).toContain(t('error.lead.default'));
  });

  it('renders the 404 sub/lead copy and statusCode when error.statusCode is 404', async () => {
    const t = createT('en');
    const wrapper = await mountError(404);

    expect(wrapper.findComponent({ name: 'AtomHeading' }).text()).toBe('404');
    const rendered = wrapper
      .findAllComponents({ name: 'AtomText' })
      .map((node) => node.text());

    expect(rendered).toContain(t('error.sub.404'));
    expect(rendered).toContain(t('error.lead.404'));
  });

  it('renders the eyebrow copy resolved from i18n', async () => {
    const t = createT('en');
    const wrapper = await mountError(404);

    const rendered = wrapper
      .findAllComponents({ name: 'AtomText' })
      .map((node) => node.text());

    expect(rendered).toContain(t('error.eyebrow'));
  });

  it('renders a primary AtomButton to home and two quiet AtomLinks (blog, projects) as recovery actions', async () => {
    const t = createT('en');
    const wrapper = await mountError(404);

    const button = wrapper.findComponent({ name: 'AtomButton' });

    expect(button.exists()).toBe(true);
    expect(button.props('variant')).toBe('primary');
    expect(button.text()).toBe(t('error.actions.home'));

    const links = wrapper.findAllComponents({ name: 'AtomLink' });

    expect(links).toHaveLength(2);
    expect(links.map((link) => link.text())).toEqual([
      t('layouts.nav.blog'),
      t('layouts.nav.projects'),
    ]);
  });

  it('passes a watermark text containing the statusCode', async () => {
    const wrapper = await mountError(404);

    const watermark = wrapper.findComponent({ name: 'AtomWatermark' });

    expect(watermark.props('text')).toContain('404');
  });

  it('wraps the content in NuxtLayout with name="error"', async () => {
    const wrapper = await mountError(500);

    const layout = wrapper.findComponent({ name: 'NuxtLayout' });

    expect(layout.exists()).toBe(true);
    expect(layout.props('name')).toBe('error');
  });

  it('calls clearError with the home path when the home action is clicked', async () => {
    const wrapper = await mountError(500);

    await wrapper.findComponent({ name: 'AtomButton' }).trigger('click');

    expect(mockClearError).toHaveBeenCalledWith({ redirect: '/' });
  });

  it('resolves the eyebrow, sub, and lead copy in French', async () => {
    stubI18n('fr');
    const t = createT('fr');
    const ErrorPage = (await import('../error.vue')).default;
    const wrapper = mount(ErrorPage, {
      props: { error: { statusCode: 404 } },
      global: { stubs: { NuxtLayout: NuxtLayoutStub } },
    });

    const rendered = wrapper
      .findAllComponents({ name: 'AtomText' })
      .map((node) => node.text());

    expect(rendered).toContain(t('error.eyebrow'));
    expect(rendered).toContain(t('error.sub.404'));
    expect(rendered).toContain(t('error.lead.404'));
  });
});
