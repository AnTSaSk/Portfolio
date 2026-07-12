import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import Link from '@/components/Atoms/Link/index.vue';

import MainNav from '../index.vue';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const STYLE_CSS_PATH = path.join(dirname, '../style.css');

interface MainNavLink {
  label: string;
  href: string;
  current?: boolean;
  external?: boolean;
}

const links: MainNavLink[] = [
  { label: 'Home', href: '/', current: true },
  { label: 'Projects', href: '/projects' },
  { label: 'External', href: 'https://example.com', external: true },
];

describe('Organisms/MainNav', () => {
  // AC-COMP-1/3: MainNav composes the Link atom, no raw markup structure reinvented
  it('renders footer root with an inner nav, list and item wrappers around composed Link components', () => {
    const wrapper = mount(MainNav, { props: { links } });

    expect(wrapper.find('footer.o-mainNav').exists()).toBe(true);
    expect(wrapper.find('.o-mainNav__inner').exists()).toBe(true);
    expect(wrapper.find('nav.o-mainNav__nav').exists()).toBe(true);
    expect(wrapper.find('ul.o-mainNav__list').exists()).toBe(true);
    expect(wrapper.findAll('li.o-mainNav__item')).toHaveLength(links.length);
    expect(wrapper.findAllComponents(Link)).toHaveLength(links.length);
  });

  // AC-COMP-1/3: no raw <a> reinvented by MainNav — every anchor must come from Link
  it('renders anchors only through the composed Link atom, never authored directly by MainNav', () => {
    const wrapper = mount(MainNav, { props: { links } });

    const anchors = wrapper.findAll('a');
    const linkComponents = wrapper.findAllComponents(Link);

    expect(anchors).toHaveLength(linkComponents.length);
  });

  // AC-COMP-1/3: Link behavior variant is fixed to "nav", never left to default
  it('passes variant="nav" to every composed Link', () => {
    const wrapper = mount(MainNav, { props: { links } });

    const linkComponents = wrapper.findAllComponents(Link);

    linkComponents.forEach((link) => {
      expect(link.props('variant')).toBe('nav');
    });
  });

  // AC-COMP-1/3: href mapping from links prop to each composed Link
  it('maps href from each link entry to the corresponding Link component', () => {
    const wrapper = mount(MainNav, { props: { links } });

    const linkComponents = wrapper.findAllComponents(Link);

    links.forEach((entry, index) => {
      expect(linkComponents[index]?.props('href')).toBe(entry.href);
    });
  });

  // AC-COMP-1/3: current mapping from links prop to each composed Link
  it('maps current from each link entry to the corresponding Link component', () => {
    const wrapper = mount(MainNav, { props: { links } });

    const linkComponents = wrapper.findAllComponents(Link);

    links.forEach((entry, index) => {
      expect(linkComponents[index]?.props('current')).toBe(
        Boolean(entry.current),
      );
    });
  });

  // AC-COMP-1/3: external mapping from links prop to each composed Link
  it('maps external from each link entry to the corresponding Link component', () => {
    const wrapper = mount(MainNav, { props: { links } });

    const linkComponents = wrapper.findAllComponents(Link);

    links.forEach((entry, index) => {
      expect(linkComponents[index]?.props('external')).toBe(entry.external);
    });
  });

  it('applies the -min modifier class to the footer root when min prop is true', () => {
    const wrapper = mount(MainNav, { props: { links, min: true } });

    expect(wrapper.find('footer.o-mainNav').classes()).toContain('-min');
  });

  it('does not apply the -min modifier class when min prop is false', () => {
    const wrapper = mount(MainNav, { props: { links, min: false } });

    expect(wrapper.find('footer.o-mainNav').classes()).not.toContain('-min');
  });

  it('sets aria-label on the inner nav from the ariaLabel prop', () => {
    const wrapper = mount(MainNav, {
      props: { links, ariaLabel: 'Footer navigation' },
    });

    expect(wrapper.find('nav.o-mainNav__nav').attributes('aria-label')).toBe(
      'Footer navigation',
    );
  });

  it('defaults aria-label to "Principale" when ariaLabel is not provided', () => {
    const wrapper = mount(MainNav, { props: { links } });

    expect(wrapper.find('nav.o-mainNav__nav').attributes('aria-label')).toBe(
      'Principale',
    );
  });

  // AC-LAYER-3: no external margin/width authored on the component root
  it('does not set an inline style on the footer root (no external margin/width)', () => {
    const wrapper = mount(MainNav, { props: { links } });

    expect(
      wrapper.find('footer.o-mainNav').attributes('style'),
    ).toBeUndefined();
  });
});

describe('MainNav (AC-LAYER-3 — internal geometry only)', () => {
  it('declares no external margin or width on the .o-mainNav root beyond sticky insets and inline-size', () => {
    const css = readFileSync(STYLE_CSS_PATH, 'utf-8');
    const rootBlock = css.match(/\.o-mainNav\s*\{([^}]*)\}/)?.[1] ?? '';
    const withoutAllowedInlineSize = rootBlock.replace(
      /inline-size:\s*100%/g,
      '',
    );

    expect(withoutAllowedInlineSize).not.toMatch(/\bmargin(?:-\w+)?\s*:/);
    expect(withoutAllowedInlineSize).not.toMatch(/(?<!-)\bwidth\s*:/);
    expect(withoutAllowedInlineSize).not.toMatch(/max-inline-size\s*:/);
  });

  it('does not declare the content-container band on .o-mainNav__inner (owned by l-container)', () => {
    const css = readFileSync(STYLE_CSS_PATH, 'utf-8');
    const innerBlock = css.match(/\.o-mainNav__inner\s*\{([^}]*)\}/)?.[1] ?? '';

    expect(innerBlock).not.toMatch(/max-inline-size\s*:/);
    expect(innerBlock).not.toMatch(/margin-inline\s*:/);
    expect(innerBlock).not.toMatch(/padding-inline\s*:/);
  });

  it('composes the l-container layout class on .o-mainNav__inner', () => {
    const wrapper = mount(MainNav, { props: { links } });
    const inner = wrapper.find('.o-mainNav__inner');

    expect(inner.classes()).toContain('l-container');
  });
});
