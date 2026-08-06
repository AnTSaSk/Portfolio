<template>
  <div class="l-page -about">
    <div class="u-radial" aria-hidden="true"></div>
    <div class="l-container">
      <div class="l-container__wrapper">
        <div class="l-page__note">
          <ContentRenderer v-if="doc" class="a-prose" :value="doc" />
          <div class="l-page__legal">
            <Button type="link" variant="ghost" :href="legalHref">
              {{ t('about.legal') }}
            </Button>
          </div>
        </div>
      </div>
    </div>
    <Watermark :text="t('about.marquee')" />
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue';

  import { useLocaleContent } from '@/composables/useLocaleContent';
  import { useSeo } from '@/composables/useSeo';

  import { Button, Watermark } from '@antsask/styleguide';

  /* global queryCollection, createError */

  interface AboutDoc {
    title: string;
    path: string;
  }

  defineOptions({ name: 'PageAbout' });

  definePageMeta({ layout: 'landing' });

  const { t, locale } = useI18n();
  const localePath = useLocalePath();
  const { collection } = useLocaleContent('about');

  const legalHref = computed(() => localePath('/legal'));

  const aboutPath = computed(() => `/about/${locale.value}/about`);

  const { data, error } = await useAsyncData(
    'about',
    async () => {
      const found = (await queryCollection(collection.value)
        .where('path', '=', aboutPath.value)
        .first()) as AboutDoc | null;

      if (!found) {
        throw createError({
          statusCode: 404,
          statusMessage: 'About content not found',
          fatal: true,
        });
      }

      return found;
    },
    { watch: [collection] },
  );

  // useAsyncData captures a handler throw in `error` instead of propagating it:
  // without this re-throw the 404 never reaches Nuxt and the page renders a 200.
  if (error.value) {
    throw error.value;
  }

  const doc = computed<AboutDoc | null>(() => data.value ?? null);

  useSeo({
    title: t('about.seo.title'),
    description: t('about.seo.description'),
  });
</script>
