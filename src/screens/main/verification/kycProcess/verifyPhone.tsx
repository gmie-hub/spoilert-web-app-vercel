"use client";

import React, { useMemo } from "react";

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

const validationSchema = object().shape({
  countryCode: validations.countryCode,
  phoneNumber: validations.phoneNumber,
});

interface VerifyPhoneNumberStepProps {
  onNext: () => void;
  onSuccess?: () => void;
}

const VerifyPhoneNumberStep = ({ onNext, onSuccess }: VerifyPhoneNumberStepProps) => {
  const { sendOtpHandler, isLoading } = useVerifyPhoneMutation();

  const initialValues = useMemo<FormValues>(() => {
    try {
      const storedCountry = localStorage.getItem("countryCode");
      const storedPhone = localStorage.getItem("phoneNumber");

      return {
        countryCode: storedCountry ?? "+234",
        phoneNumber: storedPhone ?? "",
      };
    } catch (e) {
      return { countryCode: "+234", phoneNumber: "" };
    }
  }, []);

  const handleSubmit = async (
    values: FormValues,
    actions: FormikHelpers<FormValues>,
  ) => {
    if (isLoading) return;

    try {
      await sendOtpHandler(values, actions);

      localStorage.setItem("countryCode", values.countryCode);
      localStorage.setItem("phoneNumber", values.phoneNumber);

      if (onSuccess) {
        onSuccess();
      } else {
        onNext();
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        error?.message ||
        "Failed to send OTP";

      // If backend indicates phone is already verified, skip to VerifyIdentity
      if (message === "Phone already verified.") {
        onNext();
        return;
      }
    } finally {
      actions.setSubmitting(false);
    }
  };

  const COUNTRY_OPTIONS = [
    { value: "+234", label: "🇳🇬 +234" },

    { value: "+44", label: "🇬🇧 +44" },
    { value: "+1", label: "🇺🇸 +1" },
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
