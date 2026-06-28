"use client";

import { useEffect, useState } from "react";

import { Container } from "@/components/ui/Container";
import { AppleIcon, LogoIcon, MenuIcon } from "@/components/ui/icons";
import { mainNav, siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import styles from "./Navbar.module.css";

export function Navbar() {
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={cn(styles.nav, stuck && styles.stuck)}>
      <Container className={styles.inner}>
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

        <a className={styles.cta} href="#download">
          Download
          <AppleIcon />
        </a>

        <button className={styles.menuBtn} type="button" aria-label="Menu">
          <MenuIcon />
        </button>
      </Container>
    </nav>
  );
}
