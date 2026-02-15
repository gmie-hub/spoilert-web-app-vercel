
"use client";

import { ChangeEvent, FC, useState } from "react";

import { useField } from "formik";

interface Props {
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  disabled?: boolean;

  /** for side effects like account verification */
  onValueChange?: (value: string) => void;
}

const Input: FC<Props> = ({
  name,
  label,
  placeholder,
  type = "text",
  disabled = false,
  onValueChange,
}) => {
  const [field, meta, helpers] = useField(name);
  const [showPassword, setShowPassword] = useState(false);

  const hasError = meta.touched && Boolean(meta.error);
  const isPassword = type === "password";

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;

    helpers.setValue(e.target.value);
    helpers.setTouched(true);

    onValueChange?.(e.target.value);
  };

  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">
        {label}
      </label>

      <div className="relative">
        <input
          {...field}
          type={isPassword && showPassword ? "text" : type}
          placeholder={placeholder}
          disabled={disabled}
          value={field.value}
          onChange={handleChange}
          className={`
            h-12 w-full px-3 rounded-lg border outline-none text-sm
            ${hasError ? "border-red-500" : "border-gray-200"}
            ${disabled && "bg-gray-100 cursor-not-allowed"}
          `}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        )}
      </div>

      {/* Formik error lives here only */}
      {hasError && (
        <p className="text-xs text-red-500">{meta.error}</p>
      )}
    </div>
  );
};

export default Input;
