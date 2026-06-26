export type Platform = {
  name: string;
  /** File under /public/images/platforms/. */
  file: string;
  /** Wordmark logos render shorter than icon logos. */
  wordmark?: boolean;
};

/** "welock.in is available on" row in the Locked-everywhere section. */
export const platforms: Platform[] = [
  { name: "macOS", file: "macos.png", wordmark: true },
  { name: "iOS", file: "ios.png", wordmark: true },
  { name: "Windows", file: "windows.png" },
  { name: "Android", file: "android.png" },
  { name: "Linux", file: "linux.png" },
];
