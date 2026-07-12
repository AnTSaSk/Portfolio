import { type Meta, type StoryObj } from '@storybook/vue3-vite';

import Head from './index.vue';

const meta: Meta<typeof Head> = {
  title: 'Design System/Organisms/Head',
  component: Head,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const template = `<div style="min-height:40vh;"><Head v-bind="args" /></div>`;

export const Listing: Story = {
  args: {
    variant: 'listing',
    eyebrow: 'Notes sur le métier',
    title: 'Blog',
    lede: 'Notes sur la pratique front-end, les design systems, et les petites décisions éditoriales inscrites dans les interfaces.',
  },
  render: (args) => ({
    components: { Head },
    setup: () => ({ args }),
    template,
  }),
};

export const Article: Story = {
  args: {
    variant: 'article',
    title: 'On design systems as tools, not products',
    lede: 'A design system is most useful when it disappears into the work. A short note on the difference between scaffolding and a finished object.',
    backHref: 'blog.html',
    backLabel: 'Le blog',
    tags: ['design-systems', 'practice'],
    metaDate: '12 AVR. 2026',
    metaDuration: '9 min de lecture',
  },
  render: (args) => ({
    components: { Head },
    setup: () => ({ args }),
    template,
  }),
};

export const ArticleDark: Story = {
  globals: {
    theme: 'dark',
  },
  args: Article.args,
  render: (args) => ({
    components: { Head },
    setup: () => ({ args }),
    template,
  }),
};
