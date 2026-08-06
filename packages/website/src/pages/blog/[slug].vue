<template>
  <div class="l-page -article">
    <div class="l-container">
      <div class="l-container__wrapper">
        <article v-if="article">
          <Head
            variant="article"
            :back-href="backHref"
            :back-label="t('blog.article.backToList')"
            :tags="article.tags"
            :title="article.title"
            :lede="article.description"
            :meta-date="formatDate(article.date, locale)"
            :meta-duration="readingTimeLabel"
          />

          <MediaCover
            v-if="coverImage"
            variant="poster"
            :image="coverImage"
            :image-component="NuxtImg"
            :category="article.tags?.[0]"
            :caption="article.cover?.caption"
            :title="article.cover?.caption"
          />

          <div class="o-articleLayout">
            <TOC
              v-if="showToc"
              :items="tocItems"
              :active-id="activeId ?? undefined"
              :label="t('blog.article.toc')"
            />

            <div class="o-articleLayout__body">
              <ContentRenderer class="a-prose" :value="article" />

              <Author
                :initials="authorInitials"
                :name="authorName"
                :bio="t('blog.article.author.bio')"
                :links="authorLinks"
                :photo="authorPhoto"
              />
            </div>
          </div>
        </article>
      </div>
    </div>

    <Related
      v-if="relatedArticles.length > 0"
      :eyebrow="t('blog.article.related')"
      :aria-label="t('blog.article.related')"
    >
      <CardArticle
        v-for="related in relatedArticles"
        :key="related.path"
        :href="articleHref(related)"
        :title="related.title"
        :date="cardMeta(related)"
        :excerpt="related.description"
        :tags="related.tags"
      />
    </Related>
  </div>
</template>

<script setup lang="ts">
  import { computed, resolveComponent, type Component } from 'vue';

  import { useLocaleContent } from '@/composables/useLocaleContent';
  import { useSeo } from '@/composables/useSeo';
  import { useTocTracking } from '@/composables/useTocTracking';

  import { AUTHOR_PHOTO_PATH } from '@/constants/assets';
  import {
    LINK_EXTERNAL_GITHUB,
    LINK_EXTERNAL_LINKEDIN,
    LINK_EXTERNAL_TWITTER,
  } from '@/constants/links';

  import { formatDate } from '@/utils/formatDate';
  import { readingTime } from '@/utils/readingTime';

  import {
    Author,
    CardArticle,
    Head,
    MediaCover,
    Related,
    TOC,
  } from '@antsask/styleguide';

  // resolveComponent is typed to also return the raw name string; NuxtImg is a
  // globally registered component, so narrow it to Component for the DS prop.
  const NuxtImg = resolveComponent('NuxtImg') as Component;

  /* global queryCollection, createError, useBreadcrumbItems */

  interface TocLink {
    id: string;
    text?: string;
    depth?: number;
    children?: TocLink[];
  }

  interface BlogArticle {
    title: string;
    description: string;
    date: string;
    updated?: string;
    tags: string[];
    cover?: {
      src: string;
      width: number;
      height: number;
      caption?: string;
    };
    author?: string;
    draft?: boolean;
    readingTime?: number;
    path: string;
    body?: { toc?: { links?: TocLink[] }; value?: unknown };
  }

  defineOptions({ name: 'PageBlogArticle' });

  definePageMeta({ layout: 'default' });

  // Flattens nested TOC links (real @nuxt/content AST nests depth-3 headings
  // under depth-2 parents via `children`; the fixture used in tests is
  // already flat, so this is a no-op there).
  const flattenTocLinks = (links: TocLink[] = []): TocLink[] =>
    links.flatMap((link) => [link, ...flattenTocLinks(link.children ?? [])]);

  // Best-effort plain-text extraction from the MDC AST for a word-count estimate.
  const extractText = (node: unknown): string => {
    if (typeof node === 'string') {
      return node;
    }

    if (Array.isArray(node)) {
      return node.map(extractText).join(' ');
    }

    return '';
  };

  const route = useRoute();
  const { t, locale } = useI18n();
  const siteConfig = useSiteConfig();
  const img = useImage();
  const localePath = useLocalePath();
  const { collection } = useLocaleContent('blog');

  // The content `path` embeds the locale folder (/blog/en/<slug>), which is
  // not the routable URL. Link to the localized article route built from the
  // slug (last path segment): /blog/<slug> (EN) or /fr/blog/<slug> (FR).
  const articleHref = (item: BlogArticle): string => {
    const itemSlug = item.path.split('/').filter(Boolean).pop() ?? '';

    return localePath(`/blog/${itemSlug}`);
  };

  const cardMeta = (item: BlogArticle): string =>
    t('blog.card.meta', {
      date: formatDate(item.date, locale.value),
      n: item.readingTime ?? 1,
    });

  const slug = computed(() => String(route.params.slug));
  const articlePath = computed(() => `/blog/${locale.value}/${slug.value}`);
  const backHref = computed(() =>
    locale.value === 'fr' ? '/fr/blog' : '/blog',
  );

  // Read the payload-backed data ref from useAsyncData directly: it is
  // serialized into the Nuxt payload and available at client hydration. A
  // local ref populated as a side effect of the handler is NOT in the
  // payload, so it resets on the client (the handler does not re-run on
  // hydration), causing a server/client mismatch. The handler stays
  // side-effect free (Nuxt best practice) and returns the article plus its
  // related list in one pass.
  // Awaited: the schema-org graph freezes at setup in SSR prod, so the
  // article must be resolved before useSchemaOrg reads it.
  const { data, error } = await useAsyncData(
    `blog-article-${slug.value}`,
    async () => {
      const found = (await queryCollection(collection.value)
        .where('path', '=', articlePath.value)
        .first()) as BlogArticle | null;

      if (!found) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Article not found',
          fatal: true,
        });
      }

      // Draft filtering in JS (a SQL `draft <> true` clause drops NULL-draft
      // rows, i.e. every non-draft article); slice after filtering so drafts
      // never consume a related slot.
      const relatedAll = (await queryCollection(collection.value)
        .where('path', '<>', found.path)
        .order('date', 'DESC')
        .all()) as BlogArticle[];

      return {
        article: found,
        related: relatedAll.filter((item) => !item.draft).slice(0, 3),
      };
    },
    { watch: [collection] },
  );

  // useAsyncData captures a handler throw in `error` instead of propagating it:
  // without this re-throw the 404 never reaches Nuxt and the page renders a 200.
  if (error.value) {
    throw error.value;
  }

  const article = computed<BlogArticle | null>(
    () => data.value?.article ?? null,
  );
  const relatedArticles = computed<BlogArticle[]>(
    () => data.value?.related ?? [],
  );

  const tocLinks = computed(() =>
    flattenTocLinks(article.value?.body?.toc?.links ?? []),
  );

  const tocItems = computed(() =>
    tocLinks.value.map((link) => ({
      id: link.id,
      label: link.text ?? '',
      sub: (link.depth ?? 2) > 2,
    })),
  );

  const showToc = computed(() => tocLinks.value.length >= 3);

  const headingIds = computed(() => tocLinks.value.map((link) => link.id));

  // Runs after the awaited useAsyncData: the page setup is Suspense-wrapped,
  // so the component context survives the await and onMounted still registers.
  const { activeId: trackedActiveId } = useTocTracking(headingIds);

  const activeId = computed<string | null>(() =>
    article.value ? (trackedActiveId.value ?? null) : null,
  );

  const minutes = computed(() =>
    readingTime(
      extractText(article.value?.body?.value) ||
        article.value?.description ||
        '',
    ),
  );

  const readingTimeLabel = computed(() =>
    t('blog.article.readingTime', { n: minutes.value }),
  );

  const coverImage = computed(() => {
    if (!article.value?.cover) {
      return undefined;
    }

    return {
      src: article.value.cover.src,
      alt: article.value.title,
      width: article.value.cover.width,
      height: article.value.cover.height,
    };
  });

  const authorName = computed(() => article.value?.author ?? t('home.name'));

  const authorPhoto = {
    src: img(AUTHOR_PHOTO_PATH, { width: 128, height: 128, fit: 'cover' }),
  };

  const authorInitials = computed(() =>
    authorName.value
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase())
      .slice(0, 2)
      .join(''),
  );

  const authorLinks = computed(() => [
    {
      label: t('blog.article.author.linkGithub'),
      href: LINK_EXTERNAL_GITHUB,
      external: true,
    },
    {
      label: t('blog.article.author.linkLinkedin'),
      href: LINK_EXTERNAL_LINKEDIN,
      external: true,
    },
    {
      label: t('blog.article.author.linkX'),
      href: LINK_EXTERNAL_TWITTER,
      external: true,
    },
  ]);

  useSeo({
    title: computed(() => article.value?.title ?? ''),
    description: computed(() => article.value?.description ?? ''),
    type: 'article',
    image: coverImage,
  });

  useBreadcrumbItems();

  // SSR snapshots the schema-org graph at call time: pass the resolved value
  // (article is hydrated after the awaited useAsyncData), not a computed.
  const buildArticleSchema = (): Array<Record<string, unknown>> => {
    const current = article.value;

    if (!current) {
      return [];
    }

    const node: Record<string, unknown> = {
      '@type': 'Article',
      headline: current.title,
      datePublished: current.date,
      author: { '@id': `${siteConfig.url}/#identity` },
      inLanguage: locale.value,
    };

    if (current.updated) {
      node.dateModified = current.updated;
    }

    return [node];
  };

  useSchemaOrg(buildArticleSchema());
</script>
