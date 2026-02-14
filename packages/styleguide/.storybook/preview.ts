import type { Preview } from '@storybook/vue3';

const preview: Preview = {
  parameters: {
    backgrounds: {
      options: {
        light: {
          name: 'Light',
          value: '#ffffff',
        },
        dark: {
          name: 'Dark',
          value: '#111315',
        },
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    options: {
      storySort: {
        order: [
          'Docs',
          'Design System',
          'Design System/Atoms',
          'Design System/Molecules',
          'Design System/Organisms',
          'Design System/Templates',
        ],
      },
    },
  },

  tags: ['autodocs'],
};

export default preview;
