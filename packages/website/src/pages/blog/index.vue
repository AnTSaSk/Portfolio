<template>
  <div class="l-page -blog">
    <div class="l-container">
      <div class="l-container__wrapper">
        <Head
          variant="listing"
          :eyebrow="t('blog.listing.eyebrow')"
          :title="t('blog.listing.title')"
          :lede="t('blog.listing.lede')"
        />

        <Listing grid-variant="auto-fill">
          <template v-if="filtersVisible" #filter>
            <Filter
              :items="filterItems"
              :aria-label="t('blog.listing.filter.label')"
              @toggle="onToggleTag"
            />
          </template>

          <div v-if="isEmpty || noResults" class="l-page__state">
            <Heading :level="'h2'">
              {{
                isEmpty ? t('blog.listing.empty') : t('blog.listing.noResults')
              }}
            </Heading>
          </div>
          <template v-else>
            <CardArticle
              v-for="article in paginatedArticles"
              :key="article.path"
              :href="articleHref(article)"
              :title="article.title"
              :date="cardMeta(article)"
              :excerpt="article.description"
              :tags="article.tags"
              :image="articleImage(article)"
              :image-component="NuxtImg"
            />
          </template>

          <template #pagination>
            <Pagination
              :pages="totalPages"
              :current="currentPage"
              :has-prev="hasPrev"
              :has-next="hasNext"
              @select="onSelectPage"
              @prev="onPrevPage"
              @next="onNextPage"
            />
          </template>
        </Listing>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, resolveComponent, type Component } from 'vue';

  import { useLocaleContent } from '@/composables/useLocaleContent';
  import { useSeo } from '@/composables/useSeo';
  import { useTagFilters } from '@/composables/useTagFilters';

  import { formatDate } from '@/utils/formatDate';

  import {
    CardArticle,
    Filter,
    Head,
    Heading,
    Listing,
    Pagination,
  } from '@antsask/styleguide';

  /* global queryCollection */

  defineOptions({ name: 'PageBlog' });

  definePageMeta({ layout: 'default' });

  const PAGE_SIZE = 6;

  interface BlogArticle {
    title: string;
    description: string;
    date: string;
    tags: string[];
    draft?: boolean;
    readingTime?: number;
    path: string;
    cover?: { src: string; width: number; height: number };
  }

  const NuxtImg = resolveComponent('NuxtImg') as Component;

  const articleImage = (
    article: BlogArticle,
  ): { src: string; alt: string } | undefined =>
    article.cover ? { src: article.cover.src, alt: article.title } : undefined;

  const { t, locale } = useI18n();
  const localePath = useLocalePath();
  const { collection } = useLocaleContent('blog');

  // The content `path` embeds the locale folder (/blog/en/<slug>), which is
  // not the routable URL. Link to the localized article route built from the
  // slug (last path segment): /blog/<slug> (EN) or /fr/blog/<slug> (FR).
  const articleHref = (article: BlogArticle): string => {
    const slug = article.path.split('/').filter(Boolean).pop() ?? '';

    return localePath(`/blog/${slug}`);
  };

  const cardMeta = (article: BlogArticle): string =>
    t('blog.card.meta', {
      date: formatDate(article.date, locale.value),
      n: article.readingTime ?? 1,
    });

  // Read the data ref returned by useAsyncData directly: it is serialized
  // into the Nuxt payload and available at client hydration. A local ref
  // populated as a side effect of the handler is NOT in the payload, so it
  // resets to [] on the client (the handler does not re-run on hydration),
  // causing a server/client children mismatch.
  //
  // Draft filtering happens client-side (publishedArticles): a SQL
  // `draft <> true` clause drops rows where draft is NULL (absent
  // frontmatter), which is every non-draft article.
  const { data: rawArticles } = useAsyncData(
    'blog-listing',
    async () =>
      (await queryCollection(collection.value)
        .order('date', 'DESC')
        .all()) as BlogArticle[],
    { watch: [collection], default: (): BlogArticle[] => [] },
  );

  const publishedArticles = computed<BlogArticle[]>(() =>
    (rawArticles.value ?? []).filter((article) => !article.draft),
  );

  const sortedArticles = computed<BlogArticle[]>(() =>
    [...publishedArticles.value].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    ),
  );

  const selectedTag = ref<string | null>(null);

  const { items: filterItems, isVisible: filtersVisible } = useTagFilters({
    values: computed(() => sortedArticles.value.map((article) => article.tags)),
    selected: selectedTag,
    allLabel: computed(() => t('blog.listing.filter.all')),
    threshold: 2,
    cap: 8,
  });

  const filteredArticles = computed<BlogArticle[]>(() => {
    if (selectedTag.value === null) {
      return sortedArticles.value;
    }

    const tag = selectedTag.value;

    return sortedArticles.value.filter((article) => article.tags.includes(tag));
  });

  const paginatedArticles = computed<BlogArticle[]>(() =>
    filteredArticles.value.slice(
      (currentPage.value - 1) * PAGE_SIZE,
      currentPage.value * PAGE_SIZE,
    ),
  );

  const isEmpty = computed(() => sortedArticles.value.length === 0);
  const noResults = computed(
    () => !isEmpty.value && filteredArticles.value.length === 0,
  );

  const totalPages = computed(() =>
    Math.max(1, Math.ceil(filteredArticles.value.length / PAGE_SIZE)),
  );
  const currentPage = ref(1);
  const hasPrev = computed(() => currentPage.value > 1);
  const hasNext = computed(() => currentPage.value < totalPages.value);

  const onToggleTag = (id: string): void => {
    selectedTag.value = id === 'all' ? null : id;
    currentPage.value = 1;
  };

  const onSelectPage = (page: number): void => {
    currentPage.value = page;
  };

  const onPrevPage = (): void => {
    if (hasPrev.value) {
      currentPage.value -= 1;
    }
  };

  const onNextPage = (): void => {
    if (hasNext.value) {
      currentPage.value += 1;
    }
  };

  useSeo({
    title: t('blog.seo.title'),
    description: t('blog.seo.description'),
  });
</script>
