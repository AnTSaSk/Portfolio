import { type Meta, type StoryObj } from '@storybook/vue3-vite';

import Related from './index.vue';
import CardArticle from '../../Molecules/CardArticle/index.vue';
import CardProject from '../../Molecules/CardProject/index.vue';

const meta: Meta<typeof Related> = {
  title: 'Design System/Organisms/Related',
  component: Related,
  tags: ['autodocs'],
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
    setup: () => ({ args }),
    template: `
      <Related v-bind="args">
        <CardArticle
          href="/blog/design-tokens"
          title="Construire un design system avec des tokens"
          date="12 mars 2026"
          excerpt="Comment structurer des tokens génériques et sémantiques pour tenir un thème clair/sombre."
          :tags="['CSS', 'Design system']"
        />
        <CardArticle
          href="/blog/accessibilite-vue"
          title="Accessibilité des composants Vue"
          date="2 février 2026"
          excerpt="Focus visible, rôles ARIA et navigation clavier appliqués à un atomic design."
          :tags="['A11y', 'Vue']"
        />
        <CardArticle
          href="/blog/nuxt-content-v3"
          title="Migrer vers @nuxt/content v3"
          date="18 janvier 2026"
          excerpt="Collections bilingues et requêtes typées pour un blog SSR."
          :tags="['Nuxt', 'Contenu']"
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
    setup: () => ({ args }),
    template: `
      <Related v-bind="args">
        <CardProject
          href="/projects/portfolio"
          title="Portfolio personnel"
          meta="Vue 3 · Nuxt 4"
          :stack="['Vue', 'Nuxt', 'TypeScript']"
        />
        <CardProject
          href="/projects/design-system"
          title="Design system Atomic"
          meta="Storybook 10"
          :stack="['Storybook', 'CSS']"
        />
        <CardProject
          href="/projects/cv-ats"
          title="CV statique ATS"
          meta="HTML · CSS"
          :stack="['HTML', 'SCSS']"
        />
      </Related>
    `,
  }),
};
