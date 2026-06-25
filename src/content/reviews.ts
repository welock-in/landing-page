export type Review = {
  quote: string;
  name: string;
  role: string;
  /** Avatar tint. */
  color: string;
};

export const reviews: Review[] = [
  {
    quote: "I handed in my thesis early for the first time ever. Literally.",
    name: "Yasmine",
    role: "Law MSc · Paris",
    color: "#F5C6C2",
  },
  {
    quote: "$20 felt like nothing. Now I do 5 hours of deep work a day.",
    name: "Marco",
    role: "CS Junior · EPFL",
    color: "#E9B4AE",
  },
  {
    quote: "Freedom is fine, but $40/yr on a student budget... no thanks.",
    name: "Sarah",
    role: "Design MA · Gobelins",
    color: "#F0CFAA",
  },
  {
    quote: "The Nuclear Lock saved me during finals. No cheating on myself.",
    name: "Tom",
    role: "Math Sophomore · Polytechnique",
    color: "#D8C2B0",
  },
  {
    quote:
      "Set up in 30 seconds, never reinstalled Instagram since. Thank you.",
    name: "Léa",
    role: "Architecture MA · ETH Zürich",
    color: "#EBC6C0",
  },
  {
    quote: "My Mac and iPhone blocked together. No way out anymore.",
    name: "Hugo",
    role: "Freelancer · Lyon",
    color: "#E3C8B4",
  },
  {
    quote: "Paid once, focused forever. Best deal of my student life.",
    name: "Nina",
    role: "Biology MSc · Sorbonne",
    color: "#F5C6C2",
  },
  {
    quote: "I code 6 hours straight without touching my phone. Unheard of.",
    name: "Adrien",
    role: "CS Junior · TUM",
    color: "#E0B6A0",
  },
];
