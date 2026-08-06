import { type Meta, type StoryObj } from '@storybook/vue3-vite';

import Hero from './index.vue';
import { HOME, LINKS } from '../../__fixtures__/content';

const meta: Meta<typeof Hero> = {
  title: 'Design System/Organisms/Hero',
  component: Hero,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    greeting: HOME.greeting,
    name: HOME.name,
    role: HOME.role,
    body: [...HOME.body],
    tags: [...HOME.tags],
    watermarkText: HOME.watermark,
    primaryHref: '/projects',
    primaryLabel: 'Voir les projets',
    secondaryHref: LINKS.linkedin,
    secondaryLabel: 'LinkedIn',
    secondaryExternal: true,
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
