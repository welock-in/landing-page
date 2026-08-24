"use client";

/* eslint-disable @next/next/no-img-element -- university marks and avatars are plain <img>, matching the design byte-for-byte */

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";

import type { HomeCopy } from "./HomePage";
import { LockInLink } from "./LockInLink";
import { useMarquee, type MarqueeSpeed } from "./useMarquee";

/**
 * Slow enough to finish reading a card before it leaves, rather than one lap
 * per fixed number of seconds: seven quotes is a short list, and a lap-based
 * pace would make it crawl.
 */
const SPEED: MarqueeSpeed = { pxPerSecond: 28 };

/**
 * Copies of the list laid end to end. The drift wraps after the first one, so
 * the other two have to cover the widest viewport we care about — about
 * 6600px of cards, which is past any desktop.
 */
const COPIES = 3;

/**
 * The face and the school behind each quote, in the order the quotes appear in
 * `home.json → results.quotes`. The words themselves live in the catalogs.
 */
const TESTIMONIALS: {
  avatar: string;
  avatarAlt: string;
  linkedin?: string;
  mark: { src: string; alt: string; width: number; height: number };
  /**
   * Marks default to a wordmark capped at 22px. `tall` is for a portrait
   * crest, `badge` for a square lockup on its own solid background — capped
   * to a wordmark's height those read as a 22px speck, so they get a rounded
   * tile instead. Swap a badge back to the default the day a transparent
   * horizontal version of that logo lands.
   */
  markVariant?: "tall" | "badge";
}[] = [
  {
    avatar: "/images/people/sarah-fourati.webp",
    avatarAlt: "Sarah Fourati",
    linkedin: "https://www.linkedin.com/in/sarah-fourati-7784b9293/",
    mark: { src: "/images/logos/27_HEC.webp", alt: "HEC Paris", width: 240, height: 108 },
  },
  {
    avatar: "/images/people/karim-assaf.webp",
    avatarAlt: "Karim Assaf",
    linkedin: "https://www.linkedin.com/in/karim-assaf-9a82a4223/",
    mark: { src: "/images/logos/07_ETH.webp", alt: "ETH Zürich", width: 240, height: 54 },
  },
  {
    avatar: "/images/people/hedi-fourati.webp",
    avatarAlt: "Hedi Fourati",
    linkedin: "https://www.linkedin.com/in/hedi-fourati-49ba722a8/",
    mark: { src: "/images/polytechnique.webp", alt: "École Polytechnique", width: 68, height: 96 },
    markVariant: "tall",
  },
  {
    avatar: "/images/people/selim-haouala.webp",
    avatarAlt: "Selim Haouala",
    linkedin: "https://www.linkedin.com/in/selim-haouala-40a75a3a7/",
    mark: { src: "/images/logos/22_EPFL.webp", alt: "EPFL", width: 236, height: 80 },
  },
  {
    avatar: "/images/people/selim-msallem.webp",
    avatarAlt: "Selim Msallem",
    linkedin: "https://www.linkedin.com/in/selim-msallem-9a49a6292/",
    mark: { src: "/images/logos/27_HECMONTREAL.png", alt: "HEC Montréal", width: 400, height: 400 },
    markVariant: "badge",
  },
  {
    avatar: "/images/people/skander-gharbi.webp",
    avatarAlt: "Skander el Gharbi",
    mark: { src: "/images/logos/30_LyceeParc.png", alt: "Lycée du Parc", width: 447, height: 447 },
    markVariant: "badge",
  },
  {
    avatar: "/images/people/omar-bouzguenda.webp",
    avatarAlt: "Omar Bouzguenda",
    linkedin: "https://www.linkedin.com/in/omar-bouzguenda-796767249/",
    // The square PNG in the same folder is black on white, so it would sit on
    // the card as a white tile; this is its wordmark half, cut out onto alpha.
    mark: { src: "/images/logos/29_ESSEC.webp", alt: "ESSEC Business School", width: 147, height: 71 },
  },
];

/**
 * Lines of quote a closed card shows. Handed to the stylesheet as
 * `--rs-clamp`, which is what does the clamping, and used again below to work
 * out which quotes are long enough to need a button.
 */
const CLAMP_LINES = 5;

/**
 * The LinkedIn bug, sized to sit level with a name. The face-and-name block
 * has linked out to the profile since the names went in, but nothing said so:
 * a face on a testimonial reads as decoration, and a bare name is not an
 * invitation. The mark is the invitation. It is in brand blue on purpose,
 * since the same footer already carries university marks in their own
 * colours. A warm grey glyph at 15px would be exactly the hint nobody
 * notices.
 *
 * Cards without a `linkedin` do not render it, so the mark never promises a
 * profile that is not there.
 */
function LinkedInMark() {
  return (
    <svg className="rs-li" viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
      <rect width="24" height="24" rx="4.6" fill="#0A66C2" />
      <path
        fill="#fff"
        d="M7.5 9.6H4.3v9.9h3.2V9.6ZM5.9 4.5a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm14.3 15h-3.4v-4.9c0-1.2-.5-2-1.5-2-1.1 0-1.8.8-1.8 2v4.9h-3.3V9.6h3.3V11c.6-.9 1.5-1.6 3-1.6 2.3 0 3.7 1.4 3.7 4.3v5.8Z"
      />
    </svg>
  );
}

/**
 * "Real results from real students": the quotes ride the same endless row as
 * the university marquee above — drifting on their own, pausing under the
 * cursor, draggable with a mouse and swipeable on a phone. The list is
 * rendered several times over so the wrap never shows a seam.
 *
 * Quotes run long, and a row is only as short as its tallest card, so each one
 * is clamped to {@link CLAMP_LINES} lines with a "read more" underneath. Only
 * the cards that actually overflow get the button, which is measured rather
 * than guessed: the same sentence wraps to four lines in English and six in
 * German.
 */
export function Results({ copy }: { copy: HomeCopy["results"] }) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const loopStartRef = useRef<HTMLElement>(null);

  useMarquee(viewportRef, loopStartRef, SPEED);

  /** Which quote is showing in full, by index — at most one at a time. */
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  /** Which quotes are long enough to be worth a button. */
  const [clipped, setClipped] = useState<boolean[]>(() => TESTIMONIALS.map(() => false));

  // Only the first copy of each card is measured; the other two are scenery.
  const quoteRefs = useRef<(HTMLParagraphElement | null)[]>([]);

  const measure = useCallback(() => {
    setClipped((prev) => {
      const next = quoteRefs.current.map((el, i) => {
        if (!el) return prev[i] ?? false;
        // Full text against the height the clamp allows, rather than the
        // element's own clientHeight: an open card has no clamp on it, and
        // measuring that would drop the very button that closes it again.
        const line = Number.parseFloat(getComputedStyle(el).lineHeight);
        if (!Number.isFinite(line)) return prev[i] ?? false;
        return el.scrollHeight > line * CLAMP_LINES + 1;
      });
      return next.every((v, i) => v === prev[i]) ? prev : next;
    });
  }, []);

  useEffect(() => {
    measure();
    // Cards reflow on resize, and again when Figtree replaces the fallback
    // font — a quote that fit in five lines can stop fitting either way.
    const observer = new ResizeObserver(measure);
    quoteRefs.current.forEach((el) => el && observer.observe(el));
    document.fonts?.ready.then(measure).catch(() => {});
    return () => observer.disconnect();
  }, [measure]);

  return (
    <section
      className="results"
      id="stats"
      style={{ "--rs-clamp": CLAMP_LINES } as CSSProperties}
    >
      <h2 className="rs-head" id="rs-head">
        {copy.headLine1}
        <br />
        {copy.headLine2}
      </h2>
      <div
        className="rs-marquee"
        ref={viewportRef}
        role="group"
        aria-labelledby="rs-head"
        // An open quote holds the row still, so it cannot slide out from
        // under the person reading it on a phone, where there is no hover.
        data-hold={openIndex !== null ? "true" : undefined}
      >
        <div className="rs-track">
          {Array.from({ length: COPIES }, (_, lap) =>
            TESTIMONIALS.map((person, i) => {
              const quote = copy.quotes[i];
              // Everything past the first copy is scenery: hidden from
              // assistive tech, and out of the tab order so the row does not
              // trap a keyboard in four identical passes of the same links.
              const dupe = lap > 0;
              const open = openIndex === i;
              const who = (
                <>
                  <img
                    className="rs-av"
                    src={person.avatar}
                    alt={dupe ? "" : person.avatarAlt}
                    width={96}
                    height={96}
                    loading="lazy"
                    decoding="async"
                  />
                  <div>
                    <b>
                      <span>{quote.name}</span>
                      {person.linkedin && <LinkedInMark />}
                    </b>
                    <em>{quote.role}</em>
                  </div>
                </>
              );
              return (
                <article
                  key={`${lap}-${i}`}
                  className={`rs-card rs-slide${open ? " rs-open" : ""}`}
                  style={{ background: "#faf7f1" }}
                  // The second copy's first card marks where one lap ends.
                  ref={lap === 1 && i === 0 ? loopStartRef : undefined}
                  aria-hidden={dupe || undefined}
                >
                  <p
                    className="rs-quote"
                    ref={
                      lap === 0
                        ? (el) => {
                            quoteRefs.current[i] = el;
                          }
                        : undefined
                    }
                  >
                    {quote.quote}
                  </p>
                  {/* `|| open` keeps the button there in the one state the
                      measurement cannot see: a card that is already open. */}
                  {(clipped[i] || open) && (
                    <button
                      type="button"
                      className="rs-more"
                      onClick={() => setOpenIndex(open ? null : i)}
                      aria-expanded={open}
                      tabIndex={dupe ? -1 : undefined}
                    >
                      {open ? copy.readLess : copy.readMore}
                    </button>
                  )}
                  <div style={{ flex: 1 }} />
                  <div className="rs-foot">
                    {person.linkedin ? (
                      <a
                        className="rs-who"
                        href={person.linkedin}
                        target="_blank"
                        rel="noopener"
                        tabIndex={dupe ? -1 : undefined}
                      >
                        {who}
                      </a>
                    ) : (
                      <div className="rs-who">{who}</div>
                    )}
                    <div className="rs-mark">
                      <img
                        className={person.markVariant ? `rs-${person.markVariant}` : undefined}
                        src={person.mark.src}
                        alt={dupe ? "" : person.mark.alt}
                        width={person.mark.width}
                        height={person.mark.height}
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  </div>
                </article>
              );
            }),
          )}
        </div>
      </div>
      <div className="cta-row">
        <LockInLink label="lockInNow" />
      </div>
    </section>
  );
}
