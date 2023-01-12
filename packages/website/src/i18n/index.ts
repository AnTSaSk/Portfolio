/*******************/
/**** LANGUAGES ****/
/*******************/
import messages from '@intlify/unplugin-vue-i18n/messages';
import { createI18n } from 'vue-i18n';

// Constants
import { AVAILABLE_LOCALES } from '@/constants/i18n';

// Utils
import { getCurrentLocale } from '@/utils/i18n';

/**************/
/**** I18N ****/
/**************/
const i18n = createI18n({
  legacy: false,
  locale: getCurrentLocale(),
  fallbackLocale: 'en',
  availableLocales: AVAILABLE_LOCALES,
  messages,
  globalInjection: true,
  escapeParameter: true,
});

// @ts-ignore - Error ts2589, "t" type is too deep
export const { locale, n, t } = i18n.global;
export default i18n;
