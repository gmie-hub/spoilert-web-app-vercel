"use client";

import type { FC } from "react";
import { useEffect } from "react";

import { Form, Formik } from "formik";

import Button from "@spt/components/button";
import Input from "@spt/components/input";
import Select from "@spt/components/select";
import useGetSpoilByIdQuery from "@spt/hooks/apiRequests/getSpoilByIdQuery";
import useCreateSpoilMutation from "@spt/hooks/apiRequests/useCreateSpoilMutation";
import { useGetAllCategoriesQuery } from "@spt/hooks/apiRequests/useGetAllCategoriesQuery";
import useUpdateSpoilMutation from "@spt/hooks/apiRequests/useUpdateSpoilMutation";
import { useAuthStore } from "@spt/store/authStore";

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

const pricingModels = ["free", "Paid", "Subscription"];

const buildNumberOptions = (limit: number) =>
  Array.from({ length: limit }, (_, index) => {
    const value = String(index + 1);
    return { value, label: value };
  });

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
  // onBackToSelection,
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
  const { updateSpoilHandler, isLoading: isUpdating } =
    useUpdateSpoilMutation();

  const storedSpoilId = useAuthStore.getState().createdSpoilId;
  const { data: spoilData } = useGetSpoilByIdQuery(storedSpoilId);

  useEffect(() => {
    if (!spoilData) return;

    const mapped = {
      coverImage: spoilData.cover_image_url ?? null,
      title: spoilData.title ?? "",
      category: String(spoilData.category?.id ?? ""),
      institution: spoilData.institution ?? "",
      courseCode: spoilData.course_code ?? "",
      pricing: spoilData.pricing ?? "",
      amount: spoilData.amount ? String(spoilData.amount) : "",
      expiryDate: spoilData.expires_at
        ? String(spoilData.expires_at).split(" ")[0]
        : "",
      moduleCount: spoilData.modules_no ? String(spoilData.modules_no) : "",
      lessonCount: spoilData.lessons_no ? String(spoilData.lessons_no) : "",
      description: spoilData.description ?? "",
      learningOutcome: spoilData.what_to_learn ?? "",
    };

    onChange(mapped);
  }, [spoilData, onChange]);

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
          onChange(values);

          // if we have a stored spoil id, update instead of create
          if (storedSpoilId) {
            try {
              const res = await updateSpoilHandler(
                storedSpoilId,
                values,
                formikHelpers,
              );
              if (!res) return;
              onNext();
            } catch {
              // update handler shows toast
            }
            return;
          }

          // otherwise create a new spoil
          let res: any;
          try {
            res = await createSpoilHandler(values, formikHelpers);
          } catch {
            // createSpoilHandler handles toasts; stay on this step
            return;
          }

          if (!res) return; // request failed, stay on this step

          const createdId =
            res?.data?.id ?? res?.data?.spoil_id ?? res?.data?.data?.id ?? null;

          if (!createdId) return; // no id returned, stay on this step

          if (typeof onCreated === "function") {
            onCreated(Number(createdId));
          }
          onNext();
        }}
      >
        {({ values, handleChange, handleBlur, isValid }) => (
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
                disabled={!isValid || isCreating || isUpdating}
                className="w-full"
              >
                {isCreating || isUpdating ? "Saving..." : "Save and Continue"}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default SpoilBasicsStep;
