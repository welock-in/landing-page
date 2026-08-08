import { ogCard, OG_CONTENT_TYPE, OG_SIZE } from "@/lib/og";

export const alt = "Download Welockin for Mac, iPhone, iPad and Windows.";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return ogCard({
    eyebrow: "Download",
    title: "Get locked in.",
    subtitle: "One purchase covers your Mac, iPhone, iPad and Windows PC.",
  });
}
