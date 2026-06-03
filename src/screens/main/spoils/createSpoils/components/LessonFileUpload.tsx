"use client";

import type { FC } from "react";

import { useField } from "formik";
import Image from "next/image";

import DocumentIcon from "@spt/assets/icons/note.svg";
import TrashIcon from "@spt/assets/icons/trash.svg";

import ContentUpload from "./ContentUpload";

interface LessonFileUploadProps {
  name: string;
  label?: string;
  accept?: string;
}

/**
 * Derive a human-readable file name from the field value.
 * - A freshly picked file is a `File` -> use its name.
 * - An already-uploaded file (on edit) is a URL string -> use the last path
 *   segment, URL-decoded.
 */
const getFileName = (file: unknown): string => {
  if (typeof File !== "undefined" && file instanceof File) {
    return file.name;
  }

  if (typeof file === "string" && file) {
    const path = file.split("?")[0];
    const segment = path.substring(path.lastIndexOf("/") + 1);

    try {
      return decodeURIComponent(segment) || "Uploaded file";
    } catch {
      return segment || "Uploaded file";
    }
  }

  return "Uploaded file";
};

/**
 * File field for a lesson's content.
 *
 * Shows the uploader when there is no file, otherwise shows the current file
 * name with a Remove button. Removing clears the value, which brings back the
 * uploader so a different file can be chosen. Works for both newly picked files
 * (`File`) and files already saved on the server (URL string, on edit).
 */
const LessonFileUpload: FC<LessonFileUploadProps> = ({
  name,
  label = "Content Upload",
  accept,
}) => {
  const [field, , helpers] = useField(name);
  const value = field.value;

  // No file selected/saved yet -> let the user upload one.
  if (!value) {
    return <ContentUpload name={name} label={label} accept={accept} />;
  }

  const isExistingFile = typeof value === "string";
  const fileName = getFileName(value);

  return (
    <div className="flex w-full flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}

      <div className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 bg-[#FBFBFB] px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <Image
            src={DocumentIcon}
            alt=""
            width={20}
            height={20}
            className="shrink-0"
          />

          <div className="min-w-0">
            <p
              className="truncate text-sm font-medium text-gray-700"
              title={fileName}
            >
              {fileName}
            </p>

            {isExistingFile ? (
              <a
                href={value as string}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue underline"
              >
                View file
              </a>
            ) : (
              <p className="text-xs text-gray-500">Ready to upload</p>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={() => helpers.setValue(null)}
          className="flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-sm font-medium text-red-600 transition hover:bg-red-50"
          aria-label="Remove file"
        >
          <Image src={TrashIcon} alt="" width={16} height={16} />
          Remove
        </button>
      </div>
    </div>
  );
};

export default LessonFileUpload;
