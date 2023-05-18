import { fileURLToPath } from 'url';

import svgLoader from 'vite-svg-loader';

export default defineNuxtConfig({
  // Alias
  alias: {
    '~': fileURLToPath(new URL('./src/assets', import.meta.url)),
    '@': fileURLToPath(new URL('./src', import.meta.url)),
  },

  nitro: {
    minify: true,
  },

  // Env/Config
  runtimeConfig: {
    public: {
      layout: 'landing',
      baseUrl: process.env.NUXT_BASE_URL,
      i18n: {
        baseUrl: process.env.NUXT_BASE_URL,
      },
    },
  },

  srcDir: 'src/',

  // Typescript
  typescript: {
    // shim: false,
    strict: true,
  },

  vite: {
    // Styles
    css: {
      preprocessorOptions: {
        scss: {
          quietDeps: true,
          additionalData: `
            @use 'sass:math';
            @use "@antsask/styleguide/src/assets/scss/index.scss" as *;
            @use "./src/assets/scss/index.scss" as *;
          `,
        },
      },
    },

    plugins: [
      svgLoader({
        defaultImport: 'component',
      }),
    ],
  },

  // Modules
  modules: ['@vueuse/nuxt', '@nuxtjs/i18n'],

  // I18n
  i18n: {
    defaultLocale: 'en',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
    },
    lazy: true,
    langDir: 'locales',
    locales: [
      {
        code: 'en',
        iso: 'en-US',
        file: 'en.json',
      },
      {
        code: 'fr',
        iso: 'fr-FR',
        file: 'fr.json',
      },
    ],
    strategy: 'prefix_except_default',
  },
});
