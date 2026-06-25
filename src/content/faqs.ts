export type Faq = {
  question: string;
  answer: string;
};

export const faqs: Faq[] = [
  {
    question: "How is this different from Freedom?",
    answer:
      "$20 for life versus $40 per year. Same level of blocking, without a subscription that bills you every term.",
  },
  {
    question: "Is it really impossible to bypass?",
    answer:
      "With Concrete Mode: yes. Once a session starts, neither a restart nor an uninstall stops it before it ends.",
  },
  {
    question: "Which apps can I block?",
    answer:
      "All of them. Apps, websites and notifications — you decide what gets through and what goes quiet.",
  },
  {
    question: "Is it available on mobile?",
    answer:
      "iOS, macOS and Windows are here today. Android is coming soon.",
  },
  {
    question: "Are you really students?",
    answer:
      "Yes. Three engineers between EPFL and Polytechnique Paris, fed up with paying a subscription just to focus.",
  },
];
