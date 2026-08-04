import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import en from '../../i18n/locales/en.json';
import fr from '../../i18n/locales/fr.json';

const getKeys = (obj: Record<string, unknown>, prefix = ''): string[] =>
  Object.entries(obj).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;

    if (typeof value === 'object' && value !== null) {
      return getKeys(value as Record<string, unknown>, path);
    }

    return [path];
  });

describe('i18n locale synchronization', () => {
  const enKeys = getKeys(en).sort();
  const frKeys = getKeys(fr).sort();

  it('en.json and fr.json have the same number of keys', () => {
    expect(enKeys.length).toBe(frKeys.length);
  });

  it('en.json and fr.json have identical key structures', () => {
    expect(enKeys).toEqual(frKeys);
  });

  it('no translation value is empty', () => {
    const checkNonEmpty = (
      obj: Record<string, unknown>,
      locale: string,
      prefix = '',
    ): void => {
      for (const [key, value] of Object.entries(obj)) {
        const path = prefix ? `${prefix}.${key}` : key;

        if (typeof value === 'string') {
          expect(value.trim(), `${locale}:${path} is empty`).not.toBe('');
        } else if (typeof value === 'object' && value !== null) {
          checkNonEmpty(value as Record<string, unknown>, locale, path);
        }
      }
    };

    checkNonEmpty(en, 'en');
    checkNonEmpty(fr, 'fr');
  });
});

const localesDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../../i18n/locales',
);

const localeText = (name: string): string =>
  readFileSync(path.join(localesDir, name), 'utf8');

// Depth-tracking scanner: reports every key that appears twice under the same
// parent object. JSON.parse silently keeps the last duplicate, so a duplicate
// key is invisible to the parsed object and must be caught from the raw text.
const findDuplicateKeys = (text: string): string[] => {
  const dupes: string[] = [];
  const stack: Array<Set<string>> = [];
  let inString = false;
  let escaped = false;
  let current = '';
  let lastString: string | null = null;

  for (const ch of text) {
    if (inString) {
      if (escaped) {
        current += ch;
        escaped = false;
      } else if (ch === '\\') {
        escaped = true;
      } else if (ch === '"') {
        inString = false;
        lastString = current;
      } else {
        current += ch;
      }

      continue;
    }

    switch (ch) {
      case '"':
        inString = true;
        current = '';
        break;
      case '{':
      case '[':
        stack.push(new Set());
        lastString = null;
        break;
      case '}':
      case ']':
        stack.pop();
        lastString = null;
        break;
      case ':':
        if (lastString !== null && stack.length > 0) {
          const set = stack[stack.length - 1];

          if (!set) {
            break;
          }

          if (set.has(lastString)) {
            dupes.push(lastString);
          } else {
            set.add(lastString);
          }
        }

        lastString = null;
        break;
      case ',':
        lastString = null;
        break;
      default:
        break;
    }
  }

  return dupes;
};

const assertSorted = (
  obj: Record<string, unknown>,
  locale: string,
  path = '',
): void => {
  const keys = Object.keys(obj);
  const sorted = [...keys].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));

  expect(
    keys,
    `${locale}:${path || 'root'} keys not alphabetically sorted`,
  ).toEqual(sorted);

  for (const [key, value] of Object.entries(obj)) {
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      assertSorted(
        value as Record<string, unknown>,
        locale,
        path ? `${path}.${key}` : key,
      );
    }
  }
};

describe('i18n locale files are well-formed', () => {
  for (const name of ['en.json', 'fr.json'] as const) {
    it(`${name} has no duplicate keys`, () => {
      expect(findDuplicateKeys(localeText(name))).toEqual([]);
    });
  }

  it('en.json keys are alphabetically sorted at every level', () => {
    assertSorted(en as Record<string, unknown>, 'en');
  });

  it('fr.json keys are alphabetically sorted at every level', () => {
    assertSorted(fr as Record<string, unknown>, 'fr');
  });
});

// Rich text under about.note must flow through i18n-t + named slots, never
// inline HTML tags in the JSON values (security requirement, no v-html).
const getByPath = (obj: Record<string, unknown>, path: string): unknown =>
  path
    .split('.')
    .reduce<unknown>(
      (acc, key) => (acc as Record<string, unknown> | undefined)?.[key],
      obj,
    );

const collectStrings = (value: unknown): string[] => {
  if (typeof value === 'string') {
    return [value];
  }

  if (value !== null && typeof value === 'object') {
    return Object.values(value as Record<string, unknown>).flatMap(
      collectStrings,
    );
  }

  return [];
};

describe('about.note contains no embedded HTML', () => {
  it('en.json about.note has no < or > character in any string value', () => {
    const strings = collectStrings(getByPath(en, 'about.note'));

    for (const value of strings) {
      expect(value, `HTML-like character found in: ${value}`).not.toMatch(
        /[<>]/,
      );
    }
  });

  it('fr.json about.note has no < or > character in any string value', () => {
    const strings = collectStrings(getByPath(fr, 'about.note'));

    for (const value of strings) {
      expect(value, `HTML-like character found in: ${value}`).not.toMatch(
        /[<>]/,
      );
    }
  });
});
