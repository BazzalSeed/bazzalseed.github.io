# seedzeng.com — Revamp Design

**Date:** 2026-06-05
**Owner:** Seed Zeng
**Status:** Approved (design); ready for implementation planning

## Goal

Replace the current single-page jQuery/Bootstrap template site with a fast,
lightweight, geeky-clean static site that (1) loads acceptably from mainland
China, (2) adds a real blog, and (3) is easy to maintain and extend. Aesthetic
inspiration: https://www.nic-nguyen.com/ — clean, monospace-flavored, with a
light/dark toggle.

## Background

- Current site: `index.html` (~59KB) + ~15 CSS files + ~18 JS files, built from a
  jQuery/Bootstrap portfolio template. Sections: Home, About (skills wall), CV
  timeline, Writing (external links), Podcast, Life (photo gallery), Contact.
- Deployed on GitHub Pages, `CNAME` → seedzeng.com, fronted by Cloudflare (free).
- Problem: unreliable/blocked from mainland China; heavyweight; no blog; dated look.

### China connectivity findings (measured 2026-06-05 via globalping)

- Current site (Cloudflare) loads from China **datacenter** probes in ~0.9–1.2s,
  status OK — reachable, not hard-blocked, but datacenter ≠ residential.
- A Vercel-hosted reference (nic-nguyen.com) loads from China datacenter probes
  in ~0.7–1.6s, status OK — **Vercel is reachable from China ≈ as well as
  Cloudflare**.
- Root causes of poor real-world China experience: (a) `github.io` IPs are
  throttled/blocked; (b) Cloudflare free has **no in-China POP** so every byte
  crosses the GFW; (c) the `apex → www → https` redirect chain adds full
  cross-GFW round trips before the page loads; (d) the page is asset-heavy
  (dozens of round trips).
- Hard truth: **truly fast** China delivery requires an ICP license (备案) +
  domestic CDN. That is out of scope for a personal site.

## Decisions

| Area | Decision |
|------|----------|
| Framework | **Astro + Tailwind CSS** (zero-JS static output; first-class Markdown/MDX blog) |
| Hosting | **Vercel** (CI from this GitHub repo, preview deploys; good Asia edge) |
| China strategy | **Tier 1 now, Tier 2 ready** (see below) |
| Theme | **Light + dark mode**, defaults to visitor OS preference, choice persisted |
| Hero | **Pure text**, no avatar (photo can be added later) |
| Accent | **Distinct per-mode**: terracotta (light) / terminal-green + blue (dark) |
| Layout | Clean nic-style: minimal nav, generous whitespace, subtle monospace touches |

### China delivery — staged

- **Tier 1 (this project):** Ship lightweight static to Vercel; remove the
  redirect chain by serving a single canonical host directly. Re-measure
  residential China with itdog.cn / globalping after launch and record results.
- **Tier 2 (documented, build only if Tier 1 insufficient):** Geo-split DNS —
  mainland China visitors routed to a Hong Kong / Singapore origin (HK requires
  no ICP); everyone else served by Vercel's global edge. ~$5–10/mo + setup.
- **Tier 3 (rejected):** Full ICP + domestic CDN. Too much bureaucracy/compliance
  for a personal site.

## Information Architecture (lean)

Four nav items: **work / writing / life** + theme toggle. Everything else cut.

- **Home** — pure-text hero: monospace kicker (`$ whoami` dark / `// hi, I'm`
  light), name, headline `Senior Staff Software Engineer @ DoorDash`, meta line
  `ex-Meta · ex-Klaviyo · angel investor · Boston`, one-line bio, social links.
  Below: the 3 most recent Writing entries.
- **Work** — role timeline sourced from CV (see Content). "Résumé" link points to
  LinkedIn (https://www.linkedin.com/in/seedzeng/) for now; swap to a hosted PDF later.
- **Writing** — **one unified reverse-chronological feed**. Local Markdown/MDX
  posts render on-site; external articles show a `source ↗` tag and link out.
  Includes RSS feed and syntax highlighting for code blocks.
- **Life** — lightweight photo gallery on its own `/life` route; images
  lazy-loaded and compressed. Migrate existing photos from `assets/images/life/`.
- **Footer** — email, GitHub, LinkedIn, Medium.

**Cut from old site:** skills/tech wall, podcast, projects section.

## Visual Design

- **Layout:** minimal top nav (`seed zeng` wordmark left; `work / writing / life`
  + theme toggle right). No window chrome, no avatar. Generous whitespace.
- **Type:** monospace (system stack: `ui-monospace, SF Mono, JetBrains Mono,
  Menlo`) for nav, kickers, labels, metadata; clean sans (`system-ui`) for body
  and the large name. (Optional later: a web font like JetBrains Mono / Inter —
  weigh against China page weight; system stack is the default.)
- **Terminal flavor** kept to subtle accents only: `$ whoami` / `// hi, I'm`
  hero kicker, `$ ls writing/` / `recent writing` section labels. No fake macOS
  traffic-light dots.
- **Themes:**
  - Light: background `#faf8f4`, ink `#2b2722`, accent terracotta `#b04a2f`.
  - Dark: background `#0d1117`, text `#c9d1d9`, accent green `#3fb950` + link
    blue `#58a6ff`.
  - Toggle in top-right; defaults to `prefers-color-scheme`; selection persisted
    (localStorage). No flash of wrong theme on load (inline head script).

## Content to Migrate

### Work timeline (from CV)
- DoorDash — Senior Staff Software Engineer (Jan 2026–present); Staff Software
  Engineer (Jul 2022–Dec 2025). **Leads the Storage / core online datastore org**
  (streaming is one of several teams under him).
- Meta — Lead Software Engineer (Aug 2020–Oct 2022).
- Klaviyo — **early engineer**; Senior Software Engineer (May 2019–Aug 2020);
  Software Engineer (Apr 2017–Jul 2019). Highlights: Abacus 1.0/2.0, scaled
  ingestion 500 → 150k events/s (~300×).
- SurveyMini (acq. SMG) — Backend Software Engineer (Jul 2016–Mar 2017).
- Education: WashU (CS, Summa Cum Laude); Denison (Physics, Summa Cum Laude).
- "Résumé" → link to LinkedIn (https://www.linkedin.com/in/seedzeng/) for now;
  replace with a current hosted PDF later. Drop the stale 2020 Google Drive link.

### Writing — external entries (seed the unified feed)
- Cassandra Unleashed — How We Enhanced Cassandra Fleet's Efficiency and
  Performance — *DoorDash Engineering* (2024)
  https://doordash.engineering/2024/01/30/cassandra-unleashed-how-we-enhanced-cassandra-fleets-efficiency-and-performance/
- API-First Approach to Kafka Topic Creation — *DoorDash Engineering* (2023)
  https://doordash.engineering/2023/12/05/api-first-approach-to-kafka-topic-creation/
- Stream Processing with High Cardinality and Large State at Klaviyo —
  *Ververica* https://www.ververica.com/blog/stream-processing-with-high-cardinality-and-large-state-at-klaviyo
- Scaling Klaviyo's Real-Time Analytics System with Stream Processing —
  *klaviyo.tech* https://klaviyo.tech/scaling-klaviyos-real-time-analytics-system-with-stream-processing-4b3bb87cd6b5
- Auditing and Replaying Billions of Streaming Events with AWS Athena —
  *klaviyo.tech* https://klaviyo.tech/auditing-and-replaying-billions-of-streaming-events-with-aws-athena-398ecc58a914

### Writing — first local post
- A short "Rebuilding seedzeng.com" inaugural post (optional but nice — exercises
  the blog pipeline end to end).

### Life
- Migrate + compress existing photos from `assets/images/life/`.

### Bio (final)
> "Engineering leader for DoorDash's core online datastores — the storage layer
> the whole business runs on. Early engineer at Klaviyo (scaled the pipeline
> ~300×). Physics + CS background: scientist's curiosity, engineer's execution.
> Angel investor in early-stage startups."

## Architecture / Project Structure (Astro)

Each unit has one clear purpose and a defined interface (content collections
decouple content from presentation; layout components decouple chrome from pages):

```
src/
  content/
    writing/        # Markdown/MDX entries; frontmatter: title, date, external?, url, source, tags
    config.ts       # content collection schema (zod)
  components/
    Nav.astro       # wordmark + links + ThemeToggle
    ThemeToggle.astro
    WritingList.astro   # renders unified feed; external -> link out, local -> /writing/[slug]
    WorkTimeline.astro
    SocialLinks.astro
  layouts/
    Base.astro      # <head>, theme bootstrap (no-flash inline script), Nav, footer
    Post.astro      # blog post layout (prose styles, syntax highlighting)
  pages/
    index.astro     # Home: hero + 3 recent writing
    work.astro
    writing/index.astro
    writing/[...slug].astro   # local post pages
    life.astro
    rss.xml.ts      # RSS feed
  styles/           # Tailwind + theme tokens (CSS vars for light/dark accents)
public/
  images/life/      # optimized photos
  resume.pdf
```

- **Theme tokens** as CSS custom properties switched by a `data-theme` attribute
  on `<html>`; Tailwind configured to consume them. Toggle flips the attribute +
  localStorage; inline head script applies the stored/OS theme before paint.
- **Writing feed** is a single sorted list built from the `writing` collection;
  an `external` boolean in frontmatter decides link-out vs. local render. Adding
  a post = dropping a Markdown file in `src/content/writing/`.

## Deployment & DNS

- Connect this GitHub repo to Vercel; production = `master`, previews per PR/push.
- Set custom domain `seedzeng.com` (and `www`) in Vercel; pick **one canonical
  host** and 308-redirect the other once, at the edge — eliminate the multi-hop
  chain. Prefer apex (`seedzeng.com`) as canonical.
- Update Cloudflare DNS to point at Vercel (CNAME/A per Vercel instructions);
  keep Cloudflare for DNS. Remove GitHub Pages serving + the `CNAME` file.
- Keep `license.txt`. Old `assets/` removed once content is migrated.

## Out of Scope (YAGNI)

- ICP filing / domestic China CDN (Tier 3).
- Comments, analytics dashboards, newsletter signup, search — can be added later.
- CMS — Markdown files in git are the content store.
- Avatar/photo — deferred.

## Success Criteria

- Lighthouse performance ≥ 95 on Home and a blog post; near-zero JS shipped.
- Light/dark toggle works, respects OS default, no flash on load.
- Writing feed renders both local posts and external links correctly; RSS valid.
- Re-measured China load (itdog/globalping) is meaningfully better than the
  current site, with redirect chain eliminated; results recorded.
- Deploys automatically from `master` on Vercel; seedzeng.com serves the new site.
