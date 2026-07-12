import type { Meta, StoryObj } from '@storybook/vue3-vite';

import Watermark from './index.vue';

const meta = {
  title: 'Design System/Atoms/Watermark',
  component: Watermark,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    text: { control: 'text' },
  },
  args: {
    text: 'antsask/alexis besson',
  },
} satisfies Meta<typeof Watermark>;

export default meta;
type Story = StoryObj<typeof meta>;

// Demo-only wrapper: 105vw centered and clipped, showing the full-bleed
// placement a parent (e.g. o-hero) applies around the intrinsic atom.
const fullBleedTemplate =
  '<div style="width: 105vw; margin-left: calc(50% - 52.5vw); overflow: hidden;"><Watermark v-bind="args" /></div>';

export const Default: Story = {
  parameters: {
    layout: 'fullscreen',
  },
  render: (args) => ({
    components: { Watermark },
    setup: () => ({ args }),
    template: fullBleedTemplate,
  }),
};

export const Light: Story = {
  globals: {
    theme: 'light',
  },
  parameters: {
    layout: 'fullscreen',
  },
  render: (args) => ({
    components: { Watermark },
    setup: () => ({ args }),
    template: fullBleedTemplate,
  }),
};

export const Dark: Story = {
  globals: {
    theme: 'dark',
  },
  parameters: {
    layout: 'fullscreen',
  },
  render: (args) => ({
    components: { Watermark },
    setup: () => ({ args }),
    template: fullBleedTemplate,
  }),
};
