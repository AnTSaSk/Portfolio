import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import Gallery from '../index.vue';

// A source-size list is `<media-condition> <length>` pairs then a bare default:
// the @nuxt/image shorthand (`100vw xl:1280px`) is not valid HTML and collapses
// the whole attribute to 100vw in the browser.
const expectValidSizes = (value: string | undefined): void => {
  expect(value).toBeDefined();
  const entries = (value ?? '').split(',').map((entry) => entry.trim());

  expect(entries.length).toBeGreaterThan(1);
  entries.slice(0, -1).forEach((entry) => {
    expect(entry).toMatch(/^\((?:min|max)-width:\s*\d+px\)\s+\S+$/);
  });
  expect(entries.at(-1)).toMatch(/^\S+$/);
};

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

  it('relays pregenerated sources/srcset and applies hero/tile sizes per index', () => {
    const heroSources = [
      { srcset: '/img/_gen/h-632w.avif 632w', type: 'image/avif' },
      { srcset: '/img/_gen/h-632w.webp 632w', type: 'image/webp' },
    ];
    const hero = {
      image: {
        src: '/img/h.jpg',
        alt: 'Hero',
        width: 1280,
        height: 720,
        sources: heroSources,
        srcset: '/img/_gen/h-632w.webp 632w',
      },
    };
    const tile = {
      image: { src: '/img/t.jpg', alt: 'Tile', width: 632, height: 474 },
    };
    const wrapper = mount(Gallery, {
      props: { items: [hero, tile], ariaLabel: 'Project gallery' },
    });

    const atoms = wrapper.findAllComponents({ name: 'AtomImage' });

    expect(atoms).toHaveLength(2);
    expect(atoms[0]?.props('sources')).toEqual(heroSources);
    expect(atoms[0]?.props('srcset')).toBe('/img/_gen/h-632w.webp 632w');
    expect(atoms[0]?.props('sizes')).toBe('(min-width: 1280px) 1280px, 100vw');
    expect(atoms[1]?.props('sizes')).toBe('(min-width: 768px) 632px, 100vw');
  });

  it('renders hero/tile sizes as valid HTML sizes attributes on img and sources', () => {
    const hero = {
      image: {
        src: '/img/h.jpg',
        alt: 'Hero',
        sources: [
          { srcset: '/img/_gen/h-1280w.avif 1280w', type: 'image/avif' },
          { srcset: '/img/_gen/h-1280w.webp 1280w', type: 'image/webp' },
        ],
        srcset: '/img/_gen/h-1280w.webp 1280w',
      },
    };
    const tile = { image: { src: '/img/t.jpg', alt: 'Tile' } };
    const wrapper = mount(Gallery, { props: { items: [hero, tile] } });

    const figures = wrapper.findAll('figure.m-gallery__fig');
    const heroSizes = [
      ...(figures[0]?.findAll('source') ?? []),
      figures[0]?.find('img.a-image'),
    ].map((node) => node?.attributes('sizes'));

    expect(heroSizes).toHaveLength(3);
    heroSizes.forEach((sizes) => {
      expect(sizes).toBe('(min-width: 1280px) 1280px, 100vw');
      expectValidSizes(sizes);
    });

    const tileSizes = figures[1]?.find('img.a-image').attributes('sizes');

    expect(tileSizes).toBe('(min-width: 768px) 632px, 100vw');
    expectValidSizes(tileSizes);
  });

  it('renders a picture source per format for the item that carries sources', () => {
    const wrapper = mount(Gallery, {
      props: {
        items: [
          {
            image: {
              src: '/img/h.jpg',
              alt: 'Hero',
              sources: [
                { srcset: '/img/_gen/h-632w.avif 632w', type: 'image/avif' },
                { srcset: '/img/_gen/h-632w.webp 632w', type: 'image/webp' },
              ],
            },
          },
        ],
      },
    });
    const rendered = wrapper.findAll('picture source');

    expect(rendered).toHaveLength(2);
    expect(rendered[0]?.attributes('type')).toBe('image/avif');
  });
});
