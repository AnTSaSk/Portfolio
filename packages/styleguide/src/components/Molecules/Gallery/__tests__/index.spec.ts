import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { defineComponent, h, markRaw } from 'vue';

import Gallery from '../index.vue';

const ImgStub = markRaw(
  defineComponent({
    name: 'ImgStub',
    props: { src: { type: String, required: true } },
    setup: (props) => () => h('img', { src: props.src }),
  }),
);

const withImage = {
  image: { src: '/gallery-1.jpg', alt: 'First shot' },
  caption: 'Fig. 01',
};

const withoutImage = { caption: 'Fig. 02' };

describe('Gallery', () => {
  it('renders a section.m-gallery root with an aria-label', () => {
    const wrapper = mount(Gallery, {
      props: { items: [withImage], ariaLabel: 'Project gallery' },
    });

    const section = wrapper.find('section.m-gallery');

    expect(section.exists()).toBe(true);
    expect(section.attributes('aria-label')).toBe('Project gallery');
  });

  it('renders no variant modifier class for the default styleA variant', () => {
    const wrapper = mount(Gallery, {
      props: { items: [withImage], ariaLabel: 'Project gallery' },
    });

    expect(wrapper.find('section.m-gallery').classes()).not.toContain(
      '-threeUp',
    );
  });

  it('applies the -threeUp modifier class on the root when variant is threeUp', () => {
    const wrapper = mount(Gallery, {
      props: {
        items: [withImage],
        ariaLabel: 'Project gallery',
        variant: 'threeUp',
      },
    });

    expect(wrapper.find('section.m-gallery').classes()).toContain('-threeUp');
  });

  it('renders one figure.m-gallery__fig per item', () => {
    const wrapper = mount(Gallery, {
      props: {
        items: [withImage, withoutImage, withImage],
        ariaLabel: 'Project gallery',
      },
    });

    expect(wrapper.findAll('figure.m-gallery__fig')).toHaveLength(3);
  });

  it('renders an Image inside the figure when the item has an image', () => {
    const wrapper = mount(Gallery, {
      props: { items: [withImage], ariaLabel: 'Project gallery' },
    });

    const figure = wrapper.find('figure.m-gallery__fig');
    const img = figure.find('img.a-image');

    expect(img.exists()).toBe(true);
    expect(img.attributes('src')).toBe('/gallery-1.jpg');
    expect(img.attributes('alt')).toBe('First shot');
    expect(figure.find('.a-image__frame .u-placeholder').exists()).toBe(true);
  });

  it('renders a u-placeholder inside the figure when the item has no image', () => {
    const wrapper = mount(Gallery, {
      props: { items: [withoutImage], ariaLabel: 'Project gallery' },
    });

    const figure = wrapper.find('figure.m-gallery__fig');

    expect(figure.find('.u-placeholder').exists()).toBe(true);
    expect(figure.find('img.a-image').exists()).toBe(false);
  });

  it('renders the caption as .m-gallery__cap when the item has one', () => {
    const wrapper = mount(Gallery, {
      props: { items: [withImage], ariaLabel: 'Project gallery' },
    });

    const cap = wrapper.find('figure.m-gallery__fig .m-gallery__cap');

    expect(cap.exists()).toBe(true);
    expect(cap.text()).toBe('Fig. 01');
  });

  it('renders no .m-gallery__cap when the item has no caption', () => {
    const wrapper = mount(Gallery, {
      props: {
        items: [{ image: { src: '/gallery-3.jpg', alt: 'Third shot' } }],
        ariaLabel: 'Project gallery',
      },
    });

    expect(wrapper.find('figure.m-gallery__fig .m-gallery__cap').exists()).toBe(
      false,
    );
  });

  it('reveals each item image over its own placeholder backdrop', () => {
    const other = { image: { src: '/gallery-2.jpg', alt: 'Second shot' } };
    const wrapper = mount(Gallery, {
      props: { items: [withImage, other], ariaLabel: 'Project gallery' },
    });

    const figures = wrapper.findAll('figure.m-gallery__fig');

    for (const figure of figures) {
      expect(figure.find('.a-image__frame .u-placeholder').exists()).toBe(true);
      expect(figure.find('img.a-image.-reveal').exists()).toBe(true);
    }
  });

  it('keeps a failed image mounted so its placeholder backdrop shows through', async () => {
    const wrapper = mount(Gallery, {
      props: { items: [withImage], ariaLabel: 'Project gallery' },
    });

    const figure = wrapper.find('figure.m-gallery__fig');

    await figure.find('img.a-image').trigger('error');

    expect(figure.find('img.a-image').exists()).toBe(true);
    expect(figure.find('.a-image__frame').classes()).not.toContain('-revealed');
    expect(figure.find('.u-placeholder').exists()).toBe(true);
  });

  it('relays the injected component and applies hero/tile sizes per index', () => {
    const hero = {
      image: { src: '/h.webp', alt: 'Hero', width: 1280, height: 720 },
    };
    const tile = {
      image: { src: '/t.webp', alt: 'Tile', width: 632, height: 474 },
    };
    const wrapper = mount(Gallery, {
      props: {
        items: [hero, tile],
        ariaLabel: 'Project gallery',
        imageComponent: ImgStub,
      },
    });

    const atoms = wrapper.findAllComponents({ name: 'AtomImage' });

    expect(atoms).toHaveLength(2);
    expect(atoms[0]?.props('imageComponent')).toBe(ImgStub);
    expect(atoms[0]?.props('sizes')).toBe('100vw xl:1280px');
    expect(atoms[1]?.props('sizes')).toBe('100vw md:632px');
  });
});
