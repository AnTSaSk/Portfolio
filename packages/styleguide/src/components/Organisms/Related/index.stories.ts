import { type Meta, type StoryObj } from '@storybook/vue3-vite';

import Related from './index.vue';
import { LAUNCH_ARTICLES, PROJECT_CARDS } from '../../__fixtures__/content';
import CardArticle from '../../Molecules/CardArticle/index.vue';
import CardProject from '../../Molecules/CardProject/index.vue';

const meta: Meta<typeof Related> = {
  title: 'Design System/Organisms/Related',
  component: Related,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Articles: Story = {
  args: {
    eyebrow: 'À lire ensuite',
    ariaLabel: 'À lire ensuite',
  },
  render: (args) => ({
    components: { CardArticle, Related },
    setup: () => ({ args, articles: LAUNCH_ARTICLES }),
    template: `
      <Related v-bind="args">
        <CardArticle
          v-for="article in articles"
          :key="article.href"
          :href="article.href"
          :title="article.title"
          :date="article.date"
          :excerpt="article.excerpt"
          :tags="article.tags"
        />
      </Related>
    `,
  }),
};

export const Projects: Story = {
  args: {
    eyebrow: 'Autres projets',
    ariaLabel: 'Autres projets',
  },
  render: (args) => ({
    components: { CardProject, Related },
    setup: () => ({ args, projects: PROJECT_CARDS }),
    template: `
      <Related v-bind="args">
        <CardProject
          v-for="project in projects"
          :key="project.href"
          :href="project.href"
          :title="project.title"
          :meta="String(project.year)"
          :excerpt="project.excerpt"
          :image="project.image"
        />
      </Related>
    `,
  }),
};
