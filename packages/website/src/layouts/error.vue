<template>
  <div class="l-layoutError -fullscreen">
    <Header
      :scrolled="isScrolled"
      :theme="resolvedTheme"
      :locale="currentLocale"
      :logo-href="homeHref"
      :logo-label="t('layouts.header.logoLabel')"
      @toggle-theme="toggleTheme"
      @change-lang="onChangeLang"
    />
    <main class="l-layoutError__main">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue';

  import { useScrollY } from '@/composables/useScrollY';
  import { useTheme } from '@/composables/useTheme';

  import { Header } from '@antsask/styleguide';

  defineOptions({ name: 'LayoutError' });

  type Locale = 'en' | 'fr';

  const route = useRoute();
  const { t } = useI18n();
  // On a non-matched route i18n cannot resolve the active locale, so derive it
  // from the URL prefix (prefix_except_default: /fr → fr, otherwise en).
  const currentLocale = computed<Locale>(() =>
    /^\/fr(\/|$)/.test(route.path) ? 'fr' : 'en',
  );
  const localePath = useLocalePath();
  const { isScrolled } = useScrollY();
  const { resolvedTheme, toggleTheme } = useTheme();

  const homeHref = computed(() => localePath('/', currentLocale.value));

  // On the error screen there is no current route to translate, so the lang
  // switch clears the error and lands on the target locale's home.
  const onChangeLang = (target: Locale): void => {
    clearError({ redirect: localePath('/', target) });
  };
</script>
