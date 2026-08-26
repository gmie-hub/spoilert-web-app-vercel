import * as yup from "yup";

const SUPPORTED_IMAGE_FORMATS = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB

export const makeBasicsValidationSchema = (selectedType?: string) =>
  yup.object({
  coverImage: yup
    .mixed()
    .required("Cover image is required")
    .test("fileType", "The image must be a file of type: jpeg, png, jpg, gif", (value) => {
      if (!value) return false;
      if (value instanceof File) return SUPPORTED_IMAGE_FORMATS.includes(value.type);
      return true; // already uploaded / URL
    })
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
  // amount: yup.string().when("pricing", (pricing: any, schema: yup.StringSchema) => {
  //   const p = typeof pricing === "string" ? pricing.trim().toLowerCase() : "";
  //   if (p !== "free") {
  //     return schema
  //       .trim()
  //       .matches(/^(?:\d+)(?:\.\d{1,2})?$/, "Enter a valid amount")
  //       .required("Amount is required");
  //   }
  //   return schema.trim().notRequired().nullable();
  // }),

amount: yup
  .string()
  .trim()
  .when("pricing", (pricingValue, schema) => {
    const pricing = pricingValue?.[0]; // 👈 FIX

    if (pricing !== "free") {
      return schema
        .required("Amount is required")
        .matches(/^(?:\d+)(?:\.\d{1,2})?$/, "Enter a valid amount");
    }

    return schema
      .notRequired()
      .nullable()
      .transform(() => null);
  }),
  expiryDate: yup.string().trim().nullable(),
  moduleCount: yup
    .string()
    .trim()
    .nullable()
    .matches(/^\d+$/, {
      message: "Enter a valid number of modules",
      excludeEmptyString: true,
    }),
  lessonCount: yup
    .string()
    .trim()
    .nullable()
    .matches(/^\d+$/, {
      message: "Enter a valid number of lessons",
      excludeEmptyString: true,
    }),
  description: yup.string().trim().required('required '),
  learningOutcome: yup.string().trim(),
  lessonType:
    selectedType === "simple"
      ? yup.string().trim().required("Select a lesson type")
      : yup.string().trim().nullable(),
  });

// Backwards-compatible default (non-simple) schema.
export const basicsValidationSchema = makeBasicsValidationSchema();
