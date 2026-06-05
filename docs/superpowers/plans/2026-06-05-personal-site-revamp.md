# Personal Site Revamp Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the legacy jQuery/Bootstrap single-page site with a fast, lightweight Astro + Tailwind static site (light/dark, blog, lean IA) deployed on Vercel.

**Architecture:** Astro 5 static output. Theming via CSS custom properties switched by a `data-theme` attribute (no-flash inline script), not Tailwind's dark variant. Content is Markdown in an Astro content collection; a single "writing" feed renders local posts on-site and external articles as link-outs. Pure-text design, monospace accents, generous whitespace.

**Tech Stack:** Astro 5, Tailwind CSS 4 (`@tailwindcss/vite`), `astro:assets` (image optimization), `@astrojs/rss`, Vitest (unit tests for feed helpers), Vercel hosting.

**Reference spec:** `docs/superpowers/specs/2026-06-05-personal-site-revamp-design.md`

**Working branch:** `site-revamp` (already created).

**Isolation (IMPORTANT — do not break the current site):** The entire new site is
built inside a new `site/` subdirectory. The existing root files (`index.html`,
`assets/`, `CNAME`) are **left completely untouched** so the current site keeps
serving on GitHub Pages / seedzeng.com throughout development. The new site is
verified locally and on a Vercel **preview** URL first. Only after that passes do
we cut the domain over to Vercel (Task 11) and finally remove the old root files
(Task 13 — "devour the old site"). Nothing about the live site changes until then.

**Working directory & paths:**
- **All build/test/npm commands run from inside `site/`.** Commands are written as
  if the current directory is `site/` (e.g. `npm run build`).
- **All source paths in tasks are relative to `site/`** (e.g. `src/pages/index.astro`
  means `site/src/pages/index.astro`).
- **Exceptions** (repo-root-relative): everything under `docs/`, and all `git`
  commands (git operates on the whole repo regardless of cwd).

---

## File Structure

Root stays as-is (legacy site untouched). Everything new lives under `site/`:

```
index.html, assets/, CNAME       # LEGACY — untouched until Task 13
license.txt, .gitignore, docs/   # kept
site/                            # NEW Astro project (Vercel "Root Directory" = site)
  package.json                   # scripts + deps
  astro.config.mjs               # Astro config (site URL, integrations)
  tsconfig.json                  # TS config (Astro strict)
  vitest.config.ts               # Vitest config
  .gitignore                     # node_modules/, dist/, .astro/
  src/
    styles/global.css            # Tailwind import + theme tokens + base + prose
    content.config.ts            # writing collection schema (Astro 5 glob loader)
    lib/
      writing.ts                 # pure helpers: sortEntries(), entryHref(), isLocal()
      site.ts                    # site constants: name, socials, nav, bio, headline
    components/
      BaseHead.astro             # <head> meta/SEO
      Nav.astro                  # wordmark + links + ThemeToggle
      ThemeToggle.astro          # light/dark button
      Footer.astro               # social links
      WritingList.astro          # renders feed (limit optional)
      WorkTimeline.astro         # role timeline
    layouts/
      Base.astro                 # html shell, no-flash theme script, Nav, Footer
      Post.astro                 # blog post layout (prose)
    content/writing/             # one .md per entry (external = frontmatter only)
    assets/life/                 # life photos (optimized via astro:assets)
    pages/
      index.astro                # Home
      work.astro                 # Work
      writing/index.astro        # Writing feed
      writing/[...id].astro       # local post pages
      life.astro                 # Life gallery
      404.astro                  # not found
      rss.xml.ts                 # RSS feed
  test/
    writing.test.ts              # Vitest unit tests for lib/writing.ts
  public/
    favicon.svg
```

---

## Task 1: Scaffold Astro + Tailwind in an isolated `site/` directory

**Files:**
- Create: `site/package.json`, `site/astro.config.mjs`, `site/tsconfig.json`, `site/.gitignore`, `site/src/pages/index.astro` (temp), `site/src/styles/global.css`
- **Do NOT touch** root `index.html`, `assets/`, or `CNAME` — the current site must keep working.

- [ ] **Step 1: Create the isolated project directory.** The old site at the repo root stays exactly as-is and keeps serving live.

```bash
mkdir -p site
cd site
```
> From here on, all `npm`/`astro`/`npx` commands in the plan run from inside `site/`.
> All `src/...`, `test/...`, `public/...` paths are under `site/`.

- [ ] **Step 2: Initialize a minimal Astro project.**

Create `site/package.json`:

```json
{
  "name": "seedzeng",
  "type": "module",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "check": "astro check",
    "test": "vitest run"
  }
}
```

- [ ] **Step 3: Install Astro and create config files.**

```bash
npm install astro@^5
npm install -D typescript @astrojs/check vitest
```

Create `astro.config.mjs`:

```js
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://seedzeng.com',
  trailingSlash: 'never',
  build: { format: 'file' },
});
```

Create `tsconfig.json`:

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist", "legacy"]
}
```

- [ ] **Step 4: Add Tailwind 4 via the official integration command** (configures the `@tailwindcss/vite` plugin automatically).

```bash
npx astro add tailwind --yes
```

Then create `src/styles/global.css` (overwrite if the command created one):

```css
@import "tailwindcss";

:root {
  --bg: #faf8f4;
  --fg: #2b2722;
  --muted: #9c9486;
  --rule: #e6e0d6;
  --accent: #b04a2f;   /* terracotta */
  --link: #b04a2f;
  --post: #b04a2f;
  --mono: ui-monospace, "SF Mono", "JetBrains Mono", Menlo, Consolas, monospace;
  --sans: system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

[data-theme="dark"] {
  --bg: #0d1117;
  --fg: #c9d1d9;
  --muted: #8b949e;
  --rule: #21262d;
  --accent: #3fb950;   /* terminal green */
  --link: #58a6ff;     /* link blue */
  --post: #3fb950;
}

html { color-scheme: light dark; }
body {
  background: var(--bg);
  color: var(--fg);
  font-family: var(--sans);
  -webkit-font-smoothing: antialiased;
}
a { color: var(--link); }
::selection { background: var(--accent); color: var(--bg); }
```

- [ ] **Step 5: Create a temporary home page to verify the toolchain.**

Create `src/pages/index.astro`:

```astro
---
import '../styles/global.css';
---
<html lang="en" data-theme="light">
  <head><meta charset="utf-8" /><title>seedzeng — scaffold</title></head>
  <body>
    <main style="padding:2rem;font-family:var(--mono)">
      <p>$ scaffold ok</p>
    </main>
  </body>
</html>
```

- [ ] **Step 6: Verify dev + build work.**

Run: `npm run build`
Expected: build completes, `dist/index.html` is produced, exit code 0.

Run (optional manual): `npm run dev` then open the printed localhost URL — page shows `$ scaffold ok`. Ctrl-C to stop.

- [ ] **Step 7: Add build artifacts to a project-local gitignore.**

Create `site/.gitignore`:

```
node_modules/
dist/
.astro/
```

- [ ] **Step 8: Commit.** (run from anywhere in the repo — git is repo-root-relative)

```bash
git add site
git commit -m "chore: scaffold isolated Astro + Tailwind site (root legacy untouched)"
```

---

## Task 2: Site constants + feed helper library (with unit tests)

**Files:**
- Create: `src/lib/site.ts`, `src/lib/writing.ts`, `test/writing.test.ts`, `vitest.config.ts`

- [ ] **Step 1: Create site constants.** Single source of truth for identity/nav/socials.

Create `src/lib/site.ts`:

```ts
export const SITE = {
  name: 'Seed Zeng',
  wordmark: 'seed zeng',
  url: 'https://seedzeng.com',
  headline: 'Senior Staff Software Engineer @ DoorDash',
  meta: 'ex-Meta · ex-Klaviyo · angel investor · Boston',
  bio: "Engineering leader for DoorDash's core online datastores — the storage layer the whole business runs on. Early engineer at Klaviyo (scaled the pipeline ~300×). Physics + CS background: scientist's curiosity, engineer's execution. Angel investor in early-stage startups.",
};

export const NAV = [
  { href: '/work', label: 'work' },
  { href: '/writing', label: 'writing' },
  { href: '/life', label: 'life' },
];

export const SOCIALS = [
  { href: 'https://github.com/bazzalseed', label: 'github' },
  { href: 'https://www.linkedin.com/in/seedzeng/', label: 'linkedin' },
  { href: 'https://medium.com/@seed.zeng', label: 'medium' },
  { href: 'mailto:cdzengpeiyun@gmail.com', label: 'email' },
];
```

> NOTE: confirm the GitHub username (`bazzalseed` inferred from the repo). The implementer should verify and correct if needed before commit.

- [ ] **Step 2: Write the failing test for feed helpers.**

Create `test/writing.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { sortEntries, entryHref, isLocal } from '../src/lib/writing';

const mk = (id: string, date: string, external: boolean, url?: string) => ({
  id,
  data: { title: id, date: new Date(date), external, url, source: external ? 'Ext' : undefined },
});

describe('writing helpers', () => {
  it('sorts entries newest first', () => {
    const out = sortEntries([mk('a', '2023-01-01', false), mk('b', '2024-01-01', true, 'https://x')]);
    expect(out.map((e) => e.id)).toEqual(['b', 'a']);
  });

  it('isLocal is true only for non-external entries', () => {
    expect(isLocal(mk('a', '2023-01-01', false))).toBe(true);
    expect(isLocal(mk('b', '2024-01-01', true, 'https://x'))).toBe(false);
  });

  it('entryHref returns external url for external entries', () => {
    expect(entryHref(mk('b', '2024-01-01', true, 'https://x.com/p'))).toBe('https://x.com/p');
  });

  it('entryHref returns local route for local entries', () => {
    expect(entryHref(mk('my-post', '2024-01-01', false))).toBe('/writing/my-post');
  });
});
```

Create `vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config';
export default defineConfig({ test: { include: ['test/**/*.test.ts'] } });
```

- [ ] **Step 3: Run the test to verify it fails.**

Run: `npm test`
Expected: FAIL — `Cannot find module '../src/lib/writing'`.

- [ ] **Step 4: Implement the helpers.**

Create `src/lib/writing.ts`:

```ts
export type WritingEntry = {
  id: string;
  data: {
    title: string;
    date: Date;
    external: boolean;
    url?: string;
    source?: string;
    description?: string;
    tags?: string[];
  };
};

export function sortEntries<T extends WritingEntry>(entries: T[]): T[] {
  return [...entries].sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export function isLocal(entry: WritingEntry): boolean {
  return !entry.data.external;
}

export function entryHref(entry: WritingEntry): string {
  if (entry.data.external) {
    if (!entry.data.url) throw new Error(`External entry "${entry.id}" missing url`);
    return entry.data.url;
  }
  return `/writing/${entry.id}`;
}
```

- [ ] **Step 5: Run the test to verify it passes.**

Run: `npm test`
Expected: PASS — 4 tests green.

- [ ] **Step 6: Commit.**

```bash
git add src/lib test vitest.config.ts
git commit -m "feat: site constants + tested writing feed helpers"
```

---

## Task 3: Content collection schema + seed entries

**Files:**
- Create: `src/content.config.ts`, six files in `src/content/writing/`

- [ ] **Step 1: Define the writing collection (Astro 5 glob loader).**

Create `src/content.config.ts`:

```ts
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
  }),
});

export const collections = { writing };
```

- [ ] **Step 2: Create the 5 external seed entries** (frontmatter only).

Create `src/content/writing/cassandra-unleashed.md`:

```md
---
title: "Cassandra Unleashed: How We Enhanced Cassandra Fleet's Efficiency and Performance"
date: 2024-01-30
external: true
url: "https://doordash.engineering/2024/01/30/cassandra-unleashed-how-we-enhanced-cassandra-fleets-efficiency-and-performance/"
source: "DoorDash Engineering"
tags: ["cassandra", "storage", "performance"]
---
```

Create `src/content/writing/api-first-kafka-topics.md`:

```md
---
title: "An API-First Approach to Kafka Topic Creation"
date: 2023-12-05
external: true
url: "https://doordash.engineering/2023/12/05/api-first-approach-to-kafka-topic-creation/"
source: "DoorDash Engineering"
tags: ["kafka", "streaming"]
---
```

Create `src/content/writing/high-cardinality-large-state.md`:

```md
---
title: "Stream Processing with High Cardinality and Large State at Klaviyo"
date: 2022-06-01
external: true
url: "https://www.ververica.com/blog/stream-processing-with-high-cardinality-and-large-state-at-klaviyo"
source: "Ververica"
tags: ["flink", "streaming"]
---
```

Create `src/content/writing/realtime-analytics-stream-processing.md`:

```md
---
title: "Scaling Klaviyo's Real-Time Analytics System with Stream Processing"
date: 2021-09-01
external: true
url: "https://klaviyo.tech/scaling-klaviyos-real-time-analytics-system-with-stream-processing-4b3bb87cd6b5"
source: "klaviyo.tech"
tags: ["streaming", "analytics"]
---
```

Create `src/content/writing/auditing-replaying-athena.md`:

```md
---
title: "Auditing and Replaying Billions of Streaming Events with AWS Athena"
date: 2021-03-01
external: true
url: "https://klaviyo.tech/auditing-and-replaying-billions-of-streaming-events-with-aws-athena-398ecc58a914"
source: "klaviyo.tech"
tags: ["aws", "streaming"]
---
```

> NOTE: The two `klaviyo.tech` / Ververica dates are approximate (month-level). The implementer should confirm exact publish dates from the articles if easily available; otherwise these year/month values are acceptable for ordering.

- [ ] **Step 3: Create the first local post** (exercises the blog pipeline end-to-end).

Create `src/content/writing/rebuilding-seedzeng.md`:

```md
---
title: "Rebuilding seedzeng.com"
date: 2026-06-05
description: "Why I rebuilt my personal site on Astro — lighter, faster, and finally with a blog."
tags: ["meta", "astro"]
---

I rebuilt this site from a heavyweight jQuery template into a lean Astro static
site. The goals were simple: load fast (including from China), be easy to write
in, and finally have a real place to publish.

More to come — this post mostly exists to prove the blog pipeline works.
```

- [ ] **Step 4: Verify the schema accepts all entries.**

Run: `npm run build`
Expected: build succeeds; no Zod schema errors printed for the `writing` collection.

- [ ] **Step 5: Commit.**

```bash
git add src/content.config.ts src/content
git commit -m "feat: writing collection schema + seed entries"
```

---

## Task 4: Theme toggle + Nav + Footer + Base layout

**Files:**
- Create: `src/components/BaseHead.astro`, `src/components/ThemeToggle.astro`, `src/components/Nav.astro`, `src/components/Footer.astro`, `src/layouts/Base.astro`

- [ ] **Step 1: Create the head/meta component.**

Create `src/components/BaseHead.astro`:

```astro
---
import { SITE } from '../lib/site';
interface Props { title?: string; description?: string; }
const { title, description = SITE.bio } = Astro.props;
const fullTitle = title ? `${title} — ${SITE.name}` : SITE.name;
const canonical = new URL(Astro.url.pathname, Astro.site).href;
---
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>{fullTitle}</title>
<meta name="description" content={description} />
<link rel="canonical" href={canonical} />
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<link rel="alternate" type="application/rss+xml" title={SITE.name} href="/rss.xml" />
<meta property="og:title" content={fullTitle} />
<meta property="og:description" content={description} />
<meta property="og:type" content="website" />
<meta property="og:url" content={canonical} />
<meta name="twitter:card" content="summary" />
```

- [ ] **Step 2: Create the theme toggle.**

Create `src/components/ThemeToggle.astro`:

```astro
<button
  id="theme-toggle"
  type="button"
  aria-label="Toggle color theme"
  class="font-[family-name:var(--mono)] text-[color:var(--accent)] text-sm hover:opacity-70 transition-opacity"
>◐ <span data-toggle-label>dark</span></button>

<script>
  const btn = document.getElementById('theme-toggle');
  const root = document.documentElement;
  const label = btn?.querySelector('[data-toggle-label]');
  const render = () => {
    const dark = root.dataset.theme === 'dark';
    if (label) label.textContent = dark ? 'light' : 'dark';
    if (btn) btn.firstChild!.textContent = dark ? '◑ ' : '◐ ';
  };
  btn?.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    localStorage.setItem('theme', next);
    render();
  });
  render();
</script>
```

- [ ] **Step 3: Create the nav.**

Create `src/components/Nav.astro`:

```astro
---
import { SITE, NAV } from '../lib/site';
import ThemeToggle from './ThemeToggle.astro';
---
<nav class="flex items-center justify-between pt-6 font-[family-name:var(--mono)] text-sm">
  <a href="/" class="text-[color:var(--fg)] no-underline hover:opacity-70">{SITE.wordmark}</a>
  <div class="flex items-center gap-5">
    {NAV.map((item) => (
      <a href={item.href} class="text-[color:var(--fg)] no-underline hover:opacity-70">{item.label}</a>
    ))}
    <ThemeToggle />
  </div>
</nav>
```

- [ ] **Step 4: Create the footer.**

Create `src/components/Footer.astro`:

```astro
---
import { SOCIALS, SITE } from '../lib/site';
const year = new Date().getFullYear();
---
<footer class="mt-24 pt-6 border-t border-[color:var(--rule)] font-[family-name:var(--mono)] text-sm text-[color:var(--muted)] flex flex-wrap items-center justify-between gap-3">
  <div class="flex gap-4">
    {SOCIALS.map((s) => (
      <a href={s.href} class="text-[color:var(--link)] no-underline hover:opacity-70">{s.label}</a>
    ))}
  </div>
  <span>© {year} {SITE.name}</span>
</footer>
```

- [ ] **Step 5: Create the base layout with the no-flash theme script.**

Create `src/layouts/Base.astro`:

```astro
---
import '../styles/global.css';
import BaseHead from '../components/BaseHead.astro';
import Nav from '../components/Nav.astro';
import Footer from '../components/Footer.astro';
interface Props { title?: string; description?: string; }
const { title, description } = Astro.props;
---
<!doctype html>
<html lang="en">
  <head>
    <BaseHead title={title} description={description} />
    <script is:inline>
      (function () {
        var t = localStorage.getItem('theme');
        if (!t) t = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        document.documentElement.dataset.theme = t;
      })();
    </script>
  </head>
  <body>
    <div class="mx-auto max-w-2xl px-6 pb-12">
      <Nav />
      <main>
        <slot />
      </main>
      <Footer />
    </div>
  </body>
</html>
```

- [ ] **Step 6: Verify build + type check.**

Run: `npm run build && npm run check`
Expected: both succeed, exit code 0.

- [ ] **Step 7: Commit.**

```bash
git add src/components src/layouts
git commit -m "feat: base layout, nav, footer, theme toggle (no-flash)"
```

---

## Task 5: Home page

**Files:**
- Create: `src/components/WritingList.astro`
- Modify (replace temp): `src/pages/index.astro`

- [ ] **Step 1: Create the writing list component.**

Create `src/components/WritingList.astro`:

```astro
---
import { getCollection } from 'astro:content';
import { sortEntries, entryHref } from '../lib/writing';
interface Props { limit?: number; }
const { limit } = Astro.props;
const all = sortEntries(await getCollection('writing'));
const entries = limit ? all.slice(0, limit) : all;
---
<ul class="list-none p-0 m-0">
  {entries.map((e) => {
    const href = entryHref(e);
    const year = e.data.date.getFullYear();
    const external = e.data.external;
    return (
      <li class="flex items-baseline justify-between gap-3 py-2 border-b border-[color:var(--rule)]">
        <a
          href={href}
          class="text-[color:var(--fg)] no-underline hover:opacity-70"
          {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          <span class="font-[family-name:var(--mono)] text-xs opacity-60 mr-3">{year}</span>{e.data.title}
        </a>
        <span class="font-[family-name:var(--mono)] text-xs whitespace-nowrap"
              style={`color: var(${external ? '--link' : '--post'})`}>
          {external ? `${e.data.source ?? 'link'} ↗` : '● post'}
        </span>
      </li>
    );
  })}
</ul>
```

- [ ] **Step 2: Replace the temp home page.**

Overwrite `src/pages/index.astro`:

```astro
---
import Base from '../layouts/Base.astro';
import WritingList from '../components/WritingList.astro';
import { SITE } from '../lib/site';
---
<Base>
  <section class="mt-14">
    <p class="font-[family-name:var(--mono)] text-sm text-[color:var(--accent)] mb-2">$ whoami</p>
    <h1 class="text-4xl font-bold tracking-tight m-0">{SITE.name}</h1>
    <p class="text-base font-medium mt-1 mb-0" style="color: var(--link)">{SITE.headline}</p>
    <p class="font-[family-name:var(--mono)] text-sm mt-1 mb-4" style="color: var(--muted)">{SITE.meta}</p>
    <p class="text-[0.95rem] leading-relaxed max-w-prose" style="color: var(--fg)">{SITE.bio}</p>
  </section>

  <section class="mt-10">
    <p class="font-[family-name:var(--mono)] text-xs mb-3" style="color: var(--muted)">$ ls writing/ --recent</p>
    <WritingList limit={4} />
    <p class="mt-4 font-[family-name:var(--mono)] text-sm">
      <a href="/writing" style="color: var(--link)" class="no-underline hover:opacity-70">all writing →</a>
    </p>
  </section>
</Base>
```

- [ ] **Step 3: Verify the home page builds and lists entries.**

Run: `npm run build`
Expected: success. Confirm `dist/index.html` contains "Cassandra Unleashed" and "Rebuilding seedzeng.com":

```bash
grep -c "Cassandra Unleashed" dist/index.html && grep -c "Rebuilding seedzeng.com" dist/index.html
```
Expected: both print `1` (post is among the 4 most recent).

- [ ] **Step 4: Commit.**

```bash
git add src/components/WritingList.astro src/pages/index.astro
git commit -m "feat: home page with hero + recent writing"
```

---

## Task 6: Writing index, post pages, and RSS

**Files:**
- Create: `src/layouts/Post.astro`, `src/pages/writing/index.astro`, `src/pages/writing/[...id].astro`, `src/pages/rss.xml.ts`
- Modify: `src/styles/global.css` (add prose styles)

- [ ] **Step 1: Create the writing index page.**

Create `src/pages/writing/index.astro`:

```astro
---
import Base from '../../layouts/Base.astro';
import WritingList from '../../components/WritingList.astro';
---
<Base title="Writing" description="Posts and published engineering articles by Seed Zeng.">
  <section class="mt-14">
    <p class="font-[family-name:var(--mono)] text-sm mb-2" style="color: var(--accent)">$ ls writing/</p>
    <h1 class="text-3xl font-bold tracking-tight mt-0 mb-6">Writing</h1>
    <WritingList />
  </section>
</Base>
```

- [ ] **Step 2: Add prose styles for posts.** Append to `src/styles/global.css`:

```css
.prose { color: var(--fg); line-height: 1.7; }
.prose h2 { font-size: 1.4rem; font-weight: 700; margin: 2rem 0 0.5rem; }
.prose h3 { font-size: 1.15rem; font-weight: 700; margin: 1.5rem 0 0.5rem; }
.prose p { margin: 0 0 1rem; }
.prose a { color: var(--link); }
.prose ul, .prose ol { margin: 0 0 1rem 1.25rem; }
.prose code {
  font-family: var(--mono); font-size: 0.85em;
  background: var(--rule); padding: 0.15em 0.35em; border-radius: 4px;
}
.prose pre {
  font-family: var(--mono); font-size: 0.85rem; overflow-x: auto;
  padding: 1rem; border-radius: 8px; border: 1px solid var(--rule);
}
.prose pre code { background: none; padding: 0; }
.prose blockquote {
  border-left: 3px solid var(--accent); margin: 0 0 1rem;
  padding-left: 1rem; color: var(--muted);
}
```

- [ ] **Step 3: Create the post layout.**

Create `src/layouts/Post.astro`:

```astro
---
import Base from './Base.astro';
interface Props { title: string; date: Date; description?: string; }
const { title, date, description } = Astro.props;
const formatted = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
---
<Base title={title} description={description}>
  <article class="mt-14">
    <a href="/writing" class="font-[family-name:var(--mono)] text-sm no-underline hover:opacity-70" style="color: var(--muted)">← writing</a>
    <h1 class="text-3xl font-bold tracking-tight mt-4 mb-1">{title}</h1>
    <p class="font-[family-name:var(--mono)] text-sm mb-8" style="color: var(--muted)">{formatted}</p>
    <div class="prose">
      <slot />
    </div>
  </article>
</Base>
```

- [ ] **Step 4: Create local post pages** (only local entries get rendered routes).

Create `src/pages/writing/[...id].astro`:

```astro
---
import { getCollection, render } from 'astro:content';
import { isLocal } from '../../lib/writing';
import Post from '../../layouts/Post.astro';

export async function getStaticPaths() {
  const entries = (await getCollection('writing')).filter(isLocal);
  return entries.map((entry) => ({ params: { id: entry.id }, props: { entry } }));
}

const { entry } = Astro.props;
const { Content } = await render(entry);
---
<Post title={entry.data.title} date={entry.data.date} description={entry.data.description}>
  <Content />
</Post>
```

- [ ] **Step 5: Create the RSS feed.**

```bash
npm install @astrojs/rss
```

Create `src/pages/rss.xml.ts`:

```ts
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
```

- [ ] **Step 6: Verify writing routes + RSS build.**

Run: `npm run build`
Expected: success. Verify outputs exist:

```bash
test -f dist/writing/index.html && echo "index ok"
test -f dist/writing/rebuilding-seedzeng.html && echo "post ok"
test -f dist/rss.xml && echo "rss ok"
grep -c "rebuilding-seedzeng" dist/rss.xml
```
Expected: "index ok", "post ok", "rss ok", and the grep prints `1`. Confirm external entries are NOT given local pages (no `dist/writing/cassandra-unleashed.html`):

```bash
test ! -f dist/writing/cassandra-unleashed.html && echo "external correctly link-only"
```
Expected: "external correctly link-only".

- [ ] **Step 7: Commit.**

```bash
git add src/pages/writing src/pages/rss.xml.ts src/layouts/Post.astro src/styles/global.css package.json package-lock.json
git commit -m "feat: writing index, post pages, prose styles, RSS feed"
```

---

## Task 7: Work page (timeline)

**Files:**
- Create: `src/components/WorkTimeline.astro`, `src/pages/work.astro`

- [ ] **Step 1: Create the timeline component** with the real CV data.

Create `src/components/WorkTimeline.astro`:

```astro
---
type Role = { title: string; org: string; period: string; notes?: string[] };
const roles: Role[] = [
  { title: 'Senior Staff Software Engineer', org: 'DoorDash', period: 'Jan 2026 — present',
    notes: ['Lead the Storage / core online datastore org (streaming is one of several teams).'] },
  { title: 'Staff Software Engineer', org: 'DoorDash', period: 'Jul 2022 — Dec 2025',
    notes: ['Scaled the Cassandra fleet for efficiency and performance.'] },
  { title: 'Lead Software Engineer', org: 'Meta', period: 'Aug 2020 — Oct 2022',
    notes: ['Tech lead for consistency monitoring of large distributed systems.'] },
  { title: 'Senior Software Engineer', org: 'Klaviyo', period: 'May 2019 — Aug 2020',
    notes: ['Built Abacus 2.0; scaled ingestion 500 → 150k events/s (~300×).'] },
  { title: 'Software Engineer (early engineer)', org: 'Klaviyo', period: 'Apr 2017 — Jul 2019',
    notes: ['Built Abacus 1.0 (Apache Flink) and Klaviyo’s first Kafka microservice.'] },
  { title: 'Backend Software Engineer', org: 'SurveyMini (acq. SMG)', period: 'Jul 2016 — Mar 2017' },
];
const education = [
  { title: 'B.S. Computer Science, Summa Cum Laude', org: 'Washington University in St. Louis', period: '2014 — 2016' },
  { title: 'B.S. Physics, Summa Cum Laude', org: 'Denison University', period: '2011 — 2014' },
];
---
<div>
  {roles.map((r) => (
    <div class="py-4 border-b border-[color:var(--rule)]">
      <div class="flex items-baseline justify-between gap-3">
        <h3 class="text-base font-semibold m-0">{r.title} · <span style="color: var(--link)">{r.org}</span></h3>
        <span class="font-[family-name:var(--mono)] text-xs whitespace-nowrap" style="color: var(--muted)">{r.period}</span>
      </div>
      {r.notes && (
        <ul class="list-none p-0 mt-2 mb-0">
          {r.notes.map((n) => (
            <li class="text-sm leading-relaxed" style="color: var(--fg)">— {n}</li>
          ))}
        </ul>
      )}
    </div>
  ))}

  <h2 class="font-[family-name:var(--mono)] text-xs mt-10 mb-1" style="color: var(--muted)">$ ls education/</h2>
  {education.map((e) => (
    <div class="py-3 border-b border-[color:var(--rule)] flex items-baseline justify-between gap-3">
      <span class="text-sm">{e.title} · <span style="color: var(--link)">{e.org}</span></span>
      <span class="font-[family-name:var(--mono)] text-xs whitespace-nowrap" style="color: var(--muted)">{e.period}</span>
    </div>
  ))}
</div>
```

- [ ] **Step 2: Create the work page** (résumé links to LinkedIn for now).

Create `src/pages/work.astro`:

```astro
---
import Base from '../layouts/Base.astro';
import WorkTimeline from '../components/WorkTimeline.astro';
---
<Base title="Work" description="Seed Zeng's work history and education.">
  <section class="mt-14">
    <p class="font-[family-name:var(--mono)] text-sm mb-2" style="color: var(--accent)">$ cat work.log</p>
    <div class="flex items-baseline justify-between gap-3">
      <h1 class="text-3xl font-bold tracking-tight mt-0 mb-6">Work</h1>
      <a href="https://www.linkedin.com/in/seedzeng/" target="_blank" rel="noopener noreferrer"
         class="font-[family-name:var(--mono)] text-sm no-underline hover:opacity-70" style="color: var(--link)">résumé ↗</a>
    </div>
    <WorkTimeline />
  </section>
</Base>
```

- [ ] **Step 3: Verify.**

Run: `npm run build`
Expected: success.

```bash
grep -c "Senior Staff Software Engineer" dist/work.html && grep -c "Denison" dist/work.html
```
Expected: both ≥ `1`.

- [ ] **Step 4: Commit.**

```bash
git add src/components/WorkTimeline.astro src/pages/work.astro
git commit -m "feat: work page with role timeline + education"
```

---

## Task 8: Life gallery (optimized images)

**Files:**
- Create: `src/assets/life/*` (copied from legacy), `src/pages/life.astro`

- [ ] **Step 1: Copy the life photos into `src/assets`** so `astro:assets` can optimize them. Source is the untouched root `assets/` (from inside `site/`, that's `../assets`).

```bash
# run from inside site/
mkdir -p src/assets/life
cp ../assets/images/life/*.jpg src/assets/life/
ls src/assets/life
```
Expected: 9 jpgs (bad_blood, beidao, ca1, epicure, gongbao, paris1, qinguan, yosemite, zhutong).

- [ ] **Step 2: Create the life page** using a glob import + `<Image>` (lazy, compressed, responsive).

Create `src/pages/life.astro`:

```astro
---
import Base from '../layouts/Base.astro';
import { Image } from 'astro:assets';

const images = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/life/*.{jpg,jpeg,png}',
  { eager: true }
);
const photos = Object.entries(images).map(([path, mod]) => ({
  src: mod.default,
  alt: path.split('/').pop()!.replace(/\.[a-z]+$/, '').replace(/[-_]/g, ' '),
}));
---
<Base title="Life" description="A few photos from life outside the terminal.">
  <section class="mt-14">
    <p class="font-[family-name:var(--mono)] text-sm mb-2" style="color: var(--accent)">$ open ~/life</p>
    <h1 class="text-3xl font-bold tracking-tight mt-0 mb-6">Life</h1>
    <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {photos.map((p) => (
        <Image
          src={p.src}
          alt={p.alt}
          widths={[300, 600]}
          sizes="(max-width: 640px) 50vw, 200px"
          loading="lazy"
          class="w-full h-40 object-cover rounded-lg border border-[color:var(--rule)]"
        />
      ))}
    </div>
  </section>
</Base>
```

- [ ] **Step 3: Verify images are optimized at build.**

Run: `npm run build`
Expected: success; build log mentions optimizing images. Confirm output:

```bash
test -f dist/life.html && echo "life ok"
ls dist/_astro/*.webp 2>/dev/null | head -1 && echo "optimized images emitted"
```
Expected: "life ok" and at least one optimized asset emitted.

- [ ] **Step 4: Commit.**

```bash
git add src/assets/life src/pages/life.astro
git commit -m "feat: life gallery with optimized images"
```

---

## Task 9: Favicon, 404, sitemap, final SEO polish

**Files:**
- Create: `public/favicon.svg`, `src/pages/404.astro`
- Modify: `astro.config.mjs` (add sitemap)

- [ ] **Step 1: Create a monospace-monogram favicon.**

Create `public/favicon.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="6" fill="#0d1117"/>
  <text x="16" y="22" font-family="ui-monospace, monospace" font-size="16"
        font-weight="700" fill="#3fb950" text-anchor="middle">SZ</text>
</svg>
```

- [ ] **Step 2: Create the 404 page.**

Create `src/pages/404.astro`:

```astro
---
import Base from '../layouts/Base.astro';
---
<Base title="404">
  <section class="mt-20 font-[family-name:var(--mono)]">
    <p style="color: var(--accent)">$ cd {Astro.url.pathname}</p>
    <p style="color: var(--muted)">bash: no such file or directory</p>
    <p class="mt-4"><a href="/" style="color: var(--link)" class="no-underline hover:opacity-70">cd ~ →</a></p>
  </section>
</Base>
```

- [ ] **Step 3: Add the sitemap integration.**

```bash
npx astro add sitemap --yes
```
Confirm `astro.config.mjs` now imports and lists `sitemap()` in `integrations`. If `astro add` did not edit it, set it manually:

```js
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://seedzeng.com',
  trailingSlash: 'never',
  build: { format: 'file' },
  integrations: [sitemap()],
});
```

- [ ] **Step 4: Verify full build + type check + tests.**

Run: `npm run build && npm run check && npm test`
Expected: all succeed. Confirm:

```bash
test -f dist/sitemap-index.xml && echo "sitemap ok"
test -f dist/404.html && echo "404 ok"
```
Expected: "sitemap ok", "404 ok".

- [ ] **Step 5: Commit.**

```bash
git add public/favicon.svg src/pages/404.astro astro.config.mjs package.json package-lock.json
git commit -m "feat: favicon, 404, sitemap, SEO polish"
```

---

## Task 10: Local full-site review (manual)

**Files:** none (verification only)

- [ ] **Step 1: Run the dev server and walk every route.**

Run: `npm run dev`
Open the printed URL and verify each page:
- `/` — hero text correct (headline, meta with "angel investor", bio), 4 recent writing items, post appears with "● post", externals show "source ↗".
- `/writing` — full feed, externals open in new tab, post links to `/writing/rebuilding-seedzeng`.
- `/writing/rebuilding-seedzeng` — renders prose, "← writing" back link.
- `/work` — timeline + education, "résumé ↗" → LinkedIn.
- `/life` — 9 photos in a grid, lazy-loaded.
- `/nope` — 404 page.

- [ ] **Step 2: Verify the theme toggle.**
- Click the toggle: colors flip light↔dark, label updates (`dark`↔`light`).
- Reload: theme persists (localStorage).
- In browser devtools, emulate `prefers-color-scheme: dark` with no stored value (clear localStorage): page loads dark with no white flash.

- [ ] **Step 3: Check responsive layout** at ~375px width (mobile): nav wraps acceptably, gallery is 2-up, no horizontal scroll.

Stop the dev server (Ctrl-C). No commit (verification only). Fix any issues found by returning to the relevant task, then re-commit.

---

## Task 11: Deploy to Vercel + domain cutover

> **Requires the user's Vercel + Cloudflare access.** The agent should drive the CLI where possible and give exact manual steps for dashboard/DNS actions.

**Files:** none (infra)

- [ ] **Step 1: Push the branch and open a PR (optional but recommended).**

```bash
git push -u origin site-revamp
```

- [ ] **Step 2: Create the Vercel project pointed at the `site/` subdirectory.**

Run these from inside `site/` so Vercel treats it as the project root:

```bash
# from inside site/
npx vercel@latest login        # if not already logged in (interactive — user runs via `! ` if needed)
npx vercel@latest link         # link to a new Vercel project
npx vercel@latest --prod=false # first preview deploy -> *.vercel.app URL
```
Expected: a preview URL is printed. Open it; confirm the site renders identically to local.

> Because we deploy from inside `site/`, that becomes Vercel's **Root Directory**
> automatically. If linking from the repo root instead, set Project → Settings →
> **Root Directory = `site`** in the Vercel dashboard.
> Astro static is auto-detected (build `astro build`, output `dist`). No adapter needed.
> The current site (GitHub Pages / seedzeng.com) is still untouched and live at this point.

- [ ] **Step 3: Re-test the preview URL from China** (proves the new lightweight site before DNS cutover).

```bash
# replace PREVIEW with the actual *.vercel.app host
PREVIEW=your-project.vercel.app
MID=$(curl -s -H "Content-Type: application/json" -X POST https://api.globalping.io/v1/measurements \
  -d "{\"type\":\"http\",\"target\":\"$PREVIEW\",\"locations\":[{\"country\":\"CN\",\"limit\":5}],\"measurementOptions\":{\"protocol\":\"HTTPS\",\"request\":{\"method\":\"GET\",\"path\":\"/\"}}}" \
  | python3 -c "import sys,json;print(json.load(sys.stdin)['id'])")
sleep 9
curl -s https://api.globalping.io/v1/measurements/$MID | python3 -c "
import sys,json
d=json.load(sys.stdin)
for r in d.get('results',[]):
    p=r['probe']; res=r['result']; t=res.get('timings',{}) or {}
    print(f\"{p.get('city')}, CN  status={res.get('statusCodeName')} ttfb={t.get('firstByte')} total={t.get('total')}ms\")
"
```
Record the numbers in Task 12.

- [ ] **Step 4: Promote to production and attach the domain.**
- In Vercel dashboard → Project → Settings → Domains: add `seedzeng.com` and `www.seedzeng.com`.
- Set **`seedzeng.com` (apex) as primary**; configure `www` → 308 redirect to apex (Vercel does this when you pick the primary). This collapses the old multi-hop chain to a single edge redirect.

- [ ] **Step 5: Update Cloudflare DNS to point at Vercel.**
- In Cloudflare DNS, follow the exact records Vercel shows (typically apex `A 76.76.21.21` or the current Vercel anycast record Vercel instructs, and `www` `CNAME cname.vercel-dns.com`).
- Set the records to **DNS-only (grey cloud)** so Vercel terminates TLS and serves directly (avoids double-proxy and lets Vercel's edge/redirect behave predictably).
- Remove the old GitHub Pages records.

- [ ] **Step 6: Disable GitHub Pages** for the repo (Settings → Pages → unpublish) so it no longer serves the legacy site.

- [ ] **Step 7: Verify production.**

```bash
curl -sI https://seedzeng.com/ | grep -iE 'server|location|x-vercel'   # expect server: Vercel, no redirect (apex is canonical)
curl -sI https://www.seedzeng.com/ | grep -i location                  # expect 308 -> https://seedzeng.com/
```
Expected: apex serves 200 from Vercel; `www` issues a single redirect to apex.

---

## Task 12: China re-measurement + record results

**Files:**
- Create: `docs/superpowers/specs/2026-06-05-china-measurements.md`

- [ ] **Step 1: Measure production from China and compare to the baseline.**

```bash
MID=$(curl -s -H "Content-Type: application/json" -X POST https://api.globalping.io/v1/measurements \
  -d '{"type":"http","target":"seedzeng.com","locations":[{"country":"CN","limit":6}],"measurementOptions":{"protocol":"HTTPS","request":{"method":"GET","path":"/"}}}' \
  | python3 -c "import sys,json;print(json.load(sys.stdin)['id'])")
sleep 10
curl -s https://api.globalping.io/v1/measurements/$MID | python3 -c "
import sys,json
d=json.load(sys.stdin)
for r in d.get('results',[]):
    p=r['probe']; res=r['result']; t=res.get('timings',{}) or {}
    print(f\"{p.get('city')}, CN  status={res.get('statusCodeName')} ttfb={t.get('firstByte')} total={t.get('total')}ms\")
"
```

- [ ] **Step 2: Record results** in `docs/superpowers/specs/2026-06-05-china-measurements.md`:
  - Baseline (old Cloudflare/GitHub Pages site): ~0.9–1.2s total, with `apex→www→https` redirect chain.
  - New (Vercel static, single canonical host): paste the measured per-city numbers.
  - Note whether the redirect chain is gone (Task 11 Step 7).
  - **Decision gate:** if real-world residential China is still unacceptable, escalate to Tier 2 (HK/SG origin + geo-DNS) per the design spec. Otherwise, done.
  - Also suggest the user manually sanity-check via https://www.itdog.cn/ (residential-grade probes).

- [ ] **Step 3: Commit.**

```bash
git add docs/superpowers/specs/2026-06-05-china-measurements.md
git commit -m "docs: record post-launch China measurements"
```

---

## Task 13: Devour the old site

**Files:**
- Delete (repo root): `index.html`, `assets/`, `CNAME`

> **Gate:** Do this ONLY after the new site is confirmed live on seedzeng.com via
> Vercel (Task 11 Step 7 passed), the local walkthrough is clean (Task 10), and the
> China numbers are recorded (Task 12). Until this task, the old site is still in
> the tree and recoverable.

- [ ] **Step 1: Remove the legacy root site.** (Git history retains it; the live
domain now serves the Vercel `site/` build, so these files are dead weight.)

```bash
git rm index.html CNAME
git rm -r assets
git commit -m "chore: remove legacy site after successful migration to Astro"
```

- [ ] **Step 2: Confirm GitHub Pages is disabled** (done in Task 11 Step 6) so the
repo no longer attempts to serve the deleted root site. Verify Settings → Pages
shows no active deployment.

- [ ] **Step 3: Final full verification** (from inside `site/`).

Run: `npm run build && npm run check && npm test`
Expected: all green.

- [ ] **Step 4: Merge the branch** (use the finishing-a-development-branch skill to choose merge/PR).

---

## Self-Review (completed by plan author)

**Spec coverage:**
- Astro+Tailwind→Vercel → Tasks 1, 11. ✓
- China Tier-1 (lightweight static + kill redirect chain) → Tasks 1/5–9 (light pages), 11 Step 4–7 (single canonical host), 12 (measure). Tier-2 referenced as decision gate in Task 12. ✓
- IA: Home (T5), Work (T7), Writing unified feed (T3, T5, T6), Life (T8), footer socials (T4). Cut sections simply not built. ✓
- Light/dark, OS default, persisted, no flash → Task 4. ✓
- Pure-text hero, mono touches, distinct accents → T5 + T1 tokens. ✓
- Unified writing feed (local render + external link-out, tagged) → T3 schema, T5 WritingList. ✓
- RSS + syntax highlighting → T6. ✓
- Content (CV timeline, 5 articles, bio, résumé→LinkedIn) → T2 (bio/socials), T3 (articles), T7 (timeline/résumé). ✓
- Success criteria (Lighthouse, China, deploy) → Tasks 10–12. ✓

**Placeholder scan:** Two explicit NOTEs flag data to confirm (GitHub username, approximate article dates) — these are verification prompts, not unfilled code; all code blocks are complete. No TODO/TBD in implementation steps.

**Type consistency:** `WritingEntry`, `sortEntries`, `entryHref`, `isLocal` defined in T2 and used consistently in T5/T6. Content schema fields (T3) match `WritingEntry.data` shape (T2) and `WritingList`/RSS usage. `SITE`/`NAV`/`SOCIALS` defined in T2, consumed in T4/T5/T7. Astro 5 APIs (`glob` loader, `render`, `entry.id`) used consistently.
