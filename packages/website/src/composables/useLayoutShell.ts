import { computed, type ComputedRef } from 'vue';

import { useMainNavLinks } from '@/composables/useMainNavLinks';
import { useScrollY } from '@/composables/useScrollY';
import { useTheme } from '@/composables/useTheme';

import {
  LINK_EXTERNAL_GITHUB,
  LINK_EXTERNAL_LINKEDIN,
  LINK_EXTERNAL_TWITTER,
} from '@/constants/links';

import type { SocialLink } from '@antsask/styleguide/src/components/Organisms/Header/index.vue';

type I18nComposer = ReturnType<typeof useI18n>;
type LocaleValue = I18nComposer['locale']['value'];

interface LayoutShell {
  t: I18nComposer['t'];
  currentLocale: ComputedRef<LocaleValue>;
  isScrolled: ReturnType<typeof useScrollY>['isScrolled'];
  isFooterMin: ReturnType<typeof useScrollY>['isFooterMin'];
  resolvedTheme: ReturnType<typeof useTheme>['resolvedTheme'];
  toggleTheme: ReturnType<typeof useTheme>['toggleTheme'];
  homeHref: ComputedRef<string>;
  socialLinks: ComputedRef<SocialLink[]>;
  links: ReturnType<typeof useMainNavLinks>;
  onChangeLang: (target: LocaleValue) => void;
}

export const useLayoutShell = (): LayoutShell => {
  const { locale, t } = useI18n();
  // Template refs auto-unwrap once; re-wrap locale.value in a computed so
  // both a real Composer ref and a plain-object stub unwrap consistently.
  const currentLocale = computed(() => locale.value);
  const switchLocalePath = useSwitchLocalePath();
  const localePath = useLocalePath();
  const { isScrolled, isFooterMin } = useScrollY();
  const { resolvedTheme, toggleTheme } = useTheme();

  const homeHref = computed(() => localePath('/'));

  const socialLinks: ComputedRef<SocialLink[]> = computed(() => [
    {
      icon: 'github',
      href: LINK_EXTERNAL_GITHUB,
      label: t('layouts.header.social.github'),
    },
    {
      icon: 'linkedin',
      href: LINK_EXTERNAL_LINKEDIN,
      label: t('layouts.header.social.linkedin'),
    },
    {
      icon: 'x',
      href: LINK_EXTERNAL_TWITTER,
      label: t('layouts.header.social.x'),
    },
  ]);

  const links = useMainNavLinks();

  const onChangeLang = (target: LocaleValue): void => {
    navigateTo(switchLocalePath(target));
  };

  return {
    t,
    currentLocale,
    isScrolled,
    isFooterMin,
    resolvedTheme,
    toggleTheme,
    homeHref,
    socialLinks,
    links,
    onChangeLang,
  };
};
