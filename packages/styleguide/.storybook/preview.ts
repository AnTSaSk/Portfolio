import '../src/assets/css/app.css';

import { withThemeByDataAttribute } from '@storybook/addon-themes';
import type { Preview } from '@storybook/vue3';
import { themes } from 'storybook/theming';

// Inline the SVG icon sprite once so <use href="#name"> resolves in every story.
import spriteRaw from '../src/assets/sprite.svg?raw';

if (
  typeof document !== 'undefined' &&
  !document.getElementById('__icon-sprite')
) {
  const holder = document.createElement('div');
  holder.id = '__icon-sprite';
  holder.style.display = 'none';
  holder.innerHTML = spriteRaw;
  document.body.prepend(holder);
}

const preview: Preview = {
  decorators: [
    withThemeByDataAttribute({
      themes: { light: 'light', dark: 'dark' },
      defaultTheme: 'light',
      attributeName: 'data-theme',
    }),
  ],

  parameters: {
    // Docs pages are pinned to Storybook's dark theme (native doc blocks read
    // their chrome from this static theme, they do not follow the toolbar).
    docs: {
      theme: themes.dark,
    },
    // No fixed backgrounds: body background follows --bg-page, driven by the
    // data-theme toggle (color-scheme pinned on :root[data-theme]).
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
