import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

const configPath = resolve(process.cwd(), 'nuxt.config.ts');
const configSource = readFileSync(configPath, 'utf-8');

describe('nuxt.config.ts security headers', () => {
  it.each([
    ['X-Content-Type-Options', 'nosniff'],
    ['Referrer-Policy', 'strict-origin-when-cross-origin'],
    ['X-Frame-Options', 'SAMEORIGIN'],
    ['Strict-Transport-Security', 'max-age=31536000; includeSubDomains'],
  ])('declares %s: %s', (header, value) => {
    expect(configSource).toContain(`'${header}': '${value}'`);
  });

  it('declares a Permissions-Policy restricting unused browser features', () => {
    expect(configSource).toContain('Permissions-Policy');
    expect(configSource).toMatch(/geolocation=\(\)/);
    expect(configSource).toMatch(/camera=\(\)/);
    expect(configSource).toMatch(/microphone=\(\)/);
  });

  it('serves the CSP as an enforced header, never report-only', () => {
    expect(configSource).toContain("'Content-Security-Policy':");
    expect(configSource).not.toContain('Content-Security-Policy-Report-Only');
  });

  it('applies the CSP to built output only, so the dev server keeps working', () => {
    const cspLine = /'Content-Security-Policy':\s*([^,\n]*)/.exec(configSource);

    expect(cspLine?.[1]).toBeTypeOf('string');
    // An unconditional value would ship the CSP to the dev server, whose Vite
    // client injects inline scripts the enforced policy cannot allow.
    expect(cspLine?.[1]).not.toBe('contentSecurityPolicy');
    // The guard must read the build mode: NODE_ENV is only set in the runtime
    // stage of the Dockerfile, long after nuxt.config.ts has been evaluated.
    expect(configSource).toMatch(/import\.meta\.dev|process\.env\.NODE_ENV/);
    expect(configSource).not.toMatch(
      /const isProduction = process\.env\.NODE_ENV/,
    );
  });

  it('never allows inline code by hash, invalidated by the SSR minifier', () => {
    expect(configSource).not.toContain('sha256');
  });
});

describe('X-Powered-By removal (nitro plugin)', () => {
  const pluginPath = resolve(
    process.cwd(),
    'server/plugins/security-headers.ts',
  );

  it('provides a nitro plugin that strips the X-Powered-By header', () => {
    expect(existsSync(pluginPath)).toBe(true);

    const pluginSource = readFileSync(pluginPath, 'utf-8');

    expect(pluginSource).toContain('defineNitroPlugin');
    expect(pluginSource).toMatch(/beforeResponse|render:response/);
    expect(pluginSource).toMatch(/x-powered-by/i);
  });
});
