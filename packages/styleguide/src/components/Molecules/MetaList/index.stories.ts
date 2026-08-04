import { type Meta, type StoryObj } from '@storybook/vue3-vite';

import MetaList from './index.vue';
import { LINKS } from '../../__fixtures__/content';

const meta: Meta<typeof MetaList> = {
  title: 'Design System/Molecules/MetaList',
  component: MetaList,
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
    ariaLabel: { control: 'text' },
    items: { control: 'object' },
  },
  args: {
    ariaLabel: 'Informations du projet',
    items: [
      { term: 'Année', value: '2025' },
      { term: 'Rôle', value: 'Lead front-end · design systems' },
      { term: 'Stack', tags: ['Vue 3', 'Nuxt', 'TypeScript'] },
    ],
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const template = `<div style="max-width:280px;"><MetaList v-bind="args" /></div>`;

export const Default: Story = {
  render: (args) => ({
    components: { MetaList },
    setup: () => ({ args }),
    template,
  }),
};

export const Light: Story = {
  globals: {
    theme: 'light',
  },
  render: (args) => ({
    components: { MetaList },
    setup: () => ({ args }),
    template,
  }),
};

export const Dark: Story = {
  globals: {
    theme: 'dark',
  },
  render: (args) => ({
    components: { MetaList },
    setup: () => ({ args }),
    template,
  }),
};

export const WithLinks: Story = {
  args: {
    links: [
      { label: 'Voir le dépôt', href: LINKS.github },
      {
        label: 'Voir le site',
        href: 'https://valhalla.breitling.com/fr',
        external: true,
      },
    ],
  },
  render: (args) => ({
    components: { MetaList },
    setup: () => ({ args }),
    template,
  }),
};
