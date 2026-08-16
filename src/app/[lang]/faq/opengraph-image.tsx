import { ogCard, OG_CONTENT_TYPE, OG_SIZE } from "@/lib/og";

export const alt = "Welockin FAQ: everything about locking in.";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return ogCard({
    eyebrow: "FAQ",
    title: "Everything about locking in.",
    subtitle:
      "How the blocking works, the five unlock levels, Nuclear Mode, devices and privacy.",
  });
}
