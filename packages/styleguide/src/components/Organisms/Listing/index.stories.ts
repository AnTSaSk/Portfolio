import { type Meta, type StoryObj } from '@storybook/vue3-vite';

import Listing from './index.vue';
import { LAUNCH_ARTICLES, PROJECT_CARDS } from '../../__fixtures__/content';
import CardArticle from '../../Molecules/CardArticle/index.vue';
import CardProject from '../../Molecules/CardProject/index.vue';
import Filter from '../../Molecules/Filter/index.vue';
import Pagination from '../../Molecules/Pagination/index.vue';

const meta: Meta<typeof Listing> = {
  title: 'Design System/Organisms/Listing',
  component: Listing,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const blogFilterProps = {
  items: [
    { id: 'all', label: 'Tous', pressed: true },
    { id: 'nuxt', label: 'Nuxt', pressed: false },
    { id: 'css', label: 'CSS', pressed: false },
    { id: 'ia', label: 'Dev IA', pressed: false },
  ],
  ariaLabel: 'Filtrer par tag',
};

const blogPaginationProps = {
  pages: 3,
  current: 1,
  hasPrev: false,
  hasNext: true,
};

const blogArticles = LAUNCH_ARTICLES.map((article) => ({
  href: article.href,
  title: article.title,
  date: article.date,
  excerpt: article.excerpt,
  tags: [...article.tags],
}));

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
    { id: 'nuxt', label: 'Nuxt', pressed: false },
    { id: 'next', label: 'Next.js', pressed: false },
  ],
  ariaLabel: 'Filtrer par technologie',
};

const projects = PROJECT_CARDS.map((project) => ({
  href: project.href,
  title: project.title,
  meta: String(project.year),
  excerpt: project.excerpt,
  image: { ...project.image },
}));

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
