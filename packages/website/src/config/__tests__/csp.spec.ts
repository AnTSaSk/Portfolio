import { describe, expect, it } from 'vitest';

import { buildCsp } from '../csp';

describe('buildCsp', () => {
  it('sets default-src, object-src none and base-uri self', () => {
    const csp = buildCsp({});

    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("object-src 'none'");
    expect(csp).toContain("base-uri 'self'");
    expect(csp).toContain("frame-ancestors 'self'");
    expect(csp).toContain("form-action 'self'");
  });

  it('allows every inline script the SSR renderer emits, whatever its content', () => {
    const csp = buildCsp({});
    const scriptSrc = /script-src ([^;]*)/.exec(csp)?.[1] ?? '';

    expect(scriptSrc).toContain("'unsafe-inline'");
  });

  it('allows every inline style and style attribute the app emits', () => {
    const csp = buildCsp({});
    const styleSrc = /style-src ([^;]*)/.exec(csp)?.[1] ?? '';

    // A style attribute (e.g. a dynamic custom property) is only ever allowed
    // by 'unsafe-inline': a nonce cannot apply to an attribute.
    expect(styleSrc).toContain("'unsafe-inline'");
  });

  it('never falls back to a hash allow-list, inoperative next to unsafe-inline', () => {
    expect(buildCsp({})).not.toContain('sha256-');
  });

  it('allows WebAssembly compilation without allowing arbitrary eval', () => {
    const csp = buildCsp({});

    expect(csp).toMatch(/script-src[^;]*'wasm-unsafe-eval'/);
    // Anchored on the opening quote: 'wasm-unsafe-eval' contains the substring.
    expect(csp).not.toMatch(/'unsafe-eval'/);
  });

  it('adds the umami origin to script-src and connect-src when provided', () => {
    const csp = buildCsp({
      umamiSrc: 'https://umami.example.com/script.js',
    });

    expect(csp).toMatch(/script-src[^;]*https:\/\/umami\.example\.com/);
    expect(csp).toMatch(/connect-src[^;]*https:\/\/umami\.example\.com/);
  });

  it('omits third-party origins when not configured', () => {
    expect(buildCsp({})).not.toContain('umami');
  });
});
