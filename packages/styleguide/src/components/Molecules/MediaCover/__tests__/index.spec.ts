import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import MediaCover, {
  type MediaCoverRatio,
} from '@/components/Molecules/MediaCover/index.vue';

describe('MediaCover', () => {
  it('renders a figure.m-mediaCover as root (AC-COMP-1)', () => {
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

  it('composes the Image atom in the frame when image is provided (AC-INV-2)', () => {
    const wrapper = mount(MediaCover, {
      props: { image: { src: '/photo.jpg', alt: 'A landscape' } },
    });

    const frame = wrapper.find('.m-mediaCover__frame');
    const img = frame.find('img.a-image');

    expect(img.exists()).toBe(true);
    expect(img.attributes('src')).toBe('/photo.jpg');
    expect(img.attributes('alt')).toBe('A landscape');
    expect(img.classes()).toContain('m-mediaCover__img');
  });

  it('composes u-placeholder in the frame when no image is provided (AC-INV-2)', () => {
    const wrapper = mount(MediaCover, {});

    const frame = wrapper.find('.m-mediaCover__frame');

    expect(frame.find('.u-placeholder').exists()).toBe(true);
    expect(frame.find('img').exists()).toBe(false);
  });

  it('does not render any raw gradient background outside u-placeholder (AC-INV-2)', () => {
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
});
