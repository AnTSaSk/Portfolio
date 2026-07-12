import { type Meta, type StoryObj } from '@storybook/vue3-vite';

import Feature from './index.vue';

const meta: Meta<typeof Feature> = {
  title: 'Design System/Organisms/Feature',
  component: Feature,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    href: 'project.html',
    label: 'À la une',
    meta: '2025 · Lead front-end · design systems',
    title: 'Aurora Design System',
    lead: 'A token-driven component library. Designed for product teams that ship across surfaces, dark and light, with strong type and motion language.',
    stack: ['Vue 3', 'Nuxt 4', 'TypeScript', 'Storybook', 'Sass'],
    ctaLabel: 'Voir le projet',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const template = `<div style="padding: 24px;"><Feature v-bind="args" /></div>`;

export const Placeholder: Story = {
  render: (args) => ({
    components: { Feature },
    setup: () => ({ args }),
    template,
  }),
};

export const WithImage: Story = {
  args: {
    image: {
      src: 'https://www.astonmartin.com/-/media/partnerships-page/1-lifestyle/breitling/breitling-hero.jpg?mw=1920&rev=-1&hash=9A8D24859B25D6DC03FCA13A639A0E2D',
      alt: 'Aurora Design System cover',
    },
  },
  render: (args) => ({
    components: { Feature },
    setup: () => ({ args }),
    template,
  }),
};

export const Dark: Story = {
  globals: {
    theme: 'dark',
  },
  render: (args) => ({
    components: { Feature },
    setup: () => ({ args }),
    template,
  }),
};
