import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';

import { createT } from './__stubs__/createT';
import OrganismHeroStub from './__stubs__/OrganismHeroStub';

vi.mock('@antsask/styleguide', () => ({
  Hero: OrganismHeroStub,
}));

const mockUseLocalePath = vi.fn((path: string) => path);

function stubI18n(locale: 'en' | 'fr'): void {
  const t = createT(locale);

  vi.stubGlobal('useI18n', () => ({ locale: { value: locale }, t }));
  vi.stubGlobal('useLocalePath', () => mockUseLocalePath);
  vi.stubGlobal('useSwitchLocalePath', () =>
    vi.fn((target: string) => `/${target}`),
  );
  vi.stubGlobal('navigateTo', vi.fn());
  vi.stubGlobal('useRoute', () => ({ path: locale === 'fr' ? '/fr' : '/' }));
}

describe('pages/home/index.vue', () => {
  it('composes a single OrganismHero and nothing else', async () => {
    stubI18n('en');
    const IndexPage = (await import('../home/index.vue')).default;
    const wrapper = mount(IndexPage);

    expect(wrapper.findAllComponents({ name: 'OrganismHero' })).toHaveLength(1);
  });

  it('does not add a superfluous .p-home wrapper class', async () => {
    stubI18n('en');
    const IndexPage = (await import('../home/index.vue')).default;
    const wrapper = mount(IndexPage);

    expect(wrapper.find('.p-home').exists()).toBe(false);
  });

  it('does not re-render Hero-owned markup (headings) at the page level', async () => {
    stubI18n('en');
    const IndexPage = (await import('../home/index.vue')).default;
    const wrapper = mount(IndexPage);

    expect(wrapper.findAll('h1')).toHaveLength(0);
  });

  it('maps Hero props on home.* translations in English', async () => {
    stubI18n('en');
    const t = createT('en');
    const IndexPage = (await import('../home/index.vue')).default;
    const wrapper = mount(IndexPage);
    const hero = wrapper.findComponent({ name: 'OrganismHero' });

    expect(hero.props('name')).toBe(t('home.name'));
    expect(hero.props('role')).toBe(t('home.role'));
    expect(hero.props('greeting')).toBe(t('home.greeting'));
    expect(hero.props('watermarkText')).toBe(t('home.marquee'));
    expect(hero.props('body')).toEqual([t('home.body.p1'), t('home.body.p2')]);
    expect(hero.props('tags')).toEqual([
      t('home.tags.js'),
      t('home.tags.vue'),
      t('home.tags.ds'),
      t('home.tags.perf'),
      t('home.tags.ai'),
    ]);
    expect(hero.props('primaryLabel')).toBe(t('home.actions.projects'));
    expect(hero.props('secondaryLabel')).toBe(t('home.actions.linkedin'));
    expect(hero.props('secondaryExternal')).toBe(true);
    expect(hero.props('secondaryHref')).toBe(
      'https://www.linkedin.com/in/alexis-besson-lead-front/',
    );
  });

  it('maps Hero props on home.* translations in French', async () => {
    stubI18n('fr');
    const t = createT('fr');
    const IndexPage = (await import('../home/index.vue')).default;
    const wrapper = mount(IndexPage);
    const hero = wrapper.findComponent({ name: 'OrganismHero' });

    expect(hero.props('role')).toBe(t('home.role'));
    expect(hero.props('greeting')).toBe(t('home.greeting'));
    expect(hero.props('body')).toEqual([t('home.body.p1'), t('home.body.p2')]);
    expect(hero.props('tags')).toEqual([
      t('home.tags.js'),
      t('home.tags.vue'),
      t('home.tags.ds'),
      t('home.tags.perf'),
      t('home.tags.ai'),
    ]);
  });

  it('builds projectsHref from the localized /projects route', async () => {
    stubI18n('en');
    const IndexPage = (await import('../home/index.vue')).default;

    mount(IndexPage);

    expect(mockUseLocalePath).toHaveBeenCalledWith('/projects');
  });
});
