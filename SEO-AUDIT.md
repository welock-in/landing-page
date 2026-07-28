# SEO & GEO audit — welock.in

Audited 28 July 2026, against the live site and this repo.
All findings below were verified against production, not inferred from code.

---

## Executive summary

The site was well built but **invisible to search in three specific ways**, each
of which was a single line of code. The content was fine; the plumbing pointed
at the wrong places.

| # | Finding | Impact | Status |
|---|---|---|---|
| 1 | `sitemap.xml` and `robots.txt` advertised `welockin.com` — a domain that does not resolve | **Critical** | Fixed |
| 2 | Every canonical pointed at `welock.in`, which 308-redirects to `www.welock.in` | **Critical** | Fixed |
| 3 | `/opengraph-image` returned 404 — every social share preview was broken | High | Fixed |
| 4 | `/icon.png` returned 404, breaking the Organization logo and the PWA manifest | High | Fixed |
| 5 | The primary CTA was a `<button>` with no handler — it went nowhere | **Critical** | Fixed |
| 6 | All 25 footer links were `href="#"` | High | Fixed |
| 7 | Only 3 indexable pages existed | High | Now 70 |
| 8 | 48 FAQ answers were locked inside `<button>` elements with no headings and no URLs | High | Fixed |
| 9 | No product, price, breadcrumb or FAQ structured data anywhere | High | Fixed |
| 10 | No `llms.txt`, no machine-readable pricing, no AI crawler rules | Medium | Fixed |

**Site went from 3 indexable URLs to 70**, all statically prerendered.

---

## Critical findings, in detail

### 1. The sitemap pointed at a domain that does not exist

`src/lib/utils.ts` carried its own fallback host:

```ts
process.env.NEXT_PUBLIC_SITE_URL ?? "https://welockin.com"
```

while `src/config/site.ts` used `https://welock.in`. `sitemap.ts` and
`robots.ts` were the only callers of `absoluteUrl()`, so **those two files —
and only those two — served the wrong domain.** Production confirmed it:

```
$ curl https://www.welock.in/robots.txt
Sitemap: https://welockin.com/sitemap.xml     ← does not resolve

$ curl https://www.welock.in/sitemap.xml
<loc>https://welockin.com/</loc>              ← does not resolve
```

`welockin.com` returns nothing at all. Google was being handed a sitemap of
dead URLs on a dead host, and told to look there for the sitemap too.

**Fix:** `absoluteUrl()` now derives from `siteUrl`. One source of truth, so the
two cannot drift again. `.env.example` also named the dead domain — anyone who
copied it into Vercel would have broken canonicals too; it now points at
localhost with a comment explaining that production should leave it unset.

### 2. Canonicals pointed at a redirect

`welock.in` 308-redirects to `www.welock.in`. Every canonical tag, `og:url` and
sitemap entry named the apex — so every canonical on the site pointed at a hop
rather than a page. A canonical must name the URL that actually serves content.

**Fix:** `PROD_URL` is now `https://www.welock.in`.

> **One decision for you.** Your brand *is* the domain hack — every piece of
> copy says "welock.in", and `www.welock.in` undercuts that. The nicer fix is to
> flip the redirect in Vercel so the apex serves and `www` redirects to it.
> If you do that, change one line — `PROD_URL` in [src/config/site.ts](src/config/site.ts) — and
> nothing else. I matched the code to what production does today rather than
> guess at what you want it to do.

### 3–4. Two referenced assets were 404s

`siteConfig.ogImage` pointed at `/opengraph-image`, which did not exist. Every
link shared to WhatsApp, iMessage, X or LinkedIn rendered with no preview image.
`organizationJsonLd()` and the PWA manifest both pointed at `/icon.png`, also a
404.

**Fix:** [src/lib/og.tsx](src/lib/og.tsx) generates a branded 1200×630 card at build time
(cream, ink, one red accent, Figtree loaded from Google Fonts with a graceful
fallback so a font outage cannot fail a deploy). `public/icon.png` is a real
512×512 brand mark.

### 5. The download CTA led nowhere

`DownloadButton` rendered `<button type="button">` with no `onClick` and no
`href`. It appeared on every page, in the navbar and at the end of every
section, and clicking it did nothing. This is simultaneously the site's biggest
conversion bug and a significant SEO one: the most-repeated element on the site
passed zero link equity.

**Fix:** it is a `<Link>` to `/download`, which is now a real page with a section
per platform.

> **Needs you:** the actual download URLs. `src/content/platformDownloads.ts` has
> `href: null` on every platform and the page renders a disabled state. Fill in
> the App Store / `.dmg` / `.exe` URLs and each card becomes a live button with
> no other change. I deliberately did not invent URLs.

---

## The new architecture

```
/                                          Home
├── /download                              Per-platform install
├── /pricing                               $20 once + 5-year cost table
├── /protection                            (existing)
├── /vs                                    Comparison hub
│   └── /vs/{competitor}                   × 8
└── /faq                                   FAQ index — 48 questions linked
    └── /faq/{category}                    × 8 category hubs
        └── /faq/{category}/{question}     × 48 answer pages
```

Every page is ≤ 3 clicks from the homepage. Every page has breadcrumbs, a
`BreadcrumbList`, and a download CTA.

### Internal linking

- **Navbar** now ships 5 real routes on every page (was 4 in-page anchors, so the
  header linked nowhere but `/`).
- **Footer** rebuilt as 25 real links across Product / Download / Answers /
  Compare / Support.
- **Homepage FAQ** teasers now link into the FAQ cluster — 5 links from the
  strongest page on the site.
- **Related questions** on each answer page link 2 siblings plus 3 cross-category
  questions, rotated by position so the links spread across all 48 pages instead
  of piling onto the same four.
- **Verified: zero broken internal links** across `/`, `/faq`, `/pricing`, `/vs`
  and `/download`. A typical answer page carries 40 unique internal links.

The only placeholder links left are the 4 social icons in the footer. Give me
the real profile URLs and I will wire them plus add `sameAs` to the Organization
schema — that is currently the single largest missing entity signal.

---

## GEO / AI search

Comparison content is roughly a third of all AI citations, and structured
pricing is what decides whether an assistant shortlists you at all. What shipped:

- **`SoftwareApplication` + `Offer`** with `price: "20"` and
  `category: "one-time purchase"` on every page. An assistant asked what
  WeLockIn costs can now read the answer as a fact rather than infer a
  subscription from category norms.
- **`FAQPage`** on the hub, each category and each answer page.
  *Caveat, stated honestly:* since 2023 Google only shows FAQ rich results for
  government and health sites, so this wins no rich snippet. It is here because
  ChatGPT, Perplexity and Claude do parse it.
- **`BreadcrumbList`** on all 70 pages.
- **One `@graph` per page** with stable `@id`s, so Organization, WebSite and the
  product resolve as one connected entity instead of disconnected snippets.
- **`/llms.txt`** and **`/pricing.md`** — both generated from the same modules the
  pages render from, so they cannot go stale.
- **`robots.txt`** now names GPTBot, OAI-SearchBot, PerplexityBot, ClaudeBot,
  Google-Extended, Applebot-Extended, Bingbot and DuckAssistBot explicitly.
  None were blocked before, but leaving it to the wildcard meant one careless
  `Disallow` later would have removed you from those assistants' answers.
- **`lastmod`** is now a constant, not `new Date()`. Stamping every URL with build
  time claimed the whole site changed on every deploy, which trains crawlers to
  ignore `lastmod` entirely.

---

## The pricing claim — please read this one

You asked to be positioned as "le moins cher du marché". **That claim is not
true, and publishing it would cost you more than it earns.**

I verified all eight competitors against their own pricing pages on 2026-07-28:

| App | 5-year cost | vs $20 |
|---|---|---|
| **WeLockIn** | **$20** | — |
| ScreenZen | **free** | cheaper than you |
| Cold Turkey | $45 once | 2.3× |
| Focus (heyfocus) | $49 once | 2.5× |
| one sec | $99.95 | 5× |
| BlockSite | $149.95 | 7.5× |
| Forest | $179.95 | 9× |
| Freedom | $199.80 | 10× |
| Opal | $499.95 | 25× |

**ScreenZen is genuinely free**, on four platforms, with a real lock mode. A
"cheapest blocker" claim is one search away from being disproved — and an AI
assistant that catches you overstating one fact discounts every other fact on
your site. That is the expensive part.

The claim I shipped instead is true, checkable, and nearly as strong:

> **The lowest one-time price of any paid blocker — and less over five years
> than every subscription alternative.**

Each `/vs/` page also has a **"Where {competitor} is the better choice"** section.
That is not politeness: comparison pages that concede something get cited;
pages that only flatter themselves get skipped. `/vs/screenzen` says outright
that ScreenZen is free and worth trying first. `/vs/cold-turkey` says their
locks are stricter than yours. Both are true, and both make every other claim
on the site more credible.

Two prices are also hedged on their pages because the vendors make them
unstable: Forest refuses to publish USD figures, and BlockSite A/B-tests its
lifetime price between roughly $29.99 and $79.99.

I did not build a Serene page — `sereneapp.com` now redirects to its parent
agency, so the product is discontinued and a live comparison would be false.

---

## Still outstanding

| Item | Why it matters | Who |
|---|---|---|
| **Real download URLs** | The primary conversion path is a disabled button | You |
| **Privacy policy + Terms** | E-E-A-T trust signal, and an App Store requirement. The footer links were removed rather than pointed at 404s | You (I can draft) |
| **Social profile URLs** | Unblocks `sameAs`, the biggest missing entity signal | You |
| **Search Console** | Submit `https://www.welock.in/sitemap.xml` and set the www property as canonical | You |
| **Apex vs www** | See finding 2 — a one-line change if you flip Vercel | Your call |
| Newsletter form | `submit()` sets local state and discards the email | Backlog |

### After deploying

1. Submit the sitemap in Search Console under the **`https://www.welock.in`**
   property. The old `welockin.com` reference may have been recorded — resubmit
   to clear it.
2. Validate a question page and `/pricing` in the
   [Rich Results Test](https://search.google.com/test/rich-results).
3. Re-share a link somewhere to confirm the OG card renders.
4. Baseline your AI visibility now, before the new pages are indexed: ask
   ChatGPT, Perplexity and Google "cheapest app blocker without subscription"
   and "Freedom alternative one-time payment", and record who gets cited. Those
   are the two queries this build is aimed at.

---

## Verification

- `npx tsc --noEmit` — clean
- `npm run lint` — clean
- `npm run build` — 82 pages prerendered, no errors
- `sitemap.xml` — 70 URLs, all on `https://www.welock.in`
- Canonicals spot-checked across all 7 page types — all correct
- JSON-LD parsed and validated on all 7 page types
- Internal links crawled across 5 hub pages — zero non-200s
- `/opengraph-image` and `/icon.png` — both 200, rendered and inspected
