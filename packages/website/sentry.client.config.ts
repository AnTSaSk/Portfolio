import * as Sentry from '@sentry/nuxt';

Sentry.init({
  // DSN injected at runtime via NUXT_PUBLIC_SENTRY_DSN env var — no-op without it
  dsn: import.meta.env.NUXT_PUBLIC_SENTRY_DSN,

  environment: import.meta.env.MODE ?? 'production',

  // Matches the release uploaded at build time (see Dockerfile), undefined outside CI
  release: import.meta.env.NUXT_PUBLIC_SENTRY_RELEASE,

  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],

  // Low-traffic portfolio: 10% traces is enough signal; replays only on error
  // (100%) to capture failure context without recording normal sessions.
  tracesSampleRate: 0.1,

  replaysSessionSampleRate: 0.05,
  replaysOnErrorSampleRate: 1.0,
});
