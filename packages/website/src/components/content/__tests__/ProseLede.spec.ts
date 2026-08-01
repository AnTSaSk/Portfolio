import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import ProseLede from '../ProseLede.vue';

describe('components/content/ProseLede.vue', () => {
  it('renders a paragraph carrying the -lede role modifier', () => {
    const wrapper = mount(ProseLede);
    const root = wrapper.element as HTMLElement;

    expect(root.tagName).toBe('P');
    expect(wrapper.classes()).toContain('-lede');
  });

  it('projects its slot content', () => {
    const wrapper = mount(ProseLede, {
      slots: { default: 'Opening line.' },
    });

    expect(wrapper.text()).toBe('Opening line.');
  });
});
