import type { Meta, StoryObj } from '@storybook/vue3-vite';

import Tag from './index.vue';

const meta = {
  title: 'Design System/Atoms/Tag',
  component: Tag,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    as: {
      control: 'inline-radio',
      options: ['span', 'button'],
    },
    variant: {
      control: 'select',
      options: [undefined, 'brand', 'info', 'warning', 'error', 'strong'],
    },
    pressed: { control: 'boolean' },
    disabled: { control: 'boolean' },
    count: { control: 'number' },
  },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

const variantsTemplate = `
  <div style="display: flex; gap: 12px;">
    <Tag>Default</Tag>
    <Tag variant="brand">Brand</Tag>
    <Tag variant="info">Info</Tag>
    <Tag variant="warning">Warning</Tag>
    <Tag variant="error">Error</Tag>
  </div>
`;

export const VariantsLight: Story = {
  globals: {
    theme: 'light',
  },
  render: (args) => ({
    components: { Tag },
    setup: () => ({ args }),
    template: variantsTemplate,
  }),
};

export const VariantsDark: Story = {
  globals: {
    theme: 'dark',
  },
  render: (args) => ({
    components: { Tag },
    setup: () => ({ args }),
    template: variantsTemplate,
  }),
};

const slotsTemplate = `
  <div style="display: flex; gap: 12px;">
    <Tag>
      <template #lead><span style="width: 11px; height: 11px; display: inline-block; background: currentColor; border-radius: 50%;" /></template>
      With lead
    </Tag>
    <Tag count="8">With count</Tag>
    <Tag>
      With trail
      <template #trail><span style="width: 11px; height: 11px; display: inline-block; background: currentColor; border-radius: 50%;" /></template>
    </Tag>
  </div>
`;

export const SlotsLight: Story = {
  globals: {
    theme: 'light',
  },
  render: (args) => ({
    components: { Tag },
    setup: () => ({ args }),
    template: slotsTemplate,
  }),
};

export const SlotsDark: Story = {
  globals: {
    theme: 'dark',
  },
  render: (args) => ({
    components: { Tag },
    setup: () => ({ args }),
    template: slotsTemplate,
  }),
};

const statesTemplate = `
  <div style="display: flex; gap: 12px;">
    <Tag as="button">Default</Tag>
    <Tag as="button" pressed>Selected</Tag>
    <Tag as="button" disabled>Disabled button</Tag>
    <Tag disabled>Disabled span</Tag>
  </div>
`;

export const StatesLight: Story = {
  globals: {
    theme: 'light',
  },
  render: (args) => ({
    components: { Tag },
    setup: () => ({ args }),
    template: statesTemplate,
  }),
};

export const StatesDark: Story = {
  globals: {
    theme: 'dark',
  },
  render: (args) => ({
    components: { Tag },
    setup: () => ({ args }),
    template: statesTemplate,
  }),
};

const strongTemplate = `
  <div style="display: flex; gap: 12px;">
    <Tag>Default</Tag>
    <Tag variant="strong">Strong</Tag>
  </div>
`;

export const StrongLight: Story = {
  globals: {
    theme: 'light',
  },
  render: (args) => ({
    components: { Tag },
    setup: () => ({ args }),
    template: strongTemplate,
  }),
};

export const StrongDark: Story = {
  globals: {
    theme: 'dark',
  },
  render: (args) => ({
    components: { Tag },
    setup: () => ({ args }),
    template: strongTemplate,
  }),
};
