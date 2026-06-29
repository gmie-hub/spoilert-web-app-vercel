"use client";

import type { FC } from "react";
import { useEffect } from "react";

import { Form, Formik, useFormikContext } from "formik";

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

import {
  lessonOptions,
  mapSpoilDataToForm,
  moduleOptions,
  pricingOptions,
} from "./spoilBasicsHelpers";

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
  const {
    data: Categories,
    isLoading,
    isError,
    categoryErrorMessage,
  } = useGetAllCategoriesQuery();



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



  const mergedCategoryOptions =
    Categories?.data?.map((c) => ({
      label: c.name,
      value: String(c.id),
    })) ?? [];

  return (
    <div className="rounded-3xl bg-white p-8 shadow-sm md:max-w-2xl">
      <h2 className="mt-2 text-xl font-semibold text-black">Spoylz Basics</h2>
      <p className="mt-3">
        Start by providing basic information about your Spoylz.
      </p>

      <Formik<BasicsFormData>
        // Ensure lessonType is always a tracked field so its required error can
        // surface on submit, even if the persisted draft predates this field.
        initialValues={{ lessonType: "", ...data }}
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
                options={mergedCategoryOptions}
                hasAsterisk
                isLoading={isLoading}
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
                  <Select
                    name="moduleCount"
                    label="Modules"
                    placeholder="Select number of modules"
                    options={moduleOptions}
                  />

                  <Select
                    name="lessonCount"
                    label="Lessons"
                    placeholder="Select number of lessons"
                    options={lessonOptions}
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
