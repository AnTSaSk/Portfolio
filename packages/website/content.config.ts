import { defineCollection, defineContentConfig, z } from '@nuxt/content';

const contentImage = z.object({
  src: z.string(),
  width: z.number(),
  height: z.number(),
  caption: z.string().optional(),
});

const blogSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.coerce.date(),
  tags: z.array(z.string()).min(1),
  cover: contentImage.optional(),
  updated: z.coerce.date().optional(),
  draft: z.boolean().optional(),
  author: z.string().optional(),
  readingTime: z.number().optional(),
});

const projectsSchema = z.object({
  title: z.string(),
  year: z.number(),
  stack: z.array(z.string()),
  shortDescription: z.string(),
  description: z.string(),
  period: z.string().optional(),
  links: z.array(z.object({ label: z.string(), href: z.string() })).optional(),
  cover: contentImage.optional(),
  gallery: z.array(contentImage).optional(),
  role: z.string().optional(),
  client: z.string().optional(),
  draft: z.boolean().optional(),
  highlight: z.boolean().optional(),
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
      schema: blogSchema,
    }),
    blogFr: defineCollection({
      type: 'page',
      source: 'blog/fr/**',
      schema: blogSchema,
    }),
    projectsEn: defineCollection({
      type: 'page',
      source: 'projects/en/**',
      schema: projectsSchema,
    }),
    projectsFr: defineCollection({
      type: 'page',
      source: 'projects/fr/**',
      schema: projectsSchema,
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
