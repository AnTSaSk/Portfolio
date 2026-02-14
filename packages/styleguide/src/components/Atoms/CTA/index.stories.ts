import type { Meta, StoryObj } from '@storybook/vue3-vite';

import Component from './index.vue';
import { SideBySide } from '../../../../.storybook/decorator';

const meta = {
  title: 'Design System/Atoms/CTA',
  component: Component,
  tags: ['autodocs'],
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Main: Story = {
  args: {
    variant: 'main',
    // @ts-expect-error 'content' is a custom arg for slot rendering
    content: 'Contact me',
  },
  render: (args) => ({
    components: { Component },
    setup() {
      return { args };
    },
    template: `<Component v-bind="args">
    {{ args.content }}
  </Component>`,
  }),
};

export const MainDisabled: Story = {
  args: { ...Main.args, disabled: true },
  render: Main.render,
};

export const Text: Story = {
  args: {
    variant: 'text',
    // @ts-expect-error 'content' is a custom arg for slot rendering
    content: 'Contact me',
  },
  decorators: [SideBySide],
  render: Main.render,
};

export const TextDisabled: Story = {
  args: { ...Text.args, disabled: true },
  decorators: [SideBySide],
  render: Main.render,
};
