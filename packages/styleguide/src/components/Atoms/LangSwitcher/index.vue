<template>
  <button
    type="button"
    class="a-langSwitcher"
    :aria-label="ariaLabel"
    @click="emit('change', targetLocale)"
  >
    <span class="a-langSwitcher__flag" aria-hidden="true">
      {{ currentFlag }}
    </span>
    <Text tag="span" variant="eyebrow">{{ currentCode }}</Text>
  </button>
</template>

<script setup lang="ts">
  import { computed } from 'vue';

  import Text from '../Text/index.vue';

  export type LangSwitcherLocale = 'en' | 'fr';

  export interface Props {
    locale: LangSwitcherLocale;
  }

  defineOptions({ name: 'AtomLangSwitcher' });

  const props = defineProps<Props>();

  const emit = defineEmits<{
    change: [locale: LangSwitcherLocale];
  }>();

  const targetLocale = computed<LangSwitcherLocale>(() =>
    props.locale === 'en' ? 'fr' : 'en',
  );
  const currentFlag = computed(() => (props.locale === 'fr' ? '🇫🇷' : '🇬🇧'));
  const currentCode = computed(() => props.locale.toUpperCase());
  const ariaLabel = computed(() =>
    targetLocale.value === 'fr' ? 'Switch to French' : 'Switch to English',
  );
</script>

<style src="./style.css" />
