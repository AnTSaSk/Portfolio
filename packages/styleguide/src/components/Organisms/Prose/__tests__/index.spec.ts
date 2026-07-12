import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import Prose from '../index.vue';

describe('Prose (AC-PROSE-1 — root wrapper)', () => {
  it('mounts .o-prose as its root class', () => {
    const wrapper = mount(Prose, {
      slots: { default: '<p>Body copy.</p>' },
    });

    expect(wrapper.classes()).toContain('o-prose');
  });
});

describe('Prose (AC-PROSE-2 — renders slotted markdown verbatim, no class injection)', () => {
  it('renders slotted h2/h3/p/ul/li/blockquote/a tags unchanged, without any class attribute added by the organism', () => {
    const slotHtml = [
      '<h2>Section title</h2>',
      '<h3>Subsection title</h3>',
      '<p>A paragraph with <a href="/link">a link</a> and <code>inline code</code>.</p>',
      '<ul><li>First item</li><li>Second item</li></ul>',
      '<blockquote>A quotation.</blockquote>',
    ].join('');

    const wrapper = mount(Prose, {
      slots: { default: slotHtml },
    });

    const taggedSelectors = [
      'h2',
      'h3',
      'p',
      'a',
      'code',
      'ul',
      'li',
      'blockquote',
    ];

    taggedSelectors.forEach((selector) => {
      const el = wrapper.find(selector);

      expect(el.exists()).toBe(true);
      expect(el.attributes('class')).toBeUndefined();
    });
  });

  it('preserves the textual content of the slotted markdown as-is', () => {
    const wrapper = mount(Prose, {
      slots: {
        default: '<h2>Section title</h2><p>Body paragraph.</p>',
      },
    });

    expect(wrapper.find('h2').text()).toBe('Section title');
    expect(wrapper.find('p').text()).toBe('Body paragraph.');
  });
});

describe('Prose (AC-TOK-2 — pre/code block is the only monospace surface)', () => {
  it('renders a slotted <pre><code> block unchanged, without any class attribute added by the organism', () => {
    const wrapper = mount(Prose, {
      slots: {
        default: '<pre><code>const x = 1;</code></pre>',
      },
    });

    const pre = wrapper.find('pre');
    const code = wrapper.find('pre code');

    expect(pre.exists()).toBe(true);
    expect(pre.attributes('class')).toBeUndefined();
    expect(code.exists()).toBe(true);
    expect(code.attributes('class')).toBeUndefined();
    expect(code.text()).toBe('const x = 1;');
  });
});

describe('Prose (AC-LAYER — reading measure is internal, no external sizing)', () => {
  it('does not set any external margin or inline-size constraint on the root element via inline style/attributes', () => {
    const wrapper = mount(Prose, {
      slots: { default: '<p>Body copy.</p>' },
    });

    // Structural guarantee only: no inline style/margin/width attribute is
    // applied by the component itself on its root element. The 65ch
    // max-inline-size and no external margin are internal CSS concerns
    // covered by visual review (JSDOM does not render CSS).
    expect(wrapper.attributes('style')).toBeUndefined();
  });
});
