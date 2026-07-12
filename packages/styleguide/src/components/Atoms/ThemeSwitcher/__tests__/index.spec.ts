import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import ThemeSwitcher from '@/components/Atoms/ThemeSwitcher/index.vue';

describe('ThemeSwitcher', () => {
  it('renders a button element with type="button" and the base class', () => {
    const wrapper = mount(ThemeSwitcher, { props: { theme: 'light' } });

    expect(wrapper.element.tagName).toBe('BUTTON');
    expect(wrapper.attributes('type')).toBe('button');
    expect(wrapper.classes()).toContain('a-themeSwitcher');
  });

  it('applies the -square shape class by default', () => {
    const wrapper = mount(ThemeSwitcher, { props: { theme: 'light' } });

    expect(wrapper.classes()).toContain('-square');
    expect(wrapper.classes()).not.toContain('-circle');
  });

  it('applies the -circle shape class when shape is circle', () => {
    const wrapper = mount(ThemeSwitcher, {
      props: { theme: 'light', shape: 'circle' },
    });

    expect(wrapper.classes()).toContain('-circle');
    expect(wrapper.classes()).not.toContain('-square');
  });

  it('renders the "Switch to dark" aria-label when theme is light', () => {
    const wrapper = mount(ThemeSwitcher, { props: { theme: 'light' } });

    expect(wrapper.attributes('aria-label')).toBe('Switch to dark');
  });

  it('renders the "Switch to light" aria-label when theme is dark', () => {
    const wrapper = mount(ThemeSwitcher, { props: { theme: 'dark' } });

    expect(wrapper.attributes('aria-label')).toBe('Switch to light');
  });

  // AC-COMP-1: ThemeSwitcher composes the Icon atom instead of an inline hand-rolled svg.
  it('composes an Icon atom and renders no bespoke inline svg', () => {
    const wrapper = mount(ThemeSwitcher, { props: { theme: 'light' } });

    expect(wrapper.findComponent({ name: 'AtomIcon' }).exists()).toBe(true);
    expect(wrapper.find('svg:not(.a-icon)').exists()).toBe(false);
  });

  // AC-ATOM-3: P04 semantics — light scheme affords switching to dark via the moon glyph.
  it('passes the moon icon name in stroke mode when theme is light', () => {
    const wrapper = mount(ThemeSwitcher, { props: { theme: 'light' } });
    const icon = wrapper.findComponent({ name: 'AtomIcon' });

    expect(icon.props('name')).toBe('moon');
    expect(icon.props('stroke')).toBe(true);
  });

  // AC-ATOM-3: dark scheme affords switching to light via the sun glyph.
  it('passes the sun icon name in stroke mode when theme is dark', () => {
    const wrapper = mount(ThemeSwitcher, { props: { theme: 'dark' } });
    const icon = wrapper.findComponent({ name: 'AtomIcon' });

    expect(icon.props('name')).toBe('sun');
    expect(icon.props('stroke')).toBe(true);
  });

  it('applies the -active class and aria-pressed="true" when pressed is true', () => {
    const wrapper = mount(ThemeSwitcher, {
      props: { theme: 'light', pressed: true },
    });

    expect(wrapper.classes()).toContain('-active');
    expect(wrapper.attributes('aria-pressed')).toBe('true');
  });

  it('sets the disabled attribute and aria-disabled when disabled is true', () => {
    const wrapper = mount(ThemeSwitcher, {
      props: { theme: 'light', disabled: true },
    });

    expect(wrapper.attributes('disabled')).toBeDefined();
    expect(wrapper.attributes('aria-disabled')).toBe('true');
  });

  it('emits toggle when clicked', async () => {
    const wrapper = mount(ThemeSwitcher, { props: { theme: 'light' } });

    await wrapper.trigger('click');

    expect(wrapper.emitted('toggle')).toHaveLength(1);
  });
});
