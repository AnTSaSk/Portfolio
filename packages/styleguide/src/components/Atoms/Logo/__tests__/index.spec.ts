import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import Logo from '@/components/Atoms/Logo/index.vue';

describe('Logo', () => {
  it('renders an svg.a-logo root element with viewBox 0 0 155 143', () => {
    const wrapper = mount(Logo);
    const svg = wrapper.find('svg.a-logo');

    expect(svg.exists()).toBe(true);
    expect(svg.attributes('viewBox')).toBe('0 0 155 143');
  });

  it('renders exactly 3 paths, one of them filled with currentColor', () => {
    const wrapper = mount(Logo);
    const paths = wrapper.findAll('path');

    expect(paths).toHaveLength(3);
    expect(
      paths.filter((path) => path.attributes('fill') === 'currentColor'),
    ).toHaveLength(1);
  });

  it('is aria-hidden when no label is provided (decorative default)', () => {
    const wrapper = mount(Logo);
    const svg = wrapper.find('svg.a-logo');

    expect(svg.attributes('aria-hidden')).toBe('true');
    expect(svg.attributes('role')).toBeUndefined();
  });

  it('exposes role=img and aria-label when label is provided', () => {
    const wrapper = mount(Logo, { props: { label: 'Alexis Besson' } });
    const svg = wrapper.find('svg.a-logo');

    expect(svg.attributes('role')).toBe('img');
    expect(svg.attributes('aria-label')).toBe('Alexis Besson');
    expect(svg.attributes('aria-hidden')).toBeUndefined();
  });

  it('generates gradient ids that differ between two separately mounted instances', () => {
    const first = mount(Logo);
    const second = mount(Logo);

    const firstIds = first
      .findAll('linearGradient')
      .map((gradient) => gradient.attributes('id'));
    const secondIds = second
      .findAll('linearGradient')
      .map((gradient) => gradient.attributes('id'));

    expect(firstIds).toHaveLength(2);
    expect(secondIds).toHaveLength(2);
    firstIds.forEach((id) => {
      expect(secondIds).not.toContain(id);
    });
  });

  it('references gradient fills that resolve to ids present in the mounted defs', () => {
    const wrapper = mount(Logo);

    const definedIds = wrapper
      .findAll('linearGradient')
      .map((gradient) => gradient.attributes('id'));
    const gradientFills = wrapper
      .findAll('path')
      .map((path) => path.attributes('fill'))
      .filter((fill): fill is string => !!fill && fill.startsWith('url(#'));

    expect(gradientFills).toHaveLength(2);
    gradientFills.forEach((fill) => {
      const referencedId = fill.slice('url(#'.length, -1);

      expect(definedIds).toContain(referencedId);
    });
  });
});
