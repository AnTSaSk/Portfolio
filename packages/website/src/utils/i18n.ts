// Constants
import { DEFAULT_LOCALE, SAVED_LOCALE } from '@/constants/i18n';

/**
 * getCurrentLocale
 *
 * Return order (DESC):
 * - Saved locale
 * - Navigator Locale
 * - Default locale
 *
 * @returns {string}
 */
export const getCurrentLocale = () => {
  let currentLocale = DEFAULT_LOCALE;
  const savedLocale = localStorage.getItem(SAVED_LOCALE);
  const navigatorLocale = navigator.language;

  if (navigatorLocale && !savedLocale) {
    currentLocale = navigatorLocale.split('-')[0];
  }

  if (savedLocale) {
    currentLocale = savedLocale;
  }

  return currentLocale;
};

/**
 * storeLocale
 *
 * @param {string}  value
 */
export const storeLocale = (value: string) => {
  const savedLocale = localStorage.getItem(SAVED_LOCALE);

  if (!savedLocale || savedLocale !== value) {
    localStorage.setItem(SAVED_LOCALE, value);
  }
};
