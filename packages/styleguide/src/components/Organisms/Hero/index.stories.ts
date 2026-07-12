import { type Meta, type StoryObj } from '@storybook/vue3-vite';

import Hero from './index.vue';

const meta: Meta<typeof Hero> = {
  title: 'Design System/Organisms/Hero',
  component: Hero,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    greeting: 'Bonsoir !',
    name: 'Je suis Alexis Besson,',
    role: 'Lead Développeur Front-end',
    body: [
      'Je conçois des interfaces web robustes et accessibles, du design system à la mise en production.',
      "J'accompagne les équipes produit sur l'architecture front, la performance et la qualité de code.",
      'Basé en France, je collabore à distance avec des équipes internationales.',
    ],
    tags: ['Vue.js', 'Nuxt', 'TypeScript'],
    watermarkText: 'ALEXIS BESSON',
    contactHref: '#contact',
    projectsHref: '#projects',
    contactLabel: 'Me contacter',
    projectsLabel: 'Voir les projets',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const template = `<div style="min-height:100vh; display:flex; flex-direction:column;"><Hero v-bind="args" /></div>`;

export const Default: Story = {
  render: (args) => ({
    components: { Hero },
    setup: () => ({ args }),
    template,
  }),
};

export const Dark: Story = {
  globals: {
    theme: 'dark',
  },
  render: (args) => ({
    components: { Hero },
    setup: () => ({ args }),
    template,
  }),
};
