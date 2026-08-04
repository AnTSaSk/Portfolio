import type { Meta, StoryObj } from '@storybook/vue3-vite';

import Image from './index.vue';
import { VALHALLA } from '../../__fixtures__/content';

const astonMartin = VALHALLA.cover.src;
const jaguar = VALHALLA.gallery[1].src;

const meta: Meta<typeof Image> = {
  title: 'Design System/Atoms/Image',
  component: Image,
  parameters: {
    layout: 'fullscreen',
  },
  // Centers stories in the canvas; does not set any background.
  decorators: [
    (story) => ({
      components: { story },
      template: `
        <div style="display:grid;place-items:center;min-height:100vh;">
          <story />
        </div>
      `,
    }),
  ],
  argTypes: {
    src: { control: 'text' },
    alt: { control: 'text' },
    width: { control: 'number' },
    height: { control: 'number' },
    loading: { control: 'inline-radio', options: ['lazy', 'eager'] },
    decoding: { control: 'inline-radio', options: ['async', 'sync', 'auto'] },
    fit: { control: 'inline-radio', options: ['cover', 'contain', 'none'] },
  },
  args: {
    src: astonMartin,
    alt: 'Couverture du projet Valhalla',
    width: 1920,
    height: 1080,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: { Image },
    setup: () => ({ args }),
    template: `
      <div style="aspect-ratio:16/9;">
        <Image v-bind="args" />
      </div>
    `,
  }),
};

export const Eager: Story = {
  args: { loading: 'eager' },
  render: (args) => ({
    components: { Image },
    setup: () => ({ args }),
    template: `
      <div style="aspect-ratio:16/9;">
        <Image v-bind="args" />
      </div>
    `,
  }),
};

export const Contain: Story = {
  args: {
    src: jaguar,
    alt: 'Jaguar Type 00 side profile',
    fit: 'contain',
  },
  render: (args) => ({
    components: { Image },
    setup: () => ({ args }),
    template: `
      <div style="width:640px;height:640px;">
        <Image v-bind="args" />
      </div>
    `,
  }),
};

export const None: Story = {
  args: {
    src: jaguar,
    alt: 'Jaguar Type 00 side profile',
    fit: 'none',
  },
  render: (args) => ({
    components: { Image },
    setup: () => ({ args }),
    template: `
      <div style="width:640px;height:360px;">
        <Image v-bind="args" />
      </div>
    `,
  }),
};

export const WithSources: Story = {
  args: {
    sources: [{ srcset: jaguar, type: 'image/webp' }],
  },
  render: (args) => ({
    components: { Image },
    setup: () => ({ args }),
    template: `
      <div style="aspect-ratio:16/9;">
        <Image v-bind="args" />
      </div>
    `,
  }),
};

export const Reveal: Story = {
  args: {
    reveal: true,
    loading: 'eager',
  },
  render: (args) => ({
    components: { Image },
    setup: () => ({ args }),
    template: `
      <div style="width:480px;aspect-ratio:16/9;">
        <Image v-bind="args">
          <template #placeholder>
            <div class="u-placeholder -bottom"></div>
          </template>
        </Image>
      </div>
    `,
  }),
};
