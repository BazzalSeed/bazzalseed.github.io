# China connectivity — before vs after

**Date:** 2026-06-05 · measured via globalping.io (mainland China probes)

## Baseline — old site (GitHub Pages behind Cloudflare proxy)
- Reachable from China **datacenter** probes ~0.9–1.2s total.
- `apex → www → https` redirect chain added full cross-GFW round trips before the page loaded.
- Cloudflare free tier has **no in-China POP** (orange-cloud proxy → overseas).

## After — seedzeng.com on Vercel (Cloudflare DNS-only / grey cloud)
- DNS: `A seedzeng.com → 76.76.21.21` (DNS-only), `CNAME www → cname.vercel-dns.com` (DNS-only).
- Single canonical apex; no redirect chain.
- China results (HTTPS GET /):

| City | Status | Total |
|------|--------|-------|
| Ningbo | OK | 456ms |
| Guangzhou | OK | 608ms |
| Tianjin | OK | 657ms |
| Shenzhen | OK | 701ms |
| Beijing | OK | 770ms |
| Shanghai | OK | 894ms |

## Key finding
- **`*.vercel.app` is GFW-blocked** — `seedzeng.vercel.app` *timed out* from every China probe.
- A **custom domain on Vercel** (DNS-only) is reachable from China (~0.5–0.9s), same as the nic-nguyen.com reference on Vercel.
- → Always serve from `seedzeng.com`, never the `vercel.app` URL.

## Verdict
Tier-1 goal met: lightweight Astro static + custom domain on Vercel + DNS-only routing gives acceptable mainland-China access without ICP. Tier-2 (HK/SG geo-split) not needed at current latencies.
