"use client";

import type { FC } from "react";

import { Form, Formik } from "formik";
import * as yup from "yup";

import Button from "@spt/components/button";
import Input from "@spt/components/input";
import Select from "@spt/components/select";

import UploadSpoilImage from "../components/UploadSpoilImage";

import type { BasicsFormData, SpoilTypeOption } from "../types";

interface SpoilBasicsStepProps {
  data: BasicsFormData;
  onChange: (value: BasicsFormData) => void;
  onNext: () => void;
  onBackToSelection: () => void;
  selectedType: SpoilTypeOption;
}

const categories = [
  "Product Design",
  "Marketing",
  "Software Engineering",
  "Finance",
];

const pricingModels = ["Free", "Paid", "Subscription"];

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

const basicsValidationSchema = yup.object({
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
  coverImage: yup.mixed().nullable(),
});

const SpoilBasicsStep: FC<SpoilBasicsStepProps> = ({
  data,
  onChange,
  onNext,
  onBackToSelection,
}) => {
  return (
    <div className="rounded-3xl bg-white p-8 shadow-sm">
      <h2 className="mt-2 text-xl font-semibold text-black">Spoil Basics</h2>
      <p className="mt-3">
        Start by providing basic information about your spoil.
      </p>

      <Formik<BasicsFormData>
        initialValues={data}
        enableReinitialize
        validationSchema={basicsValidationSchema}
        onSubmit={(values) => {
          onChange(values);
          onNext();
        }}
      >
        {({ values, handleChange, handleBlur, isSubmitting, isValid }) => (
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
                options={categoryOptions}
                hasAsterisk
              />

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
                type="button"
                variant="outline"
                onClick={onBackToSelection}
              >
                Back
              </Button>

              <Button
                type="submit"
                disabled={!isValid || isSubmitting}
                className="w-full"
              >
                Save and Continue
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default SpoilBasicsStep;
