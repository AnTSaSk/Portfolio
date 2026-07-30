import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { defineComponent, h, markRaw } from 'vue';

import MediaCover, { type MediaCoverRatio } from '../index.vue';

const ImgStub = markRaw(
  defineComponent({
    name: 'ImgStub',
    props: {
      src: { type: String, required: true },
      sizes: { type: String, default: undefined },
    },
    setup: (props) => () => h('img', { src: props.src }),
  }),
);

describe('MediaCover', () => {
  it('renders a figure.m-mediaCover as root', () => {
    const wrapper = mount(MediaCover, {});

    const figure = wrapper.find('figure.m-mediaCover');

    expect(figure.exists()).toBe(true);
  });

  it('applies the -cover modifier by default', () => {
    const wrapper = mount(MediaCover, {});

    expect(wrapper.find('figure.m-mediaCover').classes()).toContain('-cover');
  });

  it('applies the -poster modifier when variant is poster', () => {
    const wrapper = mount(MediaCover, {
      props: { variant: 'poster' },
    });

    const figure = wrapper.find('figure.m-mediaCover');

    expect(figure.classes()).toContain('-poster');
    expect(figure.classes()).not.toContain('-cover');
  });

  it('composes the Image atom in the frame when image is provided', () => {
    const wrapper = mount(MediaCover, {
      props: { image: { src: '/photo.jpg', alt: 'A landscape' } },
    });

    const frame = wrapper.find('.m-mediaCover__frame');
    const img = frame.find('img.a-image');

    expect(img.exists()).toBe(true);
    expect(img.attributes('src')).toBe('/photo.jpg');
    expect(img.attributes('alt')).toBe('A landscape');
    expect(img.classes()).toContain('-reveal');
  });

  it('renders a bare u-placeholder in the frame (no image) so the radial shows', () => {
    const wrapper = mount(MediaCover, {});

    const frame = wrapper.find('.m-mediaCover__frame');

    expect(frame.find('.u-placeholder').exists()).toBe(true);
    expect(frame.find('img').exists()).toBe(false);
  });

  it('keeps the u-placeholder as a permanent backdrop under the revealed image', () => {
    const wrapper = mount(MediaCover, {
      props: { image: { src: '/photo.jpg', alt: 'A landscape' } },
    });

    const frame = wrapper.find('.m-mediaCover__frame');

    expect(frame.find('.a-image__frame .u-placeholder').exists()).toBe(true);
    expect(frame.find('img.a-image.-reveal').exists()).toBe(true);
  });

  it('does not render any raw gradient background outside u-placeholder', () => {
    const wrapper = mount(MediaCover, {});

    const gradientNodes = wrapper
      .findAll('*')
      .filter((node) => (node.attributes('style') ?? '').includes('gradient'));

    expect(gradientNodes).toHaveLength(0);
  });

  it('forwards placeholderVariant as a modifier class on u-placeholder', () => {
    const wrapper = mount(MediaCover, {
      props: { placeholderVariant: 'topRight' },
    });

    expect(wrapper.find('.u-placeholder').classes()).toContain('-topRight');
  });

  it('does not apply the -big placeholder modifier by default, even for a poster', () => {
    const wrapper = mount(MediaCover, {
      props: { variant: 'poster', category: 'Design' },
    });

    expect(wrapper.find('.u-placeholder').classes()).not.toContain('-big');
  });

  it('applies the -big placeholder modifier only when placeholderHeading is true', () => {
    const wrapper = mount(MediaCover, {
      props: {
        variant: 'poster',
        category: 'Design',
        placeholderHeading: true,
      },
    });

    expect(wrapper.find('.u-placeholder').classes()).toContain('-big');
  });

  it('applies a -ratio modifier class on the frame when ratio is provided', () => {
    const wrapper = mount(MediaCover, {
      props: { ratio: '16x9' },
    });

    expect(wrapper.find('.m-mediaCover__frame').classes()).toContain(
      '-ratio16x9',
    );
  });

  it('maps each ratio value to its own modifier class', () => {
    const cases: Array<[MediaCoverRatio, string]> = [
      ['4x3', '-ratio4x3'],
      ['1x1', '-ratio1x1'],
      ['portrait', '-ratioPortrait'],
    ];

    for (const [ratio, expectedClass] of cases) {
      const wrapper = mount(MediaCover, { props: { ratio } });

      expect(wrapper.find('.m-mediaCover__frame').classes()).toContain(
        expectedClass,
      );
    }
  });

  it('ignores the ratio prop when variant is poster', () => {
    const wrapper = mount(MediaCover, {
      props: { variant: 'poster', ratio: '16x9' },
    });

    expect(wrapper.find('.m-mediaCover__frame').classes()).not.toContain(
      '-ratio16x9',
    );
  });

  it('does not render a figcaption when no caption is provided', () => {
    const wrapper = mount(MediaCover, {});

    expect(wrapper.find('figcaption').exists()).toBe(false);
  });

  it('renders a figcaption.m-mediaCover__cap when caption is provided', () => {
    const wrapper = mount(MediaCover, {
      props: { caption: 'A view over the valley' },
    });

    const figcaption = wrapper.find('figcaption.m-mediaCover__cap');

    expect(figcaption.exists()).toBe(true);
    expect(figcaption.text()).toContain('A view over the valley');
  });

  it('renders the eyebrow via a Text -eyebrow variant when eyebrow is provided', () => {
    const wrapper = mount(MediaCover, {
      props: { caption: 'A view over the valley', eyebrow: 'Fig. 01' },
    });

    const eyebrow = wrapper.find(
      'figcaption.m-mediaCover__cap .a-text.-eyebrow',
    );

    expect(eyebrow.exists()).toBe(true);
    expect(eyebrow.text()).toBe('Fig. 01');
  });

  it('does not render an eyebrow node when eyebrow is absent', () => {
    const wrapper = mount(MediaCover, {
      props: { caption: 'A view over the valley' },
    });

    expect(
      wrapper.find('figcaption.m-mediaCover__cap .a-text.-eyebrow').exists(),
    ).toBe(false);
  });

  it('renders the caption text via a Text atom', () => {
    const wrapper = mount(MediaCover, {
      props: { caption: 'A view over the valley' },
    });

    const captionText = wrapper.find('figcaption.m-mediaCover__cap .a-text');

    expect(captionText.exists()).toBe(true);
    expect(captionText.text()).toContain('A view over the valley');
  });

  it('relays the injected image component and the poster sizes to AtomImage', () => {
    const wrapper = mount(MediaCover, {
      props: {
        variant: 'poster',
        image: { src: '/a.webp', alt: 'A', width: 1200, height: 675 },
        imageComponent: ImgStub,
      },
    });

    const atom = wrapper.findComponent({ name: 'AtomImage' });

    expect(atom.props('imageComponent')).toBe(ImgStub);
    expect(atom.props('sizes')).toBe('100vw xl:1280px');
    expect(atom.props('width')).toBe(1200);
    expect(atom.props('height')).toBe(675);
  });

  it('relays fetchpriority and loading to AtomImage when provided', () => {
    const wrapper = mount(MediaCover, {
      props: {
        variant: 'poster',
        image: { src: '/a.webp', alt: 'A' },
        fetchpriority: 'high',
        loading: 'eager',
      },
    });

    const image = wrapper.findComponent({ name: 'AtomImage' });

    expect(image.props('fetchpriority')).toBe('high');
    expect(image.props('loading')).toBe('eager');
  });

  it('does not force fetchpriority when absent', () => {
    const wrapper = mount(MediaCover, {
      props: { image: { src: '/a.webp', alt: 'A' } },
    });

    const image = wrapper.findComponent({ name: 'AtomImage' });

    expect(image.props('fetchpriority')).toBeUndefined();
  });
});
