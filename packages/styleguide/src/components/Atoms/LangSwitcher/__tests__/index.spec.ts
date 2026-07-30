import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import LangSwitcher from '../index.vue';

describe('LangSwitcher', () => {
  it('renders a button element with type="button" and the a-langSwitcher class', () => {
    const wrapper = mount(LangSwitcher, { props: { locale: 'en' } });

    expect(wrapper.element.tagName).toBe('BUTTON');
    expect(wrapper.attributes('type')).toBe('button');
    expect(wrapper.classes()).toContain('a-langSwitcher');
  });

  it('renders the current locale (EN flag + code) and a switch-to-French aria-label when locale is en', () => {
    const wrapper = mount(LangSwitcher, { props: { locale: 'en' } });

    expect(wrapper.text()).toContain('🇬🇧');
    expect(wrapper.text()).toContain('EN');
    expect(wrapper.attributes('aria-label')).toBe('Switch to French');
  });

  it('renders the current locale (FR flag + code) and a switch-to-English aria-label when locale is fr', () => {
    const wrapper = mount(LangSwitcher, { props: { locale: 'fr' } });

    expect(wrapper.text()).toContain('🇫🇷');
    expect(wrapper.text()).toContain('FR');
    expect(wrapper.attributes('aria-label')).toBe('Switch to English');
  });

  it('marks the flag as aria-hidden', () => {
    const wrapper = mount(LangSwitcher, { props: { locale: 'en' } });

    const flag = wrapper.get('[aria-hidden="true"]');

    expect(flag.text()).toBe('🇬🇧');
  });

  it('emits change with the target locale "fr" when locale is en and the button is clicked', async () => {
    const wrapper = mount(LangSwitcher, { props: { locale: 'en' } });

    await wrapper.trigger('click');

    expect(wrapper.emitted('change')).toEqual([['fr']]);
  });

  it('emits change with the target locale "en" when locale is fr and the button is clicked', async () => {
    const wrapper = mount(LangSwitcher, { props: { locale: 'fr' } });

    await wrapper.trigger('click');

    expect(wrapper.emitted('change')).toEqual([['en']]);
  });

  it('renders the current locale code through the Text component with the eyebrow variant', () => {
    const wrapper = mount(LangSwitcher, { props: { locale: 'en' } });

    const label = wrapper.get('.a-text');

    expect(label.classes()).toContain('-eyebrow');
    expect(label.text()).toBe('EN');
  });
});
