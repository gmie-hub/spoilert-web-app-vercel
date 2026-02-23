import * as yup from "yup";

const SUPPORTED_IMAGE_FORMATS = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB

export const basicsValidationSchema = yup.object({
  coverImage: yup
    .mixed()
    .required("Cover image is required")
    .test(
      "fileType",
      "Unsupported image format. Use JPEG, PNG, GIF, or WebP",
      (value) => {
        if (!value) return false;
        if (value instanceof File)
          return SUPPORTED_IMAGE_FORMATS.includes(value.type);
        return true; // already uploaded / URL
      },
    )
    .test("fileSize", "Image must be less than 5 MB", (value) => {
      if (!value) return false;
      if (value instanceof File) return value.size <= MAX_IMAGE_SIZE;
      return true;
    }),
  title: yup.string().trim().required("Title is required"),
  category: yup.string().trim().required("Select a category"),
  institution: yup.string().trim(),
  courseCode: yup.string().trim(),
  pricing: yup.string().trim().required("Select a pricing model"),
  amount: yup
    .string()
    .trim()
    .matches(/^(?:\d+)(?:\.\d{1,2})?$/, "Enter a valid amount")
    .required("Amount is required"),
  expiryDate: yup.string().trim().nullable(),
  moduleCount: yup.string().trim().nullable(),
  lessonCount: yup.string().trim().nullable(),
  description: yup.string().trim(),
  learningOutcome: yup.string().trim(),
});
