import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';

import svgLoader from 'vite-svg-loader';

import { buildCsp } from './src/config/csp';
import { buildUmamiScript } from './src/config/umami';

// @nuxt/content writes its runtime SQLite tables lazily (per collection, on first
// query), so the DB path must stay writable for the whole process life. The
// default `./contents.sqlite` is relative to the server dir, non-writable by
// `nodeuser` in the container. NUXT_CONTENT_DB overrides it in prod (see Dockerfile).
const contentDbFile =
  process.env.NUXT_CONTENT_DB ??
  fileURLToPath(new URL('./.data/content/contents.sqlite', import.meta.url));

// Nuxt inlines only component SFC styles in the SSR head, never the global
// `css:` entry, so the @layer order declaration + tokens would otherwise land
// after the inlined `@layer components{}` and after an external stylesheet
// and tokens available at first paint. tokens.css stays the single source.
const criticalCss =
  '@layer base, components, layout, utilities;\n' +
  readFileSync(
    fileURLToPath(
      new URL('../styleguide/src/assets/css/tokens.css', import.meta.url),
    ),
    'utf-8',
  );

// Same literal is injected in app.head.script and hashed for the CSP:
// both must reference this constant so the sha256 matches the served inline.
const themeScript =
  "(function(){try{var t=localStorage.getItem('ab-theme');if(t&&t!=='system')document.documentElement.setAttribute('data-theme',t);}catch(e){}})();";

const contentSecurityPolicy = buildCsp({
  inline: { themeScript, criticalStyle: criticalCss },
  umamiSrc: process.env.NUXT_PUBLIC_UMAMI_SRC,
  sentryDsn: process.env.NUXT_PUBLIC_SENTRY_DSN,
});

export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',

  hooks: {
    // Precomputed at build so the listing needs no article body.
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'content:file:afterParse'(ctx) {
      const { file, content } = ctx as {
        file: { id: string; body?: string };
        content: Record<string, unknown>;
      };

      if (!file.id.startsWith('blog/') || typeof file.body !== 'string') {
        return;
      }

      const words = file.body.trim().split(/\s+/).filter(Boolean).length;

      content.readingTime = Math.max(1, Math.ceil(words / 200));
    },
  },

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
        // Preload critical fonts to reduce FOUT
        {
          rel: 'preload',
          as: 'font',
          type: 'font/woff2',
          href: '/fonts/Montserrat/Montserrat-SemiBold.woff2',
          crossorigin: 'anonymous',
        },
        {
          rel: 'preload',
          as: 'font',
          type: 'font/woff2',
          href: '/fonts/NotoSans/NotoSans-Regular.woff2',
          crossorigin: 'anonymous',
        },
      ],
      script: [
        {
          innerHTML: themeScript,
          tagPosition: 'head',
        },
        ...buildUmamiScript({
          src: process.env.NUXT_PUBLIC_UMAMI_SRC,
          websiteId: process.env.NUXT_PUBLIC_UMAMI_WEBSITE_ID,
          domains: process.env.NUXT_PUBLIC_UMAMI_DOMAINS,
          isProduction: process.env.NODE_ENV === 'production',
        }),
      ],
      style: [
        {
          innerHTML: criticalCss,
          tagPriority: 'critical',
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
  },

  // Single route-rules surface (Nuxt 4 best practice): headers, cache and
  // sitemap priorities together. Nitro consumes these at request time.
  routeRules: {
    '/_nuxt/**': {
      headers: { 'Cache-Control': 'public, max-age=31536000, immutable' },
    },
    '/_ipx/**': {
      headers: { 'Cache-Control': 'public, max-age=2592000' },
    },
    '/fonts/**': {
      headers: { 'Cache-Control': 'public, max-age=2592000' },
    },
    '/**': {
      headers: {
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'X-Frame-Options': 'SAMEORIGIN',
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
        'Permissions-Policy': 'geolocation=(), camera=(), microphone=()',
        'Content-Security-Policy': contentSecurityPolicy,
      },
    },
    '/': { sitemap: { priority: 1, changefreq: 'weekly' } },
    '/projects': { sitemap: { priority: 0.9, changefreq: 'weekly' } },
    '/blog': { sitemap: { priority: 0.7, changefreq: 'weekly' } },
    '/about': { sitemap: { priority: 0.7, changefreq: 'monthly' } },
    '/legal': { sitemap: { priority: 0.2, changefreq: 'yearly' } },
  },

  // Env/Config
  runtimeConfig: {
    public: {
      layout: 'landing',
      baseUrl: process.env.NUXT_BASE_URL || 'https://alexisbesson.fr',
      i18n: {
        baseUrl: process.env.NUXT_BASE_URL || 'https://alexisbesson.fr',
      },
      umami: {
        src: process.env.NUXT_PUBLIC_UMAMI_SRC || '',
        websiteId: process.env.NUXT_PUBLIC_UMAMI_WEBSITE_ID || '',
        domains: process.env.NUXT_PUBLIC_UMAMI_DOMAINS || '',
      },
    },
  },

  srcDir: 'src/',

  // Typescript
  typescript: {
    // shim: false,
    strict: true,
  },

  css: ['@/assets/css/app.css'],

  // Content: explicit writable runtime DB path + native SQLite connector.
  // better-sqlite3 needs Glibc > 2.29 and fails on node:24-alpine (musl);
  content: {
    database: {
      type: 'sqlite',
      filename: contentDbFile,
    },
    experimental: {
      sqliteConnector: 'native',
    },
  },

  vite: {
    plugins: [svgLoader({ defaultImport: 'component' })],
    build: {
      // Warn at 250 kB (gzip ~80 kB); enforce via CI nuxi analyze if exceeded
      chunkSizeWarningLimit: 250,
      // Explicit (matches Vite 7 default): drops legacy polyfills (e.g. Array.from) for browsers without Baseline support.
      target: 'baseline-widely-available',
    },
  },

  // Client source maps for Sentry, not exposed to bundle consumers
  sourcemap: { client: 'hidden' },

  // Modules
  modules: [
    '@nuxtjs/i18n',
    '@nuxtjs/seo',
    '@nuxt/content',
    '@nuxt/image',
    '@sentry/nuxt/module',
  ],

  // Image (IPX runtime provider, SSR Nitro node, not SSG).
  // No `densities`: content images use the `sizes` prop, which already emits
  // width-descriptor variants (incl. 2x widths); combining the two produces
  // spurious 1px/2px density variants.
  image: {
    format: ['avif', 'webp'],
    quality: 72,
  },

  // Sentry: DSN via NUXT_PUBLIC_SENTRY_DSN env var (no-op without it).
  // Source map upload: env-only credentials, never committed. Undefined values
  // make the upload plugin skip gracefully (no auth -> no upload attempt).
  sentry: {
    org: process.env.SENTRY_ORG,
    project: process.env.SENTRY_PROJECT,
    authToken: process.env.SENTRY_AUTH_TOKEN,
    sourcemaps: {
      filesToDeleteAfterUpload: [
        '.output/**/public/**/*.map',
        '.output/server/**/*.map',
      ],
    },
  },

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
    customRoutes: 'config',
    pages: {
      about: {
        en: '/about',
        fr: '/à-propos',
      },
      'legal/index': {
        en: '/legal',
        fr: '/mentions-legales',
      },
      'projects/index': {
        en: '/projects',
        fr: '/projets',
      },
      'projects/[slug]': {
        en: '/projects/[slug]',
        fr: '/projets/[slug]',
      },
    },
  },
});
