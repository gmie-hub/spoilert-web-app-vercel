"use client";

import type { FC } from "react";

import { useField } from "formik";

interface SelectOption {
  value: string;
  label: string;
}

interface CustomSelectProps {
  name: string;
  label: string;
  placeholder?: string;
  options: SelectOption[];
  hasAsterisk?: boolean;
  disabled?: boolean;
}

const Select: FC<CustomSelectProps> = ({
  name,
  label,
  placeholder = "Select option",
  options,
  hasAsterisk = false,
  disabled = false,
}) => {
  const [field, meta] = useField(name);

  const hasError = Boolean(meta.touched && meta.error);

  return (
    <div className="flex flex-col gap-1">
      {/* Label */}
      <label
        htmlFor={name}
        className="text-sm font-medium text-gray-700"
      >
        {label}
        {hasAsterisk && <span className="ml-1 text-red-500">*</span>}
      </label>

      {/* Select */}
      <div className="relative">
        <select
        
          {...field}
          id={name}
          disabled={disabled}
          className={`
            h-12 w-full appearance-none rounded-lg border bg-[#FBFBFB] px-3 pr-12 text-sm
            placeholder:text-gray-400
            focus:outline-none focus:ring-2 focus:ring-teal-500
            ${disabled ? "cursor-not-allowed bg-gray-100 opacity-70" : ""}
            ${
              hasError
                ? "border-red-500 focus:ring-red-400"
                : "border-gray-200"
            }
          `}
        >
          {/* Placeholder */}
          <option value="" disabled>
            {placeholder}
          </option>

          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Dropdown Icon */}
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
          ▼
        </span>
      </div>

      {/* Error */}
      {hasError && (
        <span className="text-xs text-red-500">
          {meta.error}
        </span>
      )}
    </div>
  );
};

export default Select;
