import { FC } from "react";

const HStack: FC<ComponentProps> = (props) => {
  const {
    children,
    spacing = "gap-4",
    className = "",
    alignItems = "center",
    justifyContent = "start",
  } = props;

  const alignClasses = {
    start: "items-start",
    center: "items-center",
    end: "items-end",
    stretch: "items-stretch",
  };

  const justifyClasses = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
    between: "justify-between",
    around: "justify-around",
  };

  const spacingClass =
    typeof spacing === "string"
      ? spacing
      : Object.entries(spacing).map(([breakpoint, gap]) =>
          breakpoint === "base" ? gap : `${breakpoint}:${gap}`
        );

  return (
    <div
      className={`flex flex-row ${spacingClass} ${alignClasses[alignItems]} ${justifyClasses[justifyContent]} ${className}`}
    >
      {children}
    </div>
  );
};

export default HStack;