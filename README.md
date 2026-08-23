# Welockin: Landing

Marketing site for **Welockin**, the distraction blocker you cannot talk
yourself out of.
Built with **Next.js 16 (App Router) · React 19 · TypeScript · Tailwind v4**,
optimised for SEO and structured to scale.

## Getting started

```bash
npm install
cp .env.example .env        # set NEXT_PUBLIC_SITE_URL
npm run dev                 # http://localhost:3000
```

Scripts: `dev`, `build`, `start`, `lint`, `test`, `verify:agents`.

```bash
npm test                                        # unit tests (node:test)
npm run build && npm start &                    # then, against the running server:
npm run verify:agents -- http://localhost:3000  # every machine-readable endpoint
```

## Architecture

```
src/
├── app/                    # routes + SEO file conventions
│   ├── layout.tsx          # fonts, <head> metadata, JSON-LD
│   ├── page.tsx            # composes the landing sections
│   ├── globals.css         # design tokens + base styles
│   ├── sitemap.ts          # generated sitemap.xml
│   ├── robots.ts           # generated robots.txt
│   └── manifest.ts         # PWA web manifest
├── components/
│   ├── layout/             # Navbar, Footer, LegalPage shell
│   ├── home/               # one component per landing section (+ shared home.css)
│   └── ui/                 # reusable primitives (Container, Breadcrumbs, DownloadButton, icons)
├── config/
│   └── site.ts             # SINGLE SOURCE OF TRUTH: branding, nav, SEO copy
├── content/                # typed content data (reviews, faqs, stats, pricing…)
├── lib/
│   ├── seo.ts              # buildMetadata() + structured-data helpers
│   └── utils.ts            # cn(), absoluteUrl()
└── types/  hooks/          # shared types & hooks (grow as needed)
```

### Conventions

- **Content is data.** Copy lives in `src/content/*` as typed modules: edit text
  without touching components. Add a review/FAQ/stat by appending to its array.
- **Branding is centralised.** `src/config/site.ts` feeds metadata, sitemap,
  robots, manifest and JSON-LD. Change it once, it propagates everywhere.
- **Styling.** Brand palette as CSS custom properties in `globals.css` (also
  exposed to Tailwind via `@theme`). Each section owns a co-located CSS Module,
  faithful to the design and easy to maintain.
- **Server-first.** Sections are React Server Components by default; only the
  interactive ones (`Navbar`, `HowItWorks`, `LockedEverywhere`, `Stats`,
  `Globe`, `Faq`) are `"use client"`. The whole page prerenders to static
  HTML, great for SEO.

Sections, in order: `Hero` → `LogoCloud` → `HowItWorks` (scroll-driven sticky
MacBook) → `LockedEverywhere` → `Stats` → `Globe` → `Faq` → `VideoStory`.

### SEO

- `metadataBase`, title template, canonical URLs, Open Graph & Twitter cards
- `robots.ts`, `sitemap.ts`, `manifest.ts`
- Organization (with `contactPoint` and `address`) + WebSite JSON-LD in the
  root layout
- `prefers-reduced-motion` respected for all decorative animation

Set `NEXT_PUBLIC_SITE_URL` per environment so canonicals/OG point at the right host.

### Agents

Every public page has two representations at one URL. A browser gets HTML; a
client that sends `Accept: text/markdown` gets Markdown, per
[acceptmarkdown.com](https://acceptmarkdown.com). Appending `.md` to a path
does the same without a header (`/index.md`, `/download.md`, `/fr/faq.md`), and
that URL is what the `Link: rel="alternate"` header and the `<link>` in the
head point at.

| Where | What |
| --- | --- |
| `src/lib/accept.ts` | `Accept` parsing and ranking (q-values, specificity, `q=0`) |
| `src/lib/agentDocs.ts` | the Markdown for every page, generated from the catalogs |
| `src/content/agentBrief.ts` | when to use Welockin, when not to, how to call it |
| `src/proxy.ts` | negotiation, `Vary`, `Link`, and `406` |
| `src/app/api/markdown/[[...slug]]/route.ts` | serves the Markdown, and the Markdown 404 |
| `src/app/global-not-found.tsx` | the HTML 404, with a route map on it |

`/llms.txt` and `/llms-full.txt` quote the same `agentBrief` module, so the
three surfaces cannot drift apart. Nothing about the site's content is written
twice: add a page and it needs an entry in `agentDocs.ts`, which
`npm run verify:agents` will insist on by walking `sitemap.xml`.

One known gap: Next sets `Vary` on app-page responses with `res.setHeader`
(`build/templates/app-page.js`), which overwrites what the proxy set, so on a
self-hosted `next start` the HTML half of a negotiated pair does not advertise
`Vary: Accept`. The Markdown half, which is what caches actually need to key
apart, always does. See the note on `RSC_VARY` in `src/proxy.ts`.

## Analytics

PostHog, wired in `src/components/analytics/PostHogProvider.tsx` and mounted
from the root layout. The project key and region are baked into that file, so a
deploy needs no dashboard step: **analytics run in production builds only**,
which is what keeps `npm run dev` out of the real numbers.

`NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_PROJECT_HOST`
override both, to point a deployment at a different project; setting either to
an empty string turns analytics off for that deployment, which is how a preview
build stays out of the real numbers.

Only the `NEXT_PUBLIC_` prefix is load-bearing: Next.js inlines just those into
the browser bundle, and `posthog.init()` runs in the browser. A variable without
it is server-only, and would read as `undefined` here.

The `phc_` key is the **project** key: it ships to every browser that loads the
site, so committing it changes nothing about its exposure. The `phx_` key
PostHog also shows you is a **personal** key: it grants access to your whole
account, and it belongs in neither this repo nor a browser.

The project is on PostHog's **US** cloud (`https://us.i.posthog.com`). Point the
host at the wrong region and PostHog does not fail loudly: it accepts the
requests and records nothing, so an empty dashboard looks exactly like a site
nobody visits.

**Full tracking, no consent banner.** Persistence is left at PostHog's default,
so identity lives in a cookie plus localStorage and a returning visitor is
recognised as the same person, which is what makes unique visitors, retention
and multi-session funnels mean anything. Autocapture is on; session recording
follows whatever the PostHog project settings say. This is a deliberate choice
by the site owner, made with the EU consent rules in view: those rules govern
storing and reading information on a visitor's device, and there is no banner
here.

The cookieless configuration is one edit away if that trade ever stops being
worth it: `persistence: "memory"` and `person_profiles: "identified_only"` in
`PostHogProvider.tsx`. It needs no banner, at the cost of every reload looking
like a new visitor.

Two things the file is deliberate about, and which are easy to undo by accident:

- The SDK is a **dynamic import**, so ~500 kB of it never enters the bundle that
  every page loads before it paints. A plain top-level `import posthog from
  "posthog-js"` would put it back.
- The pageview tracker sits inside a **`<Suspense>` boundary**, because
  `useSearchParams()` makes its nearest boundary bail out of prerendering.
  Remove the boundary and the entire static site turns dynamic.

Pageviews are captured manually (`capture_pageview: false`) since App Router
navigation changes the URL without a document load. Every event carries the
active `locale`, so the six language editions can be compared against each other.

> **Outstanding:** the Privacy Policy still describes no analytics at all, and
> its data table lists no cookies. With tracking cookies now shipping, that page
> is the one piece of this that is out of date.

## Languages

The site ships in **English, French, Spanish, German, Brazilian Portuguese and
Hindi**.

Spanish is deliberately neutral rather than es-ES or es-MX: one catalog that
reads naturally on both sides of the Atlantic beats two that split the
audience. Register follows what each language's readers expect from a product
built by students: `vous` in French, `du` in German, `tú` in Spanish.

```
src/i18n/
├── config.ts          # the locale registry, start here
├── routing.ts         # localePath() / splitLocale() / Accept-Language matching
├── dictionaries.ts    # loads a catalog, filling gaps from English
├── metadata.ts        # metadataFor(): canonical + hreflang for a page
├── LocaleContext.tsx  # active locale + site chrome, for client components
└── messages/<locale>/ # common.json · home.json · pages.json · faq.json
```

### URLs

English is served **un-prefixed** and everything else carries a prefix:
`/faq`, `/fr/faq`, `/es/faq`, `/de/faq`, `/pt-br/faq`, `/hi/faq`. Every URL
indexed today is English,
so this keeps the site's entire search footprint exactly where it is. `proxy.ts`
rewrites `/faq` to `/en/faq` internally, so the app always sees a locale segment
while the address bar never does; `/en/faq` 308s back to `/faq` so a page never
has two URLs.

A visitor whose browser asks for a language we speak is redirected once
(`/faq` → `/fr/faq`). Choosing a language from the switcher writes the
`welockin_locale` cookie, which outranks `Accept-Language` from then on, so
picking English on a French laptop sticks.

### Adding a language

1. Add the code to `locales` in `config.ts` and describe it in `LOCALE_META`.
2. `cp -r src/i18n/messages/en src/i18n/messages/<code>` and translate.
3. Register the loader in `dictionaries.ts`.

Routing, the switcher, hreflang, the sitemap and static generation all read
from that registry and pick the new language up on their own.

### Improving a translation

Edit the JSON and redeploy: nothing else references the strings. The English
catalog defines the types, so a **missing key falls back to English** rather
than rendering blank, and a **misspelled key fails the build**. That means a
catalog can be filled in a few keys at a time without ever shipping a broken
page.

### What is not translated yet

Deliberate, and safe by construction, these render in English under every
locale via the fallback above:

- **The 44 FAQ answers** in `src/content/faqPage.ts`. The FAQ hub, the seven
  category headlines and intros, and the five questions on the landing page
  *are* translated; the long-form answers behind them are not. Add them by
  moving their text into `messages/<locale>/faq.json`.
- **Long-form prose** on `/download`, `/support`, `/help` and `/protection`.
  Each page's heading, lead and metadata are translated; the body copy is not.
- **Privacy Policy and Terms of Service**, intentionally. They are binding
  texts, and a machine translation of one is a liability rather than a
  courtesy. `common.legal.englishNotice` is in every catalog, ready to display
  if you want to say so explicitly on the page.
