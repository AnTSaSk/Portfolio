import type { Variant } from './index.vue';
import type { Meta, StoryObj } from '@storybook/vue3-vite';

import Component from './index';

const meta = {
  title: 'Design System/Atoms/Paragraph',
  component: Component,
  tags: ['autodocs'],
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

const text = 'Lead Front-end Developer';

const paragraphStory = (variant: Variant): Story => ({
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

export const Body1SemiBold: Story = paragraphStory('b1SemiBold');

export const Body1Medium: Story = paragraphStory('b1Medium');

export const Body1Regular: Story = paragraphStory('b1Regular');

export const Body2SemiBold: Story = paragraphStory('b2SemiBold');

export const Body2Medium: Story = paragraphStory('b2Medium');

export const Body2Regular: Story = paragraphStory('b2Regular');

export const Body3SemiBold: Story = paragraphStory('b3SemiBold');

export const Body3Medium: Story = paragraphStory('b3Medium');

export const Body3Regular: Story = paragraphStory('b3Regular');
