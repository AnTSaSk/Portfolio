import type { Meta, StoryObj } from '@storybook/vue3-vite';

import Logo from './index.vue';

const meta = {
  title: 'Design System/Atoms/Logo',
  component: Logo,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    label: { control: 'text' },
    title: { control: 'text' },
  },
} satisfies Meta<typeof Logo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: { Logo },
    setup: () => ({ args }),
    template: `<div style="width: 92px; color: var(--logo-fg);"><Logo v-bind="args" /></div>`,
  }),
};
