import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { defineComponent, h, nextTick, ref } from 'vue';

import Image from '../index.vue';

// Stub simulating NuxtImg's `custom` slot: exposes { src, isLoaded, imgAttrs }.
const makeNuxtImgStub = (loaded = true): ReturnType<typeof defineComponent> =>
  defineComponent({
    name: 'NuxtImgStub',
    props: {
      src: { type: String, required: true },
      sizes: { type: String, default: undefined },
      densities: { type: String, default: undefined },
      format: { type: String, default: undefined },
      width: { type: [Number, String], default: undefined },
      height: { type: [Number, String], default: undefined },
      fetchpriority: { type: String, default: undefined },
      loading: { type: String, default: undefined },
    },
    setup(props, { slots }) {
      return () =>
        slots.default?.({
          src: props.src,
          isLoaded: loaded,
          imgAttrs: {
            fetchpriority: props.fetchpriority,
            loading: props.loading,
          },
        });
    },
  });

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

  describe('injected image component', () => {
    it('renders the injected component and keeps the .a-image contract', () => {
      const Stub = makeNuxtImgStub(true);
      const wrapper = mount(Image, {
        props: {
          src: '/a.webp',
          alt: 'A',
          reveal: true,
          imageComponent: Stub,
          sizes: '100vw',
          densities: 'x1 x2',
          format: 'avif,webp',
        },
        slots: { placeholder: '<div class="u-placeholder" />' },
      });

      expect(wrapper.findComponent(Stub).exists()).toBe(true);
      expect(wrapper.find('img.a-image').exists()).toBe(true);
      expect(wrapper.find('.a-image__frame').exists()).toBe(true);
      expect(wrapper.findComponent(Stub).props('sizes')).toBe('100vw');
      expect(wrapper.findComponent(Stub).props('densities')).toBe('x1 x2');
      expect(wrapper.findComponent(Stub).props('format')).toBe('avif,webp');
    });

    it('renders the native img when no image component is injected', () => {
      const wrapper = mount(Image, { props: { src: '/a.webp', alt: 'A' } });

      expect(wrapper.find('img.a-image').exists()).toBe(true);
      expect(wrapper.find('img.a-image').attributes('src')).toBe('/a.webp');
    });

    it('reveals via the custom slot isLoaded flag when injected', async () => {
      const isLoaded = ref(false);
      const Stub = defineComponent({
        name: 'ControlledStub',
        props: { src: { type: String, required: true } },
        setup(props, { slots }) {
          return () =>
            slots.default?.({
              src: props.src,
              isLoaded: isLoaded.value,
              imgAttrs: {},
            });
        },
      });

      const wrapper = mount(Image, {
        props: { src: '/a.webp', alt: 'A', reveal: true, imageComponent: Stub },
        slots: { placeholder: h('div', { class: 'u-placeholder' }) },
      });

      expect(wrapper.find('.a-image__frame').classes()).not.toContain(
        '-revealed',
      );

      isLoaded.value = true;
      await nextTick();

      expect(wrapper.find('.a-image__frame').classes()).toContain('-revealed');
    });
  });

  // fetchpriority is passed through to the rendered img / injected component.
  describe('fetchpriority passthrough', () => {
    it('forwards fetchpriority to the native img in house mode', () => {
      const wrapper = mount(Image, {
        props: { src: '/photo.jpg', alt: 'A portrait', fetchpriority: 'high' },
      });

      expect(wrapper.find('img.a-image').attributes('fetchpriority')).toBe(
        'high',
      );
    });

    it('forwards fetchpriority to the injected image component', () => {
      const Stub = makeNuxtImgStub(true);
      const wrapper = mount(Image, {
        props: {
          src: '/a.webp',
          alt: 'A',
          imageComponent: Stub,
          fetchpriority: 'high',
        },
      });

      // NuxtImg's custom slot composes fallthrough attrs (fetchpriority,
      // loading) into imgAttrs; the atom binds imgAttrs onto the final <img>.
      expect(wrapper.find('img.a-image').attributes('fetchpriority')).toBe(
        'high',
      );
    });

    it('forwards loading to the injected image component', () => {
      const Stub = makeNuxtImgStub(true);
      const wrapper = mount(Image, {
        props: {
          src: '/a.webp',
          alt: 'A',
          imageComponent: Stub,
          loading: 'eager',
        },
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
