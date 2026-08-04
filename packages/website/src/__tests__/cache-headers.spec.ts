import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

const configPath = resolve(process.cwd(), 'nuxt.config.ts');
const configSource = readFileSync(configPath, 'utf-8');

describe('nuxt.config.ts cache headers', () => {
  it('keeps /_nuxt/** at 1 year immutable (hashed assets)', () => {
    const ruleMatch = configSource.match(/'\/_nuxt\/\*\*':\s*{[^}]*}/s);

    expect(ruleMatch).not.toBeNull();
    expect(ruleMatch?.[0]).toContain(
      "'Cache-Control': 'public, max-age=31536000, immutable'",
    );
  });

  it.each(['/_ipx/**', '/fonts/**'])(
    'declares a 30-day non-immutable Cache-Control for %s',
    (routePattern) => {
      const ruleMatch = configSource.match(
        new RegExp(`'${routePattern.replace(/\*/g, '\\*')}':\\s*{[^}]*}`, 's'),
      );

      expect(ruleMatch).not.toBeNull();
      expect(ruleMatch?.[0]).toContain(
        "'Cache-Control': 'public, max-age=2592000'",
      );
      expect(ruleMatch?.[0]).not.toContain('immutable');
    },
  );

  it('does not add immutable caching for /_ipx/** or /fonts/**', () => {
    for (const routePattern of ['/_ipx/**', '/fonts/**']) {
      const ruleMatch = configSource.match(
        new RegExp(`'${routePattern.replace(/\*/g, '\\*')}':\\s*{[^}]*}`, 's'),
      );

      expect(ruleMatch?.[0]).not.toContain('immutable');
    }
  });
});
