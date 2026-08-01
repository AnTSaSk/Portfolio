<template>
  <div class="l-layoutLanding -locked">
    <Header
      :scrolled="isScrolled"
      :theme="resolvedTheme"
      :locale="currentLocale"
      :logo-href="homeHref"
      :logo-label="t('layouts.header.logoLabel')"
      :social-links="socialLinks"
      @toggle-theme="toggleTheme"
      @change-lang="onChangeLang"
    />
    <main class="l-layoutLanding__main">
      <slot />
    </main>
    <MainNav :links="links" :min="isFooterMin" />
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue';

  import { useScrollY } from '@/composables/useScrollY';
  import { useTheme } from '@/composables/useTheme';

  import {
    LINK_EXTERNAL_GITHUB,
    LINK_EXTERNAL_LINKEDIN,
    LINK_EXTERNAL_TWITTER,
  } from '@/constants/links';

  import { Header, MainNav } from '@antsask/styleguide';

  defineOptions({ name: 'LayoutLanding' });

  interface NavLink {
    label: string;
    href: string;
    current: boolean;
  }

  interface SocialLink {
    icon: string;
    href: string;
    label: string;
  }

  const route = useRoute();
  const { locale, t } = useI18n();
  // Template refs auto-unwrap once; re-wrap locale.value in a computed so
  // both a real Composer ref and a plain-object stub unwrap consistently.
  const currentLocale = computed(() => locale.value);
  const switchLocalePath = useSwitchLocalePath();
  const localePath = useLocalePath();
  const { isScrolled, isFooterMin } = useScrollY();
  const { resolvedTheme, toggleTheme } = useTheme();

  const homeHref = computed(() => localePath('/'));

  const socialLinks = computed<SocialLink[]>(() => [
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

  const links = computed<NavLink[]>(() => [
    {
      label: t('layouts.nav.home'),
      href: localePath('/'),
      current: route.path === localePath('/'),
    },
    {
      label: t('layouts.nav.blog'),
      href: localePath('/blog'),
      current: route.path === localePath('/blog'),
    },
    {
      label: t('layouts.nav.projects'),
      href: localePath('/projects'),
      current: route.path === localePath('/projects'),
    },
    {
      label: t('layouts.nav.about'),
      href: localePath('/about'),
      current: route.path === localePath('/about'),
    },
  ]);

  const onChangeLang = (target: typeof locale.value): void => {
    navigateTo(switchLocalePath(target));
  };
</script>
