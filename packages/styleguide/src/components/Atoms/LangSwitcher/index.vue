<template>
  <button
    type="button"
    class="a-langSwitcher"
    :aria-label="ariaLabel"
    @click="emit('change', targetLocale)"
  >
    <span class="a-langSwitcher__flag" aria-hidden="true">{{
      targetFlag
    }}</span>
    <Text tag="span" variant="eyebrow">{{ targetCode }}</Text>
  </button>
</template>

<script setup lang="ts">
  import { computed } from 'vue';

  import Text from '@/components/Atoms/Text/index.vue';

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
  const targetFlag = computed(() =>
    targetLocale.value === 'fr' ? '🇫🇷' : '🇬🇧',
  );
  const targetCode = computed(() => targetLocale.value.toUpperCase());
  const ariaLabel = computed(() =>
    targetLocale.value === 'fr' ? 'Switch to French' : 'Switch to English',
  );
</script>

<style src="./style.css" />
