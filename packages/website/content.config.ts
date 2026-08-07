import { defineCollection, defineContentConfig, z } from '@nuxt/content';
import { defineSitemapSchema } from '@nuxtjs/sitemap/content';

// `filter` and `onUrl` reach Nitro through `fn.toString()`, so they must be self-contained:
// an imported helper resolves to an undefined binding at runtime, and a closure variable is
// emitted verbatim and equally undefined. Hence the inlined, repetitive bodies below.
// `name` must match the collection key exactly: a typo silently drops both callbacks.
// The module derives `lastmod` from `updatedAt` on its own; deleting it here enforces the
// "no unverifiable date" rule (ADR-0049 D4) at the only point where the value exists.
const blogEnSitemap = (): ReturnType<typeof defineSitemapSchema> =>
  defineSitemapSchema({
    z,
    name: 'blogEn',
    // JS, never a SQL `draft <> true` clause: that drops NULL-draft rows, i.e. every
    // published item.
    filter: (entry) => !entry.draft,
    onUrl: (url) => {
      const slug = String(url.loc).split('/').filter(Boolean).pop() ?? '';

      url.loc = `/blog/${slug}`;
      url.alternatives = [
        { hreflang: 'en-US', href: `/blog/${slug}` },
        { hreflang: 'fr-FR', href: `/fr/blog/${slug}` },
        { hreflang: 'x-default', href: `/blog/${slug}` },
      ];
      delete url.lastmod;
    },
  });

const blogFrSitemap = (): ReturnType<typeof defineSitemapSchema> =>
  defineSitemapSchema({
    z,
    name: 'blogFr',
    filter: (entry) => !entry.draft,
    onUrl: (url) => {
      const slug = String(url.loc).split('/').filter(Boolean).pop() ?? '';

      url.loc = `/fr/blog/${slug}`;
      url.alternatives = [
        { hreflang: 'en-US', href: `/blog/${slug}` },
        { hreflang: 'fr-FR', href: `/fr/blog/${slug}` },
        { hreflang: 'x-default', href: `/blog/${slug}` },
      ];
      delete url.lastmod;
    },
  });

const projectsEnSitemap = (): ReturnType<typeof defineSitemapSchema> =>
  defineSitemapSchema({
    z,
    name: 'projectsEn',
    filter: (entry) => !entry.draft,
    onUrl: (url) => {
      const slug = String(url.loc).split('/').filter(Boolean).pop() ?? '';

      url.loc = `/projects/${slug}`;
      url.alternatives = [
        { hreflang: 'en-US', href: `/projects/${slug}` },
        { hreflang: 'fr-FR', href: `/fr/projets/${slug}` },
        { hreflang: 'x-default', href: `/projects/${slug}` },
      ];
      delete url.lastmod;
    },
  });

const projectsFrSitemap = (): ReturnType<typeof defineSitemapSchema> =>
  defineSitemapSchema({
    z,
    name: 'projectsFr',
    filter: (entry) => !entry.draft,
    onUrl: (url) => {
      const slug = String(url.loc).split('/').filter(Boolean).pop() ?? '';

      url.loc = `/fr/projets/${slug}`;
      url.alternatives = [
        { hreflang: 'en-US', href: `/projects/${slug}` },
        { hreflang: 'fr-FR', href: `/fr/projets/${slug}` },
        { hreflang: 'x-default', href: `/projects/${slug}` },
      ];
      delete url.lastmod;
    },
  });

const contentImage = z.object({
  src: z.string(),
  width: z.number(),
  height: z.number(),
  caption: z.string().optional(),
});

const blogSchema = (
  sitemap: ReturnType<typeof defineSitemapSchema>,
): z.ZodObject<Record<string, z.ZodTypeAny>> =>
  z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).min(1),
    cover: contentImage.optional(),
    updated: z.coerce.date().optional(),
    draft: z.boolean().optional(),
    author: z.string().optional(),
    readingTime: z.number().optional(),
    sitemap,
  });

const projectsSchema = (
  sitemap: ReturnType<typeof defineSitemapSchema>,
): z.ZodObject<Record<string, z.ZodTypeAny>> =>
  z.object({
    title: z.string(),
    year: z.number(),
    stack: z.array(z.string()),
    shortDescription: z.string(),
    description: z.string(),
    period: z.string().optional(),
    links: z
      .array(z.object({ label: z.string(), href: z.string() }))
      .optional(),
    cover: contentImage.optional(),
    gallery: z.array(contentImage).optional(),
    role: z.string().optional(),
    client: z.string().optional(),
    draft: z.boolean().optional(),
    highlight: z.boolean().optional(),
    sitemap,
  });

const legalSchema = z.object({
  title: z.string(),
  lastUpdated: z.coerce.date(),
});

const aboutSchema = z.object({
  title: z.string(),
});

export default defineContentConfig({
  collections: {
    blogEn: defineCollection({
      type: 'page',
      source: 'blog/en/**',
      schema: blogSchema(blogEnSitemap()),
    }),
    blogFr: defineCollection({
      type: 'page',
      source: 'blog/fr/**',
      schema: blogSchema(blogFrSitemap()),
    }),
    projectsEn: defineCollection({
      type: 'page',
      source: 'projects/en/**',
      schema: projectsSchema(projectsEnSitemap()),
    }),
    projectsFr: defineCollection({
      type: 'page',
      source: 'projects/fr/**',
      schema: projectsSchema(projectsFrSitemap()),
    }),
    legalEn: defineCollection({
      type: 'page',
      source: 'legal/en/**',
      schema: legalSchema,
    }),
    legalFr: defineCollection({
      type: 'page',
      source: 'legal/fr/**',
      schema: legalSchema,
    }),
    aboutEn: defineCollection({
      type: 'page',
      source: 'about/en/**',
      schema: aboutSchema,
    }),
    aboutFr: defineCollection({
      type: 'page',
      source: 'about/fr/**',
      schema: aboutSchema,
    }),
  },
});
