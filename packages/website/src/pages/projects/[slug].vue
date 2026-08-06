<template>
  <div class="l-page -project">
    <div class="l-container">
      <div class="l-container__wrapper">
        <article v-if="project">
          <Head
            variant="article"
            :back-href="backHref"
            :back-label="t('projects.project.backToList')"
            :tags="project.stack"
            :title="project.title"
            :lede="project.shortDescription"
          />

          <MediaCover
            variant="poster"
            :image="coverImage"
            :image-component="NuxtImg"
            :category="project.title"
            placeholder-heading
            fetchpriority="high"
            loading="eager"
          />

          <div class="o-caseLayout">
            <div class="o-caseLayout__body">
              <ContentRenderer class="a-prose" :value="project" />
            </div>

            <aside class="m-facts">
              <MetaList
                :items="facts"
                :links="project.links"
                :links-label="t('projects.project.facts.links')"
                :aria-label="t('projects.project.factsAriaLabel')"
              />
            </aside>
          </div>

          <Gallery
            :items="galleryItems"
            variant="styleA"
            :image-component="NuxtImg"
            :aria-label="t('projects.project.galleryAriaLabel')"
          />
        </article>
        <p v-else class="a-prose">{{ t('error.description.default') }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, resolveComponent, type Component } from 'vue';

  import { useLocaleContent } from '@/composables/useLocaleContent';
  import { useSeo } from '@/composables/useSeo';

  import { Gallery, Head, MediaCover, MetaList } from '@antsask/styleguide';

  const NuxtImg = resolveComponent('NuxtImg') as Component;

  /* global queryCollection, createError */
  interface ProjectLink {
    label: string;
    href: string;
  }

  interface ProjectGalleryItem {
    src: string;
    width: number;
    height: number;
    caption?: string;
  }

  interface ProjectContent {
    title: string;
    year: number;
    stack: string[];
    shortDescription: string;
    description: string;
    period?: string;
    role?: string;
    client?: string;
    links?: ProjectLink[];
    cover?: { src: string; width: number; height: number };
    gallery?: ProjectGalleryItem[];
    draft?: boolean;
    path: string;
  }

  defineOptions({ name: 'PageProjectCaseStudy' });

  definePageMeta({ layout: 'default' });

  const route = useRoute();
  const { t, locale } = useI18n();
  const localePath = useLocalePath();
  const { collection } = useLocaleContent('projects');

  const slug = computed(() => String(route.params.slug));
  const projectPath = computed(() => `/projects/${locale.value}/${slug.value}`);
  const backHref = computed(() => localePath('/projects'));

  const { data } = useAsyncData(
    `project-${slug.value}`,
    async () => {
      const found = (await queryCollection(collection.value)
        .where('path', '=', projectPath.value)
        .first()) as ProjectContent | null;

      if (!found) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Project not found',
          fatal: true,
        });
      }

      const relatedAll = (await queryCollection(collection.value)
        .where('path', '<>', found.path)
        .all()) as ProjectContent[];

      return {
        project: found,
        related: relatedAll
          .filter((item) => !item.draft)
          .sort((a, b) => b.year - a.year)
          .slice(0, 3),
      };
    },
    { watch: [collection] },
  );

  const project = computed<ProjectContent | null>(
    () => data.value?.project ?? null,
  );
  const facts = computed(() => {
    if (!project.value) {
      return [];
    }

    return [
      {
        term: t('projects.project.facts.year'),
        value: String(project.value.year),
      },
      { term: t('projects.project.facts.role'), value: project.value.role },
      { term: t('projects.project.facts.client'), value: project.value.client },
      { term: t('projects.project.facts.period'), value: project.value.period },
      { term: t('projects.project.facts.stack'), tags: project.value.stack },
    ];
  });

  const coverImage = computed(() => {
    if (!project.value?.cover) {
      return undefined;
    }

    return {
      src: project.value.cover.src,
      alt: project.value.title,
      width: project.value.cover.width,
      height: project.value.cover.height,
    };
  });

  const galleryItems = computed(() => {
    if (project.value?.gallery && project.value.gallery.length > 0) {
      return project.value.gallery.map((g) => ({
        image: {
          src: g.src,
          alt: g.caption ?? project.value?.title ?? '',
          width: g.width,
          height: g.height,
        },
        caption: g.caption,
      }));
    }

    return [{}, {}, {}];
  });

  useSeo({
    title: computed(() => project.value?.title ?? ''),
    description: computed(() => project.value?.shortDescription ?? ''),
    type: 'article',
    image: coverImage,
  });
</script>
