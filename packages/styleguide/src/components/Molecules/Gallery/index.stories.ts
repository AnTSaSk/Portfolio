import { type Meta, type StoryObj } from '@storybook/vue3-vite';

import Gallery from './index.vue';
import { EMEIS_GALLERY, VALHALLA } from '../../__fixtures__/content';

const styleAItems = VALHALLA.gallery.map((image, index) => ({
  image: { ...image, alt: `Projet Valhalla, visuel ${index + 1}` },
  caption: `Fig. 0${index + 1}`,
}));

const threeUpItems = EMEIS_GALLERY.map((image, index) => ({
  image: { ...image, alt: `Projet Emeis, visuel ${index + 1}` },
  caption: `Fig. 0${index + 1}`,
}));

const meta: Meta<typeof Gallery> = {
  title: 'Design System/Molecules/Gallery',
  component: Gallery,
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
    variant: { control: 'inline-radio', options: ['styleA', 'threeUp'] },
    ariaLabel: { control: 'text' },
  },
  args: {
    items: styleAItems,
    ariaLabel: 'Project gallery',
    variant: 'styleA',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const template = `<div style="max-width:960px;"><Gallery v-bind="args" /></div>`;

export const StyleA: Story = {
  render: (args) => ({
    components: { Gallery },
    setup: () => ({ args }),
    template,
  }),
};

export const ThreeUp: Story = {
  args: { items: threeUpItems, variant: 'threeUp' },
  render: (args) => ({
    components: { Gallery },
    setup: () => ({ args }),
    template,
  }),
};

export const Light: Story = {
  globals: {
    theme: 'light',
  },
  render: (args) => ({
    components: { Gallery },
    setup: () => ({ args }),
    template,
  }),
};

export const Dark: Story = {
  globals: {
    theme: 'dark',
  },
  render: (args) => ({
    components: { Gallery },
    setup: () => ({ args }),
    template,
  }),
};
