import { describe, expect, it } from 'vitest';

import { buildCsp, sha256Hash } from '../csp';

describe('sha256Hash', () => {
  it('produces a CSP-formatted sha256 source expression', () => {
    const hash = sha256Hash('console.log(1)');

    expect(hash).toMatch(/^'sha256-[A-Za-z0-9+/]+=*'$/);
  });

  it('is deterministic for the same input', () => {
    expect(sha256Hash('x')).toBe(sha256Hash('x'));
  });
});

describe('buildCsp', () => {
  const inline = {
    themeScript: 'document.documentElement',
    criticalStyle: ':root{}',
  };

  it('sets default-src, object-src none and base-uri self', () => {
    const csp = buildCsp({ inline });

    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("object-src 'none'");
    expect(csp).toContain("base-uri 'self'");
    expect(csp).toContain("frame-ancestors 'self'");
    expect(csp).toContain("form-action 'self'");
  });

  it('hashes the inline script and style instead of using unsafe-inline', () => {
    const csp = buildCsp({ inline });

    expect(csp).not.toContain("'unsafe-inline'");
    expect(csp).toContain(sha256Hash(inline.themeScript));
    expect(csp).toContain(sha256Hash(inline.criticalStyle));
  });

  it('allows WebAssembly compilation without allowing arbitrary eval', () => {
    const csp = buildCsp({ inline });

    expect(csp).toMatch(/script-src[^;]*'wasm-unsafe-eval'/);
    // Anchored on the opening quote: 'wasm-unsafe-eval' contains the substring.
    expect(csp).not.toMatch(/'unsafe-eval'/);
  });

  it('adds the umami origin to script-src and connect-src when provided', () => {
    const csp = buildCsp({
      inline,
      umamiSrc: 'https://umami.example.com/script.js',
    });

    expect(csp).toMatch(/script-src[^;]*https:\/\/umami\.example\.com/);
    expect(csp).toMatch(/connect-src[^;]*https:\/\/umami\.example\.com/);
  });

  it('omits third-party origins when not configured', () => {
    const csp = buildCsp({ inline });

    expect(csp).not.toContain('umami');
  });
});
