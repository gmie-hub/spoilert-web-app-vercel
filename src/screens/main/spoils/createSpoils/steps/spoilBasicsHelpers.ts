import type { BasicsFormData } from "./types";

export const pricingModels = ["free", "Paid", "Subscription"];

export const buildNumberOptions = (limit: number) =>
  Array.from({ length: limit }, (_, index) => {
    const value = String(index + 1);
    return { value, label: value };
  });

export const pricingOptions = pricingModels.map((pricing) => ({
  label: pricing,
  value: pricing,
}));

export const moduleOptions = buildNumberOptions(20);
export const lessonOptions = buildNumberOptions(60);

export const mapSpoilDataToForm = (spoilData: any): BasicsFormData => ({
  coverImage: spoilData.cover_image_url ?? null,
  title: spoilData.title ?? "",
  category: String(spoilData.category?.id ?? ""),
  institution: spoilData.institution ?? "",
  courseCode: spoilData.course_code ?? "",
  pricing: spoilData.pricing ?? "",
  amount: spoilData.amount ? String(spoilData.amount) : "",
  expiryDate: spoilData.expires_at ? String(spoilData.expires_at).split(" ")[0] : "",
  moduleCount: spoilData.modules_no ? String(spoilData.modules_no) : "",
  lessonCount: spoilData.lessons_no ? String(spoilData.lessons_no) : "",
  description: spoilData.description ?? "",
  learningOutcome: spoilData.what_to_learn ?? "",
});
