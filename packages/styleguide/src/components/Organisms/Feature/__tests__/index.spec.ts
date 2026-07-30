import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { defineComponent, h, markRaw } from 'vue';

import Heading from '../../../Atoms/Heading/index.vue';
import Image from '../../../Atoms/Image/index.vue';
import Link from '../../../Atoms/Link/index.vue';
import Tag from '../../../Atoms/Tag/index.vue';
import Text from '../../../Atoms/Text/index.vue';
import Feature from '../index.vue';

const baseProps = {
  href: 'project.html',
  label: 'À la une',
  meta: '2025 · Lead front-end · design systems',
  title: 'Aurora Design System',
  lead: 'A token-driven component library. Designed for product teams that ship across surfaces, dark and light, with strong type and motion language.',
  stack: ['Vue 3', 'Nuxt 4', 'TypeScript', 'Storybook', 'Sass'],
  ctaLabel: 'Voir le projet',
};

describe('Feature (structure, root link, body/cover split)', () => {
  it('renders a root <a> with the o-feature class and the href prop', () => {
    const wrapper = mount(Feature, { props: baseProps });

    expect(wrapper.element.tagName).toBe('A');
    expect(wrapper.classes()).toContain('o-feature');
    expect(wrapper.attributes('href')).toBe(baseProps.href);
  });

  it('composes .o-feature__body then .o-feature__cover as the two direct children, in that DOM order', () => {
    const wrapper = mount(Feature, { props: baseProps });
    const children = wrapper.element.children;

    expect(children).toHaveLength(2);
    expect(children[0].classList.contains('o-feature__body')).toBe(true);
    expect(children[1].classList.contains('o-feature__cover')).toBe(true);
  });

  it('orders the body content label, meta, title, lead, stack, cta', () => {
    const wrapper = mount(Feature, { props: baseProps });
    const body = wrapper.find('.o-feature__body').element;
    const classOrder = Array.from(body.children).map((el) =>
      Array.from(el.classList).find((c) => c.startsWith('o-feature__')),
    );

    expect(classOrder).toEqual([
      'o-feature__label',
      'o-feature__meta',
      'o-feature__title',
      'o-feature__lead',
      'o-feature__stack',
      'o-feature__cta',
    ]);
  });
});

describe('Feature (structure, atom composition)', () => {
  it('composes the label via a Text atom with the eyebrow variant', () => {
    const wrapper = mount(Feature, { props: baseProps });
    const label = wrapper.find('.o-feature__label').findComponent(Text);

    expect(label.exists()).toBe(true);
    expect(label.props('variant')).toBe('eyebrow');
    expect(label.text()).toBe(baseProps.label);
  });

  it('composes the meta via a Text atom with the tag variant', () => {
    const wrapper = mount(Feature, { props: baseProps });
    const meta = wrapper.find('.o-feature__meta').findComponent(Text);

    expect(meta.exists()).toBe(true);
    expect(meta.props('variant')).toBe('tag');
    expect(meta.text()).toBe(baseProps.meta);
  });

  it('composes the title via a Heading atom rendered as an uppercase h2', () => {
    const wrapper = mount(Feature, { props: baseProps });
    const title = wrapper.find('.o-feature__title').findComponent(Heading);

    expect(title.exists()).toBe(true);
    expect(title.element.tagName).toBe('H2');
    expect(title.classes()).toContain('-uppercase');
    expect(title.text()).toBe(baseProps.title);
  });

  it('composes the lead via a Text atom with the lede variant', () => {
    const wrapper = mount(Feature, { props: baseProps });
    const lead = wrapper.find('.o-feature__lead').findComponent(Text);

    expect(lead.exists()).toBe(true);
    expect(lead.props('variant')).toBe('lede');
    expect(lead.text()).toBe(baseProps.lead);
  });

  it('composes one strong Tag atom per stack entry inside a .o-feature__stack list', () => {
    const wrapper = mount(Feature, { props: baseProps });
    const list = wrapper.find('ul.o-feature__stack');

    expect(list.exists()).toBe(true);

    const items = list.findAll('li');

    expect(items).toHaveLength(baseProps.stack.length);

    baseProps.stack.forEach((label, index) => {
      const tag = items[index].findComponent(Tag);

      expect(tag.exists()).toBe(true);
      expect(tag.classes()).toContain('-strong');
      expect(tag.text()).toBe(label);
    });
  });

  it('composes the cta as a non-anchor Link -arrow (tag span) inside the card link, not a reinvented span', () => {
    const wrapper = mount(Feature, { props: baseProps });
    const cta = wrapper.findComponent(Link);

    expect(cta.exists()).toBe(true);
    expect(cta.classes()).toContain('o-feature__cta');
    expect(cta.props('variant')).toBe('arrow');
    expect(cta.props('tag')).toBe('span');
    expect(cta.element.tagName).toBe('SPAN');
    expect(cta.text()).toContain(baseProps.ctaLabel);

    const arrow = cta.find('.a-link__arrow');

    expect(arrow.exists()).toBe(true);
    expect(arrow.text()).toBe('→');
    expect(cta.text().match(/→/g) ?? []).toHaveLength(1);
  });
});

describe('Feature (structure, cover: Image vs u-placeholder)', () => {
  it('composes an Image atom in the cover when the image prop is supplied', () => {
    const wrapper = mount(Feature, {
      props: {
        ...baseProps,
        image: { src: '/cover.jpg', alt: 'Aurora Design System cover' },
      },
    });
    const cover = wrapper.find('.o-feature__cover');
    const img = cover.findComponent(Image);

    expect(img.exists()).toBe(true);
    expect(img.props('src')).toBe('/cover.jpg');
    expect(img.props('alt')).toBe('Aurora Design System cover');
    expect(cover.find('.a-image__frame .u-placeholder').exists()).toBe(true);
  });

  it('falls back to a u-placeholder -big carrying the title when no image prop is supplied', () => {
    const wrapper = mount(Feature, { props: baseProps });
    const cover = wrapper.find('.o-feature__cover');
    const placeholder = cover.find('.u-placeholder');

    expect(placeholder.exists()).toBe(true);
    expect(placeholder.classes()).toContain('-big');
    expect(cover.findComponent(Image).exists()).toBe(false);
    expect(placeholder.text()).toBe(baseProps.title);
  });

  it('keeps the u-placeholder -big backdrop (with title) shown through a failed image', async () => {
    const wrapper = mount(Feature, {
      props: {
        ...baseProps,
        image: { src: '/broken.jpg', alt: 'Broken cover' },
      },
    });
    const cover = wrapper.find('.o-feature__cover');

    expect(cover.findComponent(Image).exists()).toBe(true);

    await cover.find('img.a-image').trigger('error');

    expect(cover.find('img.a-image').exists()).toBe(true);
    expect(cover.find('.a-image__frame').classes()).not.toContain('-revealed');

    const placeholder = cover.find('.a-image__frame .u-placeholder');

    expect(placeholder.exists()).toBe(true);
    expect(placeholder.classes()).toContain('-big');
    expect(placeholder.text()).toBe(baseProps.title);
  });
});

describe('Feature (a11y, single accessible link, no nested interactive elements)', () => {
  it('exposes exactly one <a> element (the root link) with no nested anchor', () => {
    const wrapper = mount(Feature, { props: baseProps });

    expect(wrapper.findAll('a')).toHaveLength(1);
  });

  it('exposes an accessible name via its text content, combining title and cta label', () => {
    const wrapper = mount(Feature, { props: baseProps });
    const accessibleName = wrapper.text();

    expect(accessibleName).toContain(baseProps.title);
    expect(accessibleName).toContain(baseProps.ctaLabel);
  });

  it('relays the injected image component to AtomImage', () => {
    const ImgStub = markRaw(
      defineComponent({
        name: 'ImgStub',
        props: { src: { type: String, required: true } },
        setup: (props) => () => h('img', { src: props.src }),
      }),
    );
    const wrapper = mount(Feature, {
      props: {
        ...baseProps,
        image: { src: '/a.webp', alt: 'A' },
        imageComponent: ImgStub,
      },
    });

    expect(wrapper.findComponent(Image).props('imageComponent')).toBe(ImgStub);
  });
});
