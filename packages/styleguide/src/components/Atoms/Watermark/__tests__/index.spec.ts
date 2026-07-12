import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import Watermark from '@/components/Atoms/Watermark/index.vue';

describe('Watermark', () => {
  it('renders an svg.a-watermark root element with viewBox 0 0 1085 90', () => {
    const wrapper = mount(Watermark, {
      props: { text: 'antsask/alexis besson' },
    });
    const svg = wrapper.find('svg.a-watermark');

    expect(svg.exists()).toBe(true);
    expect(svg.attributes('viewBox')).toBe('0 0 1085 90');
  });

  it('is always aria-hidden regardless of the text prop', () => {
    const wrapper = mount(Watermark, {
      props: { text: 'antsask/alexis besson' },
    });
    const svg = wrapper.find('svg.a-watermark');

    expect(svg.attributes('aria-hidden')).toBe('true');
  });

  it('sets preserveAspectRatio to xMidYMid meet', () => {
    const wrapper = mount(Watermark, {
      props: { text: 'antsask/alexis besson' },
    });
    const svg = wrapper.find('svg.a-watermark');

    expect(svg.attributes('preserveAspectRatio')).toBe('xMidYMid meet');
  });

  it('renders a text element whose content equals the text prop', () => {
    const wrapper = mount(Watermark, {
      props: { text: 'antsask/alexis besson' },
    });
    const text = wrapper.find('text');

    expect(text.exists()).toBe(true);
    expect(text.text()).toBe('antsask/alexis besson');
  });

  it('centers the text with text-anchor middle', () => {
    const wrapper = mount(Watermark, {
      props: { text: 'antsask/alexis besson' },
    });
    const text = wrapper.find('text');

    expect(text.attributes('text-anchor')).toBe('middle');
  });

  it('renders an empty text element when the text prop is not provided (default)', () => {
    const wrapper = mount(Watermark);
    const text = wrapper.find('text');

    expect(text.exists()).toBe(true);
    expect(text.text()).toBe('');
  });
});
