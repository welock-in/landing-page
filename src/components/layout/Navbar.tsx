"use client";

import { useEffect, useState } from "react";

import { DownloadButton } from "@/components/ui/DownloadButton";
import { CloseIcon, LogoIcon, MenuIcon } from "@/components/ui/icons";
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
    <nav className={cn(styles.nav, stuck && styles.stuck, open && styles.open)}>
      <div className={styles.inner}>
        <div className={styles.bar}>
          <a className={styles.brand} href="#" aria-label={siteConfig.name}>
            <LogoIcon />
            <span>
              welock<span className={styles.brandAccent}>.in</span>
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

          <DownloadButton
            className={styles.mobileCta}
            label="Download for iPhone"
            size="compact"
          />

          <button
            className={styles.menuBtn}
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>

        <div className={cn(styles.mobileMenu, open && styles.mobileMenuOpen)}>
          <div className={styles.mobileMenuInner}>
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
        </div>
      </div>
    </nav>
  );
}
