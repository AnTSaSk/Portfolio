import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import Heading from '../index.vue';

describe('AtomHeading', () => {
  it('has the correct component name', () => {
    const wrapper = mount(Heading);

    expect(wrapper.vm.$options.name).toBe('AtomHeading');
  });

  describe('tag rendering', () => {
    it('renders as <h1> by default', () => {
      const wrapper = mount(Heading);

      expect(wrapper.element.tagName).toBe('H1');
    });

    it.each(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const)(
      'renders as <%s> when tag="%s"',
      (tag) => {
        const wrapper = mount(Heading, {
          props: { tag },
        });

        expect(wrapper.element.tagName).toBe(tag.toUpperCase());
      },
    );
  });

  describe('variants', () => {
    it('applies "a-heading" base class with "-h1-regular" modifier by default', () => {
      const wrapper = mount(Heading);

      expect(wrapper.classes()).toContain('a-heading');
      expect(wrapper.classes()).toContain('-h1-regular');
    });

    it.each([
      'h1-regular',
      'h2-regular',
      'h3-medium',
      'h4-semibold',
      'h5-semibold',
    ] as const)('applies "-$s" modifier for variant="%s"', (variant) => {
      const wrapper = mount(Heading, {
        props: { variant },
      });

      expect(wrapper.classes()).toContain('a-heading');
      expect(wrapper.classes()).toContain(`-${variant}`);
    });
  });

  describe('slot content', () => {
    it('renders slot content', () => {
      const wrapper = mount(Heading, {
        slots: { default: 'Hello World' },
      });

      expect(wrapper.text()).toBe('Hello World');
    });

    it('renders HTML slot content', () => {
      const wrapper = mount(Heading, {
        slots: { default: '<span>Rich content</span>' },
      });

      expect(wrapper.find('span').text()).toBe('Rich content');
    });
  });
});
