import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/config/site";
import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <Container className={styles.inner}>
        <div className={styles.links}>
          <a href="#">Privacy</a>
          <a href="#">Contact</a>
          <a href={`mailto:${siteConfig.contactEmail}`}>
            {siteConfig.contactEmail}
          </a>
        </div>
      </Container>
    </footer>
  );
}
