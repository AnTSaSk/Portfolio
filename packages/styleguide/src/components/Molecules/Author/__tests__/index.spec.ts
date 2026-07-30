import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import Author from '../index.vue';

const baseProps = {
  initials: 'AB',
  name: 'Alexis Besson',
  bio: 'Lead Développeur Front-end basé à Paris. Écrit sur les design systems.',
  links: [
    { label: 'GitHub', href: 'https://github.com/antsask' },
    {
      label: 'LinkedIn',
      href: 'https://linkedin.com/in/antsask',
      external: true,
    },
  ],
};

describe('Author', () => {
  it('renders an aside root with the m-author class', () => {
    const wrapper = mount(Author, { props: baseProps });

    expect(wrapper.element.tagName).toBe('ASIDE');
    expect(wrapper.classes()).toContain('m-author');
  });

  it('renders the initials through a Text in the avatar, hidden from a11y tree', () => {
    const wrapper = mount(Author, { props: baseProps });

    const avatar = wrapper.find('.m-author__avatar');

    expect(avatar.exists()).toBe(true);
    expect(avatar.attributes('aria-hidden')).toBe('true');

    const initialsText = avatar.find('.a-text');

    expect(initialsText.exists()).toBe(true);
    expect(initialsText.text()).toBe(baseProps.initials);
  });

  it('renders the name through a Text with the -bodyS variant', () => {
    const wrapper = mount(Author, { props: baseProps });

    const name = wrapper.find('.m-author__name .a-text.-bodyS');

    expect(name.exists()).toBe(true);
    expect(name.text()).toContain(baseProps.name);
  });

  it('renders the bio through a Text with the -bodyS variant', () => {
    const wrapper = mount(Author, { props: baseProps });

    const body = wrapper.find('.m-author__body .a-text.-bodyS');

    expect(body.exists()).toBe(true);
    expect(body.text()).toContain(baseProps.bio);
  });

  it('renders one Link atom with the arrow variant per links entry, labelled with a bodyS Text', () => {
    const wrapper = mount(Author, { props: baseProps });

    const links = wrapper.findAll('.m-author__links .a-link.-arrow');

    expect(links).toHaveLength(baseProps.links.length);

    baseProps.links.forEach((link, index) => {
      const item = links[index];

      expect(item?.attributes('href')).toBe(link.href);
      expect(item?.find('.a-text.-bodyS').text()).toContain(link.label);
    });
  });

  it('composes the Link atom for its links instead of a hand-rolled anchor or arrow icon', () => {
    const wrapper = mount(Author, { props: baseProps });

    const container = wrapper.get('.m-author__links');

    expect(container.findAll('a:not(.a-link)')).toHaveLength(0);
    expect(container.find('.m-author__link').exists()).toBe(false);
    expect(container.find('.a-icon').exists()).toBe(false);
    expect(container.find('.a-link__arrow').exists()).toBe(true);
  });

  it('forwards href and an explicit external prop to each composed Link, overriding URL-based detection', () => {
    const props = {
      ...baseProps,
      links: [
        { label: 'Docs', href: '/docs', external: true },
        { label: 'Site', href: 'https://example.com', external: false },
      ],
    };
    const wrapper = mount(Author, { props });

    const links = wrapper.findAll('.m-author__links .a-link');

    expect(links).toHaveLength(2);

    expect(links[0]?.attributes('href')).toBe('/docs');
    expect(links[0]?.attributes('target')).toBe('_blank');
    expect(links[0]?.attributes('rel')).toBe('noopener noreferrer');

    expect(links[1]?.attributes('href')).toBe('https://example.com');
    expect(links[1]?.attributes('target')).toBeUndefined();
    expect(links[1]?.attributes('rel')).toBeUndefined();
  });
});
