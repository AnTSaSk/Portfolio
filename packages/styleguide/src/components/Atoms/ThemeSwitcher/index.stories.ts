import { type Meta, type StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';

import ThemeSwitcher from './index.vue';

const meta = {
  title: 'Design System/Atoms/ThemeSwitcher',
  component: ThemeSwitcher,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    theme: {
      control: 'inline-radio',
      options: ['light', 'dark'],
    },
    pressed: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: {
    theme: 'light',
  },
  render: (args) => ({
    components: { ThemeSwitcher },
    setup: () => {
      const theme = ref<'light' | 'dark'>(args.theme);
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
} satisfies Meta<typeof ThemeSwitcher>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Active: Story = {
  args: { pressed: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const DarkThemeActive: Story = {
  args: { theme: 'dark' },
};
