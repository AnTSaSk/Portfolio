import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import Tag from '../index.vue';

describe('Tag', () => {
  it('renders a span with the a-tag base class by default', () => {
    const wrapper = mount(Tag, { slots: { default: 'Label' } });

    expect(wrapper.element.tagName).toBe('SPAN');
    expect(wrapper.classes()).toContain('a-tag');
  });

  it('renders a button[type=button] when as is button', () => {
    const wrapper = mount(Tag, {
      props: { as: 'button' },
      slots: { default: 'Label' },
    });

    expect(wrapper.element.tagName).toBe('BUTTON');
    expect(wrapper.attributes('type')).toBe('button');
    expect(wrapper.classes()).toContain('a-tag');
  });

  it('renders the default slot content through the Text -tag composition', () => {
    const wrapper = mount(Tag, { slots: { default: 'Label' } });

    expect(wrapper.text()).toContain('Label');
    expect(wrapper.find('.a-text.-tag').exists()).toBe(true);
  });

  it('sets aria-pressed=true and the -selected class when pressed is true on a button', () => {
    const wrapper = mount(Tag, {
      props: { as: 'button', pressed: true },
      slots: { default: 'Label' },
    });

    expect(wrapper.attributes('aria-pressed')).toBe('true');
    expect(wrapper.classes()).toContain('-selected');
  });

  it('sets aria-pressed=false and no -selected class when pressed is false on a button', () => {
    const wrapper = mount(Tag, {
      props: { as: 'button', pressed: false },
      slots: { default: 'Label' },
    });

    expect(wrapper.attributes('aria-pressed')).toBe('false');
    expect(wrapper.classes()).not.toContain('-selected');
  });

  it('does not set aria-pressed on a span even when pressed is true', () => {
    const wrapper = mount(Tag, {
      props: { pressed: true },
      slots: { default: 'Label' },
    });

    expect(wrapper.attributes('aria-pressed')).toBeUndefined();
  });

  it('sets the disabled attribute on a button when disabled is true', () => {
    const wrapper = mount(Tag, {
      props: { as: 'button', disabled: true },
      slots: { default: 'Label' },
    });

    expect(wrapper.attributes('disabled')).toBeDefined();
  });

  it('sets aria-disabled on a span when disabled is true', () => {
    const wrapper = mount(Tag, {
      props: { disabled: true },
      slots: { default: 'Label' },
    });

    expect(wrapper.attributes('aria-disabled')).toBe('true');
  });

  it.each([
    ['brand', '-brand'],
    ['info', '-info'],
    ['warning', '-warning'],
    ['error', '-error'],
    ['strong', '-strong'],
  ])('applies the -%s modifier for variant=%s', (variant, expectedClass) => {
    const wrapper = mount(Tag, {
      props: {
        variant: variant as 'brand' | 'info' | 'warning' | 'error' | 'strong',
      },
      slots: { default: 'Label' },
    });

    expect(wrapper.classes()).toContain(expectedClass);
  });

  it('applies no variant modifier by default', () => {
    const wrapper = mount(Tag, { slots: { default: 'Label' } });

    expect(wrapper.classes()).not.toContain('-brand');
    expect(wrapper.classes()).not.toContain('-info');
    expect(wrapper.classes()).not.toContain('-warning');
    expect(wrapper.classes()).not.toContain('-error');
  });

  it('applies no -withLead or -withTrail modifier by default', () => {
    const wrapper = mount(Tag, { slots: { default: 'Label' } });

    expect(wrapper.classes()).not.toContain('-withLead');
    expect(wrapper.classes()).not.toContain('-withTrail');
  });

  it('applies the -withLead modifier and renders lead slot content when a lead slot is provided', () => {
    const wrapper = mount(Tag, {
      slots: { default: 'Label', lead: '<span class="icon">i</span>' },
    });

    expect(wrapper.classes()).toContain('-withLead');
    expect(wrapper.find('.lead .icon').exists()).toBe(true);
  });

  it.each([['info'], ['warning'], ['error']])(
    'applies the -withLead modifier and renders a lead dot for the functional variant=%s without a lead slot',
    (variant) => {
      const wrapper = mount(Tag, {
        props: { variant: variant as 'info' | 'warning' | 'error' },
        slots: { default: 'Label' },
      });

      expect(wrapper.classes()).toContain('-withLead');
      expect(wrapper.find('.lead .dot').exists()).toBe(true);
    },
  );

  it('renders no lead dot for the brand variant', () => {
    const wrapper = mount(Tag, {
      props: { variant: 'brand' },
      slots: { default: 'Label' },
    });

    expect(wrapper.find('.lead .dot').exists()).toBe(false);
  });

  it('applies the -withTrail modifier and renders trail slot content when a trail slot is provided', () => {
    const wrapper = mount(Tag, {
      slots: { default: 'Label', trail: '<span class="icon">i</span>' },
    });

    expect(wrapper.classes()).toContain('-withTrail');
    expect(wrapper.find('.trail .icon').exists()).toBe(true);
  });

  it('applies the -withTrail modifier and renders the count value when count is provided', () => {
    const wrapper = mount(Tag, {
      props: { count: 8 },
      slots: { default: 'Label' },
    });

    expect(wrapper.classes()).toContain('-withTrail');
    expect(wrapper.find('.trail .count').text()).toBe('8');
  });
});
