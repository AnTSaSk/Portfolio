import { mount, type VueWrapper } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import ProseImg from '../ProseImg.vue';

interface ProseImgProps {
  src: string;
  alt?: string;
  width?: string | number;
  height?: string | number;
}

const mountProseImg = (props: ProseImgProps): VueWrapper =>
  mount(ProseImg, { props });

const SRC = '/img/Blog/N0_OldLanding.png';

describe('components/content/ProseImg.vue', () => {
  it('renders a picture with one pregenerated source per format, avif first', () => {
    const wrapper = mountProseImg({ src: SRC, alt: 'Ancienne landing' });
    const sources = wrapper.findAll('source');

    expect(sources).toHaveLength(2);
    expect(sources[0]?.attributes('type')).toBe('image/avif');
    expect(sources[0]?.attributes('srcset')).toBe(
      '/img/Blog/_gen/N0_OldLanding-600w.avif 600w, /img/Blog/_gen/N0_OldLanding-1200w.avif 1200w',
    );
    expect(sources[1]?.attributes('type')).toBe('image/webp');
    expect(sources[1]?.attributes('srcset')).toBe(
      '/img/Blog/_gen/N0_OldLanding-600w.webp 600w, /img/Blog/_gen/N0_OldLanding-1200w.webp 1200w',
    );
  });

  it('falls back to the original source file on the img element', () => {
    const wrapper = mountProseImg({
      src: SRC,
      alt: 'Ancienne landing',
      width: 1732,
      height: 1000,
    });
    const img = wrapper.get('img');

    expect(img.attributes('src')).toBe(SRC);
    expect(img.attributes('alt')).toBe('Ancienne landing');
    expect(img.attributes('width')).toBe('1732');
    expect(img.attributes('height')).toBe('1000');
    expect(img.attributes('loading')).toBe('lazy');
    expect(img.attributes('decoding')).toBe('async');
  });

  it('applies the prose sizes from the widest breakpoint down', () => {
    const wrapper = mountProseImg({ src: SRC });
    const expected =
      '(min-width: 1280px) 600px, (min-width: 768px) 65vw, 100vw';

    expect(wrapper.get('img').attributes('sizes')).toBe(expected);
    expect(wrapper.findAll('source')[0]?.attributes('sizes')).toBe(expected);
  });

  it('renders with src alone (optional alt and dimensions)', () => {
    const wrapper = mountProseImg({ src: SRC });
    const img = wrapper.get('img');

    expect(img.attributes('src')).toBe(SRC);
    expect(img.attributes('alt')).toBe('');
  });

  it('emits no /_ipx/ URL', () => {
    const wrapper = mountProseImg({ src: SRC });

    expect(wrapper.html()).not.toContain('_ipx');
  });
});
