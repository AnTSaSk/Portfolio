import { type Meta, type StoryObj } from '@storybook/vue3-vite';

import Prose from './index.vue';

const meta: Meta<typeof Prose> = {
  title: 'Design System/Atoms/Prose',
  component: Prose,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const slotHtml = `
  <h2>Section title</h2>
  <p>A paragraph with <a href="#">a link</a> and <code>inline code</code> in it.</p>
  <h3>Subsection title</h3>
  <ul>
    <li>First item</li>
    <li>Second item</li>
    <li>Third item</li>
  </ul>
  <blockquote>A notable quotation pulled from the article body.</blockquote>
  <p>Another paragraph following the quotation, to show block spacing.</p>
  <pre><code>const greet = (name) => \`Hello, \${name}!\`;

console.log(greet('world'));</code></pre>
`;

const template = `<div style="padding: 48px;"><Prose>${slotHtml}</Prose></div>`;

export const Default: Story = {
  render: () => ({
    components: { Prose },
    template,
  }),
};
