"use client";
import React, { useRef } from "react";

import { useField } from "formik";
import Image from "next/image";

import DocIcon from "@spt/assets/icons/document-upload.svg";

interface CustomUploadProps {
  name: string;
  label?: string;
  placeholder?: string;
  accept?: string;
  maxSizeMB?: number;
  hasAsterisk?: boolean;
}

const CustomUpload = ({
  name,
  label,
  placeholder,
  accept = ".png,.jpg",
  maxSizeMB = 5,
  hasAsterisk = false,
}: CustomUploadProps) => {
  const [field, meta, helpers] = useField(name);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const hasError = Boolean(meta.touched && meta.error);

  const handleClick = () => inputRef.current?.click();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      helpers.setValue(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) helpers.setValue(file);
  };

  return (
    <div className="flex flex-col gap-1 w-full">
      {/* Label */}
      <label htmlFor={name} className="text-sm font-medium text-gray-700">
        {label}
        {hasAsterisk && <span className="ml-1 text-red-500">*</span>}
      </label>

      {/* Hidden file input */}
      <input
        id={name}
        type="file"
        accept={accept}
        ref={inputRef}
        onChange={handleChange}
        className="hidden"
      />

      {/* Dropzone */}
      <div
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className={`
          h-12 w-full rounded-lg border bg-[#FBFBFB] px-3
          flex items-center gap-3 cursor-pointer text-sm
          ${hasError ? "border-red-500" : "border-gray-200"}
          hover:border-teal-500 transition
        `}
      >
        {/* Text */}
        <div className="flex flex-col">
          <span className="font-semibold text-[var(--color-blue)] truncate">
            
            {field.value ? field.value.name : ""}
          </span>
          {!field.value && (
            <span className="flex items-center gap-1 text-xs text-[var(--color-blue)]">
              <Image src={DocIcon} alt="doc" width={12} height={12} />
              {placeholder || `.PNG, .JPG up to ${maxSizeMB}MB`}
            </span>
          )}
        </div>
      </div>

      {/* Error */}
      {hasError && (
        <span className="text-xs text-red-500">{meta.error as string}</span>
      )}
    </div>
  );
};

export default CustomUpload;
