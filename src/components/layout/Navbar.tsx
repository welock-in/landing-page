"use client";

import { useEffect, useState } from "react";

import { DownloadButton } from "@/components/ui/DownloadButton";
import { AppleIcon, LogoIcon } from "@/components/ui/icons";
import { mainNav, siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import styles from "./Navbar.module.css";

export function Navbar() {
  const [stuck, setStuck] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={cn(styles.nav, stuck && styles.stuck)}>
      <div className={styles.inner}>
        <div className={styles.bar}>
          <a className={styles.brand} href="/" aria-label={siteConfig.name}>
            <LogoIcon className={styles.brandMark} />
            <span>
              <span className={styles.brandWord}>welock</span>
              <span className={styles.brandAccent}>.in</span>
            </span>
          </a>

          <div className={styles.links}>
            {mainNav.map((item) => (
              <a key={item.href} href={item.href}>
                {item.title}
              </a>
            ))}
          </div>

          <div className={styles.actions}>
            <DownloadButton label="Download for macOS" size="compact" />
          </div>

          <button className={styles.mobileCta} type="button">
            <AppleIcon width={15} height={15} />
            <span>Download for iPhone</span>
          </button>

          <button
            className={cn(styles.menuBtn, open && styles.menuBtnOpen)}
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span className={styles.burger}>
              <span className={styles.burgerBar} />
              <span className={styles.burgerBar} />
              <span className={styles.burgerBar} />
            </span>
          </button>
        </div>
      </div>

      {open && (
        <div className={styles.mobileMenu}>
          {mainNav.map((item) => (
            <a
              key={item.href}
              className={styles.mobileLink}
              href={item.href}
              onClick={() => setOpen(false)}
            >
              {item.title}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
