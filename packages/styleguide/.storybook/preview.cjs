export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
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
};
