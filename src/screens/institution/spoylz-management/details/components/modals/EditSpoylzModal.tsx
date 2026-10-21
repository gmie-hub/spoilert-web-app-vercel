"use client";

import { useEffect, useState } from "react";

import { useQueryClient } from "@tanstack/react-query";
import { Field, Form, Formik } from "formik";
import Image from "next/image";
import * as Yup from "yup";

import Input from "@spt/components/input";
import Select from "@spt/components/select";
import Textarea from "@spt/components/textarea";
import { useGetAllCategoriesQuery } from "@spt/hooks/apiRequests/useGetAllCategoriesQuery";
import { useUpdateSpoilMutation } from "@spt/hooks/apiRequests/useUpdateSpoilMutation";
import type { SpoilDetailsData } from "@spt/utils/spoils";

import FileField from "./FileField";
import ModalShell, { ModalActions } from "./ModalShell";

const PRICING_OPTIONS = [
  { value: "free", label: "Free" },
  { value: "paid", label: "Paid" },
];

interface EditSpoylzValues {
  title: string;
  category_id: string;
  institution: string;
  course_code: string;
  expires_at: string;
  pricing: string;
  amount: string;
  description: string;
  what_to_learn: string;
  is_downloadable: boolean;
}

const validationSchema = Yup.object({
  title: Yup.string().trim().required("Spoylz title is required"),
  category_id: Yup.string().required("Category is required"),
  pricing: Yup.string().required("Pricing is required"),
  amount: Yup.string().when("pricing", {
    is: "paid",
    then: (schema) => schema.required("Amount is required"),
    otherwise: (schema) => schema,
  }),
  description: Yup.string().trim().required("Description is required"),
  what_to_learn: Yup.string().trim().required("This field is required"),
});

// Edits a Spoylz's basics with the same fields the admin portal sends. Its
// outline (modules, lessons, quizzes) has its own edit modals.
const EditSpoylzModal = ({ spoil, onClose }: { spoil: SpoilDetailsData; onClose: () => void }) => {
  const queryClient = useQueryClient();
  const { updateSpoilHandler } = useUpdateSpoilMutation();
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  // Categories load a page at a time as the dropdown scrolls, as in the create flow.
  const [categoryPage, setCategoryPage] = useState(1);
  const [categorySearch, setCategorySearch] = useState("");
  const [categoryOptions, setCategoryOptions] = useState<{ label: string; value: string }[]>([]);
  const {
    data: categories,
    isLoading: isCategoriesLoading,
    isFetching: isFetchingCategories,
  } = useGetAllCategoriesQuery(categoryPage, categorySearch || undefined);

  useEffect(() => {
    if (!categories || categories.current_page !== categoryPage) return;

    const mapped = categories.data.map((category) => ({ label: category.name, value: String(category.id) }));
    setCategoryOptions((prev) => (categoryPage === 1 ? mapped : [...prev, ...mapped]));
  }, [categories, categoryPage]);

  useEffect(() => {
    if (!coverImage) {
      setCoverPreview(null);
      return;
    }

    const url = URL.createObjectURL(coverImage);
    setCoverPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [coverImage]);

  // The Spoylz's own category may be on a page that hasn't loaded yet.
  const currentCategory = spoil.category ? { label: spoil.category.name, value: String(spoil.category.id) } : null;
  const options =
    currentCategory && !categorySearch && !categoryOptions.some((option) => option.value === currentCategory.value)
      ? [currentCategory, ...categoryOptions]
      : categoryOptions;

  const handleCategorySearchChange = (value: string) => {
    setCategorySearch(value);
    setCategoryPage(1);
  };

  const handleCategoryReachEnd = () => {
    if (categories && categories.current_page < categories.last_page && !isFetchingCategories) {
      setCategoryPage((page) => page + 1);
    }
  };

  const initialValues: EditSpoylzValues = {
    title: spoil.title ?? "",
    category_id: spoil.category_id ? String(spoil.category_id) : "",
    institution: spoil.institution ?? "",
    course_code: spoil.course_code ?? "",
    // The API sends a full timestamp; the date input wants yyyy-MM-dd.
    expires_at: spoil.expires_at ? String(spoil.expires_at).slice(0, 10) : "",
    pricing: spoil.pricing?.toLowerCase() ?? "",
    amount: spoil.amount != null ? String(spoil.amount) : "",
    description: spoil.description ?? "",
    what_to_learn: spoil.what_to_learn ?? "",
    is_downloadable: Number(spoil.is_downloadable) === 1,
  };

  const coverSrc = coverPreview ?? spoil.cover_image_url;

  return (
    <ModalShell title="Edit Spoylz" onClose={onClose} widthClassName="max-w-[720px]">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values, helpers) => {
          try {
            await updateSpoilHandler(
              spoil.id,
              {
                title: values.title.trim(),
                category: values.category_id,
                institution: values.institution.trim(),
                courseCode: values.course_code.trim(),
                expiryDate: values.expires_at,
                pricing: values.pricing,
                // Free Spoylz go up with a zero amount, as the admin portal sends them.
                amount: values.pricing === "free" ? "0" : values.amount,
                description: values.description.trim(),
                learningOutcome: values.what_to_learn.trim(),
                isDownloadable: values.is_downloadable,
                coverImage,
              },
              helpers,
            );
            queryClient.invalidateQueries({ queryKey: ["spoil-details"] });
            queryClient.invalidateQueries({ queryKey: ["spoils-page"] });
            onClose();
          } catch {
            // updateSpoilHandler has already shown the error.
          }
        }}
      >
        {({ values, isSubmitting }) => (
          <Form className="space-y-5">
            <div className="flex items-center gap-4">
              <span className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                {coverSrc && (
                  <Image src={coverSrc} alt="Cover image" fill sizes="80px" className="object-cover" unoptimized />
                )}
              </span>
              <div className="min-w-0 flex-1">
                <FileField
                  label="Cover Image"
                  accept="image/*"
                  file={coverImage}
                  onChange={setCoverImage}
                  hint="Leave this empty to keep the current cover."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <Input name="title" label="Spoylz Title" placeholder="Title" />
              </div>

              <Select
                name="category_id"
                label="Category"
                placeholder="Select category"
                options={options}
                isLoading={isCategoriesLoading || isFetchingCategories}
                searchable
                filterOnFrontend={false}
                onSearchChange={handleCategorySearchChange}
                onReachEnd={handleCategoryReachEnd}
              />

              <Input name="institution" label="Institution (Optional)" placeholder="Institution" />
              <Input name="course_code" label="Course Code (Optional)" placeholder="Course Code" />
              <Input name="expires_at" label="Expiry Date" type="date" />

              <Select name="pricing" label="Pricing" placeholder="Select pricing" options={PRICING_OPTIONS} />

              {values.pricing === "paid" && (
                <Input name="amount" label="Amount" placeholder="Enter amount" numericOnly allowDecimal />
              )}

              <div className="md:col-span-2">
                <Textarea
                  name="description"
                  label="Description"
                  placeholder="Write a description about the Spoylz"
                  rows={4}
                />
              </div>

              <div className="md:col-span-2">
                <Textarea
                  name="what_to_learn"
                  label="What Will They Learn"
                  placeholder="Write what they will learn"
                  rows={4}
                />
              </div>

              <label
                htmlFor="is_downloadable"
                className="flex cursor-pointer items-start gap-3 rounded-xl border border-gray-200 bg-[#FBFBFB] px-4 py-3 md:col-span-2"
              >
                <Field
                  id="is_downloadable"
                  type="checkbox"
                  name="is_downloadable"
                  className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-gray-300 accent-[var(--color-blue)]"
                />
                <span>
                  <span className="block text-sm font-medium text-gray-700">
                    Allow learners to download lessons
                  </span>
                  <span className="mt-0.5 block text-xs text-gray-500">
                    Learners can save this Spoylz&apos;s lesson files to their device while learning.
                  </span>
                </span>
              </label>
            </div>

            <ModalActions onCancel={onClose} isSubmitting={isSubmitting} />
          </Form>
        )}
      </Formik>
    </ModalShell>
  );
};

export default EditSpoylzModal;
