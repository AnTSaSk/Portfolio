import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { load } from 'js-yaml';
import { describe, expect, it } from 'vitest';

type ComposeMount = {
  type: string;
  source?: string;
  target: string;
  tmpfs?: { size?: number; mode?: number };
};

type ComposeService = Record<string, unknown> & {
  volumes?: ComposeMount[];
};

type Compose = {
  services: Record<string, ComposeService>;
  volumes?: Record<string, unknown>;
};

const CONTENT_DB_DIR = '/app/.data/content';

const compose = load(
  readFileSync(resolve(__dirname, '../../../../docker-compose.yml'), 'utf-8'),
) as Compose;

const service = (name: string): ComposeService => {
  const found = compose.services[name];

  if (!found) {
    throw new Error(`service "${name}" is missing from docker-compose.yml`);
  }

  return found;
};

const mounts = (name: string): ComposeMount[] => service(name).volumes ?? [];

const contentDbMount = (): ComposeMount => {
  const found = mounts('app').find((m) => m.target === CONTENT_DB_DIR);

  if (!found) {
    throw new Error(`no mount targets ${CONTENT_DB_DIR} in service "app"`);
  }

  return found;
};

describe('content database mount', () => {
  it('is served by a named volume, not a volatile tmpfs', () => {
    expect(contentDbMount().type).toBe('volume');
  });

  it('names a source declared in the stack volumes section', () => {
    const { source } = contentDbMount();

    expect(source).toBeTruthy();
    expect(Object.keys(compose.volumes ?? {})).toContain(source);
  });

  it('keeps the app container read-only with every capability dropped', () => {
    expect(service('app')['read_only']).toBe(true);
    expect(service('app')['cap_drop']).toEqual(['ALL']);
  });

  it('leaves no writable mount beyond /tmp and the database path', () => {
    const writable = mounts('app')
      .map((m) => m.target)
      .filter((target) => target !== '/tmp' && target !== CONTENT_DB_DIR);

    expect(writable).toEqual([]);
  });

  it('keeps the styleguide hardening untouched', () => {
    expect(service('styleguide')['read_only']).toBe(true);
    expect(service('styleguide')['cap_drop']).toEqual(['ALL']);
  });
});
