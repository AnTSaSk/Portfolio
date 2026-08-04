import { type Meta, type StoryObj } from '@storybook/vue3-vite';

import Author from './index.vue';
import { AUTHOR } from '../../__fixtures__/content';

const meta: Meta<typeof Author> = {
  title: 'Design System/Molecules/Author',
  component: Author,
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
    photo: { control: 'object' },
  },
  args: {
    initials: AUTHOR.initials,
    name: AUTHOR.name,
    bio: AUTHOR.bio,
    links: [...AUTHOR.links],
    photo: { src: AUTHOR.photo },
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

export const Initials: Story = {
  args: {
    photo: undefined,
  },
  render: (args) => ({
    components: { Author },
    setup: () => ({ args }),
    template,
  }),
};
