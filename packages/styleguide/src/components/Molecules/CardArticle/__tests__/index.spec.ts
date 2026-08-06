import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import CardArticle from '../index.vue';

const baseProps = {
  href: '/blog/some-article',
  title: 'Some article title',
  date: '12 APR. 2026 · 9 min',
  excerpt: 'A short excerpt describing the article.',
  tags: ['design-systems', 'vue'],
};

describe('CardArticle', () => {
  it('renders an anchor root with the m-cardArticle class and the href attribute', () => {
    const wrapper = mount(CardArticle, { props: baseProps });

    expect(wrapper.element.tagName).toBe('A');
    expect(wrapper.classes()).toContain('m-cardArticle');
    expect(wrapper.attributes('href')).toBe(baseProps.href);
  });

  it('does not use the dashed m-card-article class', () => {
    const wrapper = mount(CardArticle, { props: baseProps });

    expect(wrapper.classes()).not.toContain('m-card-article');
  });

  it('renders a u-placeholder cover when no image prop is provided', () => {
    const wrapper = mount(CardArticle, { props: baseProps });

    const placeholder = wrapper.find('.m-cardArticle__cover .u-placeholder');

    expect(wrapper.find('.m-cardArticle__cover').exists()).toBe(true);
    expect(placeholder.exists()).toBe(true);
    expect(wrapper.find('.a-image').exists()).toBe(false);
  });

  it('applies the requested placeholder variant class when placeholderVariant is set', () => {
    const wrapper = mount(CardArticle, {
      props: { ...baseProps, placeholderVariant: '-topRight' },
    });

    expect(wrapper.find('.u-placeholder.-topRight').exists()).toBe(true);
  });

  it('renders the Image component in the cover when an image prop is provided', () => {
    const wrapper = mount(CardArticle, {
      props: {
        ...baseProps,
        image: { src: '/cover.jpg', alt: 'Cover alt text' },
      },
    });

    const img = wrapper.find('.m-cardArticle__cover .a-image');

    expect(img.exists()).toBe(true);
    expect(img.attributes('src')).toBe('/cover.jpg');
    expect(img.attributes('alt')).toBe('Cover alt text');
  });

  it('keeps the placeholder as a permanent backdrop under the revealed image', () => {
    const wrapper = mount(CardArticle, {
      props: {
        ...baseProps,
        image: { src: '/cover.jpg', alt: 'Cover alt text' },
      },
    });

    expect(wrapper.find('.a-image__frame .u-placeholder').exists()).toBe(true);
    expect(wrapper.find('.a-image.-reveal').exists()).toBe(true);
  });

  it('renders the title through a Heading with the -h5 modifier', () => {
    const wrapper = mount(CardArticle, { props: baseProps });

    const heading = wrapper.find('.a-heading.-h5');

    expect(heading.exists()).toBe(true);
    expect(heading.text()).toContain(baseProps.title);
  });

  it('renders the date through a Text with the -tag variant', () => {
    const wrapper = mount(CardArticle, { props: baseProps });

    const dateText = wrapper.find('.a-text.-tag');

    expect(dateText.exists()).toBe(true);
    expect(dateText.text()).toContain(baseProps.date);
  });

  it('renders the excerpt through a Text with the -bodyS variant', () => {
    const wrapper = mount(CardArticle, { props: baseProps });

    const excerptText = wrapper.find('.a-text.-bodyS');

    expect(excerptText.exists()).toBe(true);
    expect(excerptText.text()).toContain(baseProps.excerpt);
  });

  it('renders one a-tag per tags entry inside a m-cardArticle__tags list', () => {
    const wrapper = mount(CardArticle, { props: baseProps });

    const list = wrapper.find('ul.m-cardArticle__tags');

    expect(list.exists()).toBe(true);
    expect(list.findAll('li')).toHaveLength(baseProps.tags.length);

    const tagLabels = wrapper.findAll('ul.m-cardArticle__tags li .a-tag');

    expect(tagLabels).toHaveLength(baseProps.tags.length);
    baseProps.tags.forEach((tag, index) => {
      expect(tagLabels[index]?.text()).toContain(tag);
    });
  });

  it('renders no tags list items when tags is empty', () => {
    const wrapper = mount(CardArticle, { props: { ...baseProps, tags: [] } });

    expect(wrapper.findAll('ul.m-cardArticle__tags li')).toHaveLength(0);
  });

  it('relays the pregenerated sources and srcset to AtomImage', () => {
    const sources = [
      { srcset: '/img/_gen/a-1280w.avif 1280w', type: 'image/avif' },
      { srcset: '/img/_gen/a-1280w.webp 1280w', type: 'image/webp' },
    ];
    const wrapper = mount(CardArticle, {
      props: {
        ...baseProps,
        image: {
          src: '/img/a.jpg',
          alt: 'A',
          sources,
          srcset: '/img/_gen/a-1280w.webp 1280w',
        },
      },
    });
    const atom = wrapper.findComponent({ name: 'AtomImage' });

    expect(atom.props('sources')).toEqual(sources);
    expect(atom.props('srcset')).toBe('/img/_gen/a-1280w.webp 1280w');
  });

  it('renders a picture source per format when sources are provided', () => {
    const wrapper = mount(CardArticle, {
      props: {
        ...baseProps,
        image: {
          src: '/img/a.jpg',
          alt: 'A',
          sources: [
            { srcset: '/img/_gen/a-1280w.avif 1280w', type: 'image/avif' },
            { srcset: '/img/_gen/a-1280w.webp 1280w', type: 'image/webp' },
          ],
        },
      },
    });
    const rendered = wrapper.findAll('picture source');

    expect(rendered).toHaveLength(2);
    expect(rendered[0]?.attributes('type')).toBe('image/avif');
  });

  // Without sizes the browser assumes 100vw and downloads the widest variant
  // for a card that never fills the viewport.
  describe('rendered geometry', () => {
    it('announces the card geometry on the img and on every source', () => {
      const wrapper = mount(CardArticle, {
        props: {
          ...baseProps,
          image: {
            src: '/img/a.jpg',
            alt: 'A',
            sources: [
              { srcset: '/img/_gen/a-1280w.avif 1280w', type: 'image/avif' },
              { srcset: '/img/_gen/a-1280w.webp 1280w', type: 'image/webp' },
            ],
            srcset: '/img/_gen/a-1280w.webp 1280w',
          },
          sizes: '(min-width: 521px) 405px, 100vw',
        },
      });

      const rendered = [
        ...wrapper.findAll('source'),
        wrapper.find('img.a-image'),
      ].map((node) => node.attributes('sizes'));

      expect(rendered).toHaveLength(3);
      rendered.forEach((sizes) => {
        expect(sizes).toBe('(min-width: 521px) 405px, 100vw');
      });
    });
  });
});
