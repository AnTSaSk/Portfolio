import en from '../../../../i18n/locales/en.json';
import fr from '../../../../i18n/locales/fr.json';

type Messages = Record<string, unknown>;

function resolvePath(messages: Messages, key: string): string {
  const value = key
    .split('.')
    .reduce<unknown>(
      (acc, part) => (acc as Messages | undefined)?.[part],
      messages,
    );

  if (typeof value !== 'string') {
    throw new Error(`Missing i18n key in test fixture: ${key}`);
  }

  return value;
}

export type TestLocale = 'en' | 'fr';

// Builds a real t() resolving against the actual locale JSON files, so specs
// prove translations differ across EN/FR instead of echoing a stubbed key.
// Interpolates {token} placeholders from params, mirroring vue-i18n's named
// interpolation (unmatched tokens are dropped, not left as literal {token}).
export function createT(
  locale: TestLocale,
): (key: string, params?: Record<string, unknown>) => string {
  const messages = locale === 'fr' ? (fr as Messages) : (en as Messages);

  return (key: string, params?: Record<string, unknown>) => {
    const message = resolvePath(messages, key);

    if (!params) {
      return message;
    }

    return message.replace(/\{(\w+)\}/g, (_match, token: string) =>
      token in params ? String(params[token]) : '',
    );
  };
}
