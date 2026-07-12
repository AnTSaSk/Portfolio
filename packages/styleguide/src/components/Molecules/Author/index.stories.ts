import { type Meta, type StoryObj } from '@storybook/vue3-vite';

import Author from './index.vue';

const meta: Meta<typeof Author> = {
  title: 'Design System/Molecules/Author',
  component: Author,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
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
    initials: { control: 'text' },
    name: { control: 'text' },
    bio: { control: 'text' },
    links: { control: 'object' },
  },
  args: {
    initials: 'AB',
    name: 'Alexis Besson',
    bio: 'Lead Développeur Front-end basé à Paris. Écrit sur les design systems, Vue et Nuxt.',
    links: [
      { label: 'GitHub', href: 'https://github.com/antsask', external: true },
      {
        label: 'LinkedIn',
        href: 'https://linkedin.com/in/antsask',
        external: true,
      },
    ],
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const template = `<div style="max-width:480px;"><Author v-bind="args" /></div>`;

export const Default: Story = {
  render: (args) => ({
    components: { Author },
    setup: () => ({ args }),
    template,
  }),
};

export const Light: Story = {
  globals: {
    theme: 'light',
  },
  render: (args) => ({
    components: { Author },
    setup: () => ({ args }),
    template,
  }),
};

export const Dark: Story = {
  globals: {
    theme: 'dark',
  },
  render: (args) => ({
    components: { Author },
    setup: () => ({ args }),
    template,
  }),
};
