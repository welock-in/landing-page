import { ogCard, OG_CONTENT_TYPE, OG_SIZE } from "@/lib/og";

export const alt = "Welockin Protection — block it for good.";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return ogCard({
    eyebrow: "Protection",
    title: "Block it for good.",
    subtitle:
      "Adult content, gambling, dating apps and mature games — locked across every device, for as long as you decide.",
  });
}
