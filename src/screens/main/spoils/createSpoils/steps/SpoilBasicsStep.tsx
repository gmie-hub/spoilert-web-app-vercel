"use client";

import type { FC } from "react";
import { useEffect } from "react";

import { Form, Formik } from "formik";

import Button from "@spt/components/button";
import Input from "@spt/components/input";
import Select from "@spt/components/select";
import Textarea from "@spt/components/textarea";
import useGetSpoilByIdQuery from "@spt/hooks/apiRequests/getSpoilByIdQuery";
import { useGetAllCategoriesQuery } from "@spt/hooks/apiRequests/useGetAllCategoriesQuery";
import { useAuthStore } from "@spt/store/authStore";
import { useCreateSpoilStore } from "@spt/store/createSpoilStore";

import ContentUpload from "../components/ContentUpload";
import UploadSpoilImage from "../components/UploadSpoilImage";
import { basicsValidationSchema } from "../validations";

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

  useEffect(() => {
    if (!spoilData) return;

    const mapped = mapSpoilDataToForm(spoilData);

    onChange(mapped);
  }, [spoilData, onChange]);

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
      <h2 className="mt-2 text-xl font-semibold text-black">Spoil Basics</h2>
      <p className="mt-3">
        Start by providing basic information about your spoil.
      </p>

      <Formik<BasicsFormData>
        initialValues={data}
        enableReinitialize
        validationSchema={basicsValidationSchema}
        validateOnChange={true}
        validateOnBlur={true}
        onSubmit={async (values, formikHelpers) => {
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
        {({ values, handleChange, handleBlur, isValid, setTouched, errors, touched }) => (
          <Form className="mt-8 space-y-8">
            <UploadSpoilImage />

            <div className="grid gap-6">
              <Input
                name="title"
                label="Spoil Title"
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

              <Input
                name="amount"
                label="Amount"
                placeholder="Enter amount"
                // type="text"
                // className="no-spinner"
                // inputMode="numeric"
                // pattern="[0-9]*"
                // hasAsterisk
              />

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

                  {values.lessonType === "text" ? (
                    <Textarea
                      name="lessonContent"
                      label="Lesson Content"
                      rows={5}
                      placeholder="Type in content"
                    />
                  ) : (
                    <ContentUpload
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
