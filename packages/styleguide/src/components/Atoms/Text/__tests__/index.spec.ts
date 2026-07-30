import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import Text from '../index.vue';

const VARIANT_CLASSES = [
  '-lede',
  '-bodyS',
  '-eyebrow',
  '-cta',
  '-caption',
  '-tag',
];

describe('Text', () => {
  it('renders the default p tag with the a-text base class', () => {
    const wrapper = mount(Text, { slots: { default: 'Body copy' } });

    expect(wrapper.element.tagName).toBe('P');
    expect(wrapper.classes()).toContain('a-text');
  });

  it('renders the requested tag', () => {
    const wrapper = mount(Text, {
      props: { tag: 'span' },
      slots: { default: 'Body copy' },
    });

    expect(wrapper.element.tagName).toBe('SPAN');
  });

  it('applies no size-modifier class for the default body variant', () => {
    const wrapper = mount(Text, { slots: { default: 'Body copy' } });

    for (const variantClass of VARIANT_CLASSES) {
      expect(wrapper.classes()).not.toContain(variantClass);
    }
  });

  it.each([
    ['lede', '-lede'],
    ['bodyS', '-bodyS'],
    ['eyebrow', '-eyebrow'],
    ['cta', '-cta'],
    ['caption', '-caption'],
    ['tag', '-tag'],
  ])('applies the -%s modifier for variant=%s', (variant, expectedClass) => {
    const wrapper = mount(Text, {
      props: {
        variant: variant as
          'lede' | 'bodyS' | 'eyebrow' | 'cta' | 'caption' | 'tag',
      },
      slots: { default: 'Body copy' },
    });

    expect(wrapper.classes()).toContain(expectedClass);
  });

  it('applies no weight modifier for the default regular weight', () => {
    const wrapper = mount(Text, { slots: { default: 'Body copy' } });

    expect(wrapper.classes()).not.toContain('-medium');
    expect(wrapper.classes()).not.toContain('-semibold');
  });

  it('applies the -medium weight modifier', () => {
    const wrapper = mount(Text, {
      props: { weight: 'medium' },
      slots: { default: 'Body copy' },
    });

    expect(wrapper.classes()).toContain('-medium');
  });

  it('applies the -semibold weight modifier', () => {
    const wrapper = mount(Text, {
      props: { weight: 'semibold' },
      slots: { default: 'Body copy' },
    });

    expect(wrapper.classes()).toContain('-semibold');
  });

  it('applies the -muted tone modifier', () => {
    const wrapper = mount(Text, {
      props: { tone: 'muted' },
      slots: { default: 'Body copy' },
    });

    expect(wrapper.classes()).toContain('-muted');
  });

  it('applies the -accent tone modifier', () => {
    const wrapper = mount(Text, {
      props: { tone: 'accent' },
      slots: { default: 'Body copy' },
    });

    expect(wrapper.classes()).toContain('-accent');
  });

  it('applies the -prose modifier when prose is true', () => {
    const wrapper = mount(Text, {
      props: { prose: true },
      slots: { default: 'Body copy' },
    });

    expect(wrapper.classes()).toContain('-prose');
  });

  it('applies the -truncate modifier and sets --truncate-lines when truncate is a number', () => {
    const wrapper = mount(Text, {
      props: { truncate: 3 },
      slots: { default: 'Body copy' },
    });

    expect(wrapper.classes()).toContain('-truncate');
    expect(wrapper.attributes('style')).toContain('--truncate-lines: 3');
  });

  it('applies no -truncate modifier when truncate is false', () => {
    const wrapper = mount(Text, { slots: { default: 'Body copy' } });

    expect(wrapper.classes()).not.toContain('-truncate');
  });

  it('renders the default slot content', () => {
    const wrapper = mount(Text, { slots: { default: 'Paragraph text' } });

    expect(wrapper.text()).toBe('Paragraph text');
  });
});
