"use client";
import React from "react";
import { useRef } from "react";

import { useField } from "formik";

// import Upload2 from "@spt/assets/images/auth-image-one.svg";
// import Image from "next/image";

interface CustomUploadProps {
  name: string;
  placeholder?: string;
  accept?: string;
  maxSizeMB?: number;
}

const CustomUpload = ({
  name,
  placeholder,
  accept = ".png,.jpg",
  maxSizeMB = 5,
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
      {/* Hidden file input */}
      <input
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
          h-12 w-full rounded-lg border bg-[#FBFBFB] px-3 flex items-center gap-3
          cursor-pointer text-sm placeholder:text-gray-400
          ${hasError ? "border-red-500" : "border-gray-200"}
          hover:border-teal-500 transition
        `}
      >
        {/* Icon circle */}
        

        {/* Text */}
        <div className="flex flex-col">
          <span className="font-semibold text-blue-600">
            {field.value ? field.value.name : "Click to upload"}
          </span>
          <span className="text-xs text-gray-400">
            {placeholder || `.PNG, .JPG up to ${maxSizeMB}MB`}
          </span>
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
