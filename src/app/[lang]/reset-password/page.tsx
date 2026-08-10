
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { metadataFor, type LangParams } from "@/i18n/metadata";
import styles from "@/components/auth/ResetPassword.module.css";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { Container } from "@/components/ui/Container";

export function generateMetadata({ params }: LangParams) {
  return metadataFor(params, (d) => ({
    ...d.pages.resetPassword.meta,
    path: "/reset-password",
    noIndex: true,
  }));
}

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
