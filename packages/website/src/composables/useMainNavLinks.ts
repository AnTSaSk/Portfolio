import { computed, type ComputedRef } from 'vue';

import type { MainNavLink } from '@antsask/styleguide/src/components/Organisms/MainNav/index.vue';

export interface MainNavItem extends MainNavLink {
  current: boolean;
}

interface NavSection {
  labelKey: string;
  path: string;
  exact?: boolean;
}

const NAV_SECTIONS: NavSection[] = [
  { labelKey: 'layouts.nav.home', path: '/', exact: true },
  { labelKey: 'layouts.nav.blog', path: '/blog' },
  { labelKey: 'layouts.nav.projects', path: '/projects' },
  { labelKey: 'layouts.nav.about', path: '/about' },
];

export const useMainNavLinks = (): ComputedRef<MainNavItem[]> => {
  const route = useRoute();
  const { t } = useI18n();
  const localePath = useLocalePath();

  return computed<MainNavItem[]>(() =>
    NAV_SECTIONS.map((section) => {
      const href = localePath(section.path);

      return {
        label: t(section.labelKey),
        href,
        current: section.exact
          ? route.path === href
          : route.path === href || route.path.startsWith(`${href}/`),
      };
    }),
  );
};
