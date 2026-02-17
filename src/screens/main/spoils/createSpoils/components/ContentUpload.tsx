"use client";

import type { FC } from "react";
import React, { useRef } from "react";

import { useField } from "formik";
import Image from "next/image";

import UploadIcon from "@spt/assets/icons/upload.svg";

interface ContentUploadProps {
  name: string;
  label?: string;
  accept?: string;
  hasAsterisk?: boolean;
}

const ContentUpload: FC<ContentUploadProps> = ({
  name,
  label,
  accept,
  hasAsterisk = false,
}) => {
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
    <div className="flex w-full flex-col gap-1">
      {label && (
        <label htmlFor={name} className="text-sm font-medium text-gray-700">
          {label}
          {hasAsterisk && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}

      <input
        id={name}
        type="file"
        accept={accept}
        ref={inputRef}
        onChange={handleChange}
        className="hidden"
      />

      <div
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className={`
          flex min-h-[100px] w-full cursor-pointer flex-col items-center justify-center gap-2
          rounded-lg border-2 border-dashed bg-white px-4 py-4
          transition hover:border-blue-900
          ${hasError ? "border-red-500" : "border-blue"}
        `}
      >
        <div className="flex flex-col items-center gap-2">
          <Image src={UploadIcon} alt="upload" width={20} height={20} />

          {field.value ? (
            <p className="text-sm font-medium text-gray-700">
              {field.value.name}
            </p>
          ) : (
            <p className="text-blue">Upload File</p>
          )}
        </div>
      </div>

      {hasError && (
        <span className="text-xs text-red-500">{meta.error as string}</span>
      )}
    </div>
  );
};

export default ContentUpload;
