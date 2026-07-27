export type HowStep = {
  title: string;
  body: string;
  /** Screenshot shown in the MacBook for this step. */
  image: string;
  alt: string;
  /**
   * How the screenshot fills the Mac screen. The first step is a full-bleed
   * capture ("cover"); the other two are narrower panels the design insets
   * with a small padding ("contain").
   */
  fit: "cover" | "contain";
};

export const howSteps: HowStep[] = [
  {
    title: "Choose what to block",
    body: "Bundle the apps and sites that quietly steal your focus — social, video, news, games — into reusable blocklists you can launch in a single tap.",
    image: "/images/hiw-1.png",
    alt: "Pick apps to block",
    fit: "cover",
  },
  {
    title: "Set it and lock in",
    body: "Pick a duration, hit start, and the nuclear lock seals the session shut — no pausing, no quitting, no bargaining your way out until the timer hits zero.",
    image: "/images/hiw-2.png",
    alt: "Set duration and lock in",
    fit: "contain",
  },
  {
    title: "Select your devices",
    body: "Connect your Mac, iPhone and iPad once, and every block stays in sync across all of them in real time — your distractions run out of places to hide.",
    image: "/images/hiw-3.png",
    alt: "Select your devices",
    fit: "contain",
  },
];
