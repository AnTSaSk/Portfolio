import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { defineComponent, h, markRaw } from 'vue';

import CardProject from '../index.vue';

const ImgStub = markRaw(
  defineComponent({
    name: 'ImgStub',
    props: { src: { type: String, required: true } },
    setup: (props) => () => h('img', { src: props.src }),
  }),
);

const baseProps = {
  href: '/projects/design-system',
  title: 'Design System',
  meta: '2024 · Front-end · DX',
  stack: ['Vue', 'TypeScript'],
};

describe('CardProject', () => {
  it('renders a root <a> with the m-cardProject class and the href prop', () => {
    const wrapper = mount(CardProject, { props: baseProps });

    expect(wrapper.element.tagName).toBe('A');
    expect(wrapper.classes()).toContain('m-cardProject');
    expect(wrapper.attributes('href')).toBe(baseProps.href);
  });

  it('renders an Image in the cover when the image prop is provided', () => {
    const wrapper = mount(CardProject, {
      props: {
        ...baseProps,
        image: { src: '/cover.jpg', alt: 'Cover alt text' },
      },
    });

    const img = wrapper.find('.m-cardProject__cover img.a-image');

    expect(img.exists()).toBe(true);
    expect(img.attributes('src')).toBe('/cover.jpg');
    expect(img.attributes('alt')).toBe('Cover alt text');
  });

  it('renders a u-placeholder in the cover when no image prop is provided', () => {
    const wrapper = mount(CardProject, { props: baseProps });

    expect(wrapper.find('.m-cardProject__cover img.a-image').exists()).toBe(
      false,
    );
    expect(wrapper.find('.m-cardProject__cover .u-placeholder').exists()).toBe(
      true,
    );
  });

  // Placeholder (with title) is a permanent backdrop; a failed image simply
  // never reveals over it. The reveal/fallback state itself is owned by Image.
  it('keeps the placeholder backdrop (with title) under the revealed image', () => {
    const wrapper = mount(CardProject, {
      props: {
        ...baseProps,
        image: { src: '/cover.jpg', alt: 'Project cover' },
      },
    });

    expect(wrapper.find('.m-cardProject__cover img.a-image').exists()).toBe(
      true,
    );

    const placeholder = wrapper.find(
      '.m-cardProject__cover .a-image__frame .u-placeholder',
    );

    expect(placeholder.exists()).toBe(true);
    expect(placeholder.text()).toContain(baseProps.title);
  });

  it('applies the placeholderVariant modifier class to the placeholder', () => {
    const wrapper = mount(CardProject, {
      props: { ...baseProps, placeholderVariant: '-topRight' },
    });

    expect(wrapper.find('.u-placeholder.-topRight').exists()).toBe(true);
  });

  it('renders the title through a Heading -h3 uppercase composition', () => {
    const wrapper = mount(CardProject, { props: baseProps });

    const heading = wrapper.find('.m-cardProject__title .a-heading');

    expect(heading.exists()).toBe(true);
    expect(heading.classes()).toContain('-h3');
    expect(heading.classes()).toContain('-uppercase');
    expect(heading.text()).toContain(baseProps.title);
  });

  it('renders the meta through a Text -tag composition', () => {
    const wrapper = mount(CardProject, { props: baseProps });

    const meta = wrapper.find('.m-cardProject__meta .a-text');

    expect(meta.exists()).toBe(true);
    expect(meta.classes()).toContain('-tag');
    expect(meta.text()).toContain(baseProps.meta);
  });

  it('renders the desc through a Text -bodyS composition when desc is provided', () => {
    const wrapper = mount(CardProject, {
      props: { ...baseProps, desc: 'A short project description.' },
    });

    const desc = wrapper.find('.m-cardProject__desc .a-text');

    expect(desc.exists()).toBe(true);
    expect(desc.classes()).toContain('-bodyS');
    expect(desc.text()).toContain('A short project description.');
  });

  it('does not render the desc block when desc is not provided', () => {
    const wrapper = mount(CardProject, { props: baseProps });

    expect(wrapper.find('.m-cardProject__desc').exists()).toBe(false);
  });

  it('renders one a-tag per stack entry inside a m-cardProject__stack list', () => {
    const wrapper = mount(CardProject, { props: baseProps });

    const list = wrapper.find('ul.m-cardProject__stack');

    expect(list.exists()).toBe(true);

    const items = list.findAll('li');

    expect(items).toHaveLength(baseProps.stack.length);

    baseProps.stack.forEach((label, index) => {
      const tag = items[index].find('.a-tag');

      expect(tag.exists()).toBe(true);
      expect(tag.text()).toContain(label);
    });
  });

  it('relays the injected image component to AtomImage', () => {
    const wrapper = mount(CardProject, {
      props: {
        ...baseProps,
        image: { src: '/a.webp', alt: 'A' },
        imageComponent: ImgStub,
      },
    });

    expect(
      wrapper.findComponent({ name: 'AtomImage' }).props('imageComponent'),
    ).toBe(ImgStub);
  });

  // CardProject relays sizes + width/height so the srcset resolves a slot-sized variant.
  describe('responsive passthrough', () => {
    it('relays sizes to AtomImage when provided', () => {
      const wrapper = mount(CardProject, {
        props: {
          ...baseProps,
          image: { src: '/cover.jpg', alt: 'Cover alt text' },
          sizes: '100vw md:632px',
        },
      });

      expect(wrapper.findComponent({ name: 'AtomImage' }).props('sizes')).toBe(
        '100vw md:632px',
      );
    });

    it('relays width and height from the image prop to AtomImage', () => {
      const wrapper = mount(CardProject, {
        props: {
          ...baseProps,
          image: {
            src: '/cover.jpg',
            alt: 'Cover alt text',
            width: 1600,
            height: 1200,
          },
        },
      });

      const image = wrapper.findComponent({ name: 'AtomImage' });

      expect(image.props('width')).toBe(1600);
      expect(image.props('height')).toBe(1200);
    });

    it('does not pass densities to AtomImage when sizes is provided (mutual exclusivity)', () => {
      const wrapper = mount(CardProject, {
        props: {
          ...baseProps,
          image: { src: '/cover.jpg', alt: 'Cover alt text' },
          sizes: '100vw md:632px',
        },
      });

      expect(
        wrapper.findComponent({ name: 'AtomImage' }).props('densities'),
      ).toBeUndefined();
    });

    it('relays fetchpriority and loading to AtomImage when provided', () => {
      const wrapper = mount(CardProject, {
        props: {
          ...baseProps,
          image: { src: '/cover.jpg', alt: 'Cover alt text' },
          fetchpriority: 'high',
          loading: 'eager',
        },
      });

      const image = wrapper.findComponent({ name: 'AtomImage' });

      expect(image.props('fetchpriority')).toBe('high');
      expect(image.props('loading')).toBe('eager');
    });
  });
});
