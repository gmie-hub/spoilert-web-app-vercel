import React, { ButtonHTMLAttributes, ReactNode } from "react";

import * as motion from "motion/react-client";

type ButtonVariant = "default" | "outline" | "yellow" | "yellowOutline";

type ConflictingProps =
  | "onDrag"
  | "onDragStart"
  | "onDragEnd"
  | "onDragOver"
  | "onDragEnter"
  | "onDragLeave"
  | "onAnimationStart"
  | "onAnimationComplete";

interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, ConflictingProps> {
  variant?: ButtonVariant;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  children: ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = "default",
  iconLeft,
  iconRight,
  children,
  className = "",
  ...props 
}) => {
  const baseStyles =
    "px-6 py-3 rounded-xl flex items-center justify-center gap-2 font-semibold transition-colors duration-300 cursor-pointer";

  const variantStyles = {
    default: "bg-blue text-white hover:bg-blue/90",
    outline:
      "bg-transparent border border-[#E0E0E0] text-blue hover:bg-blue hover:text-white",
    yellow: "bg-yellow text-white hover:bg-yellow/90",
    yellowOutline:
      "bg-transparent border border-yellow text-yellow hover:bg-yellow hover:text-white",
  };

  const combinedClasses = `${baseStyles} ${variantStyles[variant]} ${className}`;

  return (
    <motion.button
      className={combinedClasses}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      {...props} 
    >
      {iconLeft && <span>{iconLeft}</span>}
      {children}
      {iconRight && <span>{iconRight}</span>}
    </motion.button>
  );
};

export default Button;
