import type { Metadata } from "next";

import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import styles from "@/components/auth/ResetPassword.module.css";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { Container } from "@/components/ui/Container";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Reset your password",
  description: "Set a new password for your WeLockIn account.",
  path: "/reset-password",
  // Only ever reached from a one-time email link, and the URL carries a reset
  // token — nothing here belongs in an index.
  noIndex: true,
});

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string | string[] }>;
}) {
  // The reset email links here as /reset-password?token=…; without one we show
  // the "email me a link" form instead.
  const { token } = await searchParams;

  return (
    <>
      <Navbar />
      <main className={styles.page}>
        <Container>
          <ResetPasswordForm token={Array.isArray(token) ? token[0] : token} />
        </Container>
      </main>
      <Footer />
    </>
  );
}
