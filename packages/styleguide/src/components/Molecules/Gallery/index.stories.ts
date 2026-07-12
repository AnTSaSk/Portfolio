import { type Meta, type StoryObj } from '@storybook/vue3-vite';

import Gallery from './index.vue';

const heroImage =
  'https://arneo.io/sites/default/files/styles/1668x1083/public/medias/images/desktopemeishero-img.png.webp';
const secondImage =
  'https://imgsrv2.voi.id/jGiu2UfMVVe1E7cPJcuLetBT667v0-ihNgVfQyVT4G8/auto/1200/675/sm/1/bG9jYWw6Ly8vcHVibGlzaGVycy81MTM1ODMvMjAyNTA5MTExMTI2LW1haW4uY3JvcHBlZF8xNzU3NTY0Nzk3LmpwZw.jpg';
const thirdImage =
  'https://arneo.io/sites/default/files/styles/1112x594/public/medias/images/ia-et-numerique-responsable-nos-choix-pour-une-integration-raisonnee.png.webp';
const fourthImage =
  'https://images.unsplash.com/photo-1607465511939-92cd96b8c3f5?auto=format&fit=crop&ixlib=rb-';
const fifthImage = 'Paperclub.jpg';

const styleAItems = [
  { image: { src: heroImage, alt: 'Hero shot' }, caption: 'Fig. 01' },
  { image: { src: secondImage, alt: 'Side profile' }, caption: 'Fig. 02' },
  { image: { src: thirdImage, alt: '' }, caption: 'Fig. 03' },
];

const threeUpItems = [
  { image: { src: fourthImage, alt: 'Hero shot' }, caption: 'Fig. 01' },
  { image: { src: thirdImage, alt: 'Side profile' }, caption: 'Fig. 02' },
  { image: { src: fifthImage, alt: '' }, caption: 'Fig. 03' },
];

const meta: Meta<typeof Gallery> = {
  title: 'Design System/Molecules/Gallery',
  component: Gallery,
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
