import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

import { sha256Hash } from '../config/csp';

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

  it('serves the CSP in report-only mode (ADR-0039)', () => {
    expect(configSource).toContain('Content-Security-Policy-Report-Only');
    expect(configSource).not.toContain("'Content-Security-Policy':");
  });

  it('hashes the exact themeScript literal injected in app.head', () => {
    const themeMatch = configSource.match(
      /const themeScript\s*=\s*\n?\s*"([^"]*)";/,
    );

    const themeScript = themeMatch?.[1];

    expect(themeScript).toBeTypeOf('string');

    // Narrowed for the type checker; the assertion above fails first if absent.
    if (typeof themeScript !== 'string') {
      throw new Error('themeScript literal not found in nuxt.config.ts');
    }

    // The same literal must be injected as innerHTML and covered by the CSP
    // hash; a divergence would silently invalidate the served hash.
    expect(configSource).toContain(`innerHTML: themeScript,`);
    expect(configSource).toMatch(/inline:\s*{\s*themeScript,\s*criticalStyle/);
    expect(sha256Hash(themeScript)).toMatch(/^'sha256-[A-Za-z0-9+/]+=*'$/);
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
