import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const writing = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/writing' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    external: z.boolean().default(false),
    url: z.string().url().optional(),
    source: z.string().optional(),
    description: z.string().optional(),
    tags: z.array(z.string()).default([]),
  }).refine((d) => !d.external || !!d.url, {
    message: 'external entries require a url',
    path: ['url'],
  }),
});

export const collections = { writing };
