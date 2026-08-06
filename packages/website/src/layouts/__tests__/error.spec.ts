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
vi.stubGlobal('useRoute', () => ({ path: '/error' }));

describe('layouts/error.vue', () => {
  it('composes OrganismHeader from @antsask/styleguide', async () => {
    const ErrorLayout = (await import('../error.vue')).default;
    const wrapper = mount(ErrorLayout, {
      slots: { default: '<div class="page-content" />' },
    });

    expect(wrapper.findComponent({ name: 'OrganismHeader' }).exists()).toBe(
      true,
    );
  });

  it('does not render OrganismMainNav (footer nav hidden on error pages)', async () => {
    const ErrorLayout = (await import('../error.vue')).default;
    const wrapper = mount(ErrorLayout, {
      slots: { default: '<div class="page-content" />' },
    });

    expect(wrapper.findComponent({ name: 'OrganismMainNav' }).exists()).toBe(
      false,
    );
  });

  it('renders the page content passed to its default slot', async () => {
    const ErrorLayout = (await import('../error.vue')).default;
    const wrapper = mount(ErrorLayout, {
      slots: { default: '<div class="page-content">not found</div>' },
    });

    expect(wrapper.find('.page-content').text()).toBe('not found');
  });

  it('carries its viewport mode as an ABEM camelCase modifier on the root element', async () => {
    const ErrorLayout = (await import('../error.vue')).default;
    const wrapper = mount(ErrorLayout, {
      slots: { default: '<div />' },
    });

    const rootClasses = wrapper.classes();

    expect(rootClasses).toContain('l-layoutError');

    const modifier = rootClasses.find((cls) => cls.startsWith('-'));

    expect(modifier).toBeDefined();
    expect(modifier).not.toMatch(/-[a-z]+-[a-z]+/);
  });
});
