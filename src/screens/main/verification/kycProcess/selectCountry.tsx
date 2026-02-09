"use client";

import { Form, Formik, FormikHelpers } from "formik";
import * as Yup from "yup";

import StepLayout from "@spt/components/kycLayout";
import Select from "@spt/components/select";
import { validations } from "@spt/utils/validation";

interface FormValues {
  country: string;
}

const initialValues: FormValues = {
  country: "",
};

const validationSchema = Yup.object({
  country: validations.country,
});

const SelectCountryStep = ({ onNext }: { onNext: () => void }) => {
  const handleSubmit = (
    values: FormValues,
    actions: FormikHelpers<FormValues>,
  ) => {
    // ✅ save selected country
    localStorage.setItem("selectedCountry", values.country);

    actions.setSubmitting(false);

    // move to next step here if you use router or stepper
    onNext();
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
            step={1}
            totalSteps={4}
            title="Select Country"
            description="To begin your verification, select your country"
            buttonLabel="Continue"
            onButtonClick={() =>
              document.querySelector<HTMLFormElement>("form")?.requestSubmit()
            }
          >
            <div className="w-full space-y-2">
              <Select
                name="country"
                label="Country"
                placeholder="Select country"
                options={[
                  { value: "NG", label: "Nigeria" },
                  { value: "GH", label: "Ghana" },
                ]}
              />
            </div>
          </StepLayout>
        </Form>
      )}
    </Formik>
  );
};

export default SelectCountryStep;
