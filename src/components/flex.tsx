import { FC } from "react";

interface FlexProps extends ComponentProps {
  direction?: Direction | Partial<Record<Breakpoint, Direction>>;
  wrap?: Wrap | Partial<Record<Breakpoint, Wrap>>;
}

const Flex: FC<FlexProps> = ({
  children,
  direction = "row",
  wrap = "nowrap",
  spacing = "gap-4",
  className = "",
  alignItems = "stretch",
  justifyContent = "start",
}) => {
  const alignClasses: Record<string, string> = {
    start: "items-start",
    center: "items-center",
    end: "items-end",
    stretch: "items-stretch",
    baseline: "items-baseline",
  };

  const justifyClasses: Record<string, string> = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
    between: "justify-between",
    around: "justify-around",
    evenly: "justify-evenly",
  };

  const wrapClasses: Record<Wrap, string> = {
    nowrap: "flex-nowrap",
    wrap: "flex-wrap",
    "wrap-reverse": "flex-wrap-reverse",
  };

  // Handle direction
  const directionClass =
    typeof direction === "string"
      ? direction === "row"
        ? "flex-row"
        : "flex-col"
      : Object.entries(direction)
          .map(([bp, dir]) =>
            bp === "base"
              ? `flex-${dir === "row" ? "row" : "col"}`
              : `${bp}:flex-${dir === "row" ? "row" : "col"}`
          )
          .join(" ");

  // Handle spacing
  const spacingClass =
    typeof spacing === "string"
      ? spacing
      : Object.entries(spacing)
          .map(([bp, gap]) => (bp === "base" ? gap : `${bp}:${gap}`))
          .join(" ");

  // Handle wrap
  const wrapClass =
    typeof wrap === "string"
      ? wrapClasses[wrap]
      : Object.entries(wrap)
          .map(([bp, w]) =>
            bp === "base" ? wrapClasses[w] : `${bp}:${wrapClasses[w]}`
          )
          .join(" ");

  return (
    <div
      className={`flex ${directionClass} ${spacingClass} ${wrapClass} ${alignClasses[alignItems]} ${justifyClasses[justifyContent]} ${className}`}
    >
      {children}
    </div>
  );
};

export default Flex;
