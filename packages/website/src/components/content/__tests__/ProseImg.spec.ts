import { mount, type VueWrapper } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { defineComponent } from 'vue';

import ProseImg from '../ProseImg.vue';

const NuxtImgStub = defineComponent({
  name: 'NuxtImg',
  props: {
    src: { type: String, default: '' },
    alt: { type: String, default: '' },
    width: { type: [String, Number], default: undefined },
    height: { type: [String, Number], default: undefined },
    sizes: { type: String, default: undefined },
    format: { type: String, default: undefined },
    loading: { type: String, default: undefined },
  },
  template: '<img />',
});

interface ProseImgProps {
  src: string;
  alt?: string;
  width?: string | number;
  height?: string | number;
}

const mountProseImg = (props: ProseImgProps): VueWrapper =>
  mount(ProseImg, {
    props,
    global: { components: { NuxtImg: NuxtImgStub } },
  });

describe('components/content/ProseImg.vue', () => {
  it('delegates to NuxtImg with the prose emplacement responsive attributes', () => {
    const wrapper = mountProseImg({
      src: '/img/Blog/N0_OldLanding.png',
      alt: 'Ancienne landing',
      width: 1732,
      height: 1000,
    });
    const img = wrapper.findComponent(NuxtImgStub);

    expect(img.exists()).toBe(true);
    expect(img.props()).toMatchObject({
      src: '/img/Blog/N0_OldLanding.png',
      alt: 'Ancienne landing',
      width: 1732,
      height: 1000,
      sizes: '100vw md:65vw xl:600px',
      format: 'avif,webp',
      loading: 'lazy',
    });
  });

  it('renders with src alone (optional alt and dimensions)', () => {
    const wrapper = mountProseImg({ src: '/img/Blog/N0_OldLanding.png' });
    const img = wrapper.findComponent(NuxtImgStub);

    expect(img.props('src')).toBe('/img/Blog/N0_OldLanding.png');
    expect(img.props('alt')).toBe('');
  });
});
