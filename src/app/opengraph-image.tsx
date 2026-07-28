import { ogCard, OG_CONTENT_TYPE, OG_SIZE } from "@/lib/og";

export const alt =
  "WeLockIn — block distractions before they block your future. No override, no back door.";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return ogCard({
    title: "Block distractions before they block your future.",
    subtitle:
      "One-click, impossible-to-bypass focus sessions across macOS, iOS, iPadOS and Windows.",
  });
}
