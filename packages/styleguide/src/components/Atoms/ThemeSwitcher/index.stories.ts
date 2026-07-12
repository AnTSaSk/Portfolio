import { type Meta, type StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';

import ThemeSwitcher from './index.vue';

const meta = {
  title: 'Design System/Atoms/ThemeSwitcher',
  component: ThemeSwitcher,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    theme: {
      control: 'inline-radio',
      options: ['light', 'dark'],
    },
    shape: {
      control: 'inline-radio',
      options: ['square', 'circle'],
    },
    pressed: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: {
    theme: 'light',
    shape: 'square',
  },
} satisfies Meta<typeof ThemeSwitcher>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Square: Story = {
  render: (args) => ({
    components: { ThemeSwitcher },
    setup: () => ({ args }),
    template: `<ThemeSwitcher v-bind="args" />`,
  }),
};

export const Circle: Story = {
  args: { shape: 'circle' },
  render: (args) => ({
    components: { ThemeSwitcher },
    setup: () => ({ args }),
    template: `<ThemeSwitcher v-bind="args" />`,
  }),
};

export const Active: Story = {
  args: { pressed: true },
  render: (args) => ({
    components: { ThemeSwitcher },
    setup: () => ({ args }),
    template: `<ThemeSwitcher v-bind="args" />`,
  }),
};

export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => ({
    components: { ThemeSwitcher },
    setup: () => ({ args }),
    template: `<ThemeSwitcher v-bind="args" />`,
  }),
};

export const Light: Story = {
  globals: {
    theme: 'light',
  },
  render: (args) => ({
    components: { ThemeSwitcher },
    setup: () => ({ args }),
    template: `<ThemeSwitcher v-bind="args" />`,
  }),
};

export const Dark: Story = {
  globals: {
    theme: 'dark',
  },
  render: (args) => ({
    components: { ThemeSwitcher },
    setup: () => ({ args }),
    template: `<ThemeSwitcher v-bind="args" />`,
  }),
};

export const Interactive: Story = {
  render: (args) => ({
    components: { ThemeSwitcher },
    setup: () => {
      const theme = ref<'light' | 'dark'>('light');
      const toggle = (): void => {
        theme.value = theme.value === 'light' ? 'dark' : 'light';
      };

      return { args, theme, toggle };
    },
    template: `
      <div :data-theme="theme" style="padding: 24px;">
        <ThemeSwitcher v-bind="args" :theme="theme" @toggle="toggle" />
      </div>
    `,
  }),
};
