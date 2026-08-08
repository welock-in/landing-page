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

export const HOW_STEPS: { title: string; body: string }[] = [
  {
    title: "Choose what to block",
    body: "Bundle the apps and sites that quietly steal your focus — social, video, news, games — into reusable blocklists you can launch in a single tap.",
  },
  {
    title: "Set it and lock in",
    body: "Pick a duration, hit start, and the nuclear lock seals the session shut — no pausing, no quitting, no bargaining your way out until the timer hits zero.",
  },
  {
    title: "Select your devices",
    body: "Connect your Mac, iPhone and iPad once, and every block stays in sync across all of them in real time — your distractions run out of places to hide.",
  },
];

// `more` points each item at its full answer under /faq — the internal link is
// what lets a crawler get from the accordion to the indexable page.
export const FAQS: { question: string; answer: string; more: string }[] = [
  {
    question: "How does Welockin actually work?",
    answer:
      "Three steps: pick the apps and sites you want gone, choose how strict the lock should be, hit start. Under a minute from install to locked in — on every synced device at once.",
    more: "/faq/getting-started/how-it-works",
  },
  {
    question: "Is it really impossible to bypass?",
    answer:
      "With a Nuclear lock: yes. It survives restarts and even uninstalling the app — nothing turns it off before the timer or date you set.",
    more: "/faq/nuclear-mode/is-it-really-permanent",
  },
  {
    question: "Which apps and sites can I block?",
    answer:
      "All of them. Apps, websites and notifications — you decide what gets through and what goes quiet.",
    more: "/faq/what-you-can-block/what-can-i-block",
  },
  {
    question: "Is it available on mobile?",
    answer: "iOS, macOS and Windows are here today. Android is coming soon.",
    more: "/faq/devices-and-platforms/android-support",
  },
  {
    question: "Are you really students?",
    answer:
      "Yes. Three engineers between EPFL and Polytechnique Paris, fed up with paying a subscription just to focus.",
    more: "/faq/getting-started/built-by-students",
  },
];

export const PLATFORMS: { name: string; file: string; wordmark?: boolean }[] = [
  { name: "macOS", file: "macos.webp", wordmark: true },
  { name: "iOS", file: "ios.webp", wordmark: true },
  { name: "Windows", file: "windows.webp" },
  { name: "Android", file: "android.webp" },
  { name: "Linux", file: "linux.webp" },
];

export const SW_COPY = {
  soft: {
    title: "Soft Lock",
    tag: "Stay focused, bail if you really must.",
    foot: "For daily deep work",
  },
  nuclear: {
    title: "Nuclear Lock",
    tag: "No pause. No stop. No way out.",
    foot: "For the deadlines that matter",
  },
} as const;

export type SwMode = keyof typeof SW_COPY;
