import { createHash } from 'node:crypto';

export const sha256Hash = (source: string): string =>
  `'sha256-${createHash('sha256').update(source, 'utf-8').digest('base64')}'`;

interface CspInline {
  themeScript: string;
  criticalStyle: string;
}

interface BuildCspOptions {
  inline: CspInline;
  umamiSrc?: string;
  sentryDsn?: string;
}

// Report-Only CSP (ADR-0039): inline script/style allowed by hash, never
// unsafe-inline. Third-party origins added only when configured.
export const buildCsp = ({
  inline,
  umamiSrc,
  sentryDsn,
}: BuildCspOptions): string => {
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

  const scriptSrc = ["'self'", sha256Hash(inline.themeScript), umamiOrigin];
  const styleSrc = ["'self'", sha256Hash(inline.criticalStyle)];
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
  ] as const;

  return directives
    .map(([name, values]) =>
      `${name} ${values.filter(Boolean).join(' ')}`.trim(),
    )
    .join('; ');
};
