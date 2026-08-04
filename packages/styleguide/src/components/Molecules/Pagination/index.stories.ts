import { type Meta, type StoryObj } from '@storybook/vue3-vite';
import { ref, type Ref } from 'vue';

import Pagination from './index.vue';

const meta: Meta<typeof Pagination> = {
  title: 'Design System/Molecules/Pagination',
  component: Pagination,
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
    pages: { control: 'number' },
    current: { control: 'number' },
    hasPrev: { control: 'boolean' },
    hasNext: { control: 'boolean' },
  },
  args: {
    pages: 5,
    current: 2,
    hasPrev: true,
    hasNext: true,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Shared wiring for every story: local reactive `current` page + handlers
// deriving hasPrev/hasNext, mirroring how a real consumer would bind this
// presentational component.
function usePaginationState(
  initialCurrent: number,
  pages: number,
): {
  current: Ref<number>;
  hasPrev: Ref<boolean>;
  hasNext: Ref<boolean>;
  select: (page: number) => void;
  prev: () => void;
  next: () => void;
} {
  const current = ref(initialCurrent);
  const hasPrev = ref(current.value > 1);
  const hasNext = ref(current.value < pages);

  const sync = (): void => {
    hasPrev.value = current.value > 1;
    hasNext.value = current.value < pages;
  };

  const select = (page: number): void => {
    current.value = page;
    sync();
  };

  const prev = (): void => {
    if (current.value > 1) {
      current.value -= 1;
      sync();
    }
  };

  const next = (): void => {
    if (current.value < pages) {
      current.value += 1;
      sync();
    }
  };

  return { current, hasPrev, hasNext, select, prev, next };
}

export const Default: Story = {
  render: (args) => ({
    components: { Pagination },
    setup: () => ({ args, ...usePaginationState(args.current, args.pages) }),
    template: `<Pagination v-bind="args" :current="current" :has-prev="hasPrev" :has-next="hasNext" @select="select" @prev="prev" @next="next" />`,
  }),
};

export const FirstPage: Story = {
  args: { current: 1, hasPrev: false },
  render: (args) => ({
    components: { Pagination },
    setup: () => ({ args, ...usePaginationState(args.current, args.pages) }),
    template: `<Pagination v-bind="args" :current="current" :has-prev="hasPrev" :has-next="hasNext" @select="select" @prev="prev" @next="next" />`,
  }),
};

export const LastPage: Story = {
  args: { current: 5, hasNext: false },
  render: (args) => ({
    components: { Pagination },
    setup: () => ({ args, ...usePaginationState(args.current, args.pages) }),
    template: `<Pagination v-bind="args" :current="current" :has-prev="hasPrev" :has-next="hasNext" @select="select" @prev="prev" @next="next" />`,
  }),
};

export const Light: Story = {
  globals: {
    theme: 'light',
  },
  render: (args) => ({
    components: { Pagination },
    setup: () => ({ args, ...usePaginationState(args.current, args.pages) }),
    template: `<Pagination v-bind="args" :current="current" :has-prev="hasPrev" :has-next="hasNext" @select="select" @prev="prev" @next="next" />`,
  }),
};

export const Dark: Story = {
  globals: {
    theme: 'dark',
  },
  render: (args) => ({
    components: { Pagination },
    setup: () => ({ args, ...usePaginationState(args.current, args.pages) }),
    template: `<Pagination v-bind="args" :current="current" :has-prev="hasPrev" :has-next="hasNext" @select="select" @prev="prev" @next="next" />`,
  }),
};
