import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import Heading from '@/components/Atoms/Heading/index.vue';

describe('Heading', () => {
  it('renders the default h2 tag with the -h2 level class', () => {
    const wrapper = mount(Heading, { slots: { default: 'Title' } });

    expect(wrapper.element.tagName).toBe('H2');
    expect(wrapper.classes()).toContain('a-heading');
    expect(wrapper.classes()).toContain('-h2');
  });

  it('applies the -{level} class matching the level prop', () => {
    const wrapper = mount(Heading, {
      props: { level: 'h3' },
      slots: { default: 'Title' },
    });

    expect(wrapper.element.tagName).toBe('H3');
    expect(wrapper.classes()).toContain('-h3');
  });

  it('decouples semantic tag from visual level when tag differs from level', () => {
    const wrapper = mount(Heading, {
      props: { level: 'h1', tag: 'h2' },
      slots: { default: 'Title' },
    });

    expect(wrapper.element.tagName).toBe('H2');
    expect(wrapper.classes()).toContain('-h1');
  });

  it('applies no tone modifier for the default tone', () => {
    const wrapper = mount(Heading, { slots: { default: 'Title' } });

    expect(wrapper.classes()).not.toContain('-muted');
    expect(wrapper.classes()).not.toContain('-accent');
  });

  it('applies the -muted tone modifier', () => {
    const wrapper = mount(Heading, {
      props: { tone: 'muted' },
      slots: { default: 'Title' },
    });

    expect(wrapper.classes()).toContain('-muted');
  });

  it('applies the -accent tone modifier', () => {
    const wrapper = mount(Heading, {
      props: { tone: 'accent' },
      slots: { default: 'Title' },
    });

    expect(wrapper.classes()).toContain('-accent');
  });

  it('applies the -uppercase modifier when uppercase is true', () => {
    const wrapper = mount(Heading, {
      props: { uppercase: true },
      slots: { default: 'Title' },
    });

    expect(wrapper.classes()).toContain('-uppercase');
  });

  it('applies no -uppercase modifier by default', () => {
    const wrapper = mount(Heading, { slots: { default: 'Title' } });

    expect(wrapper.classes()).not.toContain('-uppercase');
  });

  it('applies the -noBalance modifier when balance is false', () => {
    const wrapper = mount(Heading, {
      props: { balance: false },
      slots: { default: 'Title' },
    });

    expect(wrapper.classes()).toContain('-noBalance');
  });

  it('applies no -noBalance modifier by default (balance true)', () => {
    const wrapper = mount(Heading, { slots: { default: 'Title' } });

    expect(wrapper.classes()).not.toContain('-noBalance');
  });

  it('renders the default slot content', () => {
    const wrapper = mount(Heading, { slots: { default: 'Section title' } });

    expect(wrapper.text()).toBe('Section title');
  });
});
