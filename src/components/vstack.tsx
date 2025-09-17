import { FC } from "react";

const VStack: FC<ComponentProps> = ({
  children,
  spacing = "gap-4",
  className = "",
  alignItems = "center",
  justifyContent = "center",
}) => {
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

  // Handle responsive spacing
  const spacingClass =
    typeof spacing === "string"
      ? spacing
      : Object.entries(spacing)
          .map(([breakpoint, gap]) =>
            breakpoint === "base" ? gap : `${breakpoint}:${gap}`
          )
          .join(" ");

  return (
    <div
      className={`flex flex-col h-full ${spacingClass} ${alignClasses[alignItems]} ${justifyClasses[justifyContent]} ${className}`}
    >
      {children}
    </div>
  );
};

export default VStack;