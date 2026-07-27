import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import styles from "./CtaRow.module.css";

/** Centers a section's closing call-to-action under its content. */
export function CtaRow({
  children,
  variant = "default",
  className,
}: {
  children: ReactNode;
  /** "peep" reserves the extra headroom the mascot pill needs. */
  variant?: "default" | "peep";
  className?: string;
}) {
  return (
    <div className={cn(styles.row, variant === "peep" && styles.peep, className)}>
      {children}
    </div>
  );
}
