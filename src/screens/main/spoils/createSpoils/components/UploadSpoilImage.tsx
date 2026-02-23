import { ChangeEvent, useMemo, useRef } from "react";

import Stack from "@mui/material/Stack";
import { useField } from "formik";
import Image from "next/image";
import toast from "react-hot-toast";

import CameraIcon from "@spt/assets/icons/camera.svg";

const SUPPORTED_FORMATS = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
];
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

const UploadSpoilImage = () => {
  const [field, meta, helpers] = useField("coverImage");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const hasError = Boolean(meta.touched && meta.error);
  const hasFile = Boolean(field.value);

  const accept = "image/*";

  // Build a preview URL when a File is selected
  const previewUrl = useMemo(() => {
    if (field.value instanceof File) {
      return URL.createObjectURL(field.value);
    }
    if (typeof field.value === "string" && field.value) {
      return field.value; // already a URL
    }
    return null;
  }, [field.value]);

  const handleClick = () => inputRef.current?.click();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!SUPPORTED_FORMATS.includes(file.type)) {
      toast.error("Unsupported format. Use JPEG, PNG, GIF, or WebP");
      // reset input so the same file can be re-selected if needed
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    if (file.size > MAX_SIZE) {
      toast.error("Image must be less than 5 MB");
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    helpers.setValue(file);
  };

  return (
    <Stack>
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        onClick={handleClick}
        sx={{ cursor: "pointer" }}
      >
        <div className="flex items-center justify-center h-18 w-18 rounded-lg border border-dashed border-blue bg-blue-lightest overflow-hidden">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Cover preview"
              className="h-full w-full object-cover"
            />
          ) : (
            <Image src={CameraIcon} alt="Camera Icon" width={16} height={16} />
          )}
        </div>

        <p>{hasFile ? "Change Cover Image" : "Upload Cover Image"}</p>

        <input
          id={field.name}
          type="file"
          accept={accept}
          ref={inputRef}
          onChange={handleChange}
          className="hidden"
        />
      </Stack>

      {hasError && <p className="text-xs text-red-500">{meta.error}</p>}
    </Stack>
  );
};

export default UploadSpoilImage;
