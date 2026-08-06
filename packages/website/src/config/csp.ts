interface BuildCspOptions {
  umamiSrc?: string;
  sentryDsn?: string;
}

// Inline script/style are allowed by 'unsafe-inline', not by hash: Nitro's
// minifier rewrites inline scripts after any build-time hashing, and a nonce
// cannot cover a style attribute. Third-party origins added only when configured.
export const buildCsp = ({ umamiSrc, sentryDsn }: BuildCspOptions): string => {
  const origin = (url?: string): string => {
    if (!url) {
      return '';
    }

    try {
      return new URL(url).origin;
    } catch {
      return '';
    }
  };

  const umamiOrigin = origin(umamiSrc);
  const sentryOrigin = origin(sentryDsn);

  // wasm-unsafe-eval: @nuxt/content runs a WASM-compiled SQLite in the browser.
  const scriptSrc = [
    "'self'",
    "'unsafe-inline'",
    "'wasm-unsafe-eval'",
    umamiOrigin,
  ];
  const styleSrc = ["'self'", "'unsafe-inline'"];
  const connectSrc = ["'self'", umamiOrigin, sentryOrigin];

  const directives = [
    ['default-src', ["'self'"]],
    ['script-src', scriptSrc],
    ['style-src', styleSrc],
    ['img-src', ["'self'", 'data:']],
    ['font-src', ["'self'"]],
    ['connect-src', connectSrc],
    ['object-src', ["'none'"]],
    ['base-uri', ["'self'"]],
    ['frame-ancestors', ["'self'"]],
    ['form-action', ["'self'"]],
  ] as const;

  return directives
    .map(([name, values]) =>
      `${name} ${values.filter(Boolean).join(' ')}`.trim(),
    )
    .join('; ');
};
