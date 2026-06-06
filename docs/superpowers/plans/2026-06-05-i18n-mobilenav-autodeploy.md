# i18n + Mobile Nav + Auto-Deploy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a Chinese (中文) version of seedzeng.com with an auto-detecting language switch, fix the non-responsive nav on phones, make dark mode live-react to OS changes, add an optional expand-all to Experience, and wire auto-deploy on merge to `master`.

**Architecture:** Astro built-in i18n (`en` default at `/`, `zh` at `/zh/`). All copy moves into a locale-keyed content module; components read the active locale from `Astro.currentLocale` (no prop-drilling). A shared `Home.astro` renders all sections for both routes. Nav becomes responsive (hamburger on mobile) and hosts theme + language toggles. Auto-deploy via a GitHub Actions workflow using the Vercel CLI + a token secret (no Vercel GitHub app needed).

**Tech Stack:** Astro 5 i18n, Tailwind 4, Vitest, Vercel CLI, GitHub Actions.

**Working dir:** all `npm`/paths are under `site/` (the Astro project). Git commands run from repo root.

**Reference:** prior build plan `docs/superpowers/plans/2026-06-05-personal-site-revamp.md`; design `…-revamp-design.md`.

---

## Decisions (defaults chosen; flagged where you may want to adjust)

- **Auto-deploy:** GitHub Actions + Vercel token (works without the Vercel GitHub app, which was blocked). Org/Project IDs are not secrets and are hard-coded in the workflow; only `VERCEL_TOKEN` is a GitHub secret you add.
- **i18n scope:** **full** translation (UI + hero/bio + experience + education + podcast + contact). Blog **post bodies stay English** (technical articles); their list entries still show. The `$ ls <section>` command in subtitles **stays English** (it's a terminal command); only the visible TITLE translates.
- **Language behavior:** auto-detect from `navigator.language` on first visit (no stored preference) → redirect `/`→`/zh/` if browser is Chinese; manual 中/EN toggle overrides + persists.
- **Chinese name:** kept as "Seed Zeng" on the zh site unless you provide a 中文名 (DECISION: tell the implementer your Chinese name to swap in, or leave as-is).
- **Expand-all:** included as a small optional control on Experience.

---

## Execution order (local-dev first, deploy LAST)

Tasks keep their original numbers as IDs; **run them in this sequence** (deploy is intentionally last so we finish all local-dev before touching production):

1. Task 1 — Responsive mobile nav
2. Task 2 — Dark mode live-react
3. Task 3 — Experience expand-all
4. **Task 13 — Typography & fonts**
5. **Task 14 — ASCII-art name (hero)**
6. Task 5 — Enable Astro i18n
7. Task 6 — i18n config + helpers
8. Task 7 — UI strings + content modules
9. Task 8 — Locale-aware components
10. Task 9 — Shared Home + locale routes
11. Task 10 — Language toggle
12. Task 11 — Auto-detect language
13. Task 4 — Auto-deploy (GitHub Actions)  ← **DEPLOY PHASE**
14. Task 12 — Final verification + deploy   ← **DEPLOY PHASE**

## File Structure

```
.github/workflows/deploy.yml        # NEW: auto-deploy on push to master + PR previews
site/
  astro.config.mjs                  # MODIFY: add i18n locales
  src/
    i18n/
      config.ts                     # NEW: Locale type, LOCALES, DEFAULT_LOCALE, helpers
      ui.ts                         # NEW: flat UI strings per locale (nav, sections, form, misc)
      content.ts                    # NEW: structured content per locale (headline, bio, roles, edu, podcast, contact)
    components/
      Nav.astro                     # MODIFY: responsive (hamburger), locale-aware, hosts toggles
      ThemeToggle.astro             # MODIFY: live-react to OS theme changes
      LanguageToggle.astro          # NEW: 中/EN switch
      Home.astro                    # NEW: all home sections, locale-aware (shared by both routes)
      WorkTimeline.astro            # MODIFY: read roles/edu from content[lang]
      BioSlides.astro               # MODIFY: read slides from content[lang]
      SectionLabel.astro            # MODIFY: title from props (already), command stays en
      ContactForm.astro             # MODIFY: placeholders from ui[lang]
      BaseHead.astro                # MODIFY: lang-aware title/description + html lang
      Footer.astro                  # (unchanged; socials are icons)
    layouts/
      Base.astro                    # MODIFY: set <html lang>, language auto-detect script
    pages/
      index.astro                   # MODIFY: render <Home/>
      zh/index.astro                # NEW: render <Home/> (zh route)
      404.astro                     # MODIFY: locale-aware text (en)
      zh/404.astro                  # NEW: zh 404
  test/
    i18n.test.ts                    # NEW: unit tests for i18n helpers
```

---

## Task 1: Responsive mobile nav (hamburger)

**Files:** Modify `src/components/Nav.astro`, `src/styles/global.css`

**Problem:** the nav is a single flex row (brand + 4 links + theme toggle); on a phone it overflows/crowds. Make links collapse behind a hamburger on small screens; keep brand + toggles always visible.

- [ ] **Step 1: Rewrite Nav with a responsive structure.** Replace the whole file `src/components/Nav.astro`:

```astro
---
import { SITE, NAV } from '../lib/site';
import ThemeToggle from './ThemeToggle.astro';
---
<nav class="flex items-center justify-between py-4 font-[family-name:var(--mono)] text-sm">
  <a href="/" class="text-[color:var(--fg)] no-underline hover:opacity-70 shrink-0">~/{SITE.wordmark}<span class="term-cursor" aria-hidden="true">▮</span></a>

  <div class="flex items-center gap-5">
    <!-- desktop links -->
    <div class="hidden sm:flex items-center gap-5">
      {NAV.map((item) => (
        <a href={item.href} class="text-[color:var(--fg)] no-underline hover:opacity-70">{item.label}</a>
      ))}
    </div>
    <ThemeToggle />
    <!-- mobile hamburger -->
    <button id="nav-toggle" type="button" aria-label="Menu" aria-expanded="false"
      class="sm:hidden inline-flex flex-col justify-center gap-[5px] w-6 h-6" style="color: var(--fg)">
      <span class="block h-0.5 w-6 bg-current rounded"></span>
      <span class="block h-0.5 w-6 bg-current rounded"></span>
      <span class="block h-0.5 w-6 bg-current rounded"></span>
    </button>
  </div>
</nav>

<!-- mobile dropdown panel -->
<div id="nav-menu" class="sm:hidden hidden flex-col gap-1 pb-3 font-[family-name:var(--mono)] text-sm">
  {NAV.map((item) => (
    <a href={item.href} class="block py-2 no-underline hover:opacity-70" style="color: var(--fg)" data-nav-link>{item.label}</a>
  ))}
</div>

<script>
  const btn = document.getElementById('nav-toggle');
  const menu = document.getElementById('nav-menu');
  const close = () => { menu?.classList.add('hidden'); menu?.classList.remove('flex'); btn?.setAttribute('aria-expanded', 'false'); };
  btn?.addEventListener('click', () => {
    const open = menu?.classList.toggle('hidden') === false;
    menu?.classList.toggle('flex', open);
    btn.setAttribute('aria-expanded', String(open));
  });
  document.querySelectorAll('[data-nav-link]').forEach((a) => a.addEventListener('click', close));
</script>
```

- [ ] **Step 2: Verify build + responsive behavior.**

Run: `cd site && npm run check` → 0 errors.
Run dev (`npm run dev`); at ~375px width the links collapse to a hamburger; tapping it reveals the menu; tapping a link closes it and scrolls. At ≥640px the inline links show and the hamburger is hidden.

- [ ] **Step 3: Commit.**

```bash
git add site/src/components/Nav.astro
git commit -m "fix: responsive nav — collapse links to a hamburger on mobile"
```

---

## Task 2: Dark mode live-reacts to OS theme changes

**Files:** Modify `src/components/ThemeToggle.astro`

Currently the theme is read once on load. Make it follow OS changes **only when the user hasn't manually chosen** a theme.

- [ ] **Step 1: Add an OS-change listener.** In `src/components/ThemeToggle.astro`, inside the existing `<script>`, after the `render()` definition and the click handler, append:

```js
  // Follow OS theme changes unless the user has set a manual preference.
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (localStorage.getItem('theme')) return; // manual choice wins
    root.dataset.theme = e.matches ? 'dark' : 'light';
    render();
  });
```

- [ ] **Step 2: Verify.** `cd site && npm run check` → 0 errors. In devtools, with localStorage `theme` cleared, toggle the OS/emulated `prefers-color-scheme` → the page theme flips live. After clicking the toggle once (sets localStorage), OS changes no longer override.

- [ ] **Step 3: Commit.**

```bash
git add site/src/components/ThemeToggle.astro
git commit -m "feat: dark mode live-reacts to OS theme when no manual preference set"
```

---

## Task 3: Experience expand-all toggle (optional)

**Files:** Modify `src/components/WorkTimeline.astro`

Add a small control above the roles to open/close all `<details>` at once.

- [ ] **Step 1: Add the control + script.** In `src/components/WorkTimeline.astro`, immediately after the opening `<div>` (before the `{roles.map(...)}`), insert:

```astro
  <button type="button" data-roles-toggle aria-expanded="false"
    class="font-[family-name:var(--mono)] text-xs mb-3 bg-transparent border-0 p-0 hover:opacity-70" style="color: var(--muted)">
    <span class="ra-closed">expand all ↓</span><span class="ra-open">collapse all ↑</span>
  </button>
```

At the very end of the file (after the closing `</div>`), add:

```astro
<script>
  const wrap = document.currentScript?.previousElementSibling as HTMLElement | null;
  const root = wrap ?? document;
  const btn = root.querySelector<HTMLButtonElement>('[data-roles-toggle]');
  btn?.addEventListener('click', () => {
    const open = btn.getAttribute('aria-expanded') !== 'true';
    root.querySelectorAll('details.role').forEach((d) => (d as HTMLDetailsElement).open = open);
    btn.setAttribute('aria-expanded', String(open));
  });
</script>
```

- [ ] **Step 2: Add toggle-label CSS.** Append to `src/styles/global.css`:

```css
[data-roles-toggle] .ra-open { display: none; }
[data-roles-toggle][aria-expanded="true"] .ra-open { display: inline; }
[data-roles-toggle][aria-expanded="true"] .ra-closed { display: none; }
```

- [ ] **Step 3: Verify + commit.** `cd site && npm run check` → 0 errors; clicking "expand all" opens every role and flips to "collapse all".

```bash
git add site/src/components/WorkTimeline.astro site/src/styles/global.css
git commit -m "feat: expand/collapse-all control on experience"
```

---

## Task 4: Auto-deploy via GitHub Actions

> ⚠️ **DEPLOY PHASE — run this near the end** (step 13 in Execution order), after all local-dev tasks.

**Files:** Create `.github/workflows/deploy.yml`

Deploys production on push to `master`, and a preview on PRs. Uses the Vercel CLI with a token. Org/Project IDs (not secrets) are inlined.

- [ ] **Step 1: Create the workflow.** Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel
on:
  push:
    branches: [master]
  pull_request:
    branches: [master]

env:
  VERCEL_ORG_ID: team_bCfT4OBL1ACH4RMqjEzZk6m6
  VERCEL_PROJECT_ID: prj_yS4cn14GVJOOMpEvvWWQFcqBaJLF

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 24
      - name: Install Vercel CLI
        run: npm i -g vercel@latest
      - name: Pull Vercel env
        run: vercel pull --yes --environment=${{ github.event_name == 'push' && 'production' || 'preview' }} --token=${{ secrets.VERCEL_TOKEN }}
      - name: Build
        run: vercel build ${{ github.event_name == 'push' && '--prod' || '' }} --token=${{ secrets.VERCEL_TOKEN }}
      - name: Deploy
        run: vercel deploy --prebuilt ${{ github.event_name == 'push' && '--prod' || '' }} --token=${{ secrets.VERCEL_TOKEN }}
```

> Vercel reads Root Directory = `site` from the linked project settings during `vercel pull`, so the CLI builds the Astro app in `site/` automatically.

- [ ] **Step 2: Human step — add the token secret.** In GitHub → repo → Settings → Secrets and variables → Actions → New repository secret: name `VERCEL_TOKEN`, value = a token from vercel.com/account/tokens. (Document this in the PR description; the workflow no-ops without it.)

- [ ] **Step 3: Commit + verify.** 

```bash
git add .github/workflows/deploy.yml
git commit -m "ci: auto-deploy to Vercel on merge to master (+ PR previews)"
```
After pushing to `master` (with the secret set), the Actions tab shows the workflow building from `site/` and a production deploy completing.

---

## Task 5: Enable Astro i18n

**Files:** Modify `site/astro.config.mjs`

- [ ] **Step 1: Add i18n config.** In `site/astro.config.mjs`, add an `i18n` block to `defineConfig`:

```js
  i18n: {
    locales: ['en', 'zh'],
    defaultLocale: 'en',
    routing: { prefixDefaultLocale: false },
  },
```

So `en` stays at `/` and `zh` lives at `/zh/`. `Astro.currentLocale` is `'en'` on `/…` and `'zh'` on `/zh/…`.

- [ ] **Step 2: Verify + commit.** `cd site && npm run build` → succeeds (no routes yet for zh; that's fine).

```bash
git add site/astro.config.mjs
git commit -m "feat: enable Astro i18n (en default, zh under /zh)"
```

---

## Task 6: i18n config module + helpers (with tests)

**Files:** Create `src/i18n/config.ts`, `test/i18n.test.ts`

- [ ] **Step 1: Write failing tests.** Create `site/test/i18n.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { localeFromPath, switchLocalePath, isLocale } from '../src/i18n/config';

describe('i18n helpers', () => {
  it('detects locale from path', () => {
    expect(localeFromPath('/')).toBe('en');
    expect(localeFromPath('/writing/foo')).toBe('en');
    expect(localeFromPath('/zh')).toBe('zh');
    expect(localeFromPath('/zh/')).toBe('zh');
    expect(localeFromPath('/zh/writing')).toBe('zh');
  });
  it('switches a path to the other locale preserving the rest', () => {
    expect(switchLocalePath('/', 'zh')).toBe('/zh/');
    expect(switchLocalePath('/zh/', 'en')).toBe('/');
    expect(switchLocalePath('/zh/writing/x', 'en')).toBe('/writing/x');
    expect(switchLocalePath('/writing/x', 'zh')).toBe('/zh/writing/x');
  });
  it('validates locales', () => {
    expect(isLocale('en')).toBe(true);
    expect(isLocale('zh')).toBe(true);
    expect(isLocale('fr')).toBe(false);
  });
});
```

- [ ] **Step 2: Run → fail.** `cd site && npm test` → FAIL (module missing).

- [ ] **Step 3: Implement.** Create `site/src/i18n/config.ts`:

```ts
export const LOCALES = ['en', 'zh'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'en';

export function isLocale(x: string): x is Locale {
  return (LOCALES as readonly string[]).includes(x);
}

export function localeFromPath(pathname: string): Locale {
  const seg = pathname.split('/').filter(Boolean)[0];
  return seg && isLocale(seg) ? seg : DEFAULT_LOCALE;
}

/** Return the equivalent path in `target` locale, preserving the sub-path. */
export function switchLocalePath(pathname: string, target: Locale): string {
  const parts = pathname.split('/').filter(Boolean);
  if (parts[0] && isLocale(parts[0])) parts.shift(); // strip current locale prefix
  const rest = parts.join('/');
  if (target === DEFAULT_LOCALE) return '/' + rest;
  return rest ? `/${target}/${rest}` : `/${target}/`;
}
```

- [ ] **Step 4: Run → pass.** `cd site && npm test` → all green.

- [ ] **Step 5: Commit.**

```bash
git add site/src/i18n/config.ts site/test/i18n.test.ts
git commit -m "feat: i18n config + locale path helpers (tested)"
```

---

## Task 7: UI strings + content modules

**Files:** Create `src/i18n/ui.ts`, `src/i18n/content.ts`

- [ ] **Step 1: Flat UI strings.** Create `site/src/i18n/ui.ts`:

```ts
import type { Locale } from './config';
import { DEFAULT_LOCALE } from './config';

type Dict = Record<string, string>;
const UI: Record<Locale, Dict> = {
  en: {
    'nav.work': 'work', 'nav.writing': 'writing', 'nav.podcast': 'podcast', 'nav.contact': 'contact',
    'section.experience': 'Experience', 'section.writing': 'Writing', 'section.podcast': 'Podcast',
    'section.contact': 'Get in touch', 'section.education': 'Education',
    'writing.viewAll': 'view all writing', 'writing.showLess': 'show less',
    'form.name': 'your name', 'form.email': 'your email', 'form.message': 'your message',
    'form.send': 'send →', 'form.sending': 'sending…', 'form.sent': 'thanks — message sent ✓',
    'form.error': 'that failed — email me directly?', 'contact.direct': 'or email me directly:',
    'podcast.break': 'on a break',
  },
  zh: {
    'nav.work': '经历', 'nav.writing': '文章', 'nav.podcast': '播客', 'nav.contact': '联系',
    'section.experience': '工作经历', 'section.writing': '文章', 'section.podcast': '播客',
    'section.contact': '联系我', 'section.education': '教育背景',
    'writing.viewAll': '查看全部文章', 'writing.showLess': '收起',
    'form.name': '你的名字', 'form.email': '你的邮箱', 'form.message': '想说的话',
    'form.send': '发送 →', 'form.sending': '发送中…', 'form.sent': '已发送，谢谢 ✓',
    'form.error': '发送失败 — 直接发邮件给我？', 'contact.direct': '或直接发邮件：',
    'podcast.break': '暂停更新',
  },
};

export function t(lang: Locale, key: string): string {
  return UI[lang]?.[key] ?? UI[DEFAULT_LOCALE][key] ?? key;
}
```

- [ ] **Step 2: Structured content.** Create `site/src/i18n/content.ts` (English mirrors current copy; Chinese drafted — **review wording**):

```ts
import type { Locale } from './config';

export type Slide = { title: string; desc: string };
export type Role = { title: string; org: string; logo: string; period: string; current?: boolean; summary: string; notes: string[] };
export type Education = { title: string; org: string; period: string; honors: string[]; note: string };

export type SiteContent = {
  headline: string;
  bioSlides: Slide[];
  roles: Role[];
  education: Education[];
  podcastDesc: string;
  contactTagline: string;
};

const en: SiteContent = {
  headline: 'Engineering Leader | Angel Investor',
  bioSlides: [
    { title: 'Lead at scale', desc: "I lead the team and own the technical direction for DoorDash's Storage org — the data infrastructure the whole company runs on." },
    { title: '0 to 100', desc: "I've operated at both ends of the spectrum — early-stage startup to hyperscale. As an early engineer at Klaviyo I scaled the data pipeline ~300×, to 150,000 events/sec, through the company's rise to a multi-billion-dollar IPO. Since then, tech lead at Meta and now Senior Staff at DoorDash." },
    { title: 'Bet on founders', desc: 'I stay close to the startup world — I angel-invest in early-stage founders and host a podcast where I talk with builders about the hard parts of starting up.' },
    { title: 'Think like a physicist', desc: 'I came to software from physics. That background shapes how I work — I approach hard problems methodically: hypothesis, measurement, and decisions grounded in data.' },
  ],
  roles: [
    { title: 'Senior Staff Software Engineer', org: 'DoorDash', logo: 'doordash', period: 'Jan 2026 — present', current: true,
      summary: "I lead the team and own the technical direction for DoorDash's Storage org — the data infrastructure the whole company runs on.",
      notes: [
        'Lead and grow a 40-engineer organization — mentoring and developing staff and senior engineers into the next layer of technical leaders.',
        'Set vision and roadmap for the core initiatives redefining the storage layer, partnering across product and infra teams.',
        'Own the online datastore platform every product team builds on — accountable for reliability, performance, and long-term architecture behind millions of orders a day.',
      ] },
    { title: 'Staff Software Engineer', org: 'DoorDash', logo: 'doordash', period: 'Jul 2022 — Dec 2025',
      summary: "Made DoorDash's core storage faster and cheaper as the business scaled globally.",
      notes: [
        'Drove fleet-wide efficiency and performance gains across the Cassandra deployment (“Cassandra Unleashed”).',
        'Mentored engineers and raised the technical bar across the team.',
        'Scaled core storage infrastructure to keep pace with global growth.',
      ] },
    { title: 'Lead Software Engineer', org: 'Meta', logo: 'meta', period: 'Aug 2020 — Oct 2022',
      summary: "Tech-led data-integrity systems for Meta's distributed infrastructure.",
      notes: [
        'Built inconsistency-detection services for large distributed systems using novel techniques.',
        'Scaled complex backend services to absorb major traffic spikes.',
        'Mentored engineers and helped them grow.',
      ] },
    { title: 'Senior Software Engineer', org: 'Klaviyo', logo: 'klaviyo', period: 'May 2019 — Aug 2020',
      summary: "Re-architected Klaviyo's data ingestion and scaled it ~300×.",
      notes: [
        'Built Abacus 2.0 — a full overhaul of the ingestion model, read API, and schema — ~10× faster than its predecessor.',
        'Scaled the pipeline from 500 to 150,000 events/sec (3M DB writes/sec), built to scale horizontally.',
        'Wrote the migration service that moved production data onto the new schema.',
      ] },
    { title: 'Software Engineer · early engineer', org: 'Klaviyo', logo: 'klaviyo', period: 'Apr 2017 — Jul 2019',
      summary: "Built the streaming foundations Klaviyo's data platform still runs on.",
      notes: [
        'Built Abacus 1.0 on Apache Flink, replacing the legacy ingestion pipeline — 1.5B events on Cyber Monday alone.',
        'Built Klaviyo’s first Kafka microservice, now handling billions of events a day.',
        'Maintained core data stores (MySQL, Cassandra, Redis, Memcache) and refactored the legacy pipeline to clean OOP.',
      ] },
    { title: 'Backend Software Engineer', org: 'SurveyMini (acq. SMG)', logo: 'surveymini', period: 'Jul 2016 — Mar 2017',
      summary: 'Backend engineer across survey infrastructure and AWS data systems.',
      notes: [
        'Built survey-branching logic that adapts each next question to user input.',
        'Improved AWS scalability and led a migration from Postgres to DynamoDB.',
      ] },
  ],
  education: [
    { title: 'B.S. Computer Science', org: 'Washington University in St. Louis', period: '2014 — 2016',
      honors: ['GPA 3.98', 'Summa Cum Laude', 'Tau Beta Pi', 'Brown Fellowship'],
      note: 'Teaching assistant for Advanced Algorithms, Web Development, and iOS Development.' },
    { title: 'B.S. Physics', org: 'Denison University', period: '2011 — 2014',
      honors: ['GPA 3.90', 'Summa Cum Laude', 'Sigma Pi Sigma', 'Sigma Xi'],
      note: 'Co-authored a paper in Physical Review A and researched laser cooling of negative ions at Lawrence Berkeley National Lab.' },
  ],
  podcastDesc: 'Conversations with founders on the craft and chaos of building startups. New episodes are paused for now while I’m on a break.',
  contactTagline: "Like what you see here? Drop me a line — I'm more awesome in person.",
};

const zh: SiteContent = {
  headline: '工程负责人 | 天使投资人',
  bioSlides: [
    { title: '规模化带队', desc: '我带领团队并负责 DoorDash 存储部门的技术方向——支撑整个公司运转的数据基础设施。' },
    { title: '从 0 到 100', desc: '我在创业早期和超大规模两端都深耕过。作为 Klaviyo 的早期工程师，我把数据管道扩展了约 300 倍，达到每秒 15 万事件，伴随公司成长为数十亿美元的上市公司。之后在 Meta 担任技术负责人，如今是 DoorDash 的高级资深工程师。' },
    { title: '押注创业者', desc: '我始终贴近创业圈——做早期创业者的天使投资人，并主持一档播客，和创业者聊创业中最难的部分。' },
    { title: '像物理学家一样思考', desc: '我从物理转向软件。这段背景塑造了我的工作方式——用方法论解决难题：提出假设、测量验证、让数据决定结论。' },
  ],
  roles: [
    { title: '高级资深软件工程师', org: 'DoorDash', logo: 'doordash', period: '2026年1月 — 至今', current: true,
      summary: '我带领团队并负责 DoorDash 存储部门的技术方向——支撑整个公司运转的数据基础设施。',
      notes: [
        '带领并培养一支约 40 人的工程团队——指导资深与高级工程师成长为下一批技术领导者。',
        '为重塑存储层的核心项目制定愿景与路线图，与产品和基础设施团队紧密协作。',
        '负责所有产品团队赖以构建的在线数据存储平台——为每天数百万订单背后的可靠性、性能与长期架构负责。',
      ] },
    { title: '资深软件工程师', org: 'DoorDash', logo: 'doordash', period: '2022年7月 — 2025年12月',
      summary: '在公司全球扩张的同时，让 DoorDash 的核心存储更快、更省。',
      notes: [
        '在整个 Cassandra 集群上推动效率与性能提升（《Cassandra Unleashed》）。',
        '指导工程师，提升团队的技术标准。',
        '扩展核心存储基础设施，跟上全球增长的步伐。',
      ] },
    { title: '主任软件工程师', org: 'Meta', logo: 'meta', period: '2020年8月 — 2022年10月',
      summary: '为 Meta 的分布式基础设施技术主导数据一致性系统。',
      notes: [
        '用新颖的技术为大型分布式系统构建数据不一致检测服务。',
        '扩展复杂的后端服务以承接巨大的流量峰值。',
        '指导工程师并帮助他们成长。',
      ] },
    { title: '高级软件工程师', org: 'Klaviyo', logo: 'klaviyo', period: '2019年5月 — 2020年8月',
      summary: '重构 Klaviyo 的数据接入系统，并将其扩展约 300 倍。',
      notes: [
        '打造 Abacus 2.0——对接入模型、读取 API 与数据库结构的彻底重写，速度约为前代的 10 倍。',
        '将管道从每秒 500 事件扩展到 15 万事件（每秒 300 万次数据库写入），并支持横向扩展。',
        '编写迁移服务，将生产数据迁移到新的数据结构。',
      ] },
    { title: '软件工程师 · 早期工程师', org: 'Klaviyo', logo: 'klaviyo', period: '2017年4月 — 2019年7月',
      summary: '打下了 Klaviyo 数据平台至今仍在运行的流式基础。',
      notes: [
        '基于 Apache Flink 打造 Abacus 1.0，取代旧的接入管道——仅网络星期一当天就处理 15 亿事件。',
        '构建 Klaviyo 的第一个 Kafka 微服务，如今每天处理数十亿事件。',
        '维护核心数据存储（MySQL、Cassandra、Redis、Memcache），并将旧管道重构为清晰的面向对象设计。',
      ] },
    { title: '后端软件工程师', org: 'SurveyMini (被 SMG 收购)', logo: 'surveymini', period: '2016年7月 — 2017年3月',
      summary: '负责问卷基础设施与 AWS 数据系统的后端工程师。',
      notes: [
        '构建问卷分支逻辑，根据用户输入动态决定下一题。',
        '提升 AWS 可扩展性，并主导从 Postgres 到 DynamoDB 的迁移。',
      ] },
  ],
  education: [
    { title: '计算机科学学士', org: '圣路易斯华盛顿大学', period: '2014 — 2016',
      honors: ['GPA 3.98', '最优等毕业', 'Tau Beta Pi', 'Brown Fellowship'],
      note: '担任《高级算法》《Web 开发》《iOS 开发》课程的助教。' },
    { title: '物理学学士', org: 'Denison University', period: '2011 — 2014',
      honors: ['GPA 3.90', '最优等毕业', 'Sigma Pi Sigma', 'Sigma Xi'],
      note: '在《Physical Review A》合著论文，并在劳伦斯伯克利国家实验室研究负离子的激光冷却。' },
  ],
  podcastDesc: '和创业者畅聊创业的手艺与混乱。目前我在休整，暂停更新新一期。',
  contactTagline: '喜欢你看到的内容？给我留个言吧——我本人更有意思。',
};

export const CONTENT: Record<Locale, SiteContent> = { en, zh };
export function getContent(lang: Locale): SiteContent { return CONTENT[lang]; }
```

- [ ] **Step 3: Verify + commit.** `cd site && npm run check` → 0 errors.

```bash
git add site/src/i18n/ui.ts site/src/i18n/content.ts
git commit -m "feat: i18n UI strings + structured content (en + zh draft)"
```

---

## Task 8: Make components locale-aware

**Files:** Modify `BioSlides.astro`, `WorkTimeline.astro`, `ContactForm.astro`, `Nav.astro`, `BaseHead.astro`, `SectionLabel.astro` usages

Each component reads the active locale from `Astro.currentLocale` and pulls copy from the content/ui modules. Pattern at the top of each `.astro`:

```ts
import { type Locale, DEFAULT_LOCALE, isLocale } from '../i18n/config';
const lang: Locale = isLocale(Astro.currentLocale ?? '') ? (Astro.currentLocale as Locale) : DEFAULT_LOCALE;
```

- [ ] **Step 1: BioSlides.** In `src/components/BioSlides.astro` frontmatter, replace `import { BIO_SLIDES } from '../lib/site'` with:

```ts
import { getContent } from '../i18n/content';
import { type Locale, DEFAULT_LOCALE, isLocale } from '../i18n/config';
const lang: Locale = isLocale(Astro.currentLocale ?? '') ? (Astro.currentLocale as Locale) : DEFAULT_LOCALE;
const BIO_SLIDES = getContent(lang).bioSlides;
```
In the client `<script>`, the `import { BIO_SLIDES } from '../lib/site'` must become data passed from the server (client scripts can't read `Astro.currentLocale`). Replace the script's import by serializing slides into a `data-` attribute: change the wrapper to `<div data-bioslides data-slides={JSON.stringify(BIO_SLIDES)} class="mt-6">` and in the script replace `import { BIO_SLIDES } ...` with:

```js
  const root = document.querySelector<HTMLElement>('[data-bioslides]');
  const BIO_SLIDES = JSON.parse(root?.dataset.slides ?? '[]') as { title: string; desc: string }[];
```
(Keep the rest of the typewriter/dots logic unchanged.)

- [ ] **Step 2: WorkTimeline.** In `src/components/WorkTimeline.astro`, delete the inline `const roles`/`const education` arrays and their `type` decls (now in content.ts). Replace with:

```ts
import CompanyLogo from './CompanyLogo.astro';
import SectionLabel from './SectionLabel.astro';
import { getContent } from '../i18n/content';
import { t } from '../i18n/ui';
import { type Locale, DEFAULT_LOCALE, isLocale } from '../i18n/config';
const lang: Locale = isLocale(Astro.currentLocale ?? '') ? (Astro.currentLocale as Locale) : DEFAULT_LOCALE;
const { roles, education } = getContent(lang);
```
Change the Education `<SectionLabel name="education" …>` to use the translated title: `<SectionLabel name="education" title={t(lang, 'section.education')} class="mt-12 mb-4" />`.

- [ ] **Step 3: ContactForm.** In `src/components/ContactForm.astro` frontmatter add the lang lines + `import { t } from '../i18n/ui'`. Replace the placeholder/button literals with `t(lang, 'form.name')`, `t(lang,'form.email')`, `t(lang,'form.message')`, and the button text `t(lang,'form.send')`. In the `<script>`, the status strings must come from data attributes (client can't call `t`): add to the `<form>` `data-msg-sending={t(lang,'form.sending')} data-msg-sent={t(lang,'form.sent')} data-msg-error={t(lang,'form.error')}` and in the script read `form.dataset.msgSending` etc. instead of the hard-coded English.

- [ ] **Step 4: Nav.** In `src/components/Nav.astro`, replace `import { SITE, NAV } from '../lib/site'` with `import { SITE } from '../lib/site'` plus the lang lines and `import { t } from '../i18n/ui'`. Build NAV locally so labels translate and hrefs respect locale:

```ts
import { t } from '../i18n/ui';
import { type Locale, DEFAULT_LOCALE, isLocale } from '../i18n/config';
const lang: Locale = isLocale(Astro.currentLocale ?? '') ? (Astro.currentLocale as Locale) : DEFAULT_LOCALE;
const base = lang === 'en' ? '' : '/zh';
const NAV = [
  { href: `${base}/#work`, label: t(lang, 'nav.work') },
  { href: `${base}/#writing`, label: t(lang, 'nav.writing') },
  { href: `${base}/#podcast`, label: t(lang, 'nav.podcast') },
  { href: `${base}/#contact`, label: t(lang, 'nav.contact') },
];
```
The brand link `href="/"` becomes `href={lang === 'en' ? '/' : '/zh/'}`.

- [ ] **Step 5: BaseHead.** In `src/components/BaseHead.astro`, add lang lines; pass a localized default description: keep `SITE.bio` for en, but for zh use the zh contactTagline-style summary — simplest: `const desc = description ?? getContent(lang).bioSlides[0].desc;`. Import `getContent`.

- [ ] **Step 6: Verify + commit.** `cd site && npm run check` → 0 errors; `npm test` → green; `npm run build` succeeds.

```bash
git add site/src/components/BioSlides.astro site/src/components/WorkTimeline.astro site/src/components/ContactForm.astro site/src/components/Nav.astro site/src/components/BaseHead.astro
git commit -m "feat: components read copy from locale (Astro.currentLocale)"
```

---

## Task 9: Shared Home component + locale routes

**Files:** Create `src/components/Home.astro`, `src/pages/zh/index.astro`, `src/pages/zh/404.astro`; Modify `src/pages/index.astro`, `src/pages/404.astro`

- [ ] **Step 1: Extract Home.astro.** Move the entire `<Base>…</Base>` body of the current `src/pages/index.astro` into a new `src/components/Home.astro`. At its top add the lang lines + imports it needs (`getContent`, `t`, the section components, `Image`, `profile`, `SITE`). Use `t(lang, 'section.*')` for the SectionLabel titles, `getContent(lang).headline` for the headline, `getContent(lang).podcastDesc` and `.contactTagline` for the podcast/contact copy, and `t(lang,'podcast.break')` / `t(lang,'contact.direct')`. The hero `$ whoami` and section `$ ls …` commands stay literal English.

- [ ] **Step 2: Thin page wrappers.** Replace `src/pages/index.astro` with:

```astro
---
import Base from '../layouts/Base.astro';
import Home from '../components/Home.astro';
---
<Base><Home /></Base>
```
Create `src/pages/zh/index.astro`:

```astro
---
import Base from '../../layouts/Base.astro';
import Home from '../../components/Home.astro';
---
<Base><Home /></Base>
```
(`Astro.currentLocale` is `zh` for this route, so `Home` renders Chinese.)

- [ ] **Step 3: zh 404.** Create `src/pages/zh/404.astro` mirroring `src/pages/404.astro` but with zh text (`$ cd …` stays, message: `bash: 没有这个文件或目录`, link `cd ~ →` → `/zh/`).

- [ ] **Step 4: Verify + commit.** `cd site && npm run build` → builds `/`, `/zh/`, `/404`, `/zh/404`, posts. Curl dev: `/` shows English, `/zh/` shows Chinese (经历 / 工程负责人 / etc.).

```bash
git add site/src/components/Home.astro site/src/pages/index.astro site/src/pages/zh/ site/src/pages/404.astro
git commit -m "feat: shared Home component + /zh routes"
```

---

## Task 10: Language toggle in the nav

**Files:** Create `src/components/LanguageToggle.astro`; Modify `src/components/Nav.astro`

- [ ] **Step 1: Create the toggle.** Create `site/src/components/LanguageToggle.astro`:

```astro
---
import { type Locale, DEFAULT_LOCALE, isLocale, switchLocalePath } from '../i18n/config';
const lang: Locale = isLocale(Astro.currentLocale ?? '') ? (Astro.currentLocale as Locale) : DEFAULT_LOCALE;
const other: Locale = lang === 'en' ? 'zh' : 'en';
const otherPath = switchLocalePath(Astro.url.pathname, other);
const label = other === 'zh' ? '中' : 'EN';
---
<a href={otherPath} data-lang-switch={other}
   class="font-[family-name:var(--mono)] text-sm no-underline hover:opacity-70" style="color: var(--accent)"
   aria-label={other === 'zh' ? 'Switch to Chinese' : 'Switch to English'}>{label}</a>
<script>
  document.querySelectorAll('[data-lang-switch]').forEach((el) =>
    el.addEventListener('click', () => localStorage.setItem('lang', (el as HTMLElement).dataset.langSwitch!)));
</script>
```

- [ ] **Step 2: Add it to Nav.** In `src/components/Nav.astro`, import `LanguageToggle` and place `<LanguageToggle />` next to `<ThemeToggle />` in BOTH the always-visible toggle group (so it shows on mobile too).

- [ ] **Step 3: Verify + commit.** `cd site && npm run check` → 0 errors. On `/`, the nav shows `中`; clicking goes to `/zh/` (same hash preserved) and shows `EN`.

```bash
git add site/src/components/LanguageToggle.astro site/src/components/Nav.astro
git commit -m "feat: language toggle (中/EN) in nav, persists choice"
```

---

## Task 11: Auto-detect language on first visit

**Files:** Modify `src/layouts/Base.astro`

- [ ] **Step 1: Add detection + html lang.** In `src/layouts/Base.astro` frontmatter add the lang lines and set `<html lang={lang === 'zh' ? 'zh-CN' : 'en'}>`. Then add an `is:inline` script in `<head>` (before paint, after the theme script) that redirects on first visit only:

```astro
    <script is:inline>
      (function () {
        try {
          var saved = localStorage.getItem('lang');
          var path = location.pathname;
          var onZh = path === '/zh' || path.indexOf('/zh/') === 0;
          var pref = saved || (navigator.language || '').toLowerCase().indexOf('zh') === 0 ? (saved || 'zh') : 'en';
          if (!saved) pref = (navigator.language || '').toLowerCase().indexOf('zh') === 0 ? 'zh' : 'en';
          if (pref === 'zh' && !onZh) { location.replace('/zh' + (path === '/' ? '/' : path)); }
          else if (pref === 'en' && onZh) { location.replace(path.replace(/^\/zh/, '') || '/'); }
        } catch (e) {}
      })();
    </script>
```

> This runs only client-side; the static pages still exist for crawlers at both `/` and `/zh/`. The redirect honors a saved manual choice over the browser language.

- [ ] **Step 2: Verify + commit.** `cd site && npm run build` succeeds. In a browser with Chinese as the top language and no stored `lang`, visiting `/` redirects to `/zh/`; after clicking `EN` (stores `lang=en`), `/` stays English. (Manual test; document in commit.)

```bash
git add site/src/layouts/Base.astro
git commit -m "feat: auto-detect language on first visit; honor manual choice"
```

---

## Task 12: Final verification + deploy

> ⚠️ **DEPLOY PHASE — the very last step.**

- [ ] **Step 1: Full check.** `cd site && npm run check && npm test && npm run build` — all green; build emits `/`, `/zh/`, `/404`, `/zh/404`, `/writing/<post>`, `/rss.xml`, `sitemap-index.xml`.

- [ ] **Step 2: Manual walkthrough (dev).** `/` English; toggle `中` → `/zh/` Chinese across hero/experience/education/podcast/contact; theme toggle still works in both; mobile (~375px) hamburger works; "expand all" works.

- [ ] **Step 3: Commit any fixes, then push `master`.**

```bash
git push origin master
```
If the GitHub Actions secret (`VERCEL_TOKEN`) is set (Task 4 Step 2), the push auto-deploys production. Otherwise deploy manually: `cd site && npx vercel --prod --yes`.

- [ ] **Step 4: Verify live.** `curl -s https://seedzeng.com/zh/ | grep -o '工程负责人'` returns a match; `https://seedzeng.com/` still English.

---

## Task 13: Typography & fonts

> Local-dev. Iterative — this sets up a refined font + type scale; we tune sizes/leading live afterward.

**Files:** Modify `site/package.json` (dep), `site/src/layouts/Base.astro` (font import), `site/src/styles/global.css` (--mono token + scale)

- [ ] **Step 1: Self-host a refined monospace.** From `site/`:

```bash
npm i @fontsource-variable/jetbrains-mono
```
Self-hosted → served from our own origin → no external request → China-safe. (Swap-later alternatives: `@fontsource-variable/geist-mono`, `@fontsource/commit-mono`.)

- [ ] **Step 2: Import the font.** In `site/src/layouts/Base.astro` frontmatter, add at the top (with the other imports):

```ts
import '@fontsource-variable/jetbrains-mono';
```

- [ ] **Step 3: Point `--mono` at it.** In `site/src/styles/global.css`, change the `--mono` line inside `:root`:

```css
  --mono: 'JetBrains Mono Variable', ui-monospace, 'SF Mono', Menlo, Consolas, monospace;
```

- [ ] **Step 4: Refine the type scale.** In `global.css`, add to the `body` rule and headings:

```css
body { line-height: 1.6; letter-spacing: -0.003em; }
h1, h2, h3 { letter-spacing: -0.02em; }
```

- [ ] **Step 5: Verify + commit.** `cd site && npm run check` → 0 errors; `npm run build` succeeds and emits a `dist/_astro/*.woff2`. Mono elements (nav, `$` prompts, periods, tags) render in JetBrains Mono.

```bash
git add site/package.json site/package-lock.json site/src/layouts/Base.astro site/src/styles/global.css
git commit -m "feat: self-hosted JetBrains Mono + refined type scale"
```

> Iterate-later (not in this task): try `Inter` for body (`@fontsource-variable/inter`), tune per-section sizes/leading, adjust the bio-slide title size. Decide live with the user.

---

## Task 14: ASCII-art name in the hero

> Local-dev. Programmer-flavored hero name (à la Claude Code's banner), with a plain-text fallback for mobile + screen readers/SEO.

**Files:** Create `site/src/data/ascii-name.txt`, `site/src/components/AsciiName.astro`; Modify `site/src/components/Home.astro`

- [ ] **Step 1: Generate the ASCII to a file** (avoids all template-literal escaping). From `site/`:

```bash
mkdir -p src/data
npx figlet -f Standard seedzeng > src/data/ascii-name.txt
cat src/data/ascii-name.txt   # eyeball it; try -f Slant / -f Small for other styles
```

- [ ] **Step 2: Create the component** (imports the art raw, so no escaping). Create `site/src/components/AsciiName.astro`:

```astro
---
import ascii from '../data/ascii-name.txt?raw';
interface Props { name: string }
const { name } = Astro.props;
---
<!-- Decorative ASCII on desktop; the real name stays for screen readers + SEO -->
<h1 class="text-4xl font-bold tracking-tight m-0 sm:sr-only">{name}</h1>
<pre aria-hidden="true"
     class="hidden sm:block m-0 font-[family-name:var(--mono)] text-[0.6rem] leading-[1.15] overflow-x-auto"
     style="color: var(--accent)">{ascii}</pre>
```

- [ ] **Step 3: Use it in the hero.** In `site/src/components/Home.astro`, add `import AsciiName from './AsciiName.astro';` and replace the hero name line (`<h1 …>{SITE.name}</h1>` or the localized name) with:

```astro
    <AsciiName name={SITE.name} />
```
(The ASCII spells the `seedzeng` handle — identical in both locales; the `<h1>` text stays localized.)

- [ ] **Step 4: Verify + commit.** `cd site && npm run check` → 0 errors. Desktop shows the ASCII banner; ≤640px shows the plain styled name; the `<h1>` name remains in the DOM for a11y/SEO.

```bash
git add site/src/data/ascii-name.txt site/src/components/AsciiName.astro site/src/components/Home.astro
git commit -m "feat: ASCII-art hero name (desktop) with responsive + a11y fallback"
```

> If the banner feels too wide/loud, tune `text-[0.6rem]` or pick a smaller figlet font; we'll iterate live.

---

## Self-Review

**Spec coverage:** mobile nav (T1), dark live-react (T2), expand-all (T3), typography & fonts (T13 — exact font/scale chosen from a visual design session first), ASCII-art name (T14), auto-deploy on merge (T4, deploy phase), Chinese version (T5–T11), language switch (T10), auto-detect + adaptive (T11), dark adaptive (already + T2). ✓ Execution order revised so all deploy work runs last.

**Placeholders:** Chinese strings are real drafts (flagged for your review, not TODOs). One explicit DECISION: your Chinese name (kept "Seed Zeng"). Vercel IDs are real values from `site/.vercel/project.json`. No `TODO`/`TBD` in steps.

**Type consistency:** `Locale`, `isLocale`, `localeFromPath`, `switchLocalePath`, `DEFAULT_LOCALE` defined in T6 and reused verbatim in T7–T11. `getContent`/`CONTENT`/`SiteContent`/`Role`/`Education`/`Slide` defined in T7 and consumed in T8–T9. `t(lang,key)` defined in T7, used in T8–T10. Components consistently derive `lang` from `Astro.currentLocale`. Client scripts that can't see `Astro` get data via `data-` attributes (BioSlides, ContactForm).
