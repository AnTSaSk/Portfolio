import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import Image from '@/components/Atoms/Image/index.vue';

describe('Image', () => {
  it('renders an img.a-image with src and alt', () => {
    const wrapper = mount(Image, {
      props: { src: '/photo.jpg', alt: 'A portrait' },
    });

    const img = wrapper.find('img.a-image');

    expect(img.attributes('src')).toBe('/photo.jpg');
    expect(img.attributes('alt')).toBe('A portrait');
  });

  it('defaults loading to lazy and decoding to async', () => {
    const wrapper = mount(Image, {
      props: { src: '/photo.jpg', alt: 'A portrait' },
    });

    const img = wrapper.find('img.a-image');

    expect(img.attributes('loading')).toBe('lazy');
    expect(img.attributes('decoding')).toBe('async');
  });

  it('overrides loading and decoding when provided', () => {
    const wrapper = mount(Image, {
      props: {
        src: '/photo.jpg',
        alt: 'A portrait',
        loading: 'eager',
        decoding: 'sync',
      },
    });

    const img = wrapper.find('img.a-image');

    expect(img.attributes('loading')).toBe('eager');
    expect(img.attributes('decoding')).toBe('sync');
  });

  it('forwards srcset, sizes, width and height to the img', () => {
    const wrapper = mount(Image, {
      props: {
        src: '/photo.jpg',
        alt: 'A portrait',
        srcset: '/photo-2x.jpg 2x',
        sizes: '(min-width: 768px) 50vw, 100vw',
        width: 320,
        height: 240,
      },
    });

    const img = wrapper.find('img.a-image');

    expect(img.attributes('srcset')).toBe('/photo-2x.jpg 2x');
    expect(img.attributes('sizes')).toBe('(min-width: 768px) 50vw, 100vw');
    expect(img.attributes('width')).toBe('320');
    expect(img.attributes('height')).toBe('240');
  });

  it('renders a bare img with no picture wrapper when sources is absent', () => {
    const wrapper = mount(Image, {
      props: { src: '/photo.jpg', alt: 'A portrait' },
    });

    expect(wrapper.find('picture').exists()).toBe(false);
    expect(wrapper.find('img.a-image').exists()).toBe(true);
  });

  it('wraps the img in a picture with source elements when sources is provided', () => {
    const wrapper = mount(Image, {
      props: {
        src: '/photo.jpg',
        alt: 'A portrait',
        sources: [
          { srcset: '/photo.avif', type: 'image/avif' },
          { srcset: '/photo.webp', type: 'image/webp' },
        ],
      },
    });

    const picture = wrapper.find('picture');

    expect(picture.exists()).toBe(true);

    const sources = picture.findAll('source');

    expect(sources).toHaveLength(2);
    expect(sources[0]?.attributes('srcset')).toBe('/photo.avif');
    expect(sources[0]?.attributes('type')).toBe('image/avif');
    expect(sources[1]?.attributes('srcset')).toBe('/photo.webp');
    expect(sources[1]?.attributes('type')).toBe('image/webp');
    expect(picture.find('img.a-image').exists()).toBe(true);
  });

  it('forwards media attribute on source elements when provided', () => {
    const wrapper = mount(Image, {
      props: {
        src: '/photo.jpg',
        alt: 'A portrait',
        sources: [{ srcset: '/photo-narrow.jpg', media: '(max-width: 600px)' }],
      },
    });

    expect(wrapper.find('source').attributes('media')).toBe(
      '(max-width: 600px)',
    );
  });

  it('applies -cover as the default fit modifier class', () => {
    const wrapper = mount(Image, {
      props: { src: '/photo.jpg', alt: 'A portrait' },
    });

    const img = wrapper.find('img.a-image');

    expect(img.classes()).not.toContain('-contain');
    expect(img.classes()).not.toContain('-none');
  });

  it('applies -contain modifier class when fit is contain', () => {
    const wrapper = mount(Image, {
      props: { src: '/photo.jpg', alt: 'A portrait', fit: 'contain' },
    });

    expect(wrapper.find('img.a-image').classes()).toContain('-contain');
  });

  it('applies -none modifier class when fit is none', () => {
    const wrapper = mount(Image, {
      props: { src: '/photo.jpg', alt: 'A portrait', fit: 'none' },
    });

    expect(wrapper.find('img.a-image').classes()).toContain('-none');
  });

  it('renders no text content', () => {
    const wrapper = mount(Image, {
      props: { src: '/photo.jpg', alt: 'A portrait' },
    });

    expect(wrapper.text()).toBe('');
  });
});
