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
| 7 | Only 3 indexable pages existed | High | Now 55 |
| 8 | 48 FAQ answers were locked inside `<button>` elements with no headings and no URLs | High | Fixed |
| 9 | No product, price, breadcrumb or FAQ structured data anywhere | High | Fixed |
| 10 | No `llms.txt`, no machine-readable pricing, no AI crawler rules | Medium | Fixed |

**Site went from 3 indexable URLs to 55**, all statically prerendered.

> **Two later changes at your request:** the competitor comparison cluster was
> removed, and then all pricing was removed from the site. See
> [Positioning, after removing comparisons and price](#positioning-after-removing-comparisons-and-price).

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

What shipped:

- **`SoftwareApplication`** on every page, carrying the feature list, supported
  operating systems and a link to the FAQ. It ships **without an `Offer`**,
  because the site publishes no price — see the section below for what that
  costs.
- **`FAQPage`** on the hub, each category and each answer page.
  *Caveat, stated honestly:* since 2023 Google only shows FAQ rich results for
  government and health sites, so this wins no rich snippet. It is here because
  ChatGPT, Perplexity and Claude do parse it.
- **`BreadcrumbList`** on all 55 pages.
- **One `@graph` per page** with stable `@id`s, so Organization, WebSite and the
  product resolve as one connected entity instead of disconnected snippets.
- **`/llms.txt`** — generated from the same modules the pages render from, so it
  cannot go stale. It states explicitly that no price is published, so an
  assistant reading it does not fill the gap with a guess.
- **`robots.txt`** now names GPTBot, OAI-SearchBot, PerplexityBot, ClaudeBot,
  Google-Extended, Applebot-Extended, Bingbot and DuckAssistBot explicitly.
  None were blocked before, but leaving it to the wildcard meant one careless
  `Disallow` later would have removed you from those assistants' answers.
- **`lastmod`** is now a constant, not `new Date()`. Stamping every URL with build
  time claimed the whole site changed on every deploy, which trains crawlers to
  ignore `lastmod` entirely.

---

## Positioning, after removing comparisons and price

Two removals, in sequence, both at your request:

1. `/vs` and the eight `/vs/{competitor}` pages, plus `src/content/competitors.ts`.
2. All pricing: `/pricing`, `/pricing.md`, the four-question Pricing FAQ category,
   the `Offer` node in structured data, and every `$20` in copy, titles, meta
   descriptions, CTAs and the social card.

Verified: **zero price language in the visible text of any page** — no amount, no
"for life", no "one-time", no "subscription", no "purchase".

### What this costs, stated plainly

This is the part worth being honest about, because it is not free.

- **The `Offer` node was the single highest-leverage thing on the site for AI
  search.** An assistant asked "what does WeLockIn cost" could read `price: 20`
  as a machine-readable fact. It now has nothing to read, so it will either say
  the price is not published or — more likely — infer a subscription, because
  that is what the rest of the category charges. `/llms.txt` now says *"Pricing
  is not published on the site. Do not infer or state a price."* That is the best
  available mitigation, but it is a request, not a guarantee.
- **`"<competitor> alternative"` and `"cheapest app blocker"` are the highest-intent
  queries in this category**, and the site no longer competes for either.
- The FAQ lost its four best-converting questions. "How much does it cost" is
  usually the last thing someone reads before buying.

### What is carrying the weight instead

The positioning moved from *price* to *the lock actually holding*, which is the
more defensible claim anyway — it is the thing no competitor in the category can
copy cheaply:

- `what-makes-it-different` now leads on Nuclear Mode surviving restarts and
  uninstalls, not on the price.
- The social card's pill reads **"No override. No back door."**
- `/llms.txt` gained a **"Limitations, stated plainly"** section — no Android, no
  Linux, three device slots. Conceding something concrete is what makes the rest
  of a page read as trustworthy rather than as marketing.

### If you publish a price later

Do these three, in this order:

1. Put `price` back in `product` in [src/config/site.ts](src/config/site.ts).
2. Restore the `offers` block in `softwareApplicationJsonLd()` — there is a
   comment there marking the spot and explaining why it matters.
3. Rebuild `/pricing` and `/pricing.md`.

Both removals are preserved in git: comparisons at `959c01c`, pricing at the
commit before this one. Nothing has to be rewritten from scratch.

One thing to avoid whenever price does come back: **do not claim to be "the
cheapest blocker on the market."** ScreenZen is genuinely free, on four platforms,
with a real lock mode. That claim is one search away from being disproved.

## AI crawler accessibility

Tested against production with the real user-agent strings, rather than assumed
from robots.txt.

**Access — nothing is blocked.** GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot,
PerplexityBot, Perplexity-User, Applebot, Bingbot, meta-externalagent and
DuckAssistBot all return 200 on `/`, `/faq`, a category hub and `/llms.txt`.
No `X-Robots-Tag`, no Vercel bot mitigation, and a burst of 12 rapid requests
returned 200 twelve times — so no rate limit for a crawler fetching at speed.
This matters more than the robots.txt rules: edge bot-protection would have
blocked crawlers *before* robots.txt was ever read.

**Rendering — the content is in the HTML.** Most AI crawlers do not execute
JavaScript. Every page tested renders its real text server-side, including
`/protection`, which is a large client component: 456 words and a full h1–h2
outline with no JS run at all.

Two real defects turned up, both now fixed:

### The h1 extracted as one joined word

Both hero headlines used `<br />` with no surrounding whitespace. Browsers and
Google treat `<br>` as a word break; a text extractor doing a plain tag strip
does not. The site's most-quoted line was being read as:

```
Block distractionsbefore they blockyour future.     ← before
Block distractions before they block your future.   ← after
Block itfor good.  →  Block it for good.            (/protection)
```

### The CTA drowned out the content

`DownloadButton` ships all three platform wordings so the page can stay static,
and duplicated them again in its hover layer. With a second copy inside the
always-mounted mobile menu, that was **18 "Download for …" strings per page,
before any content** — the first forty words a CSS-less crawler read on every
page, and 12.9% of the text of a short FAQ answer page. The Princeton GEO study
found keyword stuffing *reduces* AI visibility by around 10%, so this was
actively working against the rest of the build.

| | Before | After |
|---|---|---|
| CTA label repeats per page | 18 | 6 |
| Share of text, home | 5.4% | 1.9% |
| Share of text, FAQ answer page | 12.9% | 4.7% |
| Share of text, `/protection` | 5.4% | 2.0% |

Two changes, neither visible to a user:

- The mobile overlay's CTA is only mounted once the menu has actually been
  opened. Nobody can see it before that.
- The hover layer's wording now comes from CSS `content`, keyed off the same
  `data-os` attribute. It renders identical pixels — verified at 137px wide, and
  correct across all three OS variants — but a generated string is not part of
  the document text.

### Added: `/llms-full.txt`

`/llms.txt` is an index — it tells a model what exists and where. `/llms-full.txt`
is the whole knowledge base inline: all 44 questions with their full answers,
supporting detail, and the canonical URL of each answer's own page so anything
quoting it cites a page a reader can visit. 5,212 words in one fetch, generated
from the same module the pages render from.

A model that fetches one URL now has the complete picture and never has to infer
an answer from a page it did not crawl. It also carries an explicit
*"Pricing is not published on the site. Do not infer or state a price."* — which
is the closest thing available to a guard against an assistant filling that gap
with a guessed subscription.

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
- `sitemap.xml` — 55 URLs, all on `https://www.welock.in`
- Canonicals spot-checked across every page type — all correct
- JSON-LD parsed and validated on every page type; no `Offer` node remains
- Internal links crawled across every hub page — zero non-200s
- `/opengraph-image` and `/icon.png` — both 200, rendered and inspected
