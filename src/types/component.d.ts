type Breakpoint = "base" | "sm" | "md" | "lg" | "xl" | "2xl";
type Direction = "row" | "column";
type Wrap = "nowrap" | "wrap" | "wrap-reverse";

interface ComponentProps {
  children: ReactNode;
  spacing?: string | Partial<Record<Breakpoint, string>>;
  className: string;
  alignItems?: "start" | "center" | "end" | "stretch";
  justifyContent?: "start" | "center" | "end" | "between" | "around";
}