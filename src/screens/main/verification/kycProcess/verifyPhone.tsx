"use client";

import { Form, Formik, FormikHelpers } from "formik";
import * as Yup from "yup";

import Input from "@spt/components/input";
import StepLayout from "@spt/components/kycLayout";
import Select from "@spt/components/select";

interface FormValues {
  countryCode: string;
  phoneNumber: string;
}

const initialValues: FormValues = {
  countryCode: "+44",
  phoneNumber: "",
};

const validationSchema = Yup.object().shape({
  countryCode: Yup.string().required(),
  phoneNumber: Yup.string()
    .matches(/^\d+$/, "Phone number must contain only digits")
    .min(7, "Phone number is too short")
    .required("Phone number is required"),
});

const VerifyPhoneNumberStep = () => {
  const handleSubmit = (
    values: FormValues,
    actions: FormikHelpers<FormValues>,
  ) => {
    const fullPhoneNumber = `${values.countryCode}${values.phoneNumber}`;
    console.log("Sending code to:", fullPhoneNumber);
    actions.setSubmitting(false);
  };

  const COUNTRY_OPTIONS = [
    { value: "+44", label: "+44" },
    { value: "+1", label: "+1" },
    { value: "+234", label: "+234" },
  ];
  const COUNTRY_FLAG: Record<string, string> = {
    "+44": "🇬🇧",
    "+1": "🇺🇸",
    "+234": "🇳🇬",
  };
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ submitForm }) => (
        <Form>
          <StepLayout
            step={2}
            totalSteps={4}
            title="Verify Your Phone Number"
            description="To start creating Spoils we need to verify your phone number. Enter your phone number to get a verification code."
            buttonLabel="Send Code"
            onButtonClick={submitForm}
          >
            <div className="w-full space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Phone Number
              </label>

              {/* Phone input container */}
              <div className="flex items-center rounded-lg border border-gray-200 px-3 py-2 gap-2">
                <Select
                  label=""
                  name="countryCode"
                  options={[
                    { value: "+44", label: "🇬🇧 +44" },
                    { value: "+1", label: "🇺🇸 +1" },
                    { value: "+234", label: "🇳🇬 +234" },
                  ]}

                  // className="w-[90px]"
                />

                <Input
                  name="phoneNumber"
                  placeholder="901234567"
                  label=""
                  // className="border-0 p-0 focus:ring-0"
                />
              </div>
            </div>
          </StepLayout>
        </Form>
      )}
    </Formik>
  );
};

export default VerifyPhoneNumberStep;
