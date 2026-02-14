import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import CTA from '../index.vue';

describe('AtomCTA', () => {
  it('has the correct component name', () => {
    const wrapper = mount(CTA, {
      props: { variant: 'main' },
    });

    expect(wrapper.vm.$options.name).toBe('AtomCTA');
  });

  describe('rendering', () => {
    it('renders as a <button> when no href is provided', () => {
      const wrapper = mount(CTA, {
        props: { variant: 'main' },
      });

      expect(wrapper.element.tagName).toBe('BUTTON');
    });

    it('renders as an <a> when href is provided', () => {
      const wrapper = mount(CTA, {
        props: { variant: 'main', href: 'https://example.com' },
      });

      expect(wrapper.element.tagName).toBe('A');
      expect(wrapper.attributes('href')).toBe('https://example.com');
    });

    it('renders slot content', () => {
      const wrapper = mount(CTA, {
        props: { variant: 'main' },
        slots: { default: 'Click me' },
      });

      expect(wrapper.text()).toBe('Click me');
    });
  });

  describe('variants', () => {
    it('applies the "a-cta" base class with "-main" modifier', () => {
      const wrapper = mount(CTA, {
        props: { variant: 'main' },
      });

      expect(wrapper.classes()).toContain('a-cta');
      expect(wrapper.classes()).toContain('-main');
    });

    it('applies the "a-cta" base class with "-text" modifier', () => {
      const wrapper = mount(CTA, {
        props: { variant: 'text' },
      });

      expect(wrapper.classes()).toContain('a-cta');
      expect(wrapper.classes()).toContain('-text');
    });
  });

  describe('disabled state', () => {
    it('does not set aria-disabled when disabled is false', () => {
      const wrapper = mount(CTA, {
        props: { variant: 'main', disabled: false },
      });

      expect(wrapper.attributes('aria-disabled')).toBeUndefined();
    });

    it('sets aria-disabled when disabled is true', () => {
      const wrapper = mount(CTA, {
        props: { variant: 'main', disabled: true },
      });

      expect(wrapper.attributes('aria-disabled')).toBe('true');
    });

    it('sets the disabled attribute on a button', () => {
      const wrapper = mount(CTA, {
        props: { variant: 'main', disabled: true },
      });

      expect(wrapper.attributes('disabled')).toBeDefined();
    });
  });
});
