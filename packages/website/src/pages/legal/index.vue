<template>
  <div class="l-page -legal">
    <div class="l-container">
      <div class="l-container__wrapper">
        <template v-if="doc">
          <Heading level="h1">{{ doc.title }}</Heading>

          <Text variant="caption" tone="muted">{{ lastUpdatedLabel }}</Text>

          <ContentRenderer class="a-prose" :value="doc" />
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue';

  import { useLocaleContent } from '@/composables/useLocaleContent';
  import { useSeo } from '@/composables/useSeo';

  import { formatDate } from '@/utils/formatDate';

  import { Heading, Text } from '@antsask/styleguide';

  /* global queryCollection, createError */

  interface LegalDoc {
    title: string;
    lastUpdated: Date;
    path: string;
  }

  defineOptions({ name: 'PageLegal' });

  definePageMeta({ layout: 'default' });

  const { t, locale } = useI18n();
  const { collection } = useLocaleContent('legal');

  const noticePath = computed(() => `/legal/${locale.value}/legal-notice`);

  const { data } = useAsyncData(
    'legal-notice',
    async () => {
      const found = (await queryCollection(collection.value)
        .where('path', '=', noticePath.value)
        .first()) as LegalDoc | null;

      if (!found) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Legal notice not found',
          fatal: true,
        });
      }

      return found;
    },
    { watch: [collection] },
  );

  const doc = computed<LegalDoc | null>(() => data.value ?? null);

  const lastUpdatedLabel = computed(() => {
    if (!doc.value) {
      return '';
    }

    return t('legal.lastUpdated', {
      date: formatDate(doc.value.lastUpdated, locale.value),
    });
  });

  useSeo({
    title: t('legal.seo.title'),
    description: t('legal.seo.description'),
  });
</script>
