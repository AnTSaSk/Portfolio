import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import Pagination from '@/components/Molecules/Pagination/index.vue';

const baseProps = {
  pages: 5,
  current: 2,
  hasPrev: true,
  hasNext: true,
};

describe('Pagination', () => {
  it('renders a nav root with the m-pagination class and an aria-label', () => {
    const wrapper = mount(Pagination, { props: baseProps });

    expect(wrapper.element.tagName).toBe('NAV');
    expect(wrapper.classes()).toContain('m-pagination');
    expect(wrapper.attributes('aria-label')).toBeTruthy();
  });

  it('does not use the dashed m-pagination-btn or m-pagination-edge classes', () => {
    const wrapper = mount(Pagination, { props: baseProps });

    expect(wrapper.html()).not.toContain('m-pagination-btn');
    expect(wrapper.html()).not.toContain('m-pagination-edge');
  });

  it('never renders a neutralized a-button component', () => {
    const wrapper = mount(Pagination, { props: baseProps });

    expect(wrapper.find('.a-button').exists()).toBe(false);
  });

  it('renders one native button.m-pagination__btn per page, excluding the edges', () => {
    const wrapper = mount(Pagination, { props: baseProps });

    const pageButtons = wrapper.findAll(
      '.m-pagination__btn:not(.m-pagination__edge)',
    );

    expect(pageButtons).toHaveLength(baseProps.pages);
    pageButtons.forEach((button) => {
      expect(button.element.tagName).toBe('BUTTON');
      expect(button.attributes('type')).toBe('button');
    });
  });

  it('renders exactly two edge buttons for prev and next', () => {
    const wrapper = mount(Pagination, { props: baseProps });

    const edges = wrapper.findAll('.m-pagination__btn.m-pagination__edge');

    expect(edges).toHaveLength(2);
  });

  it('marks the current page button with aria-current="page" and no other page button', () => {
    const wrapper = mount(Pagination, { props: baseProps });

    const pageButtons = wrapper.findAll(
      '.m-pagination__btn:not(.m-pagination__edge)',
    );
    const current = pageButtons.filter(
      (button) => button.attributes('aria-current') === 'page',
    );

    expect(current).toHaveLength(1);
    expect(current[0]?.text()).toContain(String(baseProps.current));
  });

  it('disables the prev edge when hasPrev is false', () => {
    const wrapper = mount(Pagination, {
      props: { ...baseProps, hasPrev: false },
    });

    const edges = wrapper.findAll('.m-pagination__btn.m-pagination__edge');

    expect(edges[0]?.attributes('disabled')).toBeDefined();
    expect(edges[1]?.attributes('disabled')).toBeUndefined();
  });

  it('disables the next edge when hasNext is false', () => {
    const wrapper = mount(Pagination, {
      props: { ...baseProps, hasNext: false },
    });

    const edges = wrapper.findAll('.m-pagination__btn.m-pagination__edge');

    expect(edges[0]?.attributes('disabled')).toBeUndefined();
    expect(edges[1]?.attributes('disabled')).toBeDefined();
  });

  it('emits select with the page number when a page button is clicked', async () => {
    const wrapper = mount(Pagination, { props: baseProps });

    const pageButtons = wrapper.findAll(
      '.m-pagination__btn:not(.m-pagination__edge)',
    );

    await pageButtons[3]?.trigger('click');

    expect(wrapper.emitted('select')).toEqual([[4]]);
  });

  it('emits prev when the prev edge is clicked', async () => {
    const wrapper = mount(Pagination, { props: baseProps });

    const edges = wrapper.findAll('.m-pagination__btn.m-pagination__edge');

    await edges[0]?.trigger('click');

    expect(wrapper.emitted('prev')).toHaveLength(1);
  });

  it('emits next when the next edge is clicked', async () => {
    const wrapper = mount(Pagination, { props: baseProps });

    const edges = wrapper.findAll('.m-pagination__btn.m-pagination__edge');

    await edges[1]?.trigger('click');

    expect(wrapper.emitted('next')).toHaveLength(1);
  });

  it('does not emit prev when the prev edge is disabled and clicked', async () => {
    const wrapper = mount(Pagination, {
      props: { ...baseProps, hasPrev: false },
    });

    const edges = wrapper.findAll('.m-pagination__btn.m-pagination__edge');

    await edges[0]?.trigger('click');

    expect(wrapper.emitted('prev')).toBeUndefined();
  });

  it('does not emit next when the next edge is disabled and clicked', async () => {
    const wrapper = mount(Pagination, {
      props: { ...baseProps, hasNext: false },
    });

    const edges = wrapper.findAll('.m-pagination__btn.m-pagination__edge');

    await edges[1]?.trigger('click');

    expect(wrapper.emitted('next')).toBeUndefined();
  });

  it('renders the page button label through a Text component, not raw text', () => {
    const wrapper = mount(Pagination, { props: baseProps });

    const pageButtons = wrapper.findAll(
      '.m-pagination__btn:not(.m-pagination__edge)',
    );

    pageButtons.forEach((button) => {
      expect(button.find('.a-text').exists()).toBe(true);
    });
  });
});
