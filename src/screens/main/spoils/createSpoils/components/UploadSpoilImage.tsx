import { ChangeEvent, useRef } from "react";

import Stack from "@mui/material/Stack";
import { useField } from "formik";
import Image from "next/image";

import CameraIcon from "@spt/assets/icons/camera.svg";

const UploadSpoilImage = () => {
  const [field, meta, helpers] = useField("coverImage");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const hasError = Boolean(meta.touched && meta.error);

  const accept = "image/*";

  const handleClick = () => inputRef.current?.click();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      helpers.setValue(file);
    }
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
        <div className="flex items-center justify-center h-18 w-18 rounded-lg border border-dashed border-blue bg-blue-lightest">
          <Image src={CameraIcon} alt="Camera Icon" width={16} height={16} />
        </div>

        <p>Upload Cover Image</p>

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
