import type { Meta, StoryObj } from '@storybook/vue3-vite';

import CardProject from './index.vue';
import { VALHALLA } from '../../__fixtures__/content';

const cover = VALHALLA.cover.src;

const meta: Meta<typeof CardProject> = {
  title: 'Design System/Molecules/CardProject',
  component: CardProject,
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
    placeholderVariant: {
      control: 'inline-radio',
      options: [undefined, '-topRight', '-bottom'],
    },
  },
  args: {
    href: '/projects/design-system',
    title: 'Design System',
    meta: '2024 · Front-end architecture · DX',
    stack: ['Vue', 'TypeScript', 'Vite'],
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const template = `<div style="max-width:400px;"><CardProject v-bind="args" /></div>`;

export const Placeholder: Story = {
  render: (args) => ({
    components: { CardProject },
    setup: () => ({ args }),
    template,
  }),
};

export const WithImage: Story = {
  args: {
    image: { src: cover, alt: 'Design system components on a dark canvas' },
  },
  render: (args) => ({
    components: { CardProject },
    setup: () => ({ args }),
    template,
  }),
};

export const WithDesc: Story = {
  args: {
    image: { src: cover, alt: 'Design system components on a dark canvas' },
    desc: 'A tokenized component library shared across the product suite.',
  },
  render: (args) => ({
    components: { CardProject },
    setup: () => ({ args }),
    template,
  }),
};

export const Light: Story = {
  globals: {
    theme: 'light',
  },
  args: {
    image: { src: cover, alt: 'Design system components on a dark canvas' },
    desc: 'A tokenized component library shared across the product suite.',
  },
  render: (args) => ({
    components: { CardProject },
    setup: () => ({ args }),
    template,
  }),
};

export const Dark: Story = {
  globals: {
    theme: 'dark',
  },
  args: {
    image: { src: cover, alt: 'Design system components on a dark canvas' },
    desc: 'A tokenized component library shared across the product suite.',
  },
  render: (args) => ({
    components: { CardProject },
    setup: () => ({ args }),
    template,
  }),
};
