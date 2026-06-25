import type { ElementType, ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";
import styles from "./Container.module.css";

type ContainerProps<T extends ElementType> = {
  as?: T;
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "className">;

/** Centered max-width wrapper with horizontal gutters (the design's `.wrap`). */
export function Container<T extends ElementType = "div">({
  as,
  className,
  ...props
}: ContainerProps<T>) {
  const Tag = (as ?? "div") as ElementType;
  return <Tag className={cn(styles.wrap, className)} {...props} />;
}
