import { type Meta, type StoryObj } from '@storybook/vue3';

import CardArticle from './index.vue';
import { LAUNCH_ARTICLES } from '../../__fixtures__/content';

const cover = LAUNCH_ARTICLES[0].image.src;

const meta: Meta<typeof CardArticle> = {
  title: 'Design System/Molecules/CardArticle',
  component: CardArticle,
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
    href: { control: 'text' },
    title: { control: 'text' },
    date: { control: 'text' },
    excerpt: { control: 'text' },
    tags: { control: 'object' },
    placeholderVariant: {
      control: 'inline-radio',
      options: [undefined, '-topRight', '-bottom'],
    },
  },
  args: {
    href: '/blog/design-systems-at-scale',
    title: 'Design systems at scale',
    date: '12 APR. 2026 · 9 MIN',
    excerpt:
      'How we scaled a shared component library across three product teams.',
    tags: ['design-systems', 'vue'],
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const template = `<div style="max-width:360px;"><CardArticle v-bind="args" /></div>`;

export const PlaceholderCover: Story = {
  render: (args) => ({
    components: { CardArticle },
    setup: () => ({ args }),
    template,
  }),
};

export const PlaceholderTopRight: Story = {
  args: { placeholderVariant: '-topRight' },
  render: (args) => ({
    components: { CardArticle },
    setup: () => ({ args }),
    template,
  }),
};

export const PlaceholderBottom: Story = {
  args: { placeholderVariant: '-bottom' },
  render: (args) => ({
    components: { CardArticle },
    setup: () => ({ args }),
    template,
  }),
};

export const ImageCover: Story = {
  args: {
    image: { src: cover, alt: 'Aston Martin x Breitling hero shot' },
  },
  render: (args) => ({
    components: { CardArticle },
    setup: () => ({ args }),
    template,
  }),
};
