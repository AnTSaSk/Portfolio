import * as Sentry from '@sentry/nuxt';

Sentry.init({
  // DSN injected at runtime via NUXT_PUBLIC_SENTRY_DSN env var — no-op without it
  dsn: process.env.NUXT_PUBLIC_SENTRY_DSN,

  environment:
    process.env.SENTRY_ENVIRONMENT ?? process.env.NODE_ENV ?? 'production',

  // Matches the release uploaded at build time (see Dockerfile), undefined outside CI
  release: process.env.SENTRY_RELEASE,

  // Low-traffic portfolio: 10% traces is enough signal without added overhead.
  tracesSampleRate: 0.1,
});
