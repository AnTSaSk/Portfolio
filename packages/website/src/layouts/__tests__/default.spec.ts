import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';

import OrganismHeaderStub from './__stubs__/OrganismHeaderStub';
import OrganismMainNavStub from './__stubs__/OrganismMainNavStub';
import { createT } from '../../pages/__tests__/__stubs__/createT';

vi.mock('@antsask/styleguide', () => ({
  Header: OrganismHeaderStub,
  MainNav: OrganismMainNavStub,
}));

vi.mock('#i18n', () => ({}));

const mockUseI18n = vi.fn(() => ({
  locale: { value: 'en' },
  t: createT('en'),
}));
const mockUseSwitchLocalePath = vi.fn(() =>
  vi.fn((target: string) => `/${target}`),
);
const mockNavigateTo = vi.fn();

vi.stubGlobal('useI18n', mockUseI18n);
vi.stubGlobal('useSwitchLocalePath', mockUseSwitchLocalePath);
vi.stubGlobal('navigateTo', mockNavigateTo);
vi.stubGlobal('useRoute', () => ({ path: '/' }));

describe('layouts/default.vue', () => {
  it('composes OrganismHeader and OrganismMainNav from @antsask/styleguide', async () => {
    const DefaultLayout = (await import('../default.vue')).default;
    const wrapper = mount(DefaultLayout, {
      slots: { default: '<div class="page-content" />' },
    });

    expect(wrapper.findComponent({ name: 'OrganismHeader' }).exists()).toBe(
      true,
    );
    expect(wrapper.findComponent({ name: 'OrganismMainNav' }).exists()).toBe(
      true,
    );
  });

  it('never renders a component literally named "Nav"', async () => {
    const DefaultLayout = (await import('../default.vue')).default;
    const wrapper = mount(DefaultLayout, {
      slots: { default: '<div class="page-content" />' },
    });

    expect(wrapper.findComponent({ name: 'Nav' }).exists()).toBe(false);
  });

  it('renders the page content passed to its default slot', async () => {
    const DefaultLayout = (await import('../default.vue')).default;
    const wrapper = mount(DefaultLayout, {
      slots: { default: '<div class="page-content">hello</div>' },
    });

    expect(wrapper.find('.page-content').text()).toBe('hello');
  });

  it('passes the current locale to the Header component', async () => {
    const DefaultLayout = (await import('../default.vue')).default;
    const wrapper = mount(DefaultLayout, {
      slots: { default: '<div />' },
    });

    const header = wrapper.findComponent({ name: 'OrganismHeader' });

    expect(header.props('locale')).toBe('en');
  });

  it('reacts to Header @changeLang by triggering the i18n locale switch', async () => {
    const DefaultLayout = (await import('../default.vue')).default;
    const wrapper = mount(DefaultLayout, {
      slots: { default: '<div />' },
    });

    const header = wrapper.findComponent({ name: 'OrganismHeader' });

    await header.vm.$emit('changeLang', 'fr');

    expect(mockNavigateTo).toHaveBeenCalledWith('/fr');
  });

  it('forwards the scrolled state to the Header component', async () => {
    const DefaultLayout = (await import('../default.vue')).default;
    const wrapper = mount(DefaultLayout, {
      slots: { default: '<div />' },
    });

    const header = wrapper.findComponent({ name: 'OrganismHeader' });

    expect(typeof header.props('scrolled')).toBe('boolean');
  });

  it('builds MainNav links covering Home, Blog, Projects and About', async () => {
    const DefaultLayout = (await import('../default.vue')).default;
    const wrapper = mount(DefaultLayout, {
      slots: { default: '<div />' },
    });

    const mainNav = wrapper.findComponent({ name: 'OrganismMainNav' });
    const links = mainNav.props('links') as Array<{ label: string }>;
    const labels = links.map((link) => link.label);

    expect(labels).toEqual(
      expect.arrayContaining(['Home', 'Blog', 'Projects', 'About']),
    );
  });

  it('wires socialLinks to the Header from constants and i18n, in order', async () => {
    const DefaultLayout = (await import('../default.vue')).default;
    const wrapper = mount(DefaultLayout, {
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

  // ABEM class on the layout root, camelCase (never kebab)
  it('applies an ABEM camelCase root layout class, never kebab-case', async () => {
    const DefaultLayout = (await import('../default.vue')).default;
    const wrapper = mount(DefaultLayout, {
      slots: { default: '<div />' },
    });

    const rootClasses = wrapper.classes();
    const layoutClass = rootClasses.find((cls) => cls.startsWith('l-'));

    expect(layoutClass).toBeDefined();
    expect(layoutClass).not.toMatch(/-[a-z]+-[a-z]+/);
  });
});
