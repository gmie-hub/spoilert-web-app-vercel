"use client";

import { ChangeEvent, FC, KeyboardEvent, useState } from "react";

import { useFormikContext } from "formik";
import { useField } from "formik";
import Image from "next/image";

import EyeIcon from "@spt/assets/icons/eye-slash.svg";
import EyeOpenIcon from "@spt/assets/icons/eye.svg";

interface Props {
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  disabled?: boolean;

  /** digits only: strips anything non-numeric as the user types */
  numericOnly?: boolean;

  /** for side effects like account verification */
  onValueChange?: (value: string) => void;
}

const Input: FC<Props> = ({
  name,
  label,
  placeholder,
  type = "text",
  disabled = false,
  numericOnly = false,
  onValueChange,
}) => {
  const [field, meta, helpers] = useField(name);
  const [showPassword, setShowPassword] = useState(false);

  const hasError = meta.touched && Boolean(meta.error);
  const isPassword = type === "password";

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;

    const value = numericOnly
      ? e.target.value.replace(/\D/g, "")
      : e.target.value;

    helpers.setValue(value);
    onValueChange?.(value);
  };

  const { validateField } = useFormikContext() as any;

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (numericOnly) {
      const isControlKey = [
        "Backspace",
        "Delete",
        "Tab",
        "Escape",
        "Enter",
        "ArrowLeft",
        "ArrowRight",
        "ArrowUp",
        "ArrowDown",
        "Home",
        "End",
      ].includes(e.key);
      const isShortcut =
        (e.ctrlKey || e.metaKey) &&
        ["a", "c", "v", "x"].includes(e.key.toLowerCase());
      const isDigit = /^[0-9]$/.test(e.key);

      if (!isControlKey && !isShortcut && !isDigit) {
        e.preventDefault();
      }
    }

    if (e.key === "Enter") {
      helpers.setTouched(true);
      // trigger field validation
      validateField(field.name);
    }
  };

  // Keep numeric-only fields as text so browsers never show spinner arrows.
  const inputType = numericOnly
    ? "text"
    : isPassword && showPassword
      ? "text"
      : type;

  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>

      <div className="relative">
        <input
          {...field}
          type={inputType}
          inputMode={numericOnly ? "numeric" : undefined}
          pattern={numericOnly ? "[0-9]*" : undefined}
          autoComplete={numericOnly ? "off" : undefined}
          placeholder={placeholder}
          disabled={disabled}
          value={field.value ?? ""}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className={`
            h-12 w-full px-3 rounded-lg border outline-none text-sm
            [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none
            ${hasError ? "border-red-500" : "border-gray-200"}
            ${disabled && "bg-gray-100 cursor-not-allowed"}
          `}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            className="absolute right-3 top-1/2 -translate-y-1/2"
            tabIndex={-1}
          >
            <span className="inline-block w-5 h-5">
              <Image
                width={16}
                height={16}
                src={showPassword ? EyeOpenIcon : EyeIcon}
                alt={showPassword ? "Hide password" : "Show password"}
                style={{ filter: showPassword ? "grayscale(100%)" : "none" }}
              />
            </span>
          </button>
        )}
      </div>

      {/* Formik error lives here only */}
      {hasError && <p className="text-xs text-red-500">{meta.error}</p>}
    </div>
  );
};

export default Input;
