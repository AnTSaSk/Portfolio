import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import Filter from '../index.vue';

const baseProps = {
  items: [
    { id: 'all', label: 'Tous', pressed: true },
    { id: 'design-systems', label: 'design-systems', pressed: false },
    { id: 'vue', label: 'vue', pressed: false },
  ],
};

describe('Filter', () => {
  it('renders a div root with the m-filter class and role="group"', () => {
    const wrapper = mount(Filter, { props: baseProps });

    expect(wrapper.element.tagName).toBe('DIV');
    expect(wrapper.classes()).toContain('m-filter');
    expect(wrapper.attributes('role')).toBe('group');
  });

  it('does not use the dashed m-filter-label class', () => {
    const wrapper = mount(Filter, { props: baseProps });

    expect(wrapper.find('.m-filter-label').exists()).toBe(false);
  });

  it('exposes a non-empty aria-label by default', () => {
    const wrapper = mount(Filter, { props: baseProps });

    expect(wrapper.attributes('aria-label')).toBeTruthy();
  });

  it('accepts a custom ariaLabel prop', () => {
    const wrapper = mount(Filter, {
      props: { ...baseProps, ariaLabel: 'Filtrer par framework' },
    });

    expect(wrapper.attributes('aria-label')).toBe('Filtrer par framework');
  });

  it('renders the default label text through a Text with the -tag variant', () => {
    const wrapper = mount(Filter, { props: baseProps });

    const label = wrapper.find('.m-filter__label.a-text.-tag');

    expect(label.exists()).toBe(true);
    expect(label.text()).toBe('Filtrer');
  });

  it('renders a custom label prop through the same Text -tag node', () => {
    const wrapper = mount(Filter, {
      props: { ...baseProps, label: 'Frameworks' },
    });

    const label = wrapper.find('.m-filter__label.a-text.-tag');

    expect(label.text()).toBe('Frameworks');
  });

  it('does not declare an inline font-size on the label node', () => {
    const wrapper = mount(Filter, { props: baseProps });

    const label = wrapper.find('.m-filter__label');

    expect(label.attributes('style') ?? '').not.toContain('font-size');
  });

  it('renders one a-tag chip per items entry', () => {
    const wrapper = mount(Filter, { props: baseProps });

    const chips = wrapper.findAll('.a-tag');

    expect(chips).toHaveLength(baseProps.items.length);
    baseProps.items.forEach((item, index) => {
      expect(chips[index]?.text()).toContain(item.label);
    });
  });

  it('renders chips as native buttons carrying aria-pressed matching each item state', () => {
    const wrapper = mount(Filter, { props: baseProps });

    const chips = wrapper.findAll('.a-tag');

    baseProps.items.forEach((item, index) => {
      expect(chips[index]?.element.tagName).toBe('BUTTON');
      expect(chips[index]?.attributes('aria-pressed')).toBe(
        String(item.pressed),
      );
    });
  });

  it('emits toggle with the item id when a chip is clicked', async () => {
    const wrapper = mount(Filter, { props: baseProps });

    const chips = wrapper.findAll('.a-tag');

    await chips[1]?.trigger('click');

    expect(wrapper.emitted('toggle')).toEqual([['design-systems']]);
  });

  it('renders no chips when items is empty', () => {
    const wrapper = mount(Filter, { props: { items: [] } });

    expect(wrapper.findAll('.a-tag')).toHaveLength(0);
  });

  it('renders the count on a chip that carries one', () => {
    const wrapper = mount(Filter, {
      props: {
        items: [{ id: 'vue', label: 'Vue', pressed: false, count: 4 }],
      },
    });

    const count = wrapper.find('.a-tag__count');

    expect(count.exists()).toBe(true);
    expect(count.text()).toBe('4');
  });

  it('renders no count node on a chip without a count', () => {
    const wrapper = mount(Filter, {
      props: {
        items: [{ id: 'all', label: 'Tous', pressed: true }],
      },
    });

    expect(wrapper.find('.a-tag__count').exists()).toBe(false);
  });
});
