<template>
  <div class="l-layoutDefault">
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
    <main class="l-layoutDefault__main">
      <slot />
    </main>
    <MainNav :links="links" :min="isFooterMin" />
  </div>
</template>

<script setup lang="ts">
  import { useLayoutShell } from '@/composables/useLayoutShell';

  import { Header, MainNav } from '@antsask/styleguide';

  defineOptions({ name: 'LayoutDefault' });

  const {
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
  } = useLayoutShell();
</script>
