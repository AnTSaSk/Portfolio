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
            :aria-label="t('projects.project.galleryAriaLabel')"
          />
        </article>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue';

  import { useLocaleContent } from '@/composables/useLocaleContent';
  import { useSeo } from '@/composables/useSeo';

  import { pictureSourcesFor, srcsetFor } from '@/utils/imageVariants';

  import { Gallery, Head, MediaCover, MetaList } from '@antsask/styleguide';

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

  const { data, error } = await useAsyncData(
    `project-${slug.value}`,
    async () => {
      const found = (await queryCollection(collection.value)
        .where('path', '=', projectPath.value)
        .first()) as ProjectContent | null;

      if (!found || found.draft) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Project not found',
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

  const project = computed<ProjectContent | null>(() => data.value ?? null);
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

    const { src, width, height } = project.value.cover;

    return {
      src,
      alt: project.value.title,
      width,
      height,
      sources: pictureSourcesFor(src, 'cover'),
      srcset: srcsetFor(src, 'cover', 'webp'),
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
          sources: pictureSourcesFor(g.src, 'gallery'),
          srcset: srcsetFor(g.src, 'gallery', 'webp'),
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
