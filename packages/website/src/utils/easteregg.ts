import { useI18n } from 'vue-i18n';

/**
 * logDecoration
 */
export const logDecoration = () => {
  const { t } = useI18n();

  const message = `
  Hello There ! 👋\n
  ${t('easteregg.log.message')}\n
  https://github.com/AnTSaSk\n
  https://www.linkedin.com/in/alexis-besson-web/\n
  `;
  const styles = ['font-size: 12px', 'color: #117340'].join(';');

  console.log('%c%s', styles, message);
};
