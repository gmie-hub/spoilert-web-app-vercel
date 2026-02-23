"use client";

import type { FC } from "react";

import { Form, Formik } from "formik";

import Button from "@spt/components/button";
import Input from "@spt/components/input";
import Select from "@spt/components/select";
import useCreateSpoilMutation from "@spt/hooks/apiRequests/useCreateSpoilMutation";
import { useGetAllCategoriesQuery } from "@spt/hooks/apiRequests/useGetAllCategoriesQuery";

import UploadSpoilImage from "../components/UploadSpoilImage";
import { basicsValidationSchema } from "../validations";

import type { BasicsFormData, SpoilTypeOption } from "../types";

interface SpoilBasicsStepProps {
  data: BasicsFormData;
  onChange: (value: BasicsFormData) => void;
  onNext: () => void;
  onBackToSelection: () => void;
  selectedType: SpoilTypeOption;
  onCreated?: (id: number) => void;
}

const categories = [
  "Product Design",
  "Marketing",
  "Software Engineering",
  "Finance",
];

const pricingModels = ["free", "Paid", "Subscription"];

const buildNumberOptions = (limit: number) =>
  Array.from({ length: limit }, (_, index) => {
    const value = String(index + 1);
    return { value, label: value };
  });

const categoryOptions = categories.map((category) => ({
  label: category,
  value: category,
}));

const pricingOptions = pricingModels.map((pricing) => ({
  label: pricing,
  value: pricing,
}));

const moduleOptions = buildNumberOptions(20);
const lessonOptions = buildNumberOptions(60);

const SpoilBasicsStep: FC<SpoilBasicsStepProps> = ({
  data,
  onChange,
  onNext,
  onBackToSelection,
  onCreated,
}) => {
  const {
    data: Categories,
    isLoading,
    isError,
    categoryErrorMessage,
  } = useGetAllCategoriesQuery();

  const { createSpoilHandler, isLoading: isCreating } =
    useCreateSpoilMutation();

  const apiCategoryOptions =
    Categories?.data?.map((c) => ({
      label: c.name,
      value: String(c.id),
    })) ?? [];

  const mergedCategoryOptions = apiCategoryOptions.length
    ? apiCategoryOptions
    : categoryOptions;

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
          onChange(values);
          let res: any;
          try {
            res = await createSpoilHandler(values, formikHelpers);
          } catch {
            // createSpoilHandler handles toasts; stay on this step
            return;
          }

          if (!res) return; // request failed, stay on this step

          const createdId =
            res?.data?.id ??
            res?.data?.spoil_id ??
            res?.data?.data?.id ??
            null;

          if (!createdId) return; // no id returned, stay on this step

          if (typeof onCreated === "function") {
            onCreated(Number(createdId));
          }
          onNext();
        }}
      >
        {({ values, handleChange, handleBlur,  isValid }) => (
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
                type="number"
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
            </div>

            <div className="flex flex-wrap gap-4">
              <Button
                type="submit"
                disabled={!isValid  || isCreating}
                className="w-full"
              >
                { isCreating ? "Saving..." : "Save and Continue"}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default SpoilBasicsStep;
