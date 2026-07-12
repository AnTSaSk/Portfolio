import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import CardProject from '@/components/Molecules/CardProject/index.vue';

const baseProps = {
  href: '/projects/design-system',
  title: 'Design System',
  meta: '2024 · Front-end · DX',
  stack: ['Vue', 'TypeScript'],
};

describe('CardProject', () => {
  // AC-COMP-1 / AC-FID: root is a link carrying the ABEM block class
  it('renders a root <a> with the m-cardProject class and the href prop', () => {
    const wrapper = mount(CardProject, { props: baseProps });

    expect(wrapper.element.tagName).toBe('A');
    expect(wrapper.classes()).toContain('m-cardProject');
    expect(wrapper.attributes('href')).toBe(baseProps.href);
  });

  // AC-COMP-1: cover composes the Image atom when an image prop is supplied
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

  // AC-COMP-1: cover falls back to u-placeholder when no image prop is supplied
  it('renders a u-placeholder in the cover when no image prop is provided', () => {
    const wrapper = mount(CardProject, { props: baseProps });

    expect(wrapper.find('.m-cardProject__cover img.a-image').exists()).toBe(
      false,
    );
    expect(wrapper.find('.m-cardProject__cover .u-placeholder').exists()).toBe(
      true,
    );
  });

  // AC-COMP-1: placeholder variant modifier is forwarded onto u-placeholder
  it('applies the placeholderVariant modifier class to the placeholder', () => {
    const wrapper = mount(CardProject, {
      props: { ...baseProps, placeholderVariant: '-topRight' },
    });

    expect(wrapper.find('.u-placeholder.-topRight').exists()).toBe(true);
  });

  // AC-COMP-1: title composes Heading -h3 uppercase and renders the title text
  it('renders the title through a Heading -h3 uppercase composition', () => {
    const wrapper = mount(CardProject, { props: baseProps });

    const heading = wrapper.find('.m-cardProject__title .a-heading');

    expect(heading.exists()).toBe(true);
    expect(heading.classes()).toContain('-h3');
    expect(heading.classes()).toContain('-uppercase');
    expect(heading.text()).toContain(baseProps.title);
  });

  // AC-COMP-1: meta composes Text -tag and renders the meta text
  it('renders the meta through a Text -tag composition', () => {
    const wrapper = mount(CardProject, { props: baseProps });

    const meta = wrapper.find('.m-cardProject__meta .a-text');

    expect(meta.exists()).toBe(true);
    expect(meta.classes()).toContain('-tag');
    expect(meta.text()).toContain(baseProps.meta);
  });

  // AC-COMP-1: desc composes Text -bodyS and renders the desc text when supplied
  it('renders the desc through a Text -bodyS composition when desc is provided', () => {
    const wrapper = mount(CardProject, {
      props: { ...baseProps, desc: 'A short project description.' },
    });

    const desc = wrapper.find('.m-cardProject__desc .a-text');

    expect(desc.exists()).toBe(true);
    expect(desc.classes()).toContain('-bodyS');
    expect(desc.text()).toContain('A short project description.');
  });

  // AC-COMP-1 edge case: desc block is absent when desc prop is not supplied (related context)
  it('does not render the desc block when desc is not provided', () => {
    const wrapper = mount(CardProject, { props: baseProps });

    expect(wrapper.find('.m-cardProject__desc').exists()).toBe(false);
  });

  // AC-COMP-1 / AC-FID: stack renders one a-tag per entry inside ul > li
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
});
