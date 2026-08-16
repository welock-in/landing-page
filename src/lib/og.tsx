import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";

/** Every social card is 1200×630, the size both Open Graph and X expect. */
export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

const CREAM = "#f5f0e8";
const PAPER = "#fbf8f2";
const INK = "#1a1714";
const STONE = "#7a7164";
const RED = "#c8402f";

type GoogleFont = { name: string; weight: 400 | 600; style: "normal" };

/**
 * Pull a TTF straight from Google Fonts.
 *
 * Satori only accepts ttf/otf/woff, and the css2 endpoint only serves woff2 to
 * modern browsers, hence the vintage User-Agent, which is what makes it hand
 * back a truetype URL instead.
 */
async function loadGoogleFont({
  name,
  weight,
}: GoogleFont): Promise<ArrayBuffer | null> {
  try {
    const family = name.replace(/ /g, "+");
    const css = await fetch(
      `https://fonts.googleapis.com/css2?family=${family}:wght@${weight}`,
      {
        headers: {
          // Old enough that Google falls back to serving truetype.
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_8) AppleWebKit/533.0",
        },
      },
    ).then((r) => (r.ok ? r.text() : null));

    const url = css?.match(/src: url\((.+?)\) format\('(?:truetype|opentype)'\)/)?.[1];
    if (!url) return null;

    const res = await fetch(url);
    return res.ok ? await res.arrayBuffer() : null;
  } catch {
    // A social card is not worth failing a deploy over: fall back to the
    // default face and ship the build.
    return null;
  }
}

async function brandFonts() {
  const faces: GoogleFont[] = [
    { name: "EB Garamond", weight: 600, style: "normal" },
    { name: "Figtree", weight: 400, style: "normal" },
    { name: "Figtree", weight: 600, style: "normal" },
  ];

  const loaded = await Promise.all(
    faces.map(async (face) => {
      const data = await loadGoogleFont(face);
      return data ? { ...face, data } : null;
    }),
  );

  return loaded.filter((f) => f !== null);
}

function LockMark({ size = 46 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={RED}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="4" y="10.5" width="16" height="10" rx="2.5" />
      <path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" />
    </svg>
  );
}

/**
 * The mascot, as a data URI.
 *
 * Satori cannot fetch a relative URL, and pointing it at the deployed origin
 * would make every card build depend on the site already being up. Read off
 * disk once per process instead: these cards are generated at build time.
 */
let peepDataUri: string | null | undefined;
async function peep(): Promise<string | null> {
  if (peepDataUri !== undefined) return peepDataUri;
  try {
    const bytes = await readFile(join(process.cwd(), "public/images/peep-mark.png"));
    peepDataUri = `data:image/png;base64,${bytes.toString("base64")}`;
  } catch {
    // A card without the mascot still beats a card that failed to render.
    peepDataUri = null;
  }
  return peepDataUri;
}

type OgCardInput = {
  /** The headline. Keep it under ~70 characters so it stays on three lines. */
  title: string;
  /** Small uppercase label above the headline, e.g. "FAQ" or "Pricing". */
  eyebrow?: string;
  /** One supporting line under the headline. */
  subtitle?: string;
};

/**
 * The one social card used across the site.
 *
 * Warm paper, ink type, a single red accent: the same restraint the design
 * system asks for, so a shared link reads as Welockin before anyone reads a
 * word of it.
 */
export async function ogCard({ title, eyebrow, subtitle }: OgCardInput) {
  const [fonts, peepSrc] = await Promise.all([brandFonts(), peep()]);
  // Headlines run on Figtree, not the serif: globals.css notes the brand
  // dropped the display serif, so a serif card would be off-brand now.
  const sans = fonts.length ? "Figtree" : undefined;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: CREAM,
          padding: "64px 72px",
          fontFamily: sans,
          position: "relative",
        }}
      >
        {/* Warm paper panel, so the card reads as stationery not a slide. */}
        <div
          style={{
            position: "absolute",
            top: 28,
            left: 28,
            right: 28,
            bottom: 28,
            border: `1px solid rgba(26,23,20,0.10)`,
            borderRadius: 28,
            background: PAPER,
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 14, zIndex: 1 }}>
          <LockMark />
          <div style={{ display: "flex", fontSize: 34, fontWeight: 600, color: INK }}>
            <span>welock</span>
            <span style={{ color: RED }}>.in</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", zIndex: 1 }}>
          {eyebrow ? (
            <div
              style={{
                fontSize: 20,
                fontWeight: 600,
                letterSpacing: 3,
                textTransform: "uppercase",
                color: RED,
                marginBottom: 20,
              }}
            >
              {eyebrow}
            </div>
          ) : null}

          <div
            style={{
              fontSize: title.length > 58 ? 68 : 80,
              fontWeight: 600,
              lineHeight: 1.08,
              color: INK,
              letterSpacing: -1,
              maxWidth: 960,
            }}
          >
            {title}
          </div>

          {subtitle ? (
            <div
              style={{
                fontSize: 28,
                color: STONE,
                marginTop: 24,
                maxWidth: 860,
                lineHeight: 1.4,
              }}
            >
              {subtitle}
            </div>
          ) : null}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            zIndex: 1,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              background: INK,
              color: PAPER,
              borderRadius: 999,
              padding: "14px 26px",
              fontSize: 24,
              fontWeight: 600,
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: 999,
                background: RED,
                display: "flex",
              }}
            />
            Block your distractions when you need to focus.
          </div>

          {/* The platform list used to sit here. Peep now owns this corner,
              and the subtitle already names the platforms: two lines saying
              the same thing, one of them behind a fez, helped nobody. */}
        </div>

        {/* Peep looks over the bottom edge, the same way he does on the site.
            It is the one element that identifies the card before the type is
            legible, which in a feed is most of the job. */}
        {peepSrc ? (
          // eslint-disable-next-line @next/next/no-img-element -- satori renders this, not the browser
          <img
            src={peepSrc}
            alt=""
            width={210}
            height={193}
            style={{ position: "absolute", right: 64, bottom: 28, zIndex: 0 }}
          />
        ) : null}
      </div>
    ),
    { ...OG_SIZE, fonts: fonts.length ? fonts : undefined },
  );
}
