import type { Meta, StoryObj } from '@storybook/vue3-vite';

import Heading from './index.vue';

const meta: Meta<typeof Heading> = {
  title: 'Design System/Atoms/Heading',
  component: Heading,
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
    level: {
      control: 'inline-radio',
      options: ['h1', 'h2', 'h3', 'h4', 'h5'],
    },
    tag: {
      control: 'select',
      options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'a'],
    },
    tone: {
      control: 'inline-radio',
      options: ['default', 'muted', 'accent'],
    },
    uppercase: { control: 'boolean' },
    balance: { control: 'boolean' },
  },
  args: {
    level: 'h2',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: { Heading },
    setup: () => ({ args }),
    template: `<Heading v-bind="args">Section title</Heading>`,
  }),
};

export const Levels: Story = {
  render: (args) => ({
    components: { Heading },
    setup: () => ({ args }),
    template: `
      <div style="display:flex;flex-direction:column;gap:16px;">
        <Heading v-bind="args" level="h1">Heading level 1</Heading>
        <Heading v-bind="args" level="h2">Heading level 2</Heading>
        <Heading v-bind="args" level="h3">Heading level 3</Heading>
        <Heading v-bind="args" level="h4">Heading level 4</Heading>
        <Heading v-bind="args" level="h5">Heading level 5</Heading>
      </div>
    `,
  }),
};

export const Tones: Story = {
  render: (args) => ({
    components: { Heading },
    setup: () => ({ args }),
    template: `
      <div style="display:flex;flex-direction:column;gap:16px;">
        <Heading v-bind="args" tone="default">Default tone</Heading>
        <Heading v-bind="args" tone="muted">Muted tone</Heading>
        <Heading v-bind="args" tone="accent">Accent tone</Heading>
      </div>
    `,
  }),
};

export const Uppercase: Story = {
  args: { uppercase: true },
  render: (args) => ({
    components: { Heading },
    setup: () => ({ args }),
    template: `<Heading v-bind="args">Uppercase heading</Heading>`,
  }),
};
