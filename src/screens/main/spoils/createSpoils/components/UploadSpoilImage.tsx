import { ChangeEvent, useMemo, useRef } from "react";

import Stack from "@mui/material/Stack";
import { useField, useFormikContext } from "formik";
import Image from "next/image";
import toast from "react-hot-toast";

import CameraIcon from "@spt/assets/icons/camera.svg";
import useCreateSpoilStore from "@spt/store/createSpoilStore";

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
  const { values } = useFormikContext<any>();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const hasError = Boolean(meta.touched && meta.error);
  const hasFile = Boolean(field.value);

  const accept = "image/*";

  // read persisted basics for fallback preview when field value is not a File
  const storedBasics = useCreateSpoilStore((s) => s.basics);

  // Build a preview URL when a File is selected or when a persisted data URL exists
  const previewUrl = useMemo(() => {
    if (field.value instanceof File) {
      return URL.createObjectURL(field.value);
    }
    if (field.value && typeof field.value === "object" && (field.value as any).dataUrl) {
      return (field.value as any).dataUrl;
    }
    if (typeof field.value === "string" && field.value) {
      return field.value; // already a URL
    }
    if (storedBasics?.coverImage && typeof storedBasics.coverImage === "object" && (storedBasics.coverImage as any).dataUrl) {
      return (storedBasics.coverImage as any).dataUrl;
    }
    if (storedBasics?.coverImage && typeof storedBasics.coverImage === "string") {
      return storedBasics.coverImage;
    }

    return null;
  }, [field.value, storedBasics]);

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

    // set Formik field to the File for immediate use in this session
    helpers.setValue(file);

    // persist a lightweight preview object in the draft store (data URL + metadata)
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      try {
        // merge current Formik values into persisted basics to avoid overwriting user input
        const prev = useCreateSpoilStore.getState().basics;
        useCreateSpoilStore.getState().setBasics?.({
          ...(prev ?? {}),
          ...(values ?? {}),
          coverImage: { dataUrl, name: file.name, type: file.type } as { dataUrl: string; name: string; type: string },
        });
      } catch {
            // Failed to fetch cover image URL
          }
    };
    reader.readAsDataURL(file);
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
