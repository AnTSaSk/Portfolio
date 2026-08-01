<template>
  <div
    aria-hidden="true"
    style="position: absolute; width: 0; height: 0; overflow: hidden"
    v-html="sprite"
  />
  <NuxtLayout name="error">
    <div class="l-page -error">
      <div class="u-radial" aria-hidden="true"></div>
      <div class="l-container">
        <div class="l-container__wrapper">
          <div class="l-page__error">
            <Text tag="p" variant="eyebrow" class="l-page__errorEyebrow">
              {{ t('error.eyebrow') }}
            </Text>
            <Heading tag="h1" level="h1" class="l-page__errorCode">
              {{ statusCode }}
            </Heading>
            <Text tag="p" variant="eyebrow" class="l-page__errorSub">
              {{ sub }}
            </Text>
            <Text tag="p" variant="lede" tone="muted" class="l-page__errorLead">
              {{ lead }}
            </Text>
            <nav class="l-page__errorActions" :aria-label="t('error.eyebrow')">
              <Button
                variant="primary"
                type="link"
                :href="homeHref"
                @click.prevent="goTo(homeHref)"
              >
                {{ t('error.actions.home') }}
              </Button>
              <Link
                variant="quiet"
                :href="blogHref"
                @click.prevent="goTo(blogHref)"
              >
                {{ t('layouts.nav.blog') }}
              </Link>
              <Link
                variant="quiet"
                :href="projectsHref"
                @click.prevent="goTo(projectsHref)"
              >
                {{ t('layouts.nav.projects') }}
              </Link>
            </nav>
          </div>
        </div>
      </div>
      <Watermark :text="marquee" />
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
  import sprite from '@antsask/styleguide/src/assets/sprite.svg?raw';
  import { computed } from 'vue';

  import { Button, Heading, Link, Text, Watermark } from '@antsask/styleguide';

  interface Props {
    error: { statusCode?: number };
  }

  defineOptions({ name: 'AppError' });

  const { error } = defineProps<Props>();

  const { t } = useI18n();
  const localePath = useLocalePath();

  const statusCode = computed(() => error.statusCode ?? 500);
  const is404 = computed(() => statusCode.value === 404);
  const key = computed(() => (is404.value ? '404' : 'default'));

  const sub = computed(() => t(`error.sub.${key.value}`));
  const lead = computed(() => t(`error.lead.${key.value}`));
  const marquee = computed(
    () => `${statusCode.value}/${t(`error.title.${key.value}`)}`,
  );

  const homeHref = computed(() => localePath('/'));
  const blogHref = computed(() => localePath('/blog'));
  const projectsHref = computed(() => localePath('/projects'));

  // error.vue replaces app.vue and lives outside routing; clearError is the
  // only way to leave the error state and navigate.
  const goTo = (path: string): Promise<void> => clearError({ redirect: path });
</script>
