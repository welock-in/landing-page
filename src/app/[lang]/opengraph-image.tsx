import { ogCard, OG_CONTENT_TYPE, OG_SIZE } from "@/lib/og";

export const alt =
  "Welockin — block your distractions when you need to focus.";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return ogCard({
    title: "Block distractions before they block your future.",
    subtitle:
      "One-click, impossible-to-bypass focus sessions across macOS, iOS, iPadOS and Windows.",
  });
}
