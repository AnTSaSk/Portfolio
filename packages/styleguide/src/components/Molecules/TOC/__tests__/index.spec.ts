import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import TOC from '@/components/Molecules/TOC/index.vue';

const baseProps = {
  items: [
    { id: 'postulat', label: 'Le postulat' },
    { id: 'distinction', label: 'Une distinction à garder' },
    { id: 'exemple', label: 'Un exemple', sub: true },
    { id: 'pratique', label: 'En pratique' },
    { id: 'fin', label: 'Pour finir' },
  ],
  activeId: 'postulat',
};

describe('TOC', () => {
  it('renders a nav root with the m-toc class and an aria-label', () => {
    const wrapper = mount(TOC, { props: baseProps });

    expect(wrapper.element.tagName).toBe('NAV');
    expect(wrapper.classes()).toContain('m-toc');
    expect(wrapper.attributes('aria-label')).toBeTruthy();
  });

  it('renders the head label through a Text -tag', () => {
    const wrapper = mount(TOC, { props: baseProps });

    const head = wrapper.find('.m-toc__head .a-text.-tag');

    expect(head.exists()).toBe(true);
    expect(head.text()).toContain('Sommaire');
  });

  it('renders a m-toc__list ul with one m-toc__item li per item', () => {
    const wrapper = mount(TOC, { props: baseProps });

    const list = wrapper.find('ul.m-toc__list');

    expect(list.exists()).toBe(true);

    const items = wrapper.findAll('li.m-toc__item');

    expect(items).toHaveLength(baseProps.items.length);
  });

  it('does not use a-button for items (native li a11y, AC-COMP-3)', () => {
    const wrapper = mount(TOC, { props: baseProps });

    expect(wrapper.find('.a-button').exists()).toBe(false);
  });

  it('renders item labels through a Text -bodyS', () => {
    const wrapper = mount(TOC, { props: baseProps });

    const items = wrapper.findAll('li.m-toc__item');

    baseProps.items.forEach((item, index) => {
      const text = items[index]?.find('.a-text.-bodyS');

      expect(text?.exists()).toBe(true);
      expect(text?.text()).toContain(item.label);
    });
  });

  it('renders each item as an anchor linking to its id', () => {
    const wrapper = mount(TOC, { props: baseProps });

    const items = wrapper.findAll('li.m-toc__item');

    baseProps.items.forEach((item, index) => {
      const link = items[index]?.find('a.m-toc__link');

      expect(link?.exists()).toBe(true);
      expect(link?.attributes('href')).toBe(`#${item.id}`);
    });
  });

  it('marks the item matching activeId with the -active class and aria-current on its link', () => {
    const wrapper = mount(TOC, { props: baseProps });

    const items = wrapper.findAll('li.m-toc__item');

    baseProps.items.forEach((item, index) => {
      const link = items[index]?.find('a.m-toc__link');

      if (item.id === baseProps.activeId) {
        expect(items[index]?.classes()).toContain('-active');
        expect(link?.attributes('aria-current')).toBe('location');
      } else {
        expect(items[index]?.classes()).not.toContain('-active');
        expect(link?.attributes('aria-current')).toBeUndefined();
      }
    });
  });

  it('marks items with sub:true with the -sub class', () => {
    const wrapper = mount(TOC, { props: baseProps });

    const items = wrapper.findAll('li.m-toc__item');

    baseProps.items.forEach((item, index) => {
      if (item.sub) {
        expect(items[index]?.classes()).toContain('-sub');
      } else {
        expect(items[index]?.classes()).not.toContain('-sub');
      }
    });
  });

  it('emits select with the item id on link click', async () => {
    const wrapper = mount(TOC, { props: baseProps });

    const links = wrapper.findAll('a.m-toc__link');

    await links[1]?.trigger('click');

    expect(wrapper.emitted('select')).toBeTruthy();
    expect(wrapper.emitted('select')?.[0]).toEqual([baseProps.items[1]?.id]);
  });
});
