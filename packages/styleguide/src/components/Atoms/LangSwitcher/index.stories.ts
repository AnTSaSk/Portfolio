import { type Meta, type StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';

import LangSwitcher from './index.vue';

const meta = {
  title: 'Design System/Atoms/LangSwitcher',
  component: LangSwitcher,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    locale: {
      control: 'inline-radio',
      options: ['en', 'fr'],
    },
  },
  args: {
    locale: 'en',
  },
} satisfies Meta<typeof LangSwitcher>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: { LangSwitcher },
    setup: () => ({ args }),
    template: `<LangSwitcher v-bind="args" />`,
  }),
};

export const FrenchTarget: Story = {
  args: { locale: 'en' },
  render: (args) => ({
    components: { LangSwitcher },
    setup: () => ({ args }),
    template: `<LangSwitcher v-bind="args" />`,
  }),
};

export const EnglishTarget: Story = {
  args: { locale: 'fr' },
  render: (args) => ({
    components: { LangSwitcher },
    setup: () => ({ args }),
    template: `<LangSwitcher v-bind="args" />`,
  }),
};

export const Light: Story = {
  globals: {
    theme: 'light',
  },
  render: (args) => ({
    components: { LangSwitcher },
    setup: () => ({ args }),
    template: `<LangSwitcher v-bind="args" />`,
  }),
};

export const Dark: Story = {
  globals: {
    theme: 'dark',
  },
  render: (args) => ({
    components: { LangSwitcher },
    setup: () => ({ args }),
    template: `<LangSwitcher v-bind="args" />`,
  }),
};

export const Interactive: Story = {
  render: () => ({
    components: { LangSwitcher },
    setup: () => {
      const locale = ref<'en' | 'fr'>('en');
      const onChange = (target: 'en' | 'fr'): void => {
        locale.value = target;
      };

      return { locale, onChange };
    },
    template: `<LangSwitcher :locale="locale" @change="onChange" />`,
  }),
};
