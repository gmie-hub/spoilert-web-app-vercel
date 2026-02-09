"use client";

import type { FC, TextareaHTMLAttributes } from "react";

import { useField } from "formik";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: string;
  label?: string;
  hasAsterisk?: boolean;
  helperText?: string;
}

const Textarea: FC<TextareaProps> = ({
  name,
  label,
  hasAsterisk,
  helperText,
  className = "",
  ...props
}) => {
  const [field, meta] = useField(name);
  const hasError = meta.touched && Boolean(meta.error);

  return (
    <div className="space-y-1">
      {label && (
        <label
          htmlFor={name}
          className="text-sm font-medium text-gray-700"
        >
          {label}
          {hasAsterisk && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}
      <textarea
        id={name}
        {...field}
        {...props}
        className={`w-full rounded-2xl border bg-[#FBFBFB] px-4 py-3 text-sm focus:outline-none ${
          hasError
            ? "border-red-500 focus:border-red-500"
            : "border-gray-200 focus:border-[var(--color-blue)]"
        } ${className}`}
      />
      {hasError && (
        <p className="text-xs text-red-500">{meta.error}</p>
      )}
      {helperText && !hasError && (
        <p className="text-xs text-gray-500">{helperText}</p>
      )}
    </div>
  );
};

export default Textarea;
