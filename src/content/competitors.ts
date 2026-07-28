/**
 * Competitor data behind `/vs` and `/vs/[slug]`.
 *
 * Every number here was read off the vendor's own pricing page or payment
 * catalog on `PRICING_VERIFIED_ON`, not from a review-site listicle — several
 * of which are repeating figures that are years out of date. Where a vendor
 * refuses to publish a stable USD price, `priceNote` says so on the page rather
 * than the page inventing a precise-looking number.
 *
 * Two rules this file exists to enforce:
 *
 *  1. **No claim WeLockIn cannot survive being fact-checked on.** ScreenZen is
 *     free. A page here that called WeLockIn "the cheapest blocker" would be
 *     false, and an AI assistant that checks it would stop quoting the site at
 *     all — which costs far more than the claim was ever worth.
 *  2. **Say where the competitor wins.** `competitorWins` is not a courtesy;
 *     comparison pages that only flatter themselves read as marketing and get
 *     skipped. The ones that get cited are the ones that concede something.
 */

/** The date every price below was last checked against the vendor. */
export const PRICING_VERIFIED_ON = "2026-07-28";

export type CompetitorPricing = {
  monthly: number | null;
  annual: number | null;
  /** One-time or lifetime licence, where one exists. */
  oneTime: number | null;
  freeTier: boolean;
  /**
   * Cheapest realistic five-year spend, in USD, for comparison against a
   * single $20 purchase.
   */
  fiveYearTotal: number;
  /** Any caveat a reader deserves before trusting the number. */
  note?: string;
};

export type Competitor = {
  slug: string;
  name: string;
  /** Vendor site. Rendered `rel="nofollow"` — this is a competitor, not an endorsement. */
  url: string;
  /** Neutral one-liner. Should read as fair to someone who works there. */
  summary: string;
  platforms: string[];
  pricing: CompetitorPricing;
  hardLock: {
    offered: boolean;
    name: string | null;
    detail: string;
  };
  /** Honest reasons to choose them instead. */
  competitorWins: string[];
  /** Where WeLockIn is the better pick, stated factually. */
  welockinWins: string[];
  /** Who genuinely should not buy WeLockIn over this one. */
  chooseThemIf: string;
  /** Meta description, ≤ 155 chars. */
  description: string;
  searchTerms: string[];
};

export const competitors: Competitor[] = [
  {
    slug: "freedom",
    name: "Freedom",
    url: "https://freedom.to/",
    summary:
      "A long-established cross-platform blocker that syncs one blocking session across an unlimited number of devices.",
    platforms: ["macOS", "Windows", "iOS", "Android", "Chromebook"],
    pricing: {
      monthly: 8.99,
      annual: 39.96,
      oneTime: 99.5,
      freeTier: true,
      fiveYearTotal: 199.8,
      note: "Freedom advertises the annual plan as $3.33/month rather than printing a yearly total; $39.96 is that figure multiplied out. The $99.50 lifetime licence is a rotating 50%-off promotion against a $199 list price.",
    },
    hardLock: {
      offered: true,
      name: "Locked Mode",
      detail:
        "Premium-only. Prevents ending a session early. Not included in the free plan.",
    },
    competitorWins: [
      "Unlimited devices on one plan, where WeLockIn includes three.",
      "Android support today — WeLockIn has not shipped it yet.",
      "A far longer track record, having run since 2011.",
    ],
    welockinWins: [
      "$20 once against roughly $40 a year, so Freedom costs more before the end of its first year.",
      "Nuclear Mode survives uninstalling the app; Locked Mode is a session lock.",
      "No renewal that can lapse and quietly switch your protection off.",
    ],
    chooseThemIf:
      "Android is your main phone, or you need to cover more than three devices. Both are real gaps in WeLockIn today.",
    description:
      "Freedom costs about $40/year; WeLockIn is $20 once. Verified pricing, honest gaps, and which one actually fits you.",
    searchTerms: ["freedom alternative", "freedom.to pricing", "cheaper than freedom"],
  },
  {
    slug: "cold-turkey",
    name: "Cold Turkey Blocker",
    url: "https://getcoldturkey.com/",
    summary:
      "A desktop-only blocker with the strictest lock options on the market, sold as a one-time purchase.",
    platforms: ["macOS", "Windows"],
    pricing: {
      monthly: null,
      annual: null,
      oneTime: 45,
      freeTier: true,
      fiveYearTotal: 45,
      note: "Cold Turkey renders its price in local currency at checkout. $45 is the USD figure from the vendor's own payment catalog. The $39 widely repeated on review sites is out of date.",
    },
    hardLock: {
      offered: true,
      name: "Locked Block",
      detail:
        "The strongest in this comparison. Locks can survive uninstall attempts, and the delay lock runs up to 40 days.",
    },
    competitorWins: [
      "The toughest locks available anywhere, including WeLockIn — this is their genuine strength.",
      "A generous free tier for desktop blocking.",
      "Years of proven reliability on Windows in particular.",
    ],
    welockinWins: [
      "$20 once against $45 once — less than half the price for a comparable one-time model.",
      "Covers iPhone and iPad; Cold Turkey is desktop-only, so your phone stays wide open.",
      "One purchase syncs phone, tablet and computer together.",
    ],
    chooseThemIf:
      "You only ever get distracted at a desktop and you want the single strictest lock that exists. Cold Turkey's locks are harder than ours.",
    description:
      "Cold Turkey is $45 once and desktop-only. WeLockIn is $20 once and covers your phone too. Verified prices, both sides.",
    searchTerms: [
      "cold turkey alternative",
      "cold turkey blocker price",
      "cold turkey vs",
    ],
  },
  {
    slug: "opal",
    name: "Opal",
    url: "https://opalapp.com/",
    summary:
      "A screen-time app for iPhone, Android and Mac built around scheduled focus sessions and a usage score.",
    platforms: ["iOS", "Android", "macOS"],
    pricing: {
      monthly: 19.99,
      annual: 99.99,
      oneTime: 399,
      freeTier: true,
      fiveYearTotal: 499.95,
    },
    hardLock: {
      offered: true,
      name: "Harder Blocking Difficulty / No Unblocks",
      detail:
        "Pro-only. The free tier blocks apps but does not include the un-bypassable difficulty setting.",
    },
    competitorWins: [
      "Polished screen-time analytics and a usage score, which WeLockIn does not offer.",
      "Android support today.",
    ],
    welockinWins: [
      "$20 once against $99.99 a year — five years of Opal costs about 25 times a single WeLockIn purchase.",
      "Nuclear Mode has no override at all, where Opal's hardest setting sits behind a subscription that can lapse.",
      "Windows support, which Opal does not have.",
    ],
    chooseThemIf:
      "You mainly want detailed screen-time analytics and coaching, and the recurring cost does not bother you.",
    description:
      "Opal is $99.99/year — about $500 over five years. WeLockIn is $20 once. The full comparison, with verified prices.",
    searchTerms: ["opal alternative", "opal app pricing", "cheaper than opal"],
  },
  {
    slug: "forest",
    name: "Forest",
    url: "https://www.forestapp.cc/",
    summary:
      "A gamified focus timer where a virtual tree grows during a session and dies if you leave the app.",
    platforms: ["iOS", "Android", "watchOS", "Chrome", "Firefox"],
    pricing: {
      monthly: 5.99,
      annual: 35.99,
      oneTime: null,
      freeTier: true,
      fiveYearTotal: 179.95,
      note: "Forest does not publish USD prices, stating that they vary by region and platform. This figure is from the US App Store listing, which currently shows two different annual tiers. Check your own store for the price you would actually pay.",
    },
    hardLock: {
      offered: false,
      name: "Deep Focus",
      detail:
        "A social and gamified deterrent rather than a technical lock — leaving the session kills your tree, but nothing stops you leaving.",
    },
    competitorWins: [
      "Genuinely enjoyable to use, which matters more than it sounds for daily habits.",
      "Plants real trees from revenue.",
      "Android and Apple Watch support.",
    ],
    welockinWins: [
      "Forest deters; WeLockIn blocks. Nothing in Forest prevents you opening the app anyway.",
      "$20 once against roughly $36 a year.",
      "Windows and macOS coverage, which Forest does not offer.",
    ],
    chooseThemIf:
      "You want motivation and a gentle nudge rather than a block. If willpower plus a dying tree is enough for you, Forest is more pleasant than we are.",
    description:
      "Forest deters with a dying tree; WeLockIn actually blocks. About $36/year versus $20 once. An honest comparison.",
    searchTerms: ["forest app alternative", "forest app pricing", "forest vs"],
  },
  {
    slug: "blocksite",
    name: "BlockSite",
    url: "https://blocksite.co/",
    summary:
      "A browser-extension-first website and app blocker with cross-device sync, sold mainly as a discounted lifetime licence.",
    platforms: ["Chrome", "Safari", "Edge", "Android", "iOS", "Desktop"],
    pricing: {
      monthly: 14.99,
      annual: 29.99,
      oneTime: 29.99,
      freeTier: true,
      fiveYearTotal: 149.95,
      note: "BlockSite A/B-tests its lifetime price between roughly $29.99 and $79.99 depending on where you arrive from, so what you are offered may differ. The $29.99 annual and $14.99 monthly plans were consistent across every variant checked.",
    },
    hardLock: {
      offered: true,
      name: "Password protection and uninstall prevention",
      detail:
        "Real but softer than a dedicated lock mode — there is no single un-bypassable setting.",
    },
    competitorWins: [
      "Strong browser-extension experience if most of your distraction is on the web.",
      "Android support.",
      "A lifetime licence exists, when the promotion is running.",
    ],
    welockinWins: [
      "$20 once and never A/B-tested — the price on the page is the price.",
      "Nuclear Mode has no override; BlockSite's protections are password-based, and a password is something you know.",
      "$20 once against $29.99 a year for the subscription plan.",
    ],
    chooseThemIf:
      "Your distraction is almost entirely browser-based and you want a mature extension, or you catch their lifetime licence at the low end of its price range.",
    description:
      "BlockSite is $29.99/year with an A/B-tested lifetime price. WeLockIn is $20 once, always. Verified comparison.",
    searchTerms: ["blocksite alternative", "blocksite pricing", "blocksite premium cost"],
  },
  {
    slug: "one-sec",
    name: "one sec",
    url: "https://one-sec.app/",
    summary:
      "An app that inserts a mandatory breathing pause before you can open a distracting app, aiming to break the reflex.",
    platforms: ["iOS", "iPadOS", "Android", "Browser extension"],
    pricing: {
      monthly: 3.99,
      annual: 19.99,
      oneTime: 99.99,
      freeTier: true,
      fiveYearTotal: 99.95,
    },
    hardLock: {
      offered: false,
      name: null,
      detail:
        "one sec is friction by design, not a lock. There is no un-bypassable mode — you can always continue after the pause.",
    },
    competitorWins: [
      "The breathing-pause mechanic is genuinely effective at breaking an unconscious habit loop.",
      "The cheapest subscription in this comparison at $19.99 a year.",
      "Android support, and a student discount.",
    ],
    welockinWins: [
      "one sec pauses you; WeLockIn stops you. There is no un-bypassable mode in one sec at all.",
      "$20 once against $19.99 every year — the second year is where the gap opens.",
      "Desktop apps for macOS and Windows rather than a browser extension.",
    ],
    chooseThemIf:
      "Your problem is reflex rather than compulsion — you open apps without deciding to, and a pause is enough to stop you. That is a real category of problem and one sec solves it well.",
    description:
      "one sec pauses you; it doesn't block you. $19.99/year versus $20 once. Where each one genuinely fits.",
    searchTerms: ["one sec alternative", "one sec app pricing", "one sec vs"],
  },
  {
    slug: "focus",
    name: "Focus (heyfocus.com)",
    url: "https://heyfocus.com/",
    summary:
      "A macOS-only blocker combining Pomodoro timers, focus profiles and scheduling, sold as a one-time purchase.",
    platforms: ["macOS"],
    pricing: {
      monthly: null,
      annual: null,
      oneTime: 49,
      freeTier: false,
      fiveYearTotal: 49,
      note: "Focus sells three one-time licences: $49 including one year of updates, $129 for lifetime updates, and $29 for the legacy version. There is no subscription and no free tier, though there is a 7-day trial.",
    },
    hardLock: {
      offered: true,
      name: "Locked Mode",
      detail: "Sessions cannot be stopped once started, with optional password protection.",
    },
    competitorWins: [
      "Deep macOS integration and a mature Pomodoro workflow.",
      "A one-time purchase model, like ours.",
    ],
    welockinWins: [
      "$20 once against $49 once — and $129 if you want lifetime updates.",
      "Covers iPhone, iPad and Windows; Focus is macOS-only, so your phone is untouched.",
      "There is a free tier decision to make with Focus: there isn't one.",
    ],
    chooseThemIf:
      "You work only on a Mac, you want Pomodoro built in, and the higher one-time price is worth the macOS polish.",
    description:
      "Focus is macOS-only at $49 once. WeLockIn is $20 once across Mac, iPhone, iPad and Windows. Compared honestly.",
    searchTerms: ["heyfocus alternative", "focus app mac pricing", "focus mac blocker"],
  },
  {
    slug: "screenzen",
    name: "ScreenZen",
    url: "https://screenzen.co/",
    summary:
      "A free, donation-supported screen-time app that adds intentional friction and breathing pauses before you open a distracting app.",
    platforms: ["iOS", "macOS", "Windows", "Android"],
    pricing: {
      monthly: null,
      annual: null,
      oneTime: null,
      freeTier: true,
      fiveYearTotal: 0,
      note: "ScreenZen is genuinely free with no paid tier. In-app purchases are optional tips, not features.",
    },
    hardLock: {
      offered: true,
      name: "Lock Mode",
      detail:
        "Protects against common loopholes and can prevent uninstalling — a real lock, not just friction.",
    },
    competitorWins: [
      "It is free. WeLockIn cannot beat free, and we are not going to pretend otherwise.",
      "Four platforms including Android, which we have not shipped.",
      "A real lock mode that resists uninstalling.",
    ],
    welockinWins: [
      "Five distinct unlock difficulty levels, including an accountability partner and a lock that runs to a calendar date.",
      "Ready-made Protection categories for adult content, gambling, dating apps and mature games, rather than naming every site yourself.",
      "Funded support: a paid product has someone whose job it is to answer you.",
    ],
    chooseThemIf:
      "Budget is the deciding factor, or Android is your main device. ScreenZen is free and good — try it first, and only pay us if you need what it doesn't do.",
    description:
      "ScreenZen is free and genuinely good. Here's exactly what WeLockIn's $20 buys you that it doesn't — and when to just use ScreenZen.",
    searchTerms: ["screenzen alternative", "free app blocker", "screenzen vs"],
  },
];

export function findCompetitor(slug: string): Competitor | undefined {
  return competitors.find((c) => c.slug === slug);
}

export function competitorPath(slug: string): string {
  return `/vs/${slug}`;
}

/** Formats a USD amount the way the pages quote it. */
export function usd(amount: number): string {
  return Number.isInteger(amount) ? `$${amount}` : `$${amount.toFixed(2)}`;
}

/**
 * The cheapest recurring cadence a competitor offers, as a sentence fragment.
 * Returns null for the free and one-time-only products.
 */
export function recurringLabel(c: Competitor): string | null {
  if (c.pricing.annual !== null) return `${usd(c.pricing.annual)}/year`;
  if (c.pricing.monthly !== null) return `${usd(c.pricing.monthly)}/month`;
  return null;
}
