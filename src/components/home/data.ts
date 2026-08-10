/**
 * Content for the home page, lifted verbatim from the design file
 * (WeLockIn Landing.dc.html). Kept in a plain module — no "use client" —
 * so the server page can feed FAQS into the JSON-LD graph while the client
 * sections render the same objects.
 */

export const UNIVERSITIES: { file: string; name: string; wide?: boolean }[] = [
  { file: "05_Harvard.webp", name: "Harvard" },
  { file: "01_MIT.webp", name: "MIT" },
  { file: "03_Stanford.webp", name: "Stanford" },
  { file: "26_X.webp", name: "Polytechnique Paris" },
  { file: "04_Oxford.webp", name: "Oxford" },
  { file: "06_Cambridge.webp", name: "Cambridge" },
  { file: "07_ETH.webp", name: "ETH Zürich", wide: true },
  { file: "22_EPFL.webp", name: "EPFL", wide: true },
  { file: "21_Yale.webp", name: "Yale" },
  { file: "25_Princeton.webp", name: "Princeton" },
  { file: "02_Imperial.webp", name: "Imperial College London" },
  { file: "18_Berkeley.webp", name: "UC Berkeley" },
  { file: "10_Caltech.webp", name: "Caltech" },
  { file: "15_Penn.webp", name: "UPenn" },
  { file: "16_Cornell.webp", name: "Cornell" },
  { file: "13_UChicago.webp", name: "UChicago" },
  { file: "24_JohnsHopkins.webp", name: "Johns Hopkins" },
  { file: "23_TUM.webp", name: "TU Munich" },
  { file: "09_UCL.webp", name: "UCL" },
  { file: "08_NUS.webp", name: "NUS" },
  { file: "12_NTU.webp", name: "NTU Singapore" },
  { file: "11_HKU.webp", name: "HKU" },
  { file: "19_Melbourne.webp", name: "University of Melbourne" },
  { file: "20_UNSW.webp", name: "UNSW Sydney" },
];

/**
 * Where each home-page FAQ row links for its full answer, in the order the
 * questions appear in `home.json → faqSection.items`.
 *
 * The internal link is what lets a crawler get from the accordion to the
 * indexable page. The wording lives in the message catalogs and the URLs live
 * here, because a slug is a URL — translating one would break the link.
 * Reordering the questions in a catalog means reordering this list too.
 */
export const FAQ_LINKS: string[] = [
  "/faq/getting-started/how-it-works",
  "/faq/nuclear-mode/is-it-really-permanent",
  "/faq/what-you-can-block/what-can-i-block",
  "/faq/devices-and-platforms/android-support",
  "/faq/getting-started/built-by-students",
];

export const PLATFORMS: { name: string; file: string; wordmark?: boolean }[] = [
  { name: "macOS", file: "macos.webp", wordmark: true },
  { name: "iOS", file: "ios.webp", wordmark: true },
  { name: "Windows", file: "windows.webp" },
  { name: "Android", file: "android.webp" },
];

/** The two strictness settings the widget alternates between. */
export type SwMode = "soft" | "nuclear";
