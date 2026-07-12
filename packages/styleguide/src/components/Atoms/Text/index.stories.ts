import type { Meta, StoryObj } from '@storybook/vue3-vite';

import Text from './index.vue';

const meta: Meta<typeof Text> = {
  title: 'Design System/Atoms/Text',
  component: Text,
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
    tag: {
      control: 'select',
      options: ['p', 'span', 'div', 'li', 'dd'],
    },
    variant: {
      control: 'select',
      options: ['body', 'lede', 'bodyS', 'eyebrow', 'cta', 'caption', 'tag'],
    },
    weight: {
      control: 'inline-radio',
      options: ['regular', 'medium', 'semibold'],
    },
    tone: {
      control: 'inline-radio',
      options: ['default', 'muted', 'accent'],
    },
    prose: { control: 'boolean' },
    truncate: { control: 'number' },
  },
  args: {
    variant: 'body',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: { Text },
    setup: () => ({ args }),
    template: `<Text v-bind="args">Body copy sits here to demonstrate the default variant.</Text>`,
  }),
};

export const Variants: Story = {
  render: (args) => ({
    components: { Text },
    setup: () => ({ args }),
    template: `
      <div style="display:flex;flex-direction:column;gap:16px;">
        <Text v-bind="args" variant="lede">Lede copy introduces a section with impact.</Text>
        <Text v-bind="args" variant="body">Body copy is the default reading text.</Text>
        <Text v-bind="args" variant="bodyS">BodyS copy shares the body size for semantic distinction.</Text>
        <Text v-bind="args" variant="eyebrow" tag="span">Eyebrow label</Text>
        <Text v-bind="args" variant="cta" tag="span">Call to action label</Text>
        <Text v-bind="args" variant="caption">Caption copy for supporting detail.</Text>
        <Text v-bind="args" variant="tag" tag="span">Tag label</Text>
      </div>
    `,
  }),
};

export const Weights: Story = {
  render: (args) => ({
    components: { Text },
    setup: () => ({ args }),
    template: `
      <div style="display:flex;flex-direction:column;gap:16px;">
        <Text v-bind="args" weight="regular">Regular weight</Text>
        <Text v-bind="args" weight="medium">Medium weight</Text>
        <Text v-bind="args" weight="semibold">Semibold weight</Text>
      </div>
    `,
  }),
};

export const Tones: Story = {
  render: (args) => ({
    components: { Text },
    setup: () => ({ args }),
    template: `
      <div style="display:flex;flex-direction:column;gap:16px;">
        <Text v-bind="args" tone="default">Default tone</Text>
        <Text v-bind="args" tone="muted">Muted tone</Text>
        <Text v-bind="args" tone="accent">Accent tone</Text>
      </div>
    `,
  }),
};

export const Prose: Story = {
  args: { prose: true },
  render: (args) => ({
    components: { Text },
    setup: () => ({ args }),
    template: `<Text v-bind="args">Prose copy constrains its measure to 56 characters for comfortable reading across long paragraphs, regardless of the container width.</Text>`,
  }),
};

export const Truncate: Story = {
  args: { truncate: 2 },
  render: (args) => ({
    components: { Text },
    setup: () => ({ args }),
    template: `<Text v-bind="args" style="max-width: 320px;">Truncated copy clamps after a fixed number of lines and hides the overflow with an ellipsis so long content does not break the layout.</Text>`,
  }),
};
