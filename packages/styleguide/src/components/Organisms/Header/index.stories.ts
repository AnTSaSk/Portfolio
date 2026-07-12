import { type Meta, type StoryObj } from '@storybook/vue3-vite';

import Header from './index.vue';

const meta: Meta<typeof Header> = {
  title: 'Design System/Organisms/Header',
  component: Header,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (story) => ({
      components: { story },
      template: `
        <div style="min-height:100vh;">
          <story />
        </div>
      `,
    }),
  ],
  argTypes: {
    scrolled: { control: 'boolean' },
    theme: { control: 'select', options: ['light', 'dark'] },
    locale: { control: 'select', options: ['en', 'fr'] },
    logoLabel: { control: 'text' },
    logoTitle: { control: 'text' },
  },
  args: {
    scrolled: false,
    theme: 'light',
    locale: 'en',
    logoLabel: 'AnTSaSk',
    logoTitle: 'AnTSaSk',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: { Header },
    setup: () => ({ args }),
    template: `<Header v-bind="args" />`,
  }),
};

export const Scrolled: Story = {
  args: {
    scrolled: true,
  },
  render: (args) => ({
    components: { Header },
    setup: () => ({ args }),
    template: `<Header v-bind="args" />`,
  }),
};
