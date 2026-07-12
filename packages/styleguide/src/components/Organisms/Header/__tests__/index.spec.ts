import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import LangSwitcher from '@/components/Atoms/LangSwitcher/index.vue';
import Logo from '@/components/Atoms/Logo/index.vue';
import ThemeSwitcher from '@/components/Atoms/ThemeSwitcher/index.vue';

import Header from '../index.vue';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const STYLE_CSS_PATH = path.join(dirname, '../style.css');

const baseProps = {
  theme: 'light' as const,
  locale: 'en' as const,
};

describe('Header (AC-COMP-1)', () => {
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

describe('Header (AC-LAYER-3 — internal geometry only)', () => {
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

  it('does not declare the content-container band on .o-header__inner (owned by l-container)', () => {
    const css = readFileSync(STYLE_CSS_PATH, 'utf-8');
    const innerBlocks = css.match(/\.o-header__inner[^{]*\{[^}]*\}/g) ?? [];
    const innerCss = innerBlocks.join('\n');

    expect(innerCss).not.toMatch(/max-inline-size\s*:/);
    expect(innerCss).not.toMatch(/margin-inline\s*:/);
    expect(innerCss).not.toMatch(/padding-inline\s*:/);
  });

  it('composes the l-container layout class on .o-header__inner', () => {
    const wrapper = mount(Header, { props: baseProps });
    const inner = wrapper.find('.o-header__inner');

    expect(inner.classes()).toContain('l-container');
  });
});
