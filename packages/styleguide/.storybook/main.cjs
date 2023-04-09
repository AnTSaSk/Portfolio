const path = require('path');

module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    {
      name: 'storybook-addon-sass-postcss',
      options: {
        sassLoaderOptions: {
          implementation: require('sass'),
        },
      },
    },
  ],
  framework: {
    name: '@storybook/vue3-vite',
    options: {},
  },
  features: {
    storyStoreV7: true,
  },
  async viteFinal(config, { configType }) {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, '../src'),
    };
    config.css = {
      preprocessorOptions: {
        scss: {
          additionalData: `
            @use 'sass:math';
            @import "@/assets/scss/index.scss";
          `,
        },
      },
    };
    return config;
  },
  docs: {
    autodocs: true,
  },
};
