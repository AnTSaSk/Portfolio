import { type Meta, type StoryObj } from '@storybook/vue3-vite';

import Header from './index.vue';

const meta: Meta<typeof Header> = {
  title: 'Design System/Organisms/Header',
  component: Header,
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
    logoHref: { control: 'text' },
    logoLabel: { control: 'text' },
    logoTitle: { control: 'text' },
    socialLinks: { control: 'object' },
  },
  args: {
    scrolled: false,
    theme: 'light',
    locale: 'en',
    logoHref: '/',
    logoLabel: 'AnTSaSk',
    logoTitle: 'AnTSaSk',
    socialLinks: [
      {
        icon: 'github',
        href: 'https://github.com/AnTSaSk',
        label: 'GitHub profile',
      },
      {
        icon: 'linkedin',
        href: 'https://www.linkedin.com/in/alexis-besson-lead-front/',
        label: 'LinkedIn profile',
      },
      { icon: 'x', href: 'https://x.com/AlexisBessonWeb', label: 'X profile' },
    ],
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
