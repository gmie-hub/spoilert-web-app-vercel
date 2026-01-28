"use client";

import { useState } from "react";

import { Form, Formik, FormikHelpers } from "formik";
import * as Yup from "yup";

import CustomUpload from "@spt/components/customUpload";
import Input from "@spt/components/input";
import StepLayout from "@spt/components/kycLayout";

interface FormValues {
  nin: string;
  ninImage: File | null;
}

const initialValues: FormValues = {
  nin: "",
  ninImage: null,
};

const validationSchema = Yup.object({
  nin: Yup.string()
    .length(11, "NIN must be 11 digits")
    .required("NIN is required"),
  ninImage: Yup.mixed().required("NIN image is required"),
});

const VerifyIdentity = () => {
  const [showWhy, setShowWhy] = useState(false);
  const handleSubmit = (
    values: FormValues,
    actions: FormikHelpers<FormValues>,
  ) => {
    actions.setSubmitting(false);
    // proceed to next step
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {() => (
        <Form>
          <StepLayout
            step={3}
            totalSteps={4}
            title="Verify Your NIN"
            buttonLabel="Verify"
            onButtonClick={() => {
              document.querySelector<HTMLFormElement>("form")?.requestSubmit();
            }}
          >
            <div className="w-full space-y-5">
              {/* NIN INPUT */}
              <Input name="nin" label="NIN Number" placeholder="NIN number" />

              <CustomUpload
                name="profileImage"
                placeholder="Upload Image"
                label="Upload a photo of your NIN"
              />
              <div className="w-full bg-[#E0F4FD]  rounded-lg">
                <button
                  type="button"
                  onClick={() => setShowWhy((prev) => !prev)}
                  className="flex w-full items-center justify-between rounded-lg  px-4 py-3 text-sm text-blue-700"
                >
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full border border-[var(--color-blue-dark)] text-[var(--color-blue-dark)] text-xs font-bold">
                      i
                    </span>
                    <span className="text-[#212529]">Why we need your NIN</span>
                  </div>

                  <span
                    className={`transition-transform ${
                      showWhy ? "rotate-180" : ""
                    }`}
                  >
                    ⌃
                  </span>
                </button>

                {showWhy && (
                  <div className="rounded-b-lg px-4 pb-4 pt-2 text-sm  text-[#495057] ">
                    We need your NIN to verify your identity and ensure the
                    security of your account. Be rest assured that we do not
                    have access to your bank details.
                  </div>
                )}
              </div>
            </div>
          </StepLayout>
        </Form>
      )}
    </Formik>
  );
};

export default VerifyIdentity;
