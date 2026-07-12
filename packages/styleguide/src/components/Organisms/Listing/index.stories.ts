import { type Meta, type StoryObj } from '@storybook/vue3-vite';

import CardArticle from '@/components/Molecules/CardArticle/index.vue';
import CardProject from '@/components/Molecules/CardProject/index.vue';
import Filter from '@/components/Molecules/Filter/index.vue';
import Pagination from '@/components/Molecules/Pagination/index.vue';

import Listing from './index.vue';

const meta: Meta<typeof Listing> = {
  title: 'Design System/Organisms/Listing',
  component: Listing,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const blogFilterProps = {
  items: [
    { id: 'all', label: 'Tous', pressed: true },
    { id: 'vue', label: 'Vue.js', pressed: false },
    { id: 'nuxt', label: 'Nuxt', pressed: false },
  ],
  ariaLabel: 'Filtrer par tag',
};

const blogPaginationProps = {
  pages: 3,
  current: 1,
  hasPrev: false,
  hasNext: true,
};

const blogArticles = [
  {
    href: '/blog/article-1',
    title: 'Concevoir un design system durable',
    date: '01.01.2026',
    excerpt:
      'Comment structurer un design system évolutif avec Vue et Storybook.',
    tags: ['Vue.js'],
  },
  {
    href: '/blog/article-2',
    title: 'SSR et performance avec Nuxt',
    date: '15.01.2026',
    excerpt: 'Optimiser le rendu serveur pour de meilleurs Core Web Vitals.',
    tags: ['Nuxt'],
  },
  {
    href: '/blog/article-3',
    title: 'TypeScript strict en production',
    date: '28.01.2026',
    excerpt: 'Les patterns qui tiennent dans le temps sur un monorepo.',
    tags: ['TypeScript'],
  },
];

export const Blog: Story = {
  render: () => ({
    components: { CardArticle, Filter, Listing, Pagination },
    setup: () => ({ blogArticles, blogFilterProps, blogPaginationProps }),
    template: `
      <Listing gridVariant="auto-fill">
        <template #filter><Filter v-bind="blogFilterProps" /></template>
        <CardArticle v-for="article in blogArticles" :key="article.href" v-bind="article" />
        <template #pagination><Pagination v-bind="blogPaginationProps" /></template>
      </Listing>
    `,
  }),
};

const projectsFilterProps = {
  items: [
    { id: 'all', label: 'Tous', pressed: true },
    { id: 'vue', label: 'Vue', pressed: false },
    { id: 'react', label: 'React', pressed: false },
  ],
  ariaLabel: 'Filtrer par framework',
};

const projects = [
  {
    href: '/projects/project-1',
    title: 'Portfolio personnel',
    meta: 'Vue.js — 2026',
    stack: ['Vue.js', 'Nuxt'],
  },
  {
    href: '/projects/project-2',
    title: 'Plateforme e-commerce',
    meta: 'React — 2025',
    stack: ['React', 'TypeScript'],
  },
];

export const Projects: Story = {
  render: () => ({
    components: { CardProject, Filter, Listing },
    setup: () => ({ projects, projectsFilterProps }),
    template: `
      <Listing gridVariant="2up">
        <template #filter><Filter v-bind="projectsFilterProps" /></template>
        <template #preGrid><p>Projet à la une</p></template>
        <CardProject v-for="project in projects" :key="project.href" v-bind="project" />
      </Listing>
    `,
  }),
};
