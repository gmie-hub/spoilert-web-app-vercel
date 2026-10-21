"use client";

import type { FC } from "react";
import { useEffect, useState } from "react";

import { Field, Form, Formik, useFormikContext } from "formik";

import Button from "@spt/components/button";
import Input from "@spt/components/input";
import RichTextEditor from "@spt/components/richTextEditor";
import Select from "@spt/components/select";
import useGetSpoilByIdQuery from "@spt/hooks/apiRequests/getSpoilByIdQuery";
import { useGetAllCategoriesQuery } from "@spt/hooks/apiRequests/useGetAllCategoriesQuery";
import { useAuthStore } from "@spt/store/authStore";
import { useCreateSpoilStore } from "@spt/store/createSpoilStore";

import LessonFileUpload from "../components/LessonFileUpload";
import UploadSpoilImage from "../components/UploadSpoilImage";
import { makeBasicsValidationSchema } from "../validations";

import { mapSpoilDataToForm, pricingOptions } from "./spoilBasicsHelpers";

import type { BasicsFormData, SpoilTypeOption } from "../types";


interface SpoilBasicsStepProps {
  data: BasicsFormData;
  onChange: (value: BasicsFormData) => void;
  onNext: () => void;
  onBackToSelection: () => void;
  selectedType: SpoilTypeOption;
  onCreated?: (id: number) => void;
}

// constants and helpers moved to ./spoilBasicsHelpers.ts

// After a failed "Save and Continue", scroll to the first invalid field so the
// user can see the validation error. The cover image is prioritised because it
// sits at the very top of the form and its hidden input can't be focused.
const ScrollToFirstError = () => {
  const { submitCount, errors } = useFormikContext<BasicsFormData>();

  useEffect(() => {
    if (submitCount === 0) return;

    const errorKeys = Object.keys(errors);
    if (errorKeys.length === 0) return;

    const firstErrorKey = errors.coverImage ? "coverImage" : errorKeys[0];

    const target =
      document.querySelector<HTMLElement>(
        `[data-error-anchor="${firstErrorKey}"]`,
      ) ??
      document.getElementById(firstErrorKey) ??
      document.querySelector<HTMLElement>(`[name="${firstErrorKey}"]`);

    target?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [submitCount, errors]);

  return null;
};

const SpoilBasicsStep: FC<SpoilBasicsStepProps> = ({
  data,
  onChange,
  onNext,
  selectedType,
  // onBackToSelection,
}) => {
  // Category options are paginated + searched server-side: `categoryPage`
  // drives which page to fetch, `categorySearch` is the backend search term,
  // and `categoryOptions` accumulates pages as the dropdown is scrolled so
  // earlier pages stay visible instead of being replaced by the next one.
  const [categoryPage, setCategoryPage] = useState(1);
  const [categorySearch, setCategorySearch] = useState("");
  const [categoryOptions, setCategoryOptions] = useState<
    { label: string; value: string }[]
  >([]);

  const {
    data: Categories,
    isLoading,
    isFetching: isFetchingCategories,
    isError,
    categoryErrorMessage,
  } = useGetAllCategoriesQuery(categoryPage, categorySearch || undefined);

  useEffect(() => {
    // `keepPreviousData` can hand back the previous page/search's data as a
    // placeholder while the next request is in flight — only accept a page
    // once it actually matches what we asked for, otherwise we'd briefly
    // append stale results to the wrong list.
    if (!Categories || Categories.current_page !== categoryPage) return;

    const mapped = Categories.data.map((c) => ({
      label: c.name,
      value: String(c.id),
    }));

    setCategoryOptions((prev) =>
      categoryPage === 1 ? mapped : [...prev, ...mapped],
    );
  }, [Categories, categoryPage]);

  const hasMoreCategories = Boolean(
    Categories && Categories.current_page < Categories.last_page,
  );

  const handleCategorySearchChange = (value: string) => {
    setCategorySearch(value);
    setCategoryPage(1);
  };

  const handleCategoryReachEnd = () => {
    if (hasMoreCategories && !isFetchingCategories) {
      setCategoryPage((page) => page + 1);
    }
  };



  const storedSpoilId = useAuthStore((s) => s.createdSpoilId);
  const { data: spoilData } = useGetSpoilByIdQuery(storedSpoilId);
  const setBasicsInDraft = useCreateSpoilStore((s) => s.setBasics);
  const loadedSpoilId = useCreateSpoilStore((s) => s.loadedSpoilId);

  useEffect(() => {
    if (!spoilData) return;

    // Don't overwrite the in-progress draft if it already represents this
    // spoil (e.g. we just came back from the certificate flow) — that would
    // wipe the user's local edits with the saved server copy.
    if (String(loadedSpoilId) === String(spoilData.id)) return;

    const mapped = mapSpoilDataToForm(spoilData);

    onChange(mapped);
  }, [spoilData, onChange, loadedSpoilId]);
  
  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };



  return (
    <div className="rounded-3xl bg-white p-8 shadow-sm md:max-w-2xl">
      <h2 className="mt-2 text-xl font-semibold text-black">Spoylz Basics</h2>
      <p className="mt-3">
        Start by providing basic information about your Spoylz.
      </p>

      <Formik<BasicsFormData>
        // Ensure lessonType and lessonFile are always tracked fields so their
        // required errors can surface on submit, even if the persisted draft
        // predates them.
        initialValues={{ lessonType: "", lessonFile: null, ...data }}
        enableReinitialize
        validationSchema={makeBasicsValidationSchema(selectedType)}
        validateOnChange={true}
        validateOnBlur={true}
        onSubmit={async (values) => {
          // prepare values to persist
          const toPersist: Partial<BasicsFormData> = { ...values };

          if (selectedType === "simple") {
            // ensure spoil `type` and lesson fields are stored for simple spoils
            toPersist.type = "simple";
            // lesson fields are already present on `values` (lessonType, lessonContent, lessonFile)
          }

          onChange(toPersist as BasicsFormData);
          // persist into draft store instead of calling API here
          setBasicsInDraft(toPersist as BasicsFormData);
          scrollToTop();
          onNext();
        }}
      >
        {({ values, handleChange, handleBlur,  setTouched, errors, touched }) => (
          <Form className="mt-8 space-y-8">
            <ScrollToFirstError />
            <div data-error-anchor="coverImage">
              <UploadSpoilImage />
            </div>

            <div className="grid gap-6">
              <Input
                name="title"
                label="Spoylz Title"
                placeholder="Title"
                // hasAsterisk
              />

              <Select
                name="category"
                label="Category"
                placeholder="Select category"
                options={categoryOptions}
                hasAsterisk
                isLoading={isLoading || isFetchingCategories}
                searchable
                filterOnFrontend={false}
                onSearchChange={handleCategorySearchChange}
                onReachEnd={handleCategoryReachEnd}
              />
              {isError && (
                <p className="text-sm text-red-500">{categoryErrorMessage}</p>
              )}

              <Input
                name="institution"
                label="Institution (Optional)"
                placeholder="Select institution"
              />

              <Input
                name="courseCode"
                label="Course Code (Optional)"
                placeholder="Course Code"
              />

              <Select
                name="pricing"
                label="Pricing"
                placeholder="Select pricing"
                options={pricingOptions}
                hasAsterisk
              />

              {values.pricing && values.pricing !== "free" && (
                <Input
                  name="amount"
                  label="Amount"
                  placeholder="Enter amount"
                />
              )}

              <div className="space-y-2">
                <label
                  className="text-sm font-medium text-gray-700"
                  htmlFor="expiryDate"
                >
                  Expiry Date
                </label>
                <input
                  id="expiryDate"
                  name="expiryDate"
                  type="date"
                  value={values.expiryDate}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="h-12 w-full rounded-xl border border-gray-200 bg-[#FBFBFB] px-4 text-sm focus:border-[var(--color-blue)] focus:outline-none"
                />
                <p className="text-xs text-gray-500">
                  Set an expiry date if this spoil should only be available for
                  a limited time.
                </p>
              </div>

              {selectedType !== "simple" && (
                <>
                  <Input
                    name="moduleCount"
                    label="Modules"
                    placeholder="Enter number of modules"
                    numericOnly
                    type="text"
                  />

                  <Input
                    name="lessonCount"
                    label="Lessons"
                    placeholder="Enter number of lessons"
                    numericOnly
                    type="text"
                  />
                </>
              )}

          
            </div>

            <div className="space-y-2">
              <label
                className="text-sm font-medium text-gray-700"
                htmlFor="description"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={values.description}
                onChange={handleChange}
                onBlur={handleBlur}
                rows={4}
                placeholder="Write a description about the project"
                className="w-full rounded-2xl border border-gray-200 bg-[#FBFBFB] px-4 py-3 text-sm focus:border-[var(--color-blue)] focus:outline-none"
              />
              {touched.description && errors.description && (
                <p className="text-xs text-red-500">{errors.description}</p>
              )}
            </div>

            <div className="space-y-2">
              <label
                className="text-sm font-medium text-gray-700"
                htmlFor="learningOutcome"
              >
                What Will They Learn
              </label>
              <textarea
                id="learningOutcome"
                name="learningOutcome"
                value={values.learningOutcome}
                onChange={handleChange}
                onBlur={handleBlur}
                rows={4}
                placeholder="Write what they will learn"
                className="w-full rounded-2xl border border-gray-200 bg-[#FBFBFB] px-4 py-3 text-sm focus:border-[var(--color-blue)] focus:outline-none"
              />
              {touched.learningOutcome && errors.learningOutcome && (
                <p className="text-xs text-red-500">{errors.learningOutcome}</p>
              )}
            </div>

                {selectedType === "simple" && (
                <div className="space-y-4">
                  <Select
                    name="lessonType"
                    label="Lesson Type"
                    placeholder="Select type"
                    options={[
                      { label: "File", value: "file" },
                      { label: "Text", value: "text" },
                    ]}
                  />
                  

                  {values.lessonType === "text" && (
                    <RichTextEditor
                      name="lessonContent"
                      label="Lesson Content"
                      placeholder="Type in content"
                    />

                
                  )}



                  {values.lessonType === "file" && (
                    <LessonFileUpload
                      name="lessonFile"
                      label="Content Upload"
                      accept={undefined}
                    />
                  )}
                </div>
              )}

            <label
              htmlFor="isDownloadable"
              className="flex cursor-pointer items-start gap-3 rounded-2xl border border-gray-200 bg-[#FBFBFB] px-4 py-3"
            >
              <Field
                id="isDownloadable"
                type="checkbox"
                name="isDownloadable"
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

            <div className="flex flex-wrap gap-4">
              <Button
                type="submit"
                disabled={false}
                className="w-full"
                onClick={() =>
                  setTouched(
                    Object.keys(values).reduce((acc, k) => {
                      // @ts-ignore
                      acc[k] = true;
                      return acc;
                    }, {} as Record<string, boolean>),
                  )
                }
              >
                {"Save and Continue"}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default SpoilBasicsStep;
