<template>
  <div class="l-page -projects">
    <div class="l-container">
      <div class="l-container__wrapper">
        <Head
          variant="listing"
          :eyebrow="t('projects.listing.eyebrow')"
          :title="t('projects.listing.title')"
          :lede="t('projects.listing.lede')"
        />

        <Listing grid-variant="2up">
          <template v-if="filtersVisible" #filter>
            <Filter
              :items="filterItems"
              :aria-label="t('projects.listing.filter.label')"
              @toggle="onToggleStack"
            />
          </template>

          <template v-if="visibleFeature" #preGrid>
            <Feature
              :href="projectHref(visibleFeature)"
              :label="t('projects.listing.feature.label')"
              :meta="projectMeta(visibleFeature)"
              :title="visibleFeature.title"
              :lead="visibleFeature.shortDescription"
              :stack="visibleFeature.stack"
              :cta-label="t('projects.project.seeProject')"
              :image="projectImage(visibleFeature)"
              :sizes="FEATURE_SIZES"
            />
          </template>

          <div v-if="isEmpty || noResults" class="l-page__state">
            <Heading :level="'h2'">
              {{
                isEmpty
                  ? t('projects.listing.empty')
                  : t('projects.listing.noResults')
              }}
            </Heading>
          </div>
          <template v-else>
            <CardProject
              v-for="(project, index) in filteredProjects"
              :key="project.path"
              :href="projectHref(project)"
              :title="project.title"
              :meta="projectMeta(project)"
              :stack="project.stack"
              :desc="project.shortDescription"
              :image="projectImage(project)"
              :placeholder-variant="index % 2 === 1 ? '-topRight' : undefined"
              :sizes="CARD_SIZES"
              :fetchpriority="index === 0 ? 'high' : undefined"
              :loading="index === 0 ? 'eager' : 'lazy'"
            />
          </template>
        </Listing>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue';

  import { useLocaleContent } from '@/composables/useLocaleContent';
  import { useSeo } from '@/composables/useSeo';
  import { useTagFilters } from '@/composables/useTagFilters';

  import { pictureSourcesFor, srcsetFor } from '@/utils/imageVariants';

  import {
    CardProject,
    Feature,
    Filter,
    Head,
    Heading,
    Listing,
  } from '@antsask/styleguide';

  /* global queryCollection */

  defineOptions({ name: 'PageProjects' });

  definePageMeta({ layout: 'default' });

  interface ContentImage {
    src: string;
    width: number;
    height: number;
    caption?: string;
  }

  interface Project {
    title: string;
    shortDescription: string;
    description: string;
    year: number;
    period?: string;
    stack: string[];
    role?: string;
    client?: string;
    cover?: ContentImage;
    draft?: boolean;
    highlight?: boolean;
    path: string;
  }

  const { t } = useI18n();
  const localePath = useLocalePath();
  const { collection } = useLocaleContent('projects');

  // Two columns from 768px, gap 32px, .l-container capped at 1280px
  // -> (1280 - 32) / 2 = 624px.
  const CARD_SIZES = '(min-width: 768px) 624px, 100vw';

  // Feature cover takes the 0.95fr column of `1.05fr 0.95fr` from 901px
  // -> 1280 * 0.95 / 2 = 608px.
  const FEATURE_SIZES = '(min-width: 901px) 608px, 100vw';

  const projectHref = (project: Project): string => {
    const slug = project.path.split('/').filter(Boolean).pop() ?? '';

    return localePath(`/projects/${slug}`);
  };

  const projectMeta = (project: Project): string =>
    t('projects.card.meta', {
      year: project.period ?? project.year,
      role: project.role,
    });

  const projectImage = (
    project: Project,
  ):
    | {
        src: string;
        alt: string;
        width: number;
        height: number;
        sources: Array<{ srcset: string; type: string }>;
        srcset: string;
      }
    | undefined =>
    project.cover
      ? {
          src: project.cover.src,
          alt: project.title,
          width: project.cover.width,
          height: project.cover.height,
          sources: pictureSourcesFor(project.cover.src, 'cover'),
          srcset: srcsetFor(project.cover.src, 'cover', 'webp'),
        }
      : undefined;

  const { data: rawProjects } = useAsyncData(
    'projects-listing',
    async () => (await queryCollection(collection.value).all()) as Project[],
    { watch: [collection], default: (): Project[] => [] },
  );

  const nonDraftProjects = computed<Project[]>(() =>
    (rawProjects.value ?? []).filter((project) => !project.draft),
  );

  const sortedProjects = computed<Project[]>(() =>
    [...nonDraftProjects.value].sort((a, b) => b.year - a.year),
  );

  const highlightedProject = computed<Project | undefined>(() =>
    sortedProjects.value.find((project) => project.highlight),
  );

  const nonHighlightedProjects = computed<Project[]>(() =>
    sortedProjects.value.filter((project) => !project.highlight),
  );

  const selectedStack = ref<string | null>(null);

  const visibleFeature = computed<Project | undefined>(() => {
    const highlighted = highlightedProject.value;

    if (!highlighted) {
      return undefined;
    }

    if (selectedStack.value === null) {
      return highlighted;
    }

    return highlighted.stack.includes(selectedStack.value)
      ? highlighted
      : undefined;
  });

  const { items: filterItems, isVisible: filtersVisible } = useTagFilters({
    values: computed(() =>
      sortedProjects.value.map((project) => project.stack),
    ),
    selected: selectedStack,
    allLabel: computed(() => t('projects.listing.filter.all')),
    threshold: 1,
    cap: 8,
  });

  const filteredProjects = computed<Project[]>(() => {
    if (selectedStack.value === null) {
      return nonHighlightedProjects.value;
    }

    const stack = selectedStack.value;

    return nonHighlightedProjects.value.filter((project) =>
      project.stack.includes(stack),
    );
  });

  const isEmpty = computed(() => sortedProjects.value.length === 0);
  const noResults = computed(
    () =>
      !isEmpty.value &&
      filteredProjects.value.length === 0 &&
      visibleFeature.value === undefined,
  );

  const onToggleStack = (id: string): void => {
    selectedStack.value = id === 'all' ? null : id;
  };

  useSeo({
    title: t('projects.seo.title'),
    description: t('projects.seo.description'),
  });
</script>
