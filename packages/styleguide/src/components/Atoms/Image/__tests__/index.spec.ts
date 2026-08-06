import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import Image from '../index.vue';

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

  it('marks the picture wrapper as the frame grid item in reveal mode', () => {
    const wrapper = mount(Image, {
      props: {
        src: '/photo.jpg',
        alt: 'A portrait',
        reveal: true,
        sources: [{ srcset: '/photo.avif', type: 'image/avif' }],
      },
      slots: { placeholder: '<div class="ph-marker">loading</div>' },
    });

    const frame = wrapper.find('.a-image__frame');
    const picture = frame.find('picture');

    expect(picture.classes()).toContain('a-image__picture');
    expect(frame.element.children).toHaveLength(2);
    expect(frame.element.children[1]).toBe(picture.element);
    expect(picture.find('img.a-image.-reveal').exists()).toBe(true);
  });

  it('marks the picture wrapper outside reveal mode too', () => {
    const wrapper = mount(Image, {
      props: {
        src: '/photo.jpg',
        alt: 'A portrait',
        sources: [{ srcset: '/photo.avif', type: 'image/avif' }],
      },
    });

    expect(wrapper.find('picture').classes()).toContain('a-image__picture');
  });

  it('renders no picture wrapper class on the bare img branch', () => {
    const wrapper = mount(Image, {
      props: { src: '/photo.jpg', alt: 'A portrait', reveal: true },
    });

    expect(wrapper.find('.a-image__picture').exists()).toBe(false);
    expect(wrapper.find('.a-image__frame > img.a-image.-reveal').exists()).toBe(
      true,
    );
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

  it('mirrors sizes on every source so the w-descriptor srcset is not read as 100vw', () => {
    const wrapper = mount(Image, {
      props: {
        src: '/photo.jpg',
        alt: 'A portrait',
        sizes: '(min-width: 1280px) 1280px, 100vw',
        sources: [
          { srcset: '/photo-1280w.avif 1280w', type: 'image/avif' },
          { srcset: '/photo-1280w.webp 1280w', type: 'image/webp' },
        ],
      },
    });

    const sources = wrapper.findAll('source');

    expect(sources).toHaveLength(2);
    sources.forEach((source) => {
      expect(source.attributes('sizes')).toBe(
        '(min-width: 1280px) 1280px, 100vw',
      );
    });
    expect(wrapper.find('img.a-image').attributes('sizes')).toBe(
      '(min-width: 1280px) 1280px, 100vw',
    );
  });

  it('mirrors sizes on every source in reveal mode too', () => {
    const wrapper = mount(Image, {
      props: {
        src: '/photo.jpg',
        alt: 'A portrait',
        reveal: true,
        sizes: '(min-width: 768px) 632px, 100vw',
        sources: [{ srcset: '/photo-632w.avif 632w', type: 'image/avif' }],
      },
    });

    expect(wrapper.find('.a-image__frame').exists()).toBe(true);
    expect(wrapper.find('source').attributes('sizes')).toBe(
      '(min-width: 768px) 632px, 100vw',
    );
    expect(wrapper.find('img.a-image.-reveal').attributes('sizes')).toBe(
      '(min-width: 768px) 632px, 100vw',
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

  describe('reveal mode', () => {
    it('does not wrap the img in a frame when reveal is off', () => {
      const wrapper = mount(Image, {
        props: { src: '/photo.jpg', alt: 'A portrait' },
      });

      expect(wrapper.find('.a-image__frame').exists()).toBe(false);
      expect(wrapper.find('.a-image.-reveal').exists()).toBe(false);
    });

    it('wraps the img in a frame with a placeholder slot when reveal is on', () => {
      const wrapper = mount(Image, {
        props: { src: '/photo.jpg', alt: 'A portrait', reveal: true },
        slots: { placeholder: '<div class="ph-marker">loading</div>' },
      });

      const frame = wrapper.find('.a-image__frame');

      expect(frame.exists()).toBe(true);
      expect(frame.find('.a-image__ph .ph-marker').exists()).toBe(true);
      expect(frame.find('img.a-image.-reveal').exists()).toBe(true);
    });

    it('stays unrevealed until the image loads', () => {
      const wrapper = mount(Image, {
        props: { src: '/photo.jpg', alt: 'A portrait', reveal: true },
      });

      expect(wrapper.find('.a-image__frame').classes()).not.toContain(
        '-revealed',
      );
    });

    it('reveals and emits load when the image fires load', async () => {
      const wrapper = mount(Image, {
        props: { src: '/photo.jpg', alt: 'A portrait', reveal: true },
      });

      await wrapper.find('img.a-image').trigger('load');

      expect(wrapper.find('.a-image__frame').classes()).toContain('-revealed');
      expect(wrapper.emitted('load')).toHaveLength(1);
    });

    it('stays unrevealed and emits error when the image fails', async () => {
      const wrapper = mount(Image, {
        props: { src: '/broken.jpg', alt: 'A portrait', reveal: true },
      });

      await wrapper.find('img.a-image').trigger('load');
      await wrapper.find('img.a-image').trigger('error');

      expect(wrapper.find('.a-image__frame').classes()).not.toContain(
        '-revealed',
      );
      expect(wrapper.emitted('error')).toHaveLength(1);
    });

    it('resets the revealed state when src changes', async () => {
      const wrapper = mount(Image, {
        props: { src: '/photo.jpg', alt: 'A portrait', reveal: true },
      });

      await wrapper.find('img.a-image').trigger('load');
      expect(wrapper.find('.a-image__frame').classes()).toContain('-revealed');

      await wrapper.setProps({ src: '/other.jpg' });

      expect(wrapper.find('.a-image__frame').classes()).not.toContain(
        '-revealed',
      );
    });
  });

  describe('fetchpriority passthrough', () => {
    it('forwards fetchpriority to the native img', () => {
      const wrapper = mount(Image, {
        props: { src: '/photo.jpg', alt: 'A portrait', fetchpriority: 'high' },
      });

      expect(wrapper.find('img.a-image').attributes('fetchpriority')).toBe(
        'high',
      );
    });

    it('forwards loading to the native img', () => {
      const wrapper = mount(Image, {
        props: { src: '/a.webp', alt: 'A', loading: 'eager' },
      });

      expect(wrapper.find('img.a-image').attributes('loading')).toBe('eager');
    });

    it('renders no fetchpriority attribute when the prop is not provided', () => {
      const wrapper = mount(Image, {
        props: { src: '/photo.jpg', alt: 'A portrait' },
      });

      expect(
        wrapper.find('img.a-image').attributes('fetchpriority'),
      ).toBeUndefined();
    });
  });
});
