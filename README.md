# WeLockIn — Landing

Marketing site for **WeLockIn**, the $20-for-life distraction blocker.
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
│   ├── layout/             # Navbar, Footer
│   ├── sections/           # one component per landing section (+ co-located .module.css)
│   └── ui/                 # reusable primitives (Container, SectionHeading, icons)
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
