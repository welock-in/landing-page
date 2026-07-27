export type Faq = {
  question: string;
  answer: string;
};

export const faqs: Faq[] = [
  {
    question: "How does WeLockIn actually work?",
    answer:
      "Three steps: pick the apps and sites you want gone, choose how strict the lock should be, hit start. Under a minute from install to locked in — on every synced device at once.",
  },
  {
    question: "Is it really impossible to bypass?",
    answer:
      "With a Nuclear lock: yes. It survives restarts and even uninstalling the app — nothing turns it off before the timer or date you set.",
  },
  {
    question: "Which apps and sites can I block?",
    answer:
      "All of them. Apps, websites and notifications — you decide what gets through and what goes quiet.",
  },
  {
    question: "Is it available on mobile?",
    answer: "iOS, macOS and Windows are here today. Android is coming soon.",
  },
  {
    question: "Are you really students?",
    answer:
      "Yes. Three engineers between EPFL and Polytechnique Paris, fed up with paying a subscription just to focus.",
  },
];
