import path from 'path';
import { fileURLToPath } from 'url';

import vue from '@vitejs/plugin-vue';
import type { StorybookConfig } from '@storybook/vue3-vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  // Stories reuse the website's published images instead of duplicating binaries.
  staticDirs: ['../../website/public'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
    '@storybook/addon-themes',
  ],

  framework: {
    name: '@storybook/vue3-vite',
    options: {},
  },

  async viteFinal(config) {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, '../src'),
    };
    config.plugins = config.plugins || [];
    config.plugins.push(vue());
    return config;
  },
};

export default config;
