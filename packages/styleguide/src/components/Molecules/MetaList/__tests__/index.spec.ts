import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import MetaList from '../index.vue';

const baseProps = {
  items: [
    { term: 'Année', value: '2025' },
    { term: 'Rôle', value: 'Lead front-end · design systems' },
    { term: 'Stack', tags: ['Vue 3', 'Nuxt', 'TypeScript'] },
  ],
};

describe('MetaList', () => {
  // Root is a div, not a dl: a <dl> may only contain dt/dd groups (or div
  // wrappers around them), so the optional __links block can't live inside
  // Guards against an invalid-HTML root regression from the Link composition.
  it('renders a div root with the m-metaList class, wrapping a dl.m-metaList__list', () => {
    const wrapper = mount(MetaList, { props: baseProps });

    expect(wrapper.element.tagName).toBe('DIV');
    expect(wrapper.classes()).toContain('m-metaList');

    const list = wrapper.find('dl.m-metaList__list');

    expect(list.exists()).toBe(true);
  });

  it('does not use the dashed m-meta-list class', () => {
    const wrapper = mount(MetaList, { props: baseProps });

    expect(wrapper.classes()).not.toContain('m-meta-list');
  });

  it('forwards an optional aria-label to the dl.m-metaList__list', () => {
    const wrapper = mount(MetaList, {
      props: { ...baseProps, ariaLabel: 'Informations du projet' },
    });

    const list = wrapper.find('dl.m-metaList__list');

    expect(list.attributes('aria-label')).toBe('Informations du projet');
  });

  it('renders one m-metaList__row per item, each containing a dt and a dd', () => {
    const wrapper = mount(MetaList, { props: baseProps });

    const rows = wrapper.findAll('.m-metaList__row');

    expect(rows).toHaveLength(baseProps.items.length);
    rows.forEach((row) => {
      expect(row.element.tagName).toBe('DIV');
      expect(row.find('dt').exists()).toBe(true);
      expect(row.find('dd').exists()).toBe(true);
    });
  });

  it('renders the term through a Text with the -tag variant', () => {
    const wrapper = mount(MetaList, { props: baseProps });

    const rows = wrapper.findAll('.m-metaList__row');
    const term = rows[0]?.find('dt .a-text.-tag');

    expect(term?.exists()).toBe(true);
    expect(term?.text()).toContain(baseProps.items[0]?.term);
  });

  it('renders a string value through a Text with the -bodyS variant', () => {
    const wrapper = mount(MetaList, { props: baseProps });

    const rows = wrapper.findAll('.m-metaList__row');
    const value = rows[0]?.find('dd .a-text.-bodyS');

    expect(value?.exists()).toBe(true);
    expect(value?.text()).toContain(baseProps.items[0]?.value);
  });

  it('renders one a-tag per tag inside a m-metaList__stack when item.tags is provided', () => {
    const wrapper = mount(MetaList, { props: baseProps });

    const stackItem = baseProps.items[2];
    const rows = wrapper.findAll('.m-metaList__row');
    const stack = rows[2]?.find('dd ul.m-metaList__stack');

    expect(stack?.exists()).toBe(true);
    expect(stack?.findAll('li')).toHaveLength(stackItem?.tags?.length ?? 0);

    const tagLabels = stack?.findAll('li .a-tag') ?? [];

    expect(tagLabels).toHaveLength(stackItem?.tags?.length ?? 0);
    stackItem?.tags?.forEach((tag, index) => {
      expect(tagLabels[index]?.text()).toContain(tag);
    });
  });

  it('does not render a project-specific m-metaList__links block', () => {
    const wrapper = mount(MetaList, { props: baseProps });

    expect(wrapper.find('.m-metaList__links').exists()).toBe(false);
  });

  it('does not render the m-metaList__links block when links is an empty array', () => {
    const wrapper = mount(MetaList, { props: { ...baseProps, links: [] } });

    expect(wrapper.find('.m-metaList__links').exists()).toBe(false);
  });

  it('renders the m-metaList__links block with a default "Liens" head when links is provided', () => {
    const wrapper = mount(MetaList, {
      props: {
        ...baseProps,
        links: [{ label: 'Repo', href: 'https://github.com/antsask' }],
      },
    });

    const block = wrapper.find('.m-metaList__links');

    expect(block.exists()).toBe(true);

    const head = block.find('.m-metaList__linksHead .a-text.-tag');

    expect(head.exists()).toBe(true);
    expect(head.text()).toBe('Liens');
  });

  it('overrides the links head with the linksLabel prop', () => {
    const wrapper = mount(MetaList, {
      props: {
        ...baseProps,
        links: [{ label: 'Repo', href: 'https://github.com/antsask' }],
        linksLabel: 'Ressources',
      },
    });

    const head = wrapper.find('.m-metaList__linksHead .a-text.-tag');

    expect(head.text()).toBe('Ressources');
  });

  it('renders one Link atom with the arrow variant per links entry, forwarding href and external', () => {
    const links = [
      { label: 'Docs', href: '/docs', external: true },
      { label: 'Site', href: 'https://example.com', external: false },
    ];
    const wrapper = mount(MetaList, { props: { ...baseProps, links } });

    const rendered = wrapper.findAll('.m-metaList__links .a-link.-arrow');

    expect(rendered).toHaveLength(links.length);

    expect(rendered[0]?.attributes('href')).toBe('/docs');
    expect(rendered[0]?.attributes('target')).toBe('_blank');
    expect(rendered[0]?.attributes('rel')).toBe('noopener noreferrer');
    expect(rendered[0]?.text()).toContain('Docs');

    expect(rendered[1]?.attributes('href')).toBe('https://example.com');
    expect(rendered[1]?.attributes('target')).toBeUndefined();
    expect(rendered[1]?.attributes('rel')).toBeUndefined();
    expect(rendered[1]?.text()).toContain('Site');
  });

  it('keeps the dl term/value rows and tag stack intact when the links block is rendered', () => {
    const wrapper = mount(MetaList, {
      props: {
        ...baseProps,
        links: [{ label: 'Repo', href: 'https://github.com/antsask' }],
      },
    });

    const rows = wrapper.findAll('.m-metaList__row');

    expect(rows).toHaveLength(baseProps.items.length);
    expect(wrapper.find('dl.m-metaList__list').exists()).toBe(true);

    const stack = rows[2]?.find('dd ul.m-metaList__stack');

    expect(stack?.findAll('li .a-tag')).toHaveLength(
      baseProps.items[2]?.tags?.length ?? 0,
    );
  });
});
