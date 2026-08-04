import { type Meta, type StoryObj } from '@storybook/vue3-vite';

import Link from './index.vue';
import Icon from '../Icon/index.vue';

const meta: Meta<typeof Link> = {
  title: 'Design System/Atoms/Link',
  component: Link,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    href: { control: 'text' },
    external: { control: 'boolean' },
    current: { control: 'boolean' },
    variant: {
      control: 'select',
      options: ['inline', 'arrow', 'quiet', 'nav', 'icon'],
    },
    tag: {
      control: 'select',
      options: ['a', 'span'],
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

const iconTemplate = `
  <div style="display: flex; gap: 16px; align-items: center;">
    <Link href="https://github.com" variant="icon" external label="GitHub">
      <Icon name="github" size="sm" />
    </Link>
    <Link href="https://linkedin.com" variant="icon" external label="LinkedIn">
      <Icon name="linkedin" size="sm" />
    </Link>
    <Link href="https://x.com" variant="icon" external label="X">
      <Icon name="x" size="sm" />
    </Link>
  </div>
`;

export const IconLight: Story = {
  globals: {
    theme: 'light',
  },
  render: (args) => ({
    components: { Link, Icon },
    setup: () => ({ args }),
    template: iconTemplate,
  }),
};

export const IconDark: Story = {
  globals: {
    theme: 'dark',
  },
  render: (args) => ({
    components: { Link, Icon },
    setup: () => ({ args }),
    template: iconTemplate,
  }),
};

export const TagSpanInCardLink: Story = {
  render: () => ({
    components: { Link },
    template: `
      <a href="/project" style="display: block; max-width: 32ch; padding: 16px; text-decoration: none; border: 1px solid currentColor;">
        <span style="display: block;">Card-wide clickable link</span>
        <Link variant="arrow" tag="span">Voir le projet</Link>
      </a>
    `,
  }),
};
