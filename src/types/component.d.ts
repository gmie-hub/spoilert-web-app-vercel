import type { ReactNode } from "react";

export type Breakpoint = "base" | "sm" | "md" | "lg" | "xl" | "2xl";
export type Direction = "row" | "column";
export type Wrap = "nowrap" | "wrap" | "wrap-reverse";

export interface ComponentProps {
  children: ReactNode;
  spacing?: string | Partial<Record<Breakpoint, string>>;
  className?: string;
  alignItems?: "start" | "center" | "end" | "stretch";
  justifyContent?: "start" | "center" | "end" | "between" | "around";
}
