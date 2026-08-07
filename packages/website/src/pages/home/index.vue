<template>
  <div class="l-page -home">
    <div class="u-radial" aria-hidden="true"></div>
    <Hero
      :greeting="t('home.greeting')"
      :name="t('home.name')"
      :role="t('home.role')"
      :body="body"
      :tags="tags"
      :watermark-text="t('home.marquee')"
      :primary-label="t('home.actions.projects')"
      :primary-href="projectsHref"
      :secondary-label="t('home.actions.linkedin')"
      :secondary-href="linkedinHref"
      secondary-external
    />
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue';

  import { useSeo } from '@/composables/useSeo';

  import { LINK_EXTERNAL_LINKEDIN } from '@/constants/links';

  import { Hero } from '@antsask/styleguide';

  defineOptions({ name: 'PageIndex' });

  definePageMeta({ layout: 'landing', path: '/' });

  const { t } = useI18n();
  const localePath = useLocalePath();

  const body = computed(() => [t('home.body.p1'), t('home.body.p2')]);

  const tags = computed(() => [
    t('home.tags.js'),
    t('home.tags.vue'),
    t('home.tags.ds'),
    t('home.tags.perf'),
    t('home.tags.ai'),
  ]);

  const projectsHref = computed(() => localePath('/projects'));
  const linkedinHref = LINK_EXTERNAL_LINKEDIN;

  useSeo({
    title: t('home.seo.title'),
    description: t('home.seo.description'),
  });

  // Brand-first home title: the global "%s | Alexis Besson" template would
  // append the name a second time.
  useHead({ titleTemplate: null });
</script>
