import type { Meta, StoryObj } from '@storybook/vue3-vite';

import Icon from './index.vue';

const meta: Meta<typeof Icon> = {
  title: 'Design System/Atoms/Icon',
  component: Icon,
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
    name: {
      control: 'select',
      options: [
        'github',
        'linkedin',
        'x',
        'arrow-right',
        'arrow-up-right',
        'moon',
        'sun',
      ],
    },
    size: {
      control: 'inline-radio',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    label: { control: 'text' },
    stroke: { control: 'boolean' },
  },
  args: {
    name: 'arrow-right',
    size: 'md',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Meaningful: Story = {
  args: { name: 'arrow-up-right', label: 'Open in a new tab' },
};

export const Stroke: Story = {
  args: { name: 'moon', stroke: true },
};
