# Welockin — Landing

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

Scripts: `dev`, `build`, `start`, `lint`.

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
│   └── site.ts             # SINGLE SOURCE OF TRUTH — branding, nav, SEO copy
├── content/                # typed content data (reviews, faqs, stats, pricing…)
├── lib/
│   ├── seo.ts              # buildMetadata() + structured-data helpers
│   └── utils.ts            # cn(), absoluteUrl()
└── types/  hooks/          # shared types & hooks (grow as needed)
```

### Conventions

- **Content is data.** Copy lives in `src/content/*` as typed modules — edit text
  without touching components. Add a review/FAQ/stat by appending to its array.
- **Branding is centralised.** `src/config/site.ts` feeds metadata, sitemap,
  robots, manifest and JSON-LD. Change it once, it propagates everywhere.
- **Styling.** Brand palette as CSS custom properties in `globals.css` (also
  exposed to Tailwind via `@theme`). Each section owns a co-located CSS Module —
  faithful to the design and easy to maintain.
- **Server-first.** Sections are React Server Components by default; only the
  interactive ones (`Navbar`, `HowItWorks`, `LockedEverywhere`, `Stats`,
  `Globe`, `Faq`) are `"use client"`. The whole page prerenders to static
  HTML — great for SEO.

Sections, in order: `Hero` → `LogoCloud` → `HowItWorks` (scroll-driven sticky
MacBook) → `LockedEverywhere` → `Stats` → `Globe` → `Faq` → `VideoStory`.

### SEO

- `metadataBase`, title template, canonical URLs, Open Graph & Twitter cards
- `robots.ts`, `sitemap.ts`, `manifest.ts`
- Organization + WebSite JSON-LD in the root layout
- `prefers-reduced-motion` respected for all decorative animation

Set `NEXT_PUBLIC_SITE_URL` per environment so canonicals/OG point at the right host.

## Languages

The site ships in **English, French, Spanish, German, Brazilian Portuguese and
Hindi**.

Spanish is deliberately neutral rather than es-ES or es-MX — one catalog that
reads naturally on both sides of the Atlantic beats two that split the
audience. Register follows what each language's readers expect from a product
built by students: `vous` in French, `du` in German, `tú` in Spanish.

```
src/i18n/
├── config.ts          # the locale registry — start here
├── routing.ts         # localePath() / splitLocale() / Accept-Language matching
├── dictionaries.ts    # loads a catalog, filling gaps from English
├── metadata.ts        # metadataFor() — canonical + hreflang for a page
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
`welockin_locale` cookie, which outranks `Accept-Language` from then on — so
picking English on a French laptop sticks.

### Adding a language

1. Add the code to `locales` in `config.ts` and describe it in `LOCALE_META`.
2. `cp -r src/i18n/messages/en src/i18n/messages/<code>` and translate.
3. Register the loader in `dictionaries.ts`.

Routing, the switcher, hreflang, the sitemap and static generation all read
from that registry and pick the new language up on their own.

### Improving a translation

Edit the JSON and redeploy — nothing else references the strings. The English
catalog defines the types, so a **missing key falls back to English** rather
than rendering blank, and a **misspelled key fails the build**. That means a
catalog can be filled in a few keys at a time without ever shipping a broken
page.

### What is not translated yet

Deliberate, and safe by construction — these render in English under every
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
