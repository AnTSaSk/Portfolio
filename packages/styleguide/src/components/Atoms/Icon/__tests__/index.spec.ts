import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import Icon from '../index.vue';

describe('Icon', () => {
  it('renders an svg.a-icon root element', () => {
    const wrapper = mount(Icon, { props: { name: 'github' } });

    expect(wrapper.find('svg.a-icon').exists()).toBe(true);
  });

  it('applies the default md size modifier class', () => {
    const wrapper = mount(Icon, { props: { name: 'github' } });

    expect(wrapper.find('svg.a-icon').classes()).toContain('-md');
  });

  it('applies the requested size modifier class', () => {
    const wrapper = mount(Icon, { props: { name: 'github', size: 'lg' } });

    expect(wrapper.find('svg.a-icon').classes()).toContain('-lg');
  });

  it('renders a use element referencing the sprite symbol id', () => {
    const wrapper = mount(Icon, { props: { name: 'arrow-r' } });

    expect(wrapper.find('use').attributes('href')).toBe('#arrow-r');
  });

  it('is aria-hidden when no label is provided (decorative default)', () => {
    const wrapper = mount(Icon, { props: { name: 'github' } });
    const svg = wrapper.find('svg.a-icon');

    expect(svg.attributes('aria-hidden')).toBe('true');
    expect(svg.attributes('role')).toBeUndefined();
  });

  it('exposes role=img and aria-label when label is provided', () => {
    const wrapper = mount(Icon, {
      props: { name: 'linkedin', label: 'LinkedIn' },
    });

    const svg = wrapper.find('svg.a-icon');

    expect(svg.attributes('role')).toBe('img');
    expect(svg.attributes('aria-label')).toBe('LinkedIn');
    expect(svg.attributes('aria-hidden')).toBeUndefined();
  });

  it('renders no text content', () => {
    const wrapper = mount(Icon, { props: { name: 'github' } });

    expect(wrapper.text()).toBe('');
  });

  it('renders a use element referencing the moon sprite symbol id', () => {
    const wrapper = mount(Icon, { props: { name: 'moon' } });

    expect(wrapper.find('use').attributes('href')).toBe('#moon');
  });

  it('renders a use element referencing the sun sprite symbol id', () => {
    const wrapper = mount(Icon, { props: { name: 'sun' } });

    expect(wrapper.find('use').attributes('href')).toBe('#sun');
  });

  // fill:none/stroke rendering is CSS, not assertable in JSDOM.
  it('applies the -stroke modifier class when the stroke prop is true', () => {
    const wrapper = mount(Icon, { props: { name: 'moon', stroke: true } });

    expect(wrapper.find('svg.a-icon').classes()).toContain('-stroke');
  });

  it('does not apply the -stroke modifier class by default (solid icons unchanged)', () => {
    const wrapper = mount(Icon, { props: { name: 'github' } });

    expect(wrapper.find('svg.a-icon').classes()).not.toContain('-stroke');
  });
});
