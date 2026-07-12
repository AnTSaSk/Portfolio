import { type Meta, type StoryObj } from '@storybook/vue3-vite';

import Link from './index.vue';

const meta: Meta<typeof Link> = {
  title: 'Design System/Atoms/Link',
  component: Link,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    href: { control: 'text' },
    external: { control: 'boolean' },
    current: { control: 'boolean' },
    variant: {
      control: 'select',
      options: ['inline', 'arrow', 'quiet', 'nav'],
    },
  },
  args: {
    href: '/about',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const proseTemplate = `
  <p style="max-width: 32ch;">
    Read more about the
    <Link href="/projects">projects built across the last few years</Link>
    to see how the underline wraps across multiple lines.
  </p>
`;

export const ProseLight: Story = {
  globals: {
    theme: 'light',
  },
  render: (args) => ({
    components: { Link },
    setup: () => ({ args }),
    template: proseTemplate,
  }),
};

export const ProseDark: Story = {
  globals: {
    theme: 'dark',
  },
  render: (args) => ({
    components: { Link },
    setup: () => ({ args }),
    template: proseTemplate,
  }),
};

const statesTemplate = `
  <div style="display: flex; gap: 24px;">
    <Link href="/default">Default</Link>
    <Link href="/hover">Hover me</Link>
    <Link href="/focus">Focus visible</Link>
    <Link href="/current" current>Current page</Link>
  </div>
`;

export const StatesLight: Story = {
  globals: {
    theme: 'light',
  },
  render: (args) => ({
    components: { Link },
    setup: () => ({ args }),
    template: statesTemplate,
  }),
};

export const StatesDark: Story = {
  globals: {
    theme: 'dark',
  },
  render: (args) => ({
    components: { Link },
    setup: () => ({ args }),
    template: statesTemplate,
  }),
};

const variantsTemplate = `
  <div style="display: flex; flex-direction: column; gap: 24px; align-items: flex-start;">
    <Link href="/inline">Inline (default)</Link>
    <Link href="/arrow" variant="arrow">Learn more</Link>
    <Link href="/quiet" variant="quiet">Quiet link</Link>
    <Link href="/nav" variant="nav">Nav link</Link>
    <Link href="/nav-current" variant="nav" current>Nav link (current)</Link>
  </div>
`;

export const VariantsLight: Story = {
  globals: {
    theme: 'light',
  },
  render: (args) => ({
    components: { Link },
    setup: () => ({ args }),
    template: variantsTemplate,
  }),
};

export const VariantsDark: Story = {
  globals: {
    theme: 'dark',
  },
  render: (args) => ({
    components: { Link },
    setup: () => ({ args }),
    template: variantsTemplate,
  }),
};
