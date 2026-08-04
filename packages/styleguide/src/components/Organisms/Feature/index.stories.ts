import { type Meta, type StoryObj } from '@storybook/vue3-vite';

import Feature from './index.vue';
import { VALHALLA } from '../../__fixtures__/content';

const meta: Meta<typeof Feature> = {
  title: 'Design System/Organisms/Feature',
  component: Feature,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    href: VALHALLA.href,
    label: 'À la une',
    meta: `${VALHALLA.year} · ${VALHALLA.role} · ${VALHALLA.client}`,
    title: VALHALLA.title,
    lead: VALHALLA.shortDescription,
    stack: [...VALHALLA.stack],
    ctaLabel: 'Voir le projet',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const template = `<div style="padding: 24px;"><Feature v-bind="args" /></div>`;

export const Default: Story = {
  render: (args) => ({
    components: { Feature },
    setup: () => ({ args }),
    template,
  }),
};

export const WithImage: Story = {
  args: {
    image: {
      src: VALHALLA.cover.src,
      alt: `Couverture du projet ${VALHALLA.title}`,
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
