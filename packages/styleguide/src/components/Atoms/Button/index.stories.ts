import type { Meta, StoryObj } from '@storybook/vue3-vite';

import Button from './index.vue';

const meta = {
  title: 'Design System/Atoms/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['primary', 'ghost'],
    },
    type: {
      control: 'inline-radio',
      options: ['button', 'submit', 'link'],
    },
    href: { control: 'text' },
    disabled: { control: 'boolean' },
    icon: {
      control: 'select',
      options: [
        undefined,
        'github',
        'linkedin',
        'x',
        'arrow-right',
        'arrow-up-right',
      ],
    },
    iconPosition: {
      control: 'inline-radio',
      options: ['before', 'after'],
    },
  },
  args: {
    variant: 'primary',
    type: 'button',
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: { Button },
    setup: () => ({ args }),
    template: `<Button v-bind="args">Send message</Button>`,
  }),
};

export const Ghost: Story = {
  args: { variant: 'ghost' },
  render: (args) => ({
    components: { Button },
    setup: () => ({ args }),
    template: `<Button v-bind="args">Learn more</Button>`,
  }),
};

export const WithIcon: Story = {
  args: { icon: 'arrow-right' },
  render: (args) => ({
    components: { Button },
    setup: () => ({ args }),
    template: `<Button v-bind="args">Continue</Button>`,
  }),
};

export const AsLink: Story = {
  args: { type: 'link', href: '/contact' },
  render: (args) => ({
    components: { Button },
    setup: () => ({ args }),
    template: `<Button v-bind="args">Contact</Button>`,
  }),
};

export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => ({
    components: { Button },
    setup: () => ({ args }),
    template: `<Button v-bind="args">Send message</Button>`,
  }),
};

export const Light: Story = {
  globals: {
    theme: 'light',
  },
  render: (args) => ({
    components: { Button },
    setup: () => ({ args }),
    template: `<Button v-bind="args">Send message</Button>`,
  }),
};

export const Dark: Story = {
  globals: {
    theme: 'dark',
  },
  render: (args) => ({
    components: { Button },
    setup: () => ({ args }),
    template: `<Button v-bind="args">Send message</Button>`,
  }),
};
