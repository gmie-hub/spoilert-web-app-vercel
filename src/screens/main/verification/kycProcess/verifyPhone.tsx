"use client";

import { Form, Formik, FormikHelpers } from "formik";
import { object } from "yup";

import Input from "@spt/components/input";
import StepLayout from "@spt/components/kycLayout";
import Select from "@spt/components/select";
import { useVerifyPhoneMutation } from "@spt/hooks/apiRequests/useVerifyPhoneMutation";
import { validations } from "@spt/utils/validation";

interface FormValues {
  countryCode: string;
  phoneNumber: string;
}

const initialValues: FormValues = {
  countryCode: "+44",
  phoneNumber: "",
};

const validationSchema = object().shape({
  countryCode: validations.countryCode,
  phoneNumber: validations.phoneNumber,
});

const VerifyPhoneNumberStep = ({ onNext }: { onNext: () => void }) => {
  const { sendOtpHandler, isLoading } = useVerifyPhoneMutation();

  const handleSubmit = async (
    values: FormValues,
    actions: FormikHelpers<FormValues>,
  ) => {
    if (isLoading) return;

    try {
      await sendOtpHandler(values, actions);

      localStorage.setItem("countryCode", values.countryCode);
      localStorage.setItem("phoneNumber", values.phoneNumber);

      onNext();
    } finally {
      actions.setSubmitting(false);
    }
  };

  const COUNTRY_OPTIONS = [
    { value: "+44", label: "🇬🇧 +44" },
    { value: "+1", label: "🇺🇸 +1" },
    { value: "+234", label: "🇳🇬 +234" },
  ];

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit} // use wrapper function
    >
      {({ submitForm }) => (
        <Form>
          <StepLayout
            step={2}
            totalSteps={4}
            title="Verify Your Phone Number"
            description="To start creating Spoils we need to verify your phone number. Enter your phone number to get a verification code."
            buttonLabel={isLoading ? "Sending..." : "Send Code"}
            onButtonClick={submitForm}
          >
            <div className="w-full space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Phone Number
              </label>

              {/* Phone input container */}
              <div className="flex items-center rounded-lg border border-gray-200 px-3 py-2 gap-2">
                <Select label="" name="countryCode" options={COUNTRY_OPTIONS} />

                <Input name="phoneNumber" placeholder="901234567" label="" />
              </div>
              {/* <Button type="submit"  className="w-full">
                send
                </Button> */}
            </div>
          </StepLayout>
        </Form>
      )}
    </Formik>
  );
};

export default VerifyPhoneNumberStep;
