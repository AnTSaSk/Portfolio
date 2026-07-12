import type { Meta, StoryObj } from '@storybook/vue3-vite';

import Image from './index.vue';

const astonMartin =
  'https://www.astonmartin.com/-/media/partnerships-page/1-lifestyle/breitling/breitling-hero.jpg?mw=1920&rev=-1&hash=9A8D24859B25D6DC03FCA13A639A0E2D';
const jaguar =
  'https://carfans.fr/wp-content/uploads/2024/12/JAGUAR_TYPE00_SIDEPROFILE_16x9_021224.webp';

const meta: Meta<typeof Image> = {
  title: 'Design System/Atoms/Image',
  component: Image,
  tags: ['autodocs'],
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
    alt: 'Aston Martin x Breitling partnership hero shot',
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
