export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  backgrounds: {
    values: [
      {
        name: 'Light',
        value: '#ffffff',
      },
      {
        name: 'Dark',
        value: '#111315',
      },
    ],
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
};
