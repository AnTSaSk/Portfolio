import { resolve } from 'path';

import vue from '@vitejs/plugin-vue';
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite';
import { defineConfig } from 'vite';
import eslintPlugin from 'vite-plugin-eslint';
import svgLoader from 'vite-svg-loader';

// https://vitejs.dev/config/
export default defineConfig({
  // Build
  build: {
    outDir: '../../dist/website',
  },

  // Env
  envDir: '../../',
  envPrefix: 'VUE_',

  // Styles
  css: {
    preprocessorOptions: {
      scss: {
        quietDeps: true,
        additionalData: `
          @use 'sass:math';
          @import "./src/assets/scss/index.scss";
        `,
      },
    },
  },

  plugins: [
    vue(),
    VueI18nPlugin({
      include: resolve(__dirname, './src/i18n/locales/**'),
    }),
    svgLoader({
      defaultImport: 'url',
    }),
    eslintPlugin(),
  ],

  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      vue: 'vue/dist/vue.esm-bundler.js',
    },
  },
});
