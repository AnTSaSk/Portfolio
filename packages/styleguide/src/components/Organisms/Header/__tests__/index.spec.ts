import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import LangSwitcher from '../../../Atoms/LangSwitcher/index.vue';
import Logo from '../../../Atoms/Logo/index.vue';
import ThemeSwitcher from '../../../Atoms/ThemeSwitcher/index.vue';
import Header, { type SocialLink } from '../index.vue';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const STYLE_CSS_PATH = path.join(dirname, '../style.css');

const baseProps = {
  theme: 'light' as const,
  locale: 'en' as const,
};

describe('Header (root structure)', () => {
  it('mounts .o-header > .o-header__inner > .o-header__tools', () => {
    const wrapper = mount(Header, { props: baseProps });

    expect(wrapper.classes()).toContain('o-header');
    const inner = wrapper.find('.o-header__inner');

    expect(inner.exists()).toBe(true);
    expect(inner.find('.o-header__tools').exists()).toBe(true);
  });

  it('composes the Logo atom instead of an inline svg', () => {
    const wrapper = mount(Header, { props: baseProps });

    expect(wrapper.findComponent(Logo).exists()).toBe(true);
  });

  it('wraps the Logo in a home link, defaulting href to "/"', () => {
    const wrapper = mount(Header, { props: baseProps });
    const link = wrapper.find('a.o-header__logoLink');

    expect(link.exists()).toBe(true);
    expect(link.attributes('href')).toBe('/');
    expect(link.findComponent(Logo).exists()).toBe(true);
  });

  it('uses the provided logoHref as the home link target', () => {
    const wrapper = mount(Header, {
      props: { ...baseProps, logoHref: '/fr' },
    });

    expect(wrapper.find('a.o-header__logoLink').attributes('href')).toBe('/fr');
  });

  it('exposes logoLabel as the home link accessible name', () => {
    const wrapper = mount(Header, {
      props: { ...baseProps, logoLabel: 'AnTSaSk home' },
    });

    expect(wrapper.find('a.o-header__logoLink').attributes('aria-label')).toBe(
      'AnTSaSk home',
    );
  });

  it('composes the LangSwitcher atom inside .o-header__tools instead of a reinvented lang control', () => {
    const wrapper = mount(Header, { props: baseProps });

    const tools = wrapper.find('.o-header__tools');

    expect(tools.findComponent(LangSwitcher).exists()).toBe(true);
  });

  it('composes the ThemeSwitcher atom inside .o-header__tools instead of a reinvented theme control', () => {
    const wrapper = mount(Header, { props: baseProps });

    const tools = wrapper.find('.o-header__tools');

    expect(tools.findComponent(ThemeSwitcher).exists()).toBe(true);
  });

  it('forwards locale and theme props to the composed atoms', () => {
    const wrapper = mount(Header, {
      props: { ...baseProps, theme: 'dark', locale: 'fr' },
    });

    expect(wrapper.findComponent(ThemeSwitcher).props('theme')).toBe('dark');
    expect(wrapper.findComponent(LangSwitcher).props('locale')).toBe('fr');
  });
});

describe('Header (no legal link)', () => {
  it('never renders a legal link (moved to the About page)', () => {
    const wrapper = mount(Header, { props: baseProps });

    expect(wrapper.find('.o-header__legal').exists()).toBe(false);
  });
});

describe('Header (right column compartments)', () => {
  it('splits the tools row into a Liens group then an Actions group', () => {
    const wrapper = mount(Header, { props: baseProps });
    const tools = wrapper.find('.o-header__tools');
    const html = tools.html();

    expect(tools.find('.o-header__group.-links').exists()).toBe(true);
    expect(tools.find('.o-header__group.-actions').exists()).toBe(true);
    expect(html.indexOf('-links')).toBeLessThan(html.indexOf('-actions'));
  });

  it('places LangSwitcher and ThemeSwitcher inside the Actions group', () => {
    const wrapper = mount(Header, { props: baseProps });
    const actions = wrapper.find('.o-header__group.-actions');

    expect(actions.findComponent(LangSwitcher).exists()).toBe(true);
    expect(actions.findComponent(ThemeSwitcher).exists()).toBe(true);
  });
});

describe('Header (social links)', () => {
  const socialLinks: SocialLink[] = [
    { icon: 'github', href: 'https://github.com/x', label: 'GitHub' },
    {
      icon: 'linkedin',
      href: 'https://linkedin.com/in/x',
      label: 'LinkedIn',
    },
    { icon: 'x', href: 'https://x.com/x', label: 'X' },
  ];

  const socialProps = { ...baseProps, socialLinks };

  it('renders no social icon link when socialLinks is absent', () => {
    const wrapper = mount(Header, { props: baseProps });

    expect(wrapper.find('.o-header__social').exists()).toBe(false);
  });

  it('renders one social icon link per entry inside the Liens group', () => {
    const wrapper = mount(Header, { props: socialProps });
    const links = wrapper.findAll('.o-header__group.-links .o-header__social');

    expect(links).toHaveLength(3);
  });

  it('renders the social links in order', () => {
    const wrapper = mount(Header, { props: socialProps });
    const socialLabels = wrapper
      .find('.o-header__group.-links')
      .findAll('.o-header__social')
      .map((l) => l.attributes('aria-label'));

    expect(socialLabels).toEqual(['GitHub', 'LinkedIn', 'X']);
  });

  it('wires each social link href, external target and accessible label', () => {
    const wrapper = mount(Header, { props: socialProps });
    const github = wrapper
      .findAll('.o-header__social')
      .find((l) => l.attributes('aria-label') === 'GitHub');

    expect(github?.attributes('href')).toBe('https://github.com/x');
    expect(github?.attributes('target')).toBe('_blank');
    expect(github?.attributes('rel')).toBe('noopener noreferrer');
  });

  it('renders an empty Liens group when socialLinks is empty', () => {
    const wrapper = mount(Header, {
      props: { ...socialProps, socialLinks: [] },
    });

    expect(wrapper.find('.o-header__group.-links').exists()).toBe(true);
    expect(wrapper.find('.o-header__social').exists()).toBe(false);
  });
});

describe('Header (scrolled prop)', () => {
  it('applies the -scrolled class when scrolled is true', () => {
    const wrapper = mount(Header, { props: { ...baseProps, scrolled: true } });

    expect(wrapper.classes()).toContain('-scrolled');
  });

  it('does not apply the -scrolled class when scrolled is false (default)', () => {
    const wrapper = mount(Header, { props: baseProps });

    expect(wrapper.classes()).not.toContain('-scrolled');
  });
});

describe('Header (event relay)', () => {
  it('emits toggleTheme when the composed ThemeSwitcher emits toggle', async () => {
    const wrapper = mount(Header, { props: baseProps });

    await wrapper.findComponent(ThemeSwitcher).vm.$emit('toggle');

    expect(wrapper.emitted('toggleTheme')).toHaveLength(1);
  });

  it('emits changeLang with the target locale when the composed LangSwitcher emits change', async () => {
    const wrapper = mount(Header, { props: baseProps });

    await wrapper.findComponent(LangSwitcher).vm.$emit('change', 'fr');

    expect(wrapper.emitted('changeLang')).toEqual([['fr']]);
  });
});

describe('Header (internal geometry only)', () => {
  it('declares no external margin, width or max-inline-size rule on the .o-header root (inline-size: 100% is allowed; the .o-header__inner content-container band is an internal section concern)', () => {
    const css = readFileSync(STYLE_CSS_PATH, 'utf-8');
    const rootBlockMatch = css.match(/\.o-header\s*\{[^}]*\}/);

    expect(rootBlockMatch).not.toBeNull();

    const rootBlock = (rootBlockMatch as RegExpMatchArray)[0].replace(
      /inline-size:\s*100%/g,
      '',
    );

    expect(rootBlock).not.toMatch(/\bmargin(?:-\w+)?\s*:/);
    expect(rootBlock).not.toMatch(/(?<!-)\bwidth\s*:/);
    expect(rootBlock).not.toMatch(/max-inline-size\s*:/);
  });
});
