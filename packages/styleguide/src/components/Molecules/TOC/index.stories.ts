import { type Meta, type StoryObj } from '@storybook/vue3-vite';
import { onMounted, onUnmounted, ref } from 'vue';

import TOC from './index.vue';

const meta: Meta<typeof TOC> = {
  title: 'Design System/Molecules/TOC',
  component: TOC,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
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
    items: { control: 'object' },
    activeId: { control: 'text' },
    label: { control: 'text' },
  },
  args: {
    items: [
      { id: 'postulat', label: 'Le postulat' },
      { id: 'distinction', label: 'Une distinction à garder' },
      { id: 'exemple', label: 'Un exemple', sub: true },
      { id: 'pratique', label: 'En pratique' },
      { id: 'fin', label: 'Pour finir' },
    ],
    activeId: 'postulat',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const template = `<div style="max-width:280px;"><TOC v-bind="args" /></div>`;

export const Default: Story = {
  render: (args) => ({
    components: { TOC },
    setup: () => ({ args }),
    template,
  }),
};

export const Light: Story = {
  globals: {
    theme: 'light',
  },
  render: (args) => ({
    components: { TOC },
    setup: () => ({ args }),
    template,
  }),
};

export const Dark: Story = {
  globals: {
    theme: 'dark',
  },
  render: (args) => ({
    components: { TOC },
    setup: () => ({ args }),
    template,
  }),
};

// Demonstrates activeId tracking a scroll position: an IntersectionObserver
// watches the sections and updates activeId to the topmost visible one.
// Clicking a TOC item scrolls its section into view.
export const ScrollSync: Story = {
  render: (args) => ({
    components: { TOC },
    setup: () => {
      const activeId = ref(args.items?.[0]?.id ?? '');
      const containerRef = ref<HTMLElement | null>(null);
      let observer: IntersectionObserver | undefined;

      const select = (id: string): void => {
        activeId.value = id;
        containerRef.value
          ?.querySelector(`#${id}`)
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      };

      onMounted(() => {
        if (!containerRef.value) {
          return;
        }

        observer = new IntersectionObserver(
          (entries) => {
            const visible = entries
              .filter((entry) => entry.isIntersecting)
              .sort(
                (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
              )[0];

            if (visible) {
              activeId.value = visible.target.id;
            }
          },
          { root: containerRef.value, threshold: 0.5 },
        );

        containerRef.value
          .querySelectorAll('section[id]')
          .forEach((section) => {
            observer?.observe(section);
          });
      });

      onUnmounted(() => {
        observer?.disconnect();
      });

      return { args, activeId, containerRef, select };
    },
    template: `
      <div style="display:flex; gap:32px; align-items:flex-start;">
        <div
          ref="containerRef"
          style="height:360px; overflow:auto; width:320px; border:1px solid var(--border);"
        >
          <section
            v-for="item in args.items"
            :key="item.id"
            :id="item.id"
            style="min-height:180px; padding:16px;"
          >
            <h3>{{ item.label }}</h3>
            <p>Contenu de la section « {{ item.label }} ».</p>
          </section>
        </div>
        <TOC :items="args.items" :activeId="activeId" @select="select" />
      </div>
    `,
  }),
};
