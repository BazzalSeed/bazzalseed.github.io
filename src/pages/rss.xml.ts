import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { sortEntries, entryHref } from '../lib/writing';
import { SITE } from '../lib/site';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const entries = sortEntries(await getCollection('writing'));
  return rss({
    title: SITE.name,
    description: 'Writing by Seed Zeng',
    site: context.site!,
    items: entries.map((e) => ({
      title: e.data.title,
      pubDate: e.data.date,
      description: e.data.description ?? e.data.source ?? '',
      link: e.data.external ? entryHref(e) : new URL(entryHref(e), context.site).href,
    })),
  });
}
