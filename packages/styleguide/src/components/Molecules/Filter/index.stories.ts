import { type Meta, type StoryObj } from '@storybook/vue3-vite';
import { ref, type Ref } from 'vue';

import Filter from './index.vue';

const meta: Meta<typeof Filter> = {
  title: 'Design System/Molecules/Filter',
  component: Filter,
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
    label: { control: 'text' },
    ariaLabel: { control: 'text' },
  },
  args: {
    items: [
      { id: 'all', label: 'Tous', pressed: true },
      { id: 'design-systems', label: 'design-systems', pressed: false },
      { id: 'vue', label: 'vue', pressed: false },
    ],
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

type FilterArgs = NonNullable<Story['args']>['items'];

// Shared wiring for every story: local reactive copy of `items` + a toggle
// handler mimicking the "Tous" exclusivity a real filter would apply.
function useFilterState(initialItems: FilterArgs): {
  items: Ref<NonNullable<FilterArgs>>;
  toggle: (id: string) => void;
} {
  const items = ref((initialItems ?? []).map((item) => ({ ...item })));

  const toggle = (id: string): void => {
    items.value = items.value.map((item) => {
      if (id === 'all') {
        return { ...item, pressed: item.id === 'all' };
      }

      if (item.id === 'all') {
        return { ...item, pressed: false };
      }

      if (item.id === id) {
        return { ...item, pressed: !item.pressed };
      }

      return item;
    });
  };

  return { items, toggle };
}

export const Default: Story = {
  render: (args) => ({
    components: { Filter },
    setup: () => ({ args, ...useFilterState(args.items) }),
    template: `<Filter v-bind="args" :items="items" @toggle="toggle" />`,
  }),
};

export const Light: Story = {
  globals: {
    theme: 'light',
  },
  render: (args) => ({
    components: { Filter },
    setup: () => ({ args, ...useFilterState(args.items) }),
    template: `<Filter v-bind="args" :items="items" @toggle="toggle" />`,
  }),
};

export const Dark: Story = {
  globals: {
    theme: 'dark',
  },
  render: (args) => ({
    components: { Filter },
    setup: () => ({ args, ...useFilterState(args.items) }),
    template: `<Filter v-bind="args" :items="items" @toggle="toggle" />`,
  }),
};
