import { fileURLToPath } from 'url';

import svgLoader from 'vite-svg-loader';

export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',

  // App head configuration
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      templateParams: {
        separator: '|',
      },
      meta: [
        {
          name: 'theme-color',
          content: '#30BF75',
          media: '(prefers-color-scheme: light)',
        },
        {
          name: 'theme-color',
          content: '#1E9782',
          media: '(prefers-color-scheme: dark)',
        },
      ],
      link: [
        {
          rel: 'icon',
          type: 'image/svg+xml',
          href: '/favicon-light.svg',
          media: '(prefers-color-scheme: light)',
        },
        {
          rel: 'icon',
          type: 'image/svg+xml',
          href: '/favicon-dark.svg',
          media: '(prefers-color-scheme: dark)',
        },
      ],
    },
  },

  // Alias
  alias: {
    '~': fileURLToPath(new URL('./src/assets', import.meta.url)),
    '@': fileURLToPath(new URL('./src', import.meta.url)),
  },

  nitro: {
    minify: true,
    compressPublicAssets: true,
    routeRules: {
      '/_nuxt/**': {
        headers: { 'Cache-Control': 'public, max-age=31536000, immutable' },
      },
    },
  },

  // Env/Config
  runtimeConfig: {
    public: {
      layout: 'landing',
      baseUrl: process.env.NUXT_BASE_URL || 'https://alexisbesson.fr',
      i18n: {
        baseUrl: process.env.NUXT_BASE_URL || 'https://alexisbesson.fr',
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
            @use "${fileURLToPath(new URL('../styleguide/src/assets/scss/index.scss', import.meta.url))}" as *;
            @use "${fileURLToPath(new URL('./src/assets/scss/index.scss', import.meta.url))}" as *;
          `,
        },
      },
    },

    plugins: [
      // @ts-expect-error vite-svg-loader Plugin type conflicts with Nuxt's resolved Vite version
      svgLoader({ defaultImport: 'component' }),
    ],
  },

  // Modules
  modules: ['@nuxtjs/i18n', '@nuxtjs/seo'],

  // Site (used by @nuxtjs/seo)
  site: {
    url: process.env.NUXT_BASE_URL || 'https://alexisbesson.fr',
    name: 'Alexis Besson',
    description:
      'Lead Front-end Developer specializing in Vue.js, TypeScript & Node.js',
    defaultLocale: 'en',
  },

  // Robots (used by nuxt-simple-robots via @nuxtjs/seo)
  robots: {
    groups: [
      {
        userAgent: ['*'],
        allow: ['/'],
      },
    ],
  },

  // OG Image (disabled — static banner in public/SocialNetworkBanner.webp)
  ogImage: {
    enabled: false,
  },

  // I18n
  i18n: {
    baseUrl: process.env.NUXT_BASE_URL || 'https://alexisbesson.fr',
    defaultLocale: 'en',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
    },
    langDir: '../i18n/locales',
    locales: [
      {
        code: 'en',
        language: 'en-US',
        file: 'en.json',
      },
      {
        code: 'fr',
        language: 'fr-FR',
        file: 'fr.json',
      },
    ],
    strategy: 'prefix_except_default',
  },
});
