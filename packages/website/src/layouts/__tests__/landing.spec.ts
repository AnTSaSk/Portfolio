import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';

import OrganismHeaderStub from './__stubs__/OrganismHeaderStub';
import OrganismMainNavStub from './__stubs__/OrganismMainNavStub';
import { createT } from '../../pages/__tests__/__stubs__/createT';

vi.mock('@antsask/styleguide', () => ({
  Header: OrganismHeaderStub,
  MainNav: OrganismMainNavStub,
}));

vi.stubGlobal('useI18n', () => ({ locale: { value: 'en' }, t: createT('en') }));
vi.stubGlobal('useSwitchLocalePath', () =>
  vi.fn((target: string) => `/${target}`),
);
vi.stubGlobal('navigateTo', vi.fn());
vi.stubGlobal('useRoute', () => ({ path: '/' }));

describe('layouts/landing.vue', () => {
  it('composes OrganismHeader and OrganismMainNav from @antsask/styleguide', async () => {
    const LandingLayout = (await import('../landing.vue')).default;
    const wrapper = mount(LandingLayout, {
      slots: { default: '<div class="page-content" />' },
    });

    expect(wrapper.findComponent({ name: 'OrganismHeader' }).exists()).toBe(
      true,
    );
    expect(wrapper.findComponent({ name: 'OrganismMainNav' }).exists()).toBe(
      true,
    );
  });

  it('renders the page content passed to its default slot', async () => {
    const LandingLayout = (await import('../landing.vue')).default;
    const wrapper = mount(LandingLayout, {
      slots: { default: '<div class="page-content">hello</div>' },
    });

    expect(wrapper.find('.page-content').text()).toBe('hello');
  });

  it('wires socialLinks to the Header from constants and i18n, in order', async () => {
    const LandingLayout = (await import('../landing.vue')).default;
    const wrapper = mount(LandingLayout, {
      slots: { default: '<div />' },
    });

    const header = wrapper.findComponent({ name: 'OrganismHeader' });
    const social = header.props('socialLinks') as Array<{
      icon: string;
      href: string;
      label: string;
    }>;

    expect(social.map((s) => s.icon)).toEqual(['github', 'linkedin', 'x']);
    expect(social.map((s) => s.href)).toEqual([
      'https://github.com/AnTSaSk',
      'https://www.linkedin.com/in/alexis-besson-lead-front/',
      'https://x.com/AlexisBessonWeb',
    ]);
    expect(social.map((s) => s.label)).toEqual([
      'GitHub profile',
      'LinkedIn profile',
      'X profile',
    ]);
  });

  it('applies a locked-viewport ABEM camelCase class on its root element', async () => {
    const LandingLayout = (await import('../landing.vue')).default;
    const wrapper = mount(LandingLayout, {
      slots: { default: '<div />' },
    });

    const rootClasses = wrapper.classes();
    const lockedClass = rootClasses.find((cls) => /lock/i.test(cls));

    expect(lockedClass).toBeDefined();
    expect(lockedClass).not.toMatch(/^t-locked$/);
    expect(lockedClass).not.toMatch(/-[a-z]+-[a-z]+/);
  });

  it('does not set overflow-x hidden inline on its root element', async () => {
    const LandingLayout = (await import('../landing.vue')).default;
    const wrapper = mount(LandingLayout, {
      slots: { default: '<div />' },
    });

    const style = wrapper.attributes('style') ?? '';

    expect(style).not.toMatch(/overflow-x:\s*hidden/);
  });
});
