import type { Variant } from './index.vue';
import type { Meta, StoryObj } from '@storybook/vue3-vite';

import Component from './index';

const meta = {
  title: 'Design System/Atoms/Heading',
  component: Component,
  tags: ['autodocs'],
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

const text = 'I\u2019m Alexis Besson';

const headingStory = (variant: Variant): Story => ({
  args: {
    variant,
    // @ts-expect-error 'content' is a custom arg for slot rendering
    content: text,
  },
  render: (args) => ({
    components: { Component },
    setup() {
      return { args };
    },
    template: `<Component :variant="args.variant" :tag="args.tag">
    {{ args.content }}
  </Component>`,
  }),
});

export const Heading1Regular: Story = headingStory('h1-regular');

export const Heading2Regular: Story = headingStory('h2-regular');

export const Heading3Medium: Story = headingStory('h3-medium');

export const Heading4Semibold: Story = headingStory('h4-semibold');

export const Heading5Semibold: Story = headingStory('h5-semibold');
