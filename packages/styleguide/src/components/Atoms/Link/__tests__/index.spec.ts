import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import Link from '../index.vue';

describe('Link', () => {
  it('renders an anchor with the a-link class and the given href', () => {
    const wrapper = mount(Link, {
      props: { href: '/about' },
      slots: { default: 'About' },
    });

    expect(wrapper.element.tagName).toBe('A');
    expect(wrapper.classes()).toContain('a-link');
    expect(wrapper.attributes('href')).toBe('/about');
  });

  it('renders the slot label content', () => {
    const wrapper = mount(Link, {
      props: { href: '/about' },
      slots: { default: 'About' },
    });

    expect(wrapper.text()).toBe('About');
  });

  it('adds target=_blank and rel=noopener noreferrer for an https href', () => {
    const wrapper = mount(Link, {
      props: { href: 'https://example.com' },
      slots: { default: 'Example' },
    });

    expect(wrapper.attributes('target')).toBe('_blank');
    expect(wrapper.attributes('rel')).toBe('noopener noreferrer');
  });

  it('does not add target or rel for an internal href', () => {
    const wrapper = mount(Link, {
      props: { href: '/about' },
      slots: { default: 'About' },
    });

    expect(wrapper.attributes('target')).toBeUndefined();
    expect(wrapper.attributes('rel')).toBeUndefined();
  });

  it('forces external treatment when external=true even for a non-http href', () => {
    const wrapper = mount(Link, {
      props: { href: '/about', external: true },
      slots: { default: 'About' },
    });

    expect(wrapper.attributes('target')).toBe('_blank');
    expect(wrapper.attributes('rel')).toBe('noopener noreferrer');
  });

  it('sets aria-current=page when current is true', () => {
    const wrapper = mount(Link, {
      props: { href: '/about', current: true },
      slots: { default: 'About' },
    });

    expect(wrapper.attributes('aria-current')).toBe('page');
  });

  it('does not add a variant modifier class for the default inline variant', () => {
    const wrapper = mount(Link, {
      props: { href: '/about' },
      slots: { default: 'About' },
    });

    expect(wrapper.classes()).toEqual(['a-link']);
  });

  it('renders the -arrow modifier class for the arrow variant', () => {
    const wrapper = mount(Link, {
      props: { href: '/about', variant: 'arrow' },
      slots: { default: 'Learn more' },
    });

    expect(wrapper.classes()).toContain('-arrow');
  });

  it('keeps the label as plain slot text for the arrow variant (non-regression)', () => {
    const wrapper = mount(Link, {
      props: { href: '/about', variant: 'arrow' },
      slots: { default: 'Learn more' },
    });

    expect(wrapper.text()).toBe('Learn more→');
    expect(wrapper.find('.a-text').exists()).toBe(false);
  });

  it('renders an aria-hidden arrow span for the arrow variant', () => {
    const wrapper = mount(Link, {
      props: { href: '/about', variant: 'arrow' },
      slots: { default: 'Learn more' },
    });

    const arrow = wrapper.find('.a-link__arrow');

    expect(arrow.exists()).toBe(true);
    expect(arrow.attributes('aria-hidden')).toBe('true');
    expect(arrow.text()).toBe('→');
  });

  it('does not render an arrow span for the inline variant', () => {
    const wrapper = mount(Link, {
      props: { href: '/about' },
      slots: { default: 'About' },
    });

    expect(wrapper.find('.a-link__arrow').exists()).toBe(false);
  });

  it('renders the -quiet modifier class for the quiet variant', () => {
    const wrapper = mount(Link, {
      props: { href: '/about', variant: 'quiet' },
      slots: { default: 'About' },
    });

    expect(wrapper.classes()).toContain('-quiet');
  });

  it('composes the label via Text -eyebrow for the quiet variant', () => {
    const wrapper = mount(Link, {
      props: { href: '/about', variant: 'quiet' },
      slots: { default: 'About' },
    });

    const label = wrapper.find('.a-text.-eyebrow');

    expect(label.exists()).toBe(true);
    expect(label.text()).toBe('About');
  });

  it('renders the -nav modifier class for the nav variant', () => {
    const wrapper = mount(Link, {
      props: { href: '/about', variant: 'nav' },
      slots: { default: 'Blog' },
    });

    expect(wrapper.classes()).toContain('-nav');
  });

  it('composes the label via Text -eyebrow for the nav variant', () => {
    const wrapper = mount(Link, {
      props: { href: '/about', variant: 'nav' },
      slots: { default: 'Blog' },
    });

    const label = wrapper.find('.a-text.-eyebrow');

    expect(label.exists()).toBe(true);
    expect(label.text()).toBe('Blog');
  });

  it('sets aria-current=page for the nav variant when current is true (non-regression)', () => {
    const wrapper = mount(Link, {
      props: { href: '/about', variant: 'nav', current: true },
      slots: { default: 'Blog' },
    });

    expect(wrapper.attributes('aria-current')).toBe('page');
  });

  it('does not set aria-current for the nav variant when current is false', () => {
    const wrapper = mount(Link, {
      props: { href: '/about', variant: 'nav', current: false },
      slots: { default: 'Blog' },
    });

    expect(wrapper.attributes('aria-current')).toBeUndefined();
  });

  it('keeps external link handling (target/rel) for the nav variant (non-regression)', () => {
    const wrapper = mount(Link, {
      props: { href: 'https://example.com', variant: 'nav' },
      slots: { default: 'External' },
    });

    expect(wrapper.attributes('target')).toBe('_blank');
    expect(wrapper.attributes('rel')).toBe('noopener noreferrer');
    expect(wrapper.classes()).toContain('-nav');
  });

  it('defaults to an arrow after the label when arrowPosition is not provided (retro-compat)', () => {
    const wrapper = mount(Link, {
      props: { href: '/about', variant: 'arrow' },
      slots: { default: 'Learn more' },
    });

    expect(wrapper.text()).toBe('Learn more→');
    expect(wrapper.find('.a-link__arrow').classes()).not.toContain('-before');
  });

  it('renders the arrow before the label with the ← glyph and a -before modifier when arrowPosition is "before"', () => {
    const wrapper = mount(Link, {
      props: { href: '/about', variant: 'arrow', arrowPosition: 'before' },
      slots: { default: 'Back' },
    });

    expect(wrapper.text()).toBe('←Back');

    const arrow = wrapper.find('.a-link__arrow');

    expect(arrow.exists()).toBe(true);
    expect(arrow.classes()).toContain('-before');
    expect(arrow.text()).toBe('←');
    expect(arrow.attributes('aria-hidden')).toBe('true');
  });

  it('does not render an arrow span for the quiet variant even when arrowPosition is "before" (non-regression)', () => {
    const wrapper = mount(Link, {
      props: { href: '/about', variant: 'quiet', arrowPosition: 'before' },
      slots: { default: 'About' },
    });

    expect(wrapper.find('.a-link__arrow').exists()).toBe(false);
  });

  it('renders an anchor by default when tag is not provided (retro-compat)', () => {
    const wrapper = mount(Link, {
      props: { href: '/about' },
      slots: { default: 'About' },
    });

    expect(wrapper.element.tagName).toBe('A');
  });

  it('renders the resolved tag element when tag is span', () => {
    const wrapper = mount(Link, {
      props: { tag: 'span', variant: 'arrow' },
      slots: { default: 'Voir le projet' },
    });

    expect(wrapper.element.tagName).toBe('SPAN');
    expect(wrapper.classes()).toContain('a-link');
    expect(wrapper.classes()).toContain('-arrow');
  });

  it('omits href, target, rel and aria-current when the resolved tag is not an anchor', () => {
    const wrapper = mount(Link, {
      props: {
        tag: 'span',
        href: 'https://example.com',
        current: true,
      },
      slots: { default: 'Voir le projet' },
    });

    expect(wrapper.attributes('href')).toBeUndefined();
    expect(wrapper.attributes('target')).toBeUndefined();
    expect(wrapper.attributes('rel')).toBeUndefined();
    expect(wrapper.attributes('aria-current')).toBeUndefined();
  });

  it('keeps the sliding arrow glyph when rendered as a span', () => {
    const wrapper = mount(Link, {
      props: { tag: 'span', variant: 'arrow' },
      slots: { default: 'Voir le projet' },
    });

    const arrow = wrapper.find('.a-link__arrow');

    expect(arrow.exists()).toBe(true);
    expect(arrow.text()).toBe('→');
    expect(wrapper.text()).toBe('Voir le projet→');
  });

  it('renders the -icon modifier class for the icon variant', () => {
    const wrapper = mount(Link, {
      props: { href: 'https://example.com', variant: 'icon', label: 'GitHub' },
      slots: { default: '<svg class="a-icon" />' },
    });

    expect(wrapper.classes()).toContain('-icon');
  });

  it('renders the slot raw without a Text -eyebrow wrapper for the icon variant', () => {
    const wrapper = mount(Link, {
      props: { href: 'https://example.com', variant: 'icon', label: 'GitHub' },
      slots: { default: '<svg class="a-icon" />' },
    });

    expect(wrapper.find('.a-text').exists()).toBe(false);
    expect(wrapper.find('svg.a-icon').exists()).toBe(true);
    expect(wrapper.find('.a-link__arrow').exists()).toBe(false);
  });

  it('applies the label prop as aria-label for the icon variant', () => {
    const wrapper = mount(Link, {
      props: { href: 'https://example.com', variant: 'icon', label: 'GitHub' },
      slots: { default: '<svg class="a-icon" />' },
    });

    expect(wrapper.attributes('aria-label')).toBe('GitHub');
  });

  it('keeps external link handling (target/rel) for the icon variant', () => {
    const wrapper = mount(Link, {
      props: { href: 'https://example.com', variant: 'icon', label: 'GitHub' },
      slots: { default: '<svg class="a-icon" />' },
    });

    expect(wrapper.attributes('target')).toBe('_blank');
    expect(wrapper.attributes('rel')).toBe('noopener noreferrer');
  });

  it('does not set aria-label for non-icon variants', () => {
    const wrapper = mount(Link, {
      props: { href: '/about' },
      slots: { default: 'About' },
    });

    expect(wrapper.attributes('aria-label')).toBeUndefined();
  });
});
