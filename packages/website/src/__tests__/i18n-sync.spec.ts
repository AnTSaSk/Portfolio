import { describe, expect, it } from 'vitest';

import en from '../../i18n/locales/en.json';
import fr from '../../i18n/locales/fr.json';

const getKeys = (obj: Record<string, unknown>, prefix = ''): string[] => {
  return Object.entries(obj).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;

    if (typeof value === 'object' && value !== null) {
      return getKeys(value as Record<string, unknown>, path);
    }

    return [path];
  });
};

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
    ) => {
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
