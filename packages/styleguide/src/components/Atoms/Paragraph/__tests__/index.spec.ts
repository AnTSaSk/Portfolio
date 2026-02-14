import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import Paragraph from '../index.vue';

describe('AtomParagraph', () => {
  it('has the correct component name', () => {
    const wrapper = mount(Paragraph);

    expect(wrapper.vm.$options.name).toBe('AtomParagraph');
  });

  describe('tag rendering', () => {
    it('renders as <p> by default', () => {
      const wrapper = mount(Paragraph);

      expect(wrapper.element.tagName).toBe('P');
    });

    it.each(['p', 'span', 'div'] as const)(
      'renders as <%s> when tag="%s"',
      (tag) => {
        const wrapper = mount(Paragraph, {
          props: { tag },
        });

        expect(wrapper.element.tagName).toBe(tag.toUpperCase());
      },
    );
  });

  describe('variants', () => {
    it('applies "a-paragraph" base class with "-b1SemiBold" modifier by default', () => {
      const wrapper = mount(Paragraph);

      expect(wrapper.classes()).toContain('a-paragraph');
      expect(wrapper.classes()).toContain('-b1SemiBold');
    });

    it.each([
      'b1SemiBold',
      'b1Medium',
      'b1Regular',
      'b2SemiBold',
      'b2Medium',
      'b2Regular',
      'b3SemiBold',
      'b3Medium',
      'b3Regular',
    ] as const)('applies "-%s" modifier for variant="%s"', (variant) => {
      const wrapper = mount(Paragraph, {
        props: { variant },
      });

      expect(wrapper.classes()).toContain('a-paragraph');
      expect(wrapper.classes()).toContain(`-${variant}`);
    });
  });

  describe('slot content', () => {
    it('renders slot content', () => {
      const wrapper = mount(Paragraph, {
        slots: { default: 'Some paragraph text' },
      });

      expect(wrapper.text()).toBe('Some paragraph text');
    });

    it('renders HTML slot content', () => {
      const wrapper = mount(Paragraph, {
        slots: { default: '<strong>Bold text</strong>' },
      });

      expect(wrapper.find('strong').text()).toBe('Bold text');
    });
  });
});
