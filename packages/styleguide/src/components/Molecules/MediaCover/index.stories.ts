import type { Meta, StoryObj } from '@storybook/vue3-vite';

import MediaCover from './index.vue';
import { VALHALLA } from '../../__fixtures__/content';

const cover = VALHALLA.cover.src;
const narrowCover = VALHALLA.gallery[1]?.src ?? cover;

// Art direction over the two source images the repository actually tracks:
// the build-time avif/webp variants are gitignored and never generated in the
// styleguide image, so referencing them here would 404 on the public build.
const COVER_SOURCES = [
  { srcset: cover, media: '(min-width: 700px)' },
  { srcset: narrowCover, media: '(max-width: 699px)' },
];

const meta: Meta<typeof MediaCover> = {
  title: 'Design System/Molecules/MediaCover',
  component: MediaCover,
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
    variant: { control: 'inline-radio', options: ['cover', 'poster'] },
    ratio: {
      control: 'inline-radio',
      options: ['16x9', '4x3', '1x1', 'portrait'],
    },
    placeholderVariant: {
      control: 'inline-radio',
      options: ['topLeft', 'topRight', 'bottom'],
    },
    caption: { control: 'text' },
    eyebrow: { control: 'text' },
  },
  args: {
    variant: 'cover',
    ratio: '16x9',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Fixed width so the component (and its placeholder, which has no intrinsic
// size) expands within the centering decorator instead of collapsing.
const coverTemplate = `<div style="width:480px;"><MediaCover v-bind="args" /></div>`;
const posterTemplate = `<div style="width:640px;"><MediaCover v-bind="args" /></div>`;

export const PlaceholderCover: Story = {
  render: (args) => ({
    components: { MediaCover },
    setup: () => ({ args }),
    template: coverTemplate,
  }),
};

export const ImageCover: Story = {
  args: {
    image: { src: cover, alt: 'Couverture du projet Valhalla' },
  },
  render: (args) => ({
    components: { MediaCover },
    setup: () => ({ args }),
    template: coverTemplate,
  }),
};

export const WithCaption: Story = {
  args: {
    image: { src: cover, alt: 'Couverture du projet Valhalla' },
    eyebrow: 'Fig. 01',
    caption: 'Valhalla, Breitling × Aston Martin',
  },
  render: (args) => ({
    components: { MediaCover },
    setup: () => ({ args }),
    template: coverTemplate,
  }),
};

// Exercises the <picture> branch. Resize the canvas across 700px to switch
// between the wide and the narrow source.
export const ResponsiveSources: Story = {
  args: {
    variant: 'poster',
    image: {
      src: cover,
      alt: 'Couverture du projet Valhalla',
      width: 1200,
      height: 675,
      sources: COVER_SOURCES,
    },
  },
  render: (args) => ({
    components: { MediaCover },
    setup: () => ({ args }),
    template: posterTemplate,
  }),
};
