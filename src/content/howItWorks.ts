export type HowStep = {
  title: string;
  body: string;
  /**
   * Screenshot shown in the MacBook for this step.
   * TODO: replace with the real Devices / Blocklists / Timer app screens —
   * drop them in /public/images/ and update these paths. The design left
   * these slots empty, so they currently reuse the dashboard screenshot.
   */
  image: string;
  alt: string;
};

export const howSteps: HowStep[] = [
  {
    title: "Select your devices",
    body: "Pick your Mac, iPhone and iPad. Block everywhere at once.",
    image: "/images/app-dashboard.jpeg",
    alt: "WeLockIn devices screen",
  },
  {
    title: "Choose what to block",
    body: "Bundle the apps and sites that steal your focus.",
    image: "/images/app-dashboard.jpeg",
    alt: "WeLockIn blocklists screen",
  },
  {
    title: "Set it and lock in",
    body: "Pick a timer, hit start. No way out until it ends.",
    image: "/images/app-dashboard.jpeg",
    alt: "WeLockIn focus timer screen",
  },
];
