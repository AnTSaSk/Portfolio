import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import Button from '../index.vue';

describe('Button', () => {
  it('renders a button element with type="button" by default', () => {
    const wrapper = mount(Button, { slots: { default: 'Submit' } });

    expect(wrapper.element.tagName).toBe('BUTTON');
    expect(wrapper.attributes('type')).toBe('button');
    expect(wrapper.classes()).toContain('a-button');
  });

  it('renders a button element with type="submit" when type is submit', () => {
    const wrapper = mount(Button, {
      props: { type: 'submit' },
      slots: { default: 'Submit' },
    });

    expect(wrapper.element.tagName).toBe('BUTTON');
    expect(wrapper.attributes('type')).toBe('submit');
  });

  it('renders an anchor element with href when type is link', () => {
    const wrapper = mount(Button, {
      props: { type: 'link', href: '/contact' },
      slots: { default: 'Contact' },
    });

    expect(wrapper.element.tagName).toBe('A');
    expect(wrapper.attributes('href')).toBe('/contact');
  });

  it('applies the -primary variant class by default', () => {
    const wrapper = mount(Button, { slots: { default: 'Submit' } });

    expect(wrapper.classes()).toContain('-primary');
    expect(wrapper.classes()).not.toContain('-ghost');
  });

  it('applies the -ghost variant class when variant is ghost', () => {
    const wrapper = mount(Button, {
      props: { variant: 'ghost' },
      slots: { default: 'Submit' },
    });

    expect(wrapper.classes()).toContain('-ghost');
    expect(wrapper.classes()).not.toContain('-primary');
  });

  it('sets the disabled attribute on the button when disabled is true', () => {
    const wrapper = mount(Button, {
      props: { disabled: true },
      slots: { default: 'Submit' },
    });

    expect(wrapper.attributes('disabled')).toBeDefined();
  });

  it('marks the link as aria-disabled when disabled and type is link', () => {
    const wrapper = mount(Button, {
      props: { type: 'link', href: '/contact', disabled: true },
      slots: { default: 'Contact' },
    });

    expect(wrapper.attributes('aria-disabled')).toBe('true');
  });

  it('renders the default slot content as the button label', () => {
    const wrapper = mount(Button, { slots: { default: 'Send message' } });

    expect(wrapper.text()).toContain('Send message');
  });

  it('renders the label through the Text component with the cta variant', () => {
    const wrapper = mount(Button, { slots: { default: 'Send message' } });

    const label = wrapper.get('.a-text');

    expect(label.classes()).toContain('-cta');
    expect(label.text()).toBe('Send message');
  });

  it('does not render an Icon component when icon prop is not provided', () => {
    const wrapper = mount(Button, { slots: { default: 'Submit' } });

    expect(wrapper.find('.a-icon').exists()).toBe(false);
  });

  it('renders the Icon component with the given icon name when icon prop is provided', () => {
    const wrapper = mount(Button, {
      props: { icon: 'check' },
      slots: { default: 'Submit' },
    });

    expect(wrapper.get('svg.a-icon use').attributes('href')).toBe('#check');
  });

  it('renders the icon after the label by default', () => {
    const wrapper = mount(Button, {
      props: { icon: 'check' },
      slots: { default: 'Submit' },
    });

    const nodes = wrapper.element.querySelectorAll('.a-text, .a-icon');

    expect(nodes[0].classList.contains('a-text')).toBe(true);
    expect(nodes[1].classList.contains('a-icon')).toBe(true);
  });

  it('renders the icon before the label when iconPosition is before', () => {
    const wrapper = mount(Button, {
      props: { icon: 'check', iconPosition: 'before' },
      slots: { default: 'Submit' },
    });

    const nodes = wrapper.element.querySelectorAll('.a-text, .a-icon');

    expect(nodes[0].classList.contains('a-icon')).toBe(true);
    expect(nodes[1].classList.contains('a-text')).toBe(true);
  });

  it('resolves to a button element when tag is unset and type is button (retro-compat)', () => {
    const wrapper = mount(Button, { slots: { default: 'Submit' } });

    expect(wrapper.element.tagName).toBe('BUTTON');
  });

  it('resolves to an anchor element when tag is unset and type is link (retro-compat)', () => {
    const wrapper = mount(Button, {
      props: { type: 'link', href: '/contact' },
      slots: { default: 'Contact' },
    });

    expect(wrapper.element.tagName).toBe('A');
  });

  it('renders the given tag when tag is provided, overriding the type-based default', () => {
    const wrapper = mount(Button, {
      props: { tag: 'a', type: 'button' },
      slots: { default: 'Link-like' },
    });

    expect(wrapper.element.tagName).toBe('A');
  });

  it('renders a span with no type, href or disabled attribute when tag is span', () => {
    const wrapper = mount(Button, {
      props: { tag: 'span', href: '/contact', disabled: true },
      slots: { default: 'Static CTA' },
    });

    expect(wrapper.element.tagName).toBe('SPAN');
    expect(wrapper.attributes('type')).toBeUndefined();
    expect(wrapper.attributes('href')).toBeUndefined();
    expect(wrapper.attributes('disabled')).toBeUndefined();
  });
});
