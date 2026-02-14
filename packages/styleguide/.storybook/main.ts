import path from 'path';
import { fileURLToPath } from 'url';

import type { StorybookConfig } from '@storybook/vue3-vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
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
    config.css = {
      preprocessorOptions: {
        scss: {
          quietDeps: true,
          additionalData: `
            @use 'sass:math';
            @use "@/assets/scss/index.scss" as *;
          `,
        },
      },
    };

    return config;
  },
};

export default config;
