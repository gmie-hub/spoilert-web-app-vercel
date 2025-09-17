import { FC } from "react";

interface FlexProps extends ComponentProps {
  direction?: Direction | Partial<Record<Breakpoint, Direction>>;
  wrap?: Wrap | Partial<Record<Breakpoint, Wrap>>;
}

const Flex: FC<FlexProps> = (props) => {
  const {
    children,
    direction = "row",
    wrap = "nowrap",
    spacing = "gap-4",
    className,
    alignItems = "start",
    justifyContent = "start",
  } = props;

  const alignClasses = {
    start: "items-start",
    center: "items-center",
    end: "items-end",
    stretch: "items-stretch",
    baseline: "items-baseline",
  };

  const justifyClasses = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
    between: "justify-between",
    around: "justify-around",
    evenly: "justify-evenly",
  };

  const wrapClasses = {
    nowrap: "flex-nowrap",
    wrap: "flex-wrap",
    "wrap-reverse": "flex-wrap-reverse",
  };

  // Handle responsive direction
  const directionClass =
    typeof direction === "string"
      ? direction === "row"
        ? "flex-row"
        : "flex-col"
      : Object.entries(direction)
          .map(([breakpoint, dir]) =>
            breakpoint === "base" ? `flex-${dir}` : `${breakpoint}:flex-${dir}`
          )
          .join(" ");

  // Handle responsive spacing
  const spacingClass =
    typeof spacing === "string"
      ? spacing
      : Object.entries(spacing)
          .map(([breakpoint, gap]) =>
            breakpoint === "base" ? gap : `${breakpoint}:${gap}`
          )
          .join(" ");

  // Handle responsive wrap
  const wrapClass =
    typeof wrap === "string"
      ? wrapClasses[wrap]
      : Object.entries(wrap)
          .map(([breakpoint, w]) =>
            breakpoint === "base"
              ? wrapClasses[w]
              : `${breakpoint}:${wrapClasses[w]}`
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