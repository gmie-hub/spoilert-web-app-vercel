"use client";

import type { FC } from "react";
// eslint-disable-next-line import/order
import { useState } from "react";
import { useField } from "formik";

interface CustomInputProps {
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  hasAsterisk?: boolean;
}

const Input: FC<CustomInputProps> = ({
  name,
  label,
  placeholder,
  type = "text",
  hasAsterisk = false,
}) => {
  const [field, meta] = useField(name);
  const [showPassword, setShowPassword] = useState(false);

  const hasError = meta.touched && meta.error;
  const isPassword = type === "password";

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={name} className="text-sm font-medium text-gray-700">
        {label}
        {hasAsterisk && <span className="ml-1 text-red-500">*</span>}
      </label>

      <div className="relative">
        <input
          {...field}
          id={name}
          type={isPassword && showPassword ? "text" : type}
          placeholder={placeholder}
          className={`
            h-12 w-full rounded-lg border bg-[#FBFBFB] px-3 pr-12 text-sm
            placeholder:text-gray-400
            focus:outline-none focus:ring-2 focus:ring-teal-500
            ${
              hasError ? "border-red-500 focus:ring-red-400" : "border-gray-200"
            }
          `}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-lg cursor-pointer"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        )}
      </div>

      {hasError && <span className="text-xs text-red-500">{meta.error}</span>}
    </div>
  );
};

export default Input;
