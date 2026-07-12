import { type Meta, type StoryObj } from '@storybook/vue3-vite';

import MainNav from './index.vue';

const meta: Meta<typeof MainNav> = {
  title: 'Design System/Organisms/MainNav',
  component: MainNav,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (story) => ({
      components: { story },
      template: `
        <div style="min-height:100vh; display:flex; flex-direction:column; justify-content:flex-end;">
          <story />
        </div>
      `,
    }),
  ],
  argTypes: {
    ariaLabel: { control: 'text' },
    min: { control: 'boolean' },
    links: { control: 'object' },
  },
  args: {
    ariaLabel: 'Principale',
    links: [
      { label: 'Home', href: '/', current: true },
      { label: 'Projects', href: '/projects' },
      { label: 'Contact', href: '/contact' },
      { label: 'GitHub', href: 'https://github.com/antsask', external: true },
    ],
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: { MainNav },
    setup: () => ({ args }),
    template: `<MainNav v-bind="args" />`,
  }),
};

export const Min: Story = {
  args: {
    min: true,
  },
  render: (args) => ({
    components: { MainNav },
    setup: () => ({ args }),
    template: `<MainNav v-bind="args" />`,
  }),
};
