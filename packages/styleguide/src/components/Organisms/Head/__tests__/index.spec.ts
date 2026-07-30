import { mount, type VueWrapper } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import Heading from '../../../Atoms/Heading/index.vue';
import Link from '../../../Atoms/Link/index.vue';
import Tag from '../../../Atoms/Tag/index.vue';
import Text from '../../../Atoms/Text/index.vue';
import Head from '../index.vue';

const listingProps = {
  variant: 'listing' as const,
  eyebrow: 'Notes sur le métier',
  title: 'Blog',
  lede: 'Notes sur la pratique front-end, les design systems, et les petites décisions éditoriales inscrites dans les interfaces.',
};

const articleProps = {
  variant: 'article' as const,
  title: 'On design systems as tools, not products',
  lede: 'A design system is most useful when it disappears into the work. A short note on the difference between scaffolding and a finished object.',
  backHref: 'blog.html',
  backLabel: 'Le blog',
  tags: ['design-systems', 'practice'],
  metaDate: '12 AVR. 2026',
  metaDuration: '9 min de lecture',
};

describe('Head (variant prop / root structure)', () => {
  it('mounts .o-head with the .-listing modifier for variant="listing"', () => {
    const wrapper = mount(Head, { props: listingProps });

    expect(wrapper.classes()).toContain('o-head');
    expect(wrapper.classes()).toContain('-listing');
  });

  it('mounts .o-head with the .-article modifier for variant="article"', () => {
    const wrapper = mount(Head, { props: articleProps });

    expect(wrapper.classes()).toContain('o-head');
    expect(wrapper.classes()).toContain('-article');
  });
});

describe('Head (listing variant structure)', () => {
  it('composes the eyebrow via the Text atom (-eyebrow, accent tone)', () => {
    const wrapper = mount(Head, { props: listingProps });
    const eyebrow = wrapper
      .findAllComponents(Text)
      .find(
        (t: VueWrapper<InstanceType<typeof Text>>) =>
          t.props('variant') === 'eyebrow',
      );

    expect(eyebrow?.exists()).toBe(true);
    expect(eyebrow?.props('tone')).toBe('accent');
    expect(eyebrow?.text()).toBe(listingProps.eyebrow);
  });

  it('composes the title via a Heading atom rendered as h1', () => {
    const wrapper = mount(Head, { props: listingProps });
    const headings = wrapper.findAllComponents(Heading);
    const titleHeading = headings.find((h) => h.element.tagName === 'H1');

    expect(titleHeading?.exists()).toBe(true);
    expect(titleHeading?.text()).toBe(listingProps.title);
  });

  it('composes the lede via the Text atom (-lede variant, as-is)', () => {
    const wrapper = mount(Head, { props: listingProps });
    const lede = wrapper
      .findAllComponents(Text)
      .find(
        (t: VueWrapper<InstanceType<typeof Text>>) =>
          t.props('variant') === 'lede',
      );

    expect(lede?.exists()).toBe(true);
    expect(lede?.text()).toBe(listingProps.lede);
  });

  it('renders no back link, tags, or meta block on the listing variant', () => {
    const wrapper = mount(Head, { props: listingProps });

    expect(wrapper.findComponent(Link).exists()).toBe(false);
    expect(wrapper.find('.o-head__tags').exists()).toBe(false);
    expect(wrapper.find('.o-head__meta').exists()).toBe(false);
  });
});

describe('Head (article variant structure)', () => {
  it('composes the back link via the Link atom (variant="arrow", arrowPosition="before")', () => {
    const wrapper = mount(Head, { props: articleProps });
    const link = wrapper.findComponent(Link);

    expect(link.exists()).toBe(true);
    expect(link.props('variant')).toBe('arrow');
    expect(link.props('arrowPosition')).toBe('before');
    expect(link.props('href')).toBe(articleProps.backHref);
    expect(link.text()).toContain(articleProps.backLabel);
    expect(link.element.tagName).toBe('A');

    const backLabelText = link.findComponent(Text);

    expect(backLabelText.exists()).toBe(true);
    expect(backLabelText.props('variant')).toBe('eyebrow');
    expect(backLabelText.text()).toBe(articleProps.backLabel);
  });

  it('composes one Tag atom per tag entry, in the .o-head__tags block', () => {
    const wrapper = mount(Head, { props: articleProps });
    const tagsBlock = wrapper.find('.o-head__tags');
    const tagAtoms = tagsBlock.findAllComponents(Tag);

    expect(tagsBlock.exists()).toBe(true);
    expect(tagAtoms).toHaveLength(articleProps.tags.length);
    tagAtoms.forEach(
      (tag: VueWrapper<InstanceType<typeof Tag>>, index: number) => {
        expect(tag.props('variant')).toBeUndefined();
        expect(tag.text()).toBe(articleProps.tags[index]);
      },
    );
  });

  it('composes the title via a Heading atom rendered as h1', () => {
    const wrapper = mount(Head, { props: articleProps });
    const headings = wrapper.findAllComponents(Heading);
    const titleHeading = headings.find((h) => h.element.tagName === 'H1');

    expect(titleHeading?.exists()).toBe(true);
    expect(titleHeading?.text()).toBe(articleProps.title);
  });

  it('composes the lede via the Text atom (-lede variant)', () => {
    const wrapper = mount(Head, { props: articleProps });
    const lede = wrapper
      .findAllComponents(Text)
      .find(
        (t: VueWrapper<InstanceType<typeof Text>>) =>
          t.props('variant') === 'lede',
      );

    expect(lede?.exists()).toBe(true);
    expect(lede?.text()).toBe(articleProps.lede);
  });

  it('composes the meta as two separate -tag Text spans (date, duration) with no separator', () => {
    const wrapper = mount(Head, { props: articleProps });
    const metaBlock = wrapper.find('.o-head__meta');
    const metaTexts = metaBlock.findAllComponents(Text);

    expect(metaBlock.exists()).toBe(true);
    expect(metaTexts).toHaveLength(2);
    expect(metaTexts[0].props('variant')).toBe('tag');
    expect(metaTexts[1].props('variant')).toBe('tag');
    expect(metaTexts[0].text()).toBe(articleProps.metaDate);
    expect(metaTexts[1].text()).toBe(articleProps.metaDuration);
  });

  it('omits the meta block when metaDate/metaDuration are not provided', () => {
    const wrapper = mount(Head, {
      props: { ...articleProps, metaDate: undefined, metaDuration: undefined },
    });

    expect(wrapper.find('.o-head__meta').exists()).toBe(false);
  });

  it('renders no section eyebrow on the article variant', () => {
    // The article variant has no section eyebrow (listing-only). The back
    // link label also uses variant="eyebrow" (o-head__backLabel), so it must
    // be excluded here to avoid a false positive on that unrelated Text atom.
    const wrapper = mount(Head, { props: articleProps });
    const sectionEyebrow = wrapper
      .findAllComponents(Text)
      .find(
        (t: VueWrapper<InstanceType<typeof Text>>) =>
          t.props('variant') === 'eyebrow' &&
          !t.classes().includes('o-head__backLabel'),
      );

    expect(sectionEyebrow?.exists()).toBeFalsy();
  });
});

describe('Head (organism exception: lede override stays Text-composed)', () => {
  it('keeps the article lede composed via the Text atom despite the organism size/line-height override', () => {
    const wrapper = mount(Head, { props: articleProps });
    const lede = wrapper
      .findAllComponents(Text)
      .find(
        (t: VueWrapper<InstanceType<typeof Text>>) =>
          t.props('variant') === 'lede',
      );

    expect(lede?.exists()).toBe(true);
  });
});

describe('Head (a11y)', () => {
  it('renders the title in a semantic h1 heading', () => {
    const wrapper = mount(Head, { props: articleProps });
    const headings = wrapper.findAllComponents(Heading);
    const titleHeading = headings.find((h) => h.element.tagName === 'H1');

    expect(titleHeading?.exists()).toBe(true);
  });

  it('renders the back link as a real, accessible <a> element', () => {
    const wrapper = mount(Head, { props: articleProps });
    const link = wrapper.findComponent(Link);

    expect(link.element.tagName).toBe('A');
    expect(link.text().trim().length).toBeGreaterThan(0);
  });
});
