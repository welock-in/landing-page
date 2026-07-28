"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { DownloadButton } from "@/components/ui/DownloadButton";
import { CloseIcon, LogoIcon, MenuIcon } from "@/components/ui/icons";
import { mainNav, siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import styles from "./Navbar.module.css";

type NavLink = { title: string; href: string };

/**
 * `links` lets a page swap in its own in-page nav — the Protection page
 * advertises its own sections rather than the landing page's.
 */
export function Navbar({ links = mainNav }: { links?: NavLink[] }) {
  const pathname = usePathname();
  const [stuck, setStuck] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // The overlay covers the viewport, so the page behind it must not scroll.
  // The cleanup also releases the lock if the nav unmounts mid-navigation.
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // On the landing page the brand just returns to the top; elsewhere it links home.
  const brandHref = pathname === "/" ? "#" : "/";

  return (
    <nav className={cn(styles.nav, stuck && styles.stuck, open && styles.open)}>
      <div className={styles.inner}>
        <div className={styles.bar}>
          <a className={styles.brand} href={brandHref} aria-label={siteConfig.name}>
            <LogoIcon className={styles.brandMark} />
            <span>
              <span>welock</span>
              <span className={styles.brandAccent}>.in</span>
            </span>
          </a>

          <div className={styles.links}>
            {links.map((item) => (
              <a
                key={item.href}
                className={cn(item.href === pathname && styles.active)}
                href={item.href}
              >
                {item.title}
              </a>
            ))}
          </div>

          <div className={styles.actions}>
            <DownloadButton size="compact" />
          </div>

          {/* Mobile keeps a CTA in the bar itself, so downloading never costs
              a trip through the menu. The bar has room for the glyph but not
              for "Download for iPhone", so only the wording is cut. */}
          <div className={styles.mobileCta}>
            <DownloadButton size="compact" icon="auto" label="Download" />
          </div>

          <button
            className={styles.menuBtn}
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span className={styles.iconMenu}>
              <MenuIcon />
            </span>
            <span className={styles.iconClose}>
              <CloseIcon />
            </span>
          </button>
        </div>
      </div>

      {/* Always mounted: the overlay fades out on close, so it cannot be
          conditionally rendered. Links must stay direct <a> children here —
          the stagger delays key off :nth-of-type. */}
      <div className={styles.mobileMenu} inert={!open}>
        <div className={styles.mobileMenuInner}>
          {links.map((item) => (
            <a
              key={item.href}
              className={styles.mobileLink}
              href={item.href}
              onClick={() => setOpen(false)}
            >
              {item.title}
            </a>
          ))}
          <div className={styles.ovCta}>
            <DownloadButton className={styles.ovCtaBtn} />
          </div>
        </div>
      </div>
    </nav>
  );
}
