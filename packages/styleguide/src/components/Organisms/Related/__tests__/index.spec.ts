import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { h } from 'vue';

import Text from '@/components/Atoms/Text/index.vue';
import CardArticle from '@/components/Molecules/CardArticle/index.vue';
import CardProject from '@/components/Molecules/CardProject/index.vue';

import Related from '../index.vue';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const STYLE_CSS_PATH = path.join(dirname, '../style.css');

const baseProps = {
  eyebrow: 'À lire ensuite',
  ariaLabel: 'À lire ensuite',
};

const stubCardsHtml =
  '<a class="m-cardArticle" href="/a">A</a>' +
  '<a class="m-cardArticle" href="/b">B</a>' +
  '<a class="m-cardArticle" href="/c">C</a>';

describe('Related (structure)', () => {
  it('mounts .o-related as a section carrying the aria-label prop', () => {
    const wrapper = mount(Related, {
      props: baseProps,
      slots: { default: stubCardsHtml },
    });

    expect(wrapper.classes()).toContain('o-related');
    expect(wrapper.element.tagName).toBe('SECTION');
    expect(wrapper.attributes('aria-label')).toBe(baseProps.ariaLabel);
  });

  it('composes the l-container layout class on .o-related__inner', () => {
    const wrapper = mount(Related, {
      props: baseProps,
      slots: { default: stubCardsHtml },
    });
    const inner = wrapper.find('.o-related__inner');

    expect(inner.exists()).toBe(true);
    expect(inner.classes()).toContain('l-container');
  });

  it('renders .o-related__grid as a plain div (not a list) holding the grid', () => {
    const wrapper = mount(Related, {
      props: baseProps,
      slots: { default: stubCardsHtml },
    });
    const grid = wrapper.find('.o-related__grid');

    expect(grid.exists()).toBe(true);
    expect(grid.element.tagName).toBe('DIV');
  });
});

describe('Related (eyebrow composed via the Text atom)', () => {
  it('renders the eyebrow prop through the Text atom with the eyebrow variant and accent tone', () => {
    const wrapper = mount(Related, {
      props: baseProps,
      slots: { default: stubCardsHtml },
    });
    const eyebrow = wrapper.findComponent(Text);

    expect(eyebrow.exists()).toBe(true);
    expect(eyebrow.props('variant')).toBe('eyebrow');
    expect(eyebrow.props('tone')).toBe('accent');
    expect(eyebrow.text()).toBe(baseProps.eyebrow);
  });
});

describe('Related (default slot exposes card composition, no reinvented card)', () => {
  it('renders slotted cards as direct children of .o-related__grid, without an intermediate <li>', () => {
    const wrapper = mount(Related, {
      props: baseProps,
      slots: { default: stubCardsHtml },
    });
    const grid = wrapper.find('.o-related__grid');
    const directChildren = Array.from(grid.element.children);

    expect(directChildren).toHaveLength(3);
    directChildren.forEach((child) => {
      expect(child.tagName).toBe('A');
    });
    expect(grid.findAll('li')).toHaveLength(0);
  });

  it('does not render any card markup of its own when the slot is empty', () => {
    const wrapper = mount(Related, {
      props: baseProps,
      slots: { default: '' },
    });
    const grid = wrapper.find('.o-related__grid');

    expect(grid.element.children).toHaveLength(0);
  });

  it('composes three CardArticle molecules as direct grid children for an article-only section', () => {
    const articles = [
      {
        href: '/1',
        title: 'One',
        date: '2026-01-01',
        excerpt: 'e1',
        tags: ['t1'],
      },
      {
        href: '/2',
        title: 'Two',
        date: '2026-01-02',
        excerpt: 'e2',
        tags: ['t2'],
      },
      {
        href: '/3',
        title: 'Three',
        date: '2026-01-03',
        excerpt: 'e3',
        tags: ['t3'],
      },
    ];
    const wrapper = mount(Related, {
      props: baseProps,
      slots: {
        default: () => articles.map((article) => h(CardArticle, article)),
      },
    });
    const cards = wrapper.findAllComponents(CardArticle);

    expect(cards).toHaveLength(3);
    cards.forEach((card) => {
      expect(card.element.parentElement).toBe(
        wrapper.find('.o-related__grid').element,
      );
    });
  });

  it('composes CardProject molecules as direct grid children for a project-only section', () => {
    const projects = [
      { href: '/p1', title: 'Alpha', meta: 'meta-1', stack: ['Vue'] },
      { href: '/p2', title: 'Beta', meta: 'meta-2', stack: ['Nuxt'] },
    ];
    const wrapper = mount(Related, {
      props: baseProps,
      slots: {
        default: () => projects.map((project) => h(CardProject, project)),
      },
    });
    const cards = wrapper.findAllComponents(CardProject);

    expect(cards).toHaveLength(2);
    cards.forEach((card) => {
      expect(card.element.parentElement).toBe(
        wrapper.find('.o-related__grid').element,
      );
    });
  });
});

describe('Related (invariant — no external sizing on root)', () => {
  it('declares no margin/width on .o-related (sizing/position owned by the parent layout)', () => {
    const css = readFileSync(STYLE_CSS_PATH, 'utf-8');
    const rootRule = css.match(/\.o-related\s*\{[^}]*\}/)?.[0] ?? '';

    expect(rootRule).not.toMatch(/margin/);
    expect(rootRule).not.toMatch(/inline-size\s*:/);
    expect(rootRule).not.toMatch(/width\s*:/);
  });
});
