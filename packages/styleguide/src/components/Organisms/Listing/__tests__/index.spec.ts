import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { mount, type VueWrapper } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { h, type VNode } from 'vue';

import CardArticle, {
  type CardArticleProps,
} from '@/components/Molecules/CardArticle/index';
import Filter from '@/components/Molecules/Filter/index.vue';
import Pagination from '@/components/Molecules/Pagination/index.vue';

import Listing from '../index.vue';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const STYLE_CSS_PATH = path.join(dirname, '../style.css');

const cardProps = (n: number): CardArticleProps => ({
  href: `/blog/article-${n}`,
  title: `Article ${n}`,
  date: '01.01.2026',
  excerpt: 'Excerpt.',
  tags: ['Vue.js'],
});

const oneCardSlot = (): VNode => h(CardArticle, cardProps(1));
const twoCardsSlot = (): VNode[] => [
  h(CardArticle, cardProps(1)),
  h(CardArticle, cardProps(2)),
];

const filterProps = {
  items: [
    { id: 'all', label: 'Tous', pressed: true },
    { id: 'vue', label: 'Vue.js', pressed: false },
  ],
};

const paginationProps = {
  pages: 2,
  current: 1,
  hasPrev: false,
  hasNext: true,
};

describe('Listing (structure)', () => {
  it('mounts .o-listing containing .o-listing__inner composing l-container', () => {
    const wrapper = mount(Listing, { slots: { default: twoCardsSlot } });

    expect(wrapper.classes()).toContain('o-listing');
    const inner = wrapper.find('.o-listing__inner');

    expect(inner.exists()).toBe(true);
    expect(inner.classes()).toContain('l-container');
  });

  it('renders the default slot cards as direct children of a .o-listing__grid div (no ul/li wrapper)', () => {
    const wrapper = mount(Listing, { slots: { default: twoCardsSlot } });
    const grid = wrapper.find('.o-listing__grid');

    expect(grid.exists()).toBe(true);
    expect(grid.element.tagName).toBe('DIV');

    const cards = grid.findAllComponents(CardArticle);

    expect(cards).toHaveLength(2);
    cards.forEach((card: VueWrapper<InstanceType<typeof CardArticle>>) => {
      expect(card.element.tagName).toBe('A');
      expect(card.element.parentElement).toBe(grid.element);
    });

    // Cards themselves may render internal <li> (e.g. tag lists) — the
    // invariant under test is no <li> wrapper as a DIRECT child of the grid.
    const directChildTagNames = Array.from(grid.element.children).map(
      (child) => child.tagName,
    );

    expect(directChildTagNames).not.toContain('LI');
  });
});

describe('Listing (gridVariant prop)', () => {
  it('defaults to the auto-fill grid variant (-autoFill modifier, matching blog)', () => {
    const wrapper = mount(Listing, { slots: { default: oneCardSlot } });

    expect(wrapper.find('.o-listing__grid').classes()).toContain('-autoFill');
  });

  it('applies the -twoUp modifier when gridVariant is "2up" (matching projects)', () => {
    const wrapper = mount(Listing, {
      props: { gridVariant: '2up' },
      slots: { default: oneCardSlot },
    });
    const grid = wrapper.find('.o-listing__grid');

    expect(grid.classes()).toContain('-twoUp');
    expect(grid.classes()).not.toContain('-autoFill');
  });
});

describe('Listing (filter — optional)', () => {
  it('does not render a filter when none is provided', () => {
    const wrapper = mount(Listing, { slots: { default: oneCardSlot } });

    expect(wrapper.findComponent(Filter).exists()).toBe(false);
  });

  it('renders the filter slot content, placed above the grid, when provided', () => {
    const wrapper = mount(Listing, {
      slots: {
        filter: () => h(Filter, filterProps),
        default: oneCardSlot,
      },
    });
    const filter = wrapper.findComponent(Filter);

    expect(filter.exists()).toBe(true);

    const html = wrapper.html();

    expect(html.indexOf('m-filter')).toBeLessThan(
      html.indexOf('o-listing__grid'),
    );
  });
});

describe('Listing (pre-grid slot — optional)', () => {
  it('renders no pre-grid content by default', () => {
    const wrapper = mount(Listing, { slots: { default: oneCardSlot } });

    expect(wrapper.find('[data-testid="feature-marker"]').exists()).toBe(false);
  });

  it('renders the pre-grid slot content, placed above the grid, when provided (projects feature)', () => {
    const wrapper = mount(Listing, {
      slots: {
        preGrid: () => h('div', { 'data-testid': 'feature-marker' }, 'Feature'),
        default: oneCardSlot,
      },
    });
    const marker = wrapper.find('[data-testid="feature-marker"]');

    expect(marker.exists()).toBe(true);

    const html = wrapper.html();

    expect(html.indexOf('feature-marker')).toBeLessThan(
      html.indexOf('o-listing__grid'),
    );
  });
});

describe('Listing (pagination — optional)', () => {
  it('does not render pagination when none is provided (projects has none)', () => {
    const wrapper = mount(Listing, { slots: { default: oneCardSlot } });

    expect(wrapper.findComponent(Pagination).exists()).toBe(false);
  });

  it('renders the pagination slot content, placed below the grid, when provided (blog)', () => {
    const wrapper = mount(Listing, {
      slots: {
        default: oneCardSlot,
        pagination: () => h(Pagination, paginationProps),
      },
    });
    const pagination = wrapper.findComponent(Pagination);

    expect(pagination.exists()).toBe(true);

    const html = wrapper.html();

    expect(html.indexOf('o-listing__grid')).toBeLessThan(
      html.indexOf('m-pagination'),
    );
  });
});

describe('Listing (invariant — no external sizing on root)', () => {
  it('declares no margin/width on .o-listing (sizing/position owned by the parent layout)', () => {
    const css = readFileSync(STYLE_CSS_PATH, 'utf-8');
    const rootRule = css.match(/\.o-listing\s*\{[^}]*\}/)?.[0] ?? '';

    expect(rootRule).not.toMatch(/margin/);
    expect(rootRule).not.toMatch(/inline-size\s*:/);
    expect(rootRule).not.toMatch(/width\s*:/);
  });
});
