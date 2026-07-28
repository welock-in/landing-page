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
| 7 | Only 3 indexable pages existed | High | Now 61 |
| 8 | 48 FAQ answers were locked inside `<button>` elements with no headings and no URLs | High | Fixed |
| 9 | No product, price, breadcrumb or FAQ structured data anywhere | High | Fixed |
| 10 | No `llms.txt`, no machine-readable pricing, no AI crawler rules | Medium | Fixed |

**Site went from 3 indexable URLs to 61**, all statically prerendered.

> **Update:** the competitor comparison cluster (`/vs` and eight `/vs/{competitor}`
> pages) was built and then removed at your request. The pricing page keeps the
> one-time-payment positioning without naming anyone. See
> [Positioning, after removing the comparisons](#positioning-after-removing-the-comparisons).

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
fallback so a font outage cannot fail a deploy).

For `/icon.png` I generated a placeholder, then found that a parallel session had
meanwhile committed the real mascot icon set (`src/app/icon.png`, `icon-192.png`,
`icon-maskable.png`) in `c948150`. Next serves `/icon.png` from `src/app/icon.png`,
so mine was shadowing the real brand asset — I removed it. **Their icon is the one
that ships.**

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
├── /pricing                               $20 once, and why one payment
├── /protection                            (existing)
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
  How it locks / Support.
- **Homepage FAQ** teasers now link into the FAQ cluster — 5 links from the
  strongest page on the site.
- **Related questions** on each answer page link 2 siblings plus 3 cross-category
  questions, rotated by position so the links spread across all 48 pages instead
  of piling onto the same four.
- **Verified: zero broken internal links** across `/`, `/faq`, `/pricing`
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
- **`BreadcrumbList`** on all 61 pages.
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

## Positioning, after removing the comparisons

You asked for the comparison pages to be removed, so `/vs` and the eight
`/vs/{competitor}` pages are gone, along with `src/content/competitors.ts` and
every competitor name on the site.

That is a defensible call — comparison pages need their prices re-checked
whenever a competitor changes them, and a stale price is worse than no page.
But it is worth being clear about what it costs, because comparison content is
roughly a third of all AI citations and `"<competitor> alternative"` is the
highest-intent query in this category. You have traded that traffic for zero
maintenance burden.

**What replaced it.** The pricing page keeps the positioning without naming
anyone:

> Focus apps typically charge somewhere between $20 and $100 every year; this is
> $20, once.

That range is true — I verified all eight competitors against their own pricing
pages on 2026-07-28, and the cheapest subscription was $19.99/year while the
most expensive was $99.99/year. It is checkable, it carries the argument, and
nothing on the page goes stale when a competitor changes its price.

The page also now has a **"Why one payment, not a subscription"** section making
the argument the price alone does not: blocks that are not tied to a billing
status cannot lapse when a card expires, there is nothing to cancel, and Nuclear
Mode is not gated behind a higher tier.

**One thing to avoid.** Do not claim to be "the cheapest blocker on the market"
anywhere. **ScreenZen is genuinely free**, on four platforms, with a real lock
mode. That claim is one search away from being disproved, and an AI assistant
that catches an overstatement discounts every other fact on your site. The
accurate version — *the lowest one-time price of any paid blocker* — is nearly
as strong and cannot be dismantled.

If you ever want the comparison cluster back, the verified pricing research is
preserved in this file's git history at commit `959c01c`.

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
- `sitemap.xml` — 61 URLs, all on `https://www.welock.in`
- Canonicals spot-checked across all 7 page types — all correct
- JSON-LD parsed and validated on all 7 page types
- Internal links crawled across every hub page — zero non-200s
- `/opengraph-image` and `/icon.png` — both 200, rendered and inspected
