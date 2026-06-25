export type Plan = {
  id: "lifetime";
  /** Small eyebrow above the plan name. */
  eyebrow: string;
  amount: string;
  cadence: string;
  cta: string;
  badge?: string;
};

export const plans: Record<Plan["id"], Plan> = {
  lifetime: {
    id: "lifetime",
    eyebrow: "Forever",
    amount: "$20",
    cadence: "one-time payment",
    cta: "Buy now — $20 for life",
    badge: "Best deal",
  },
};

export const planFeatures: string[] = [
  "Unlimited blocking, unlimited devices",
  "Nuclear Lock (impossible to disable)",
  "Multi-device sync",
  "Lifetime updates",
  "Email support",
];

/** Default plan shown on load. */
export const defaultPlan: Plan["id"] = "lifetime";
