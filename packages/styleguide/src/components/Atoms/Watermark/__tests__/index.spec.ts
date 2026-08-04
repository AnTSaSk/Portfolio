import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import Watermark from '../index.vue';

const styleCss = readFileSync(
  path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../style.css'),
  'utf-8',
);

describe('Watermark', () => {
  it('renders a div.a-watermark root element', () => {
    const wrapper = mount(Watermark, {
      props: { text: 'AnTSaSk/Alexis Besson' },
    });
    const root = wrapper.find('div.a-watermark');

    expect(root.exists()).toBe(true);
  });

  it('is always aria-hidden regardless of the text prop', () => {
    const wrapper = mount(Watermark, {
      props: { text: 'AnTSaSk/Alexis Besson' },
    });
    const root = wrapper.find('div.a-watermark');

    expect(root.attributes('aria-hidden')).toBe('true');
  });

  it('renders its text content equal to the text prop', () => {
    const wrapper = mount(Watermark, {
      props: { text: 'AnTSaSk/Alexis Besson' },
    });
    const root = wrapper.find('div.a-watermark');

    expect(root.text()).toBe('AnTSaSk/Alexis Besson');
  });

  it('renders no text content when the text prop is not provided (default)', () => {
    const wrapper = mount(Watermark);
    const root = wrapper.find('div.a-watermark');

    expect(root.text()).toBe('');
  });

  it('exposes the text length as the --wm-chars CSS variable', () => {
    const wrapper = mount(Watermark, {
      props: { text: 'AnTSaSk/Alexis Besson' },
    });
    const root = wrapper.find('div.a-watermark');

    expect(root.attributes('style')).toContain(
      `--wm-chars: ${'AnTSaSk/Alexis Besson'.length}`,
    );
  });

  // The build minifier drops the inner parens of `/ ((N) * 0.62)`, turning it
  // into `/ (N) * 0.62` which CSS evaluates as `(vw / N) * 0.62`, a smaller,
  // wrong glyph. The font-size divisor must be written as sequential divisions
  // (`/ N / 0.62`), which has no removable parens.
  it('sizes the glyph with a minification-robust calc (sequential division)', () => {
    const fontSize = styleCss.match(/font-size:\s*calc\([^;]*\);/)?.[0] ?? '';

    expect(fontSize).not.toBe('');
    expect(fontSize).not.toMatch(/\*\s*0?\.62\s*\)/);
    expect(fontSize).toMatch(/\/\s*0?\.62\s*\)/);
  });
});
