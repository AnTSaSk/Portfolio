import { markRaw } from 'vue';

import type { Meta, StoryObj } from '@storybook/vue3-vite';

import MediaCover from './index.vue';
import StubNuxtImg from '../../../../.storybook/StubNuxtImg';

const valley =
  'https://carfans.fr/wp-content/uploads/2024/12/JAGUAR_TYPE00_SIDEPROFILE_16x9_021224.webp';

const meta: Meta<typeof MediaCover> = {
  title: 'Design System/Molecules/MediaCover',
  component: MediaCover,
  tags: ['autodocs'],
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
    image: { src: valley, alt: 'A valley seen from above' },
  },
  render: (args) => ({
    components: { MediaCover },
    setup: () => ({ args }),
    template: coverTemplate,
  }),
};

export const Poster: Story = {
  args: { variant: 'poster' },
  render: (args) => ({
    components: { MediaCover },
    setup: () => ({ args }),
    template: posterTemplate,
  }),
};

export const WithCaption: Story = {
  args: {
    image: { src: valley, alt: 'A valley seen from above' },
    eyebrow: 'Fig. 01',
    caption: 'A view over the valley',
  },
  render: (args) => ({
    components: { MediaCover },
    setup: () => ({ args }),
    template: coverTemplate,
  }),
};

export const Light: Story = {
  globals: {
    theme: 'light',
  },
  args: {
    image: { src: valley, alt: 'A valley seen from above' },
    caption: 'A view over the valley',
  },
  render: (args) => ({
    components: { MediaCover },
    setup: () => ({ args }),
    template: coverTemplate,
  }),
};

export const Dark: Story = {
  globals: {
    theme: 'dark',
  },
  render: (args) => ({
    components: { MediaCover },
    setup: () => ({ args }),
    template: coverTemplate,
  }),
};

// Exercises the injected-image branch (AtomImage renders the injected
// component) using the Storybook NuxtImg stub, without Nuxt.
export const InjectedImage: Story = {
  args: {
    variant: 'poster',
    image: {
      src: valley,
      alt: 'A valley seen from above',
      width: 1200,
      height: 675,
    },
    imageComponent: markRaw(StubNuxtImg),
  },
  render: (args) => ({
    components: { MediaCover },
    setup: () => ({ args }),
    template: posterTemplate,
  }),
};
