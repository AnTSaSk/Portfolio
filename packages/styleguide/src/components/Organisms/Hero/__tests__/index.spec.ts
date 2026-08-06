import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { mount, type VueWrapper } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import Button from '../../../Atoms/Button/index.vue';
import Heading from '../../../Atoms/Heading/index.vue';
import Link from '../../../Atoms/Link/index.vue';
import Tag from '../../../Atoms/Tag/index.vue';
import Text from '../../../Atoms/Text/index.vue';
import Watermark from '../../../Atoms/Watermark/index.vue';
import Hero from '../index.vue';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const STYLE_CSS_PATH = path.join(dirname, '../style.css');

const baseProps = {
  greeting: 'Bonsoir !',
  name: 'Je suis Alexis Besson,',
  role: 'Lead Développeur Front-end',
  body: ['Paragraphe un.', 'Paragraphe deux.', 'Paragraphe trois.'],
  tags: ['Vue.js', 'Nuxt', 'TypeScript'],
  watermarkText: 'ALEXIS BESSON',
  primaryHref: '#projects',
  primaryLabel: 'Voir les projets',
  secondaryHref: 'https://www.linkedin.com/in/example/',
  secondaryLabel: 'LinkedIn',
  secondaryExternal: true,
};

describe('Hero (structure)', () => {
  it('mounts .o-hero containing .o-hero__inner', () => {
    const wrapper = mount(Hero, { props: baseProps });

    expect(wrapper.classes()).toContain('o-hero');
    expect(wrapper.find('.o-hero__inner').exists()).toBe(true);
  });

  it('composes the greeting via a Heading atom (h4, tag p, uppercase) plus a separate wave glyph', () => {
    const wrapper = mount(Hero, { props: baseProps });
    const greeting = wrapper.find('.o-hero__greeting');
    const heading = greeting.findComponent(Heading);

    expect(heading.exists()).toBe(true);
    expect(heading.element.tagName).toBe('P');
    expect(heading.classes()).toContain('-h4');
    expect(heading.classes()).toContain('-uppercase');
    expect(heading.text()).toContain(baseProps.greeting);

    const wave = greeting.find('.o-hero__wave');

    expect(wave.exists()).toBe(true);
    expect(wave.attributes('aria-hidden')).toBe('true');
  });

  it('composes the name via a Heading atom rendered as h1', () => {
    const wrapper = mount(Hero, { props: baseProps });
    const headings = wrapper.findAllComponents(Heading);
    const nameHeading = headings.find((h) => h.element.tagName === 'H1');

    expect(nameHeading?.exists()).toBe(true);
    expect(nameHeading?.text()).toContain(baseProps.name);
  });

  it('composes the role via a Heading atom rendered as a <p> with the h3 level', () => {
    const wrapper = mount(Hero, { props: baseProps });
    const roleHeading = wrapper.find('.o-hero__role').findComponent(Heading);

    expect(roleHeading.exists()).toBe(true);
    expect(roleHeading.element.tagName).toBe('P');
    expect(roleHeading.classes()).toContain('-h3');
    expect(roleHeading.text()).toBe(baseProps.role);
  });

  it('composes each body paragraph via the Text atom with the bodyS variant', () => {
    const wrapper = mount(Hero, { props: baseProps });
    const paragraphs = wrapper.find('.o-hero__body').findAllComponents(Text);

    expect(paragraphs).toHaveLength(baseProps.body.length);
    paragraphs.forEach(
      (p: VueWrapper<InstanceType<typeof Text>>, index: number) => {
        expect(p.props('variant')).toBe('bodyS');
        expect(p.text()).toBe(baseProps.body[index]);
      },
    );
  });

  it('composes one Tag atom with the strong variant per tag entry', () => {
    const wrapper = mount(Hero, { props: baseProps });
    const items = wrapper.findAll('.o-hero__tagItem');
    const tagAtoms = wrapper.find('.o-hero__tags').findAllComponents(Tag);

    expect(items).toHaveLength(baseProps.tags.length);
    expect(tagAtoms).toHaveLength(baseProps.tags.length);
    tagAtoms.forEach(
      (tag: VueWrapper<InstanceType<typeof Tag>>, index: number) => {
        expect(tag.props('variant')).toBe('strong');
        expect(tag.text()).toBe(baseProps.tags[index]);
      },
    );
  });

  // The radial glow is owned by the page (outside .o-hero) so it can bleed
  // past the hero's overflow:hidden, which clips the marquee.
  it('does not render the .u-radial glow (the page owns it)', () => {
    const wrapper = mount(Hero, { props: baseProps });

    expect(wrapper.find('.u-radial').exists()).toBe(false);
  });
});

describe('Hero (actions compose Button/Link)', () => {
  it('composes the primary action via the Button atom with the primary variant', () => {
    const wrapper = mount(Hero, { props: baseProps });
    const button = wrapper.find('.o-hero__actions').findComponent(Button);

    expect(button.exists()).toBe(true);
    expect(button.props('variant')).toBe('primary');
    expect(button.props('href')).toBe(baseProps.primaryHref);
    expect(button.text()).toContain(baseProps.primaryLabel);
    expect(button.element.tagName).toBe('A');
    expect(button.attributes('href')).toBe(baseProps.primaryHref);
  });

  it('composes the secondary action via the Link atom with the arrow variant, forwarding external, without a reinvented <a> or a hardcoded arrow glyph', () => {
    const wrapper = mount(Hero, { props: baseProps });
    const actions = wrapper.find('.o-hero__actions');
    const link = actions.findComponent(Link);

    expect(link.exists()).toBe(true);
    expect(link.props('variant')).toBe('arrow');
    expect(link.props('href')).toBe(baseProps.secondaryHref);
    expect(link.props('external')).toBe(true);
    expect(link.text()).toContain(baseProps.secondaryLabel);

    // Only the Link atom may render the secondary <a>; Hero must not add its own.
    expect(
      actions.findAll(`a[href="${baseProps.secondaryHref}"]`),
    ).toHaveLength(1);
    // The arrow glyph is owned by the Link atom's own template; Hero must not duplicate it.
    const arrowGlyphCount = (actions.text().match(/→/g) ?? []).length;

    expect(arrowGlyphCount).toBe(1);
  });
});

describe('Hero (Watermark placement owned by the organism)', () => {
  it('composes the Watermark atom, carrying its own placement class', () => {
    const wrapper = mount(Hero, { props: baseProps });
    const watermark = wrapper.findComponent(Watermark);

    expect(watermark.exists()).toBe(true);
    expect(watermark.props('text')).toBe(baseProps.watermarkText);
    expect(watermark.classes()).toContain('o-hero__watermark');
  });

  it('declares the full-bleed placement (centered max-content box) on .o-hero__watermark in the organism style sheet', () => {
    const css = readFileSync(STYLE_CSS_PATH, 'utf-8');
    const watermarkRule =
      css.match(/\.o-hero__watermark\s*\{[^}]*\}/)?.[0] ?? '';

    expect(watermarkRule).toMatch(/inline-size:\s*max-content/);
    expect(watermarkRule).not.toMatch(/text-align:\s*center/);
    expect(watermarkRule).not.toMatch(/max-inline-size:\s*100vw/);
  });
});

describe('Hero (internal geometry only, no page-level sizing)', () => {
  it('grows to fill the space its parent grants, never sizing itself on the viewport', () => {
    const css = readFileSync(STYLE_CSS_PATH, 'utf-8');
    const heroRule = css.match(/\.o-hero\s*\{[^}]*\}/)?.[0] ?? '';

    // A percentage height collapses once the parent height is no longer fixed;
    // growing as a flex item keeps the fill independent of the page frame.
    expect(heroRule).toMatch(/flex:\s*1/);
    expect(heroRule).not.toMatch(/min-block-size:\s*100%/);
    // Horizontal only: the watermark glyph is wider than the viewport by design,
    // and `hidden` would make the Hero a scroll container, leaving the page's
    // sticky nav inert.
    expect(heroRule).toMatch(/overflow-x:\s*clip/);
    expect(heroRule).not.toMatch(/overflow:\s*hidden/);
    expect(heroRule).not.toMatch(/100svh/);
    expect(heroRule).not.toMatch(/100vh/);
    expect(heroRule).not.toMatch(/min-height\s*:/);
    expect(heroRule).not.toMatch(/margin/);
  });

  it('does not declare the content-container band on .o-hero__inner', () => {
    const css = readFileSync(STYLE_CSS_PATH, 'utf-8');
    const innerRule = css.match(/\.o-hero__inner\s*\{[^}]*\}/)?.[0] ?? '';

    expect(innerRule).not.toMatch(/max-inline-size\s*:/);
    expect(innerRule).not.toMatch(/margin-inline\s*:/);
    expect(innerRule).not.toMatch(/padding-inline\s*:/);
  });
});

describe('Hero (typography owned by Heading/Text/Tag only)', () => {
  it('declares no absolute font-size on the __body/__tags blocks', () => {
    const css = readFileSync(STYLE_CSS_PATH, 'utf-8');
    const textBlockSuffixes = ['__body', '__tags'];

    textBlockSuffixes.forEach((suffix) => {
      const rule =
        css.match(new RegExp(`\\.o-hero${suffix}\\s*\\{[^}]*\\}`))?.[0] ?? '';

      expect(rule).not.toMatch(/font-size\s*:/);
    });
  });

  it('sanctions font-size only via the documented .o-hero__greeting/__name/__role.a-heading override', () => {
    const css = readFileSync(STYLE_CSS_PATH, 'utf-8');
    const plainRuleSuffixes = ['__greeting', '__name', '__role'];

    plainRuleSuffixes.forEach((suffix) => {
      const plainRule =
        css.match(new RegExp(`\\.o-hero${suffix}\\s*\\{[^}]*\\}`))?.[0] ?? '';

      expect(plainRule).not.toMatch(/font-size\s*:/);

      const overrideRule =
        css.match(
          new RegExp(`\\.o-hero${suffix}\\.a-heading\\s*\\{[^}]*\\}`),
        )?.[0] ?? '';

      expect(overrideRule).toMatch(/font-size\s*:/);
    });
  });
});
