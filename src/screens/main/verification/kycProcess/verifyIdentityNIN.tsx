
"use client";

import { useEffect, useState } from "react";

import { Form, Formik, FormikHelpers } from "formik";
import * as Yup from "yup";

import CustomUpload from "@spt/components/customUpload";
// import Input from "@spt/components/input";
import StepLayout from "@spt/components/kycLayout";
import { useVerifyIdentityMutation } from "@spt/hooks/apiRequests/useVerifyIdentityMutation";

interface FormValues {
  nin: string;
  docImage: File | null; // 👈 single upload field
}

const initialValues: FormValues = {
  nin: "",
  docImage: null,
};

const buildValidation = (isNigeria: boolean, hasExistingDocument: boolean) =>
  Yup.object({
    // nin: isNigeria
    //   ? Yup.string()
    //       .length(11, "NIN must be 11 digits")
    //       .required("NIN is required")
    //   : Yup.string().notRequired(),

    docImage: hasExistingDocument
      ? Yup.mixed().notRequired()
      : Yup.mixed().required(
          isNigeria ? "NIN image is required" : "ID image is required"
        ),
  });

const VerifyIdentity = ({ onNext, userVerificationDetails }: { onNext: () => void; userVerificationDetails?: any }) => {
  const { verifyIdentityHandler, isLoading } =
    useVerifyIdentityMutation();

  const [isNigeria, setIsNigeria] = useState(false);

  useEffect(() => {
    const country = localStorage.getItem("selectedCountry");
    setIsNigeria(country === "NG");
  }, []);

  const handleSubmit = async (
    values: FormValues,
    actions: FormikHelpers<FormValues>
  ) => {
    // If user did not upload a new document but an existing verification
    // (with a URL) exists, skip calling the endpoint and go to next.
    if (!values.docImage) {
      if (userVerificationDetails?.data?.[0]?.url) {
        actions.setSubmitting(false);
        onNext();
        return;
      }

      return;
    }

    // ✅ endpoint auto handles NG vs others internally
    try {
      await verifyIdentityHandler({ image: values.docImage }, actions.setSubmitting);
      onNext();
    } catch (error: any) {
      const message =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        error?.message ||
        "";

      // If verification of NIN already exists, proceed to bank account step
      if (
        message === "Verification of type nin already exists for this user."
      ) {
        onNext();
      }
      // other errors are already handled/toasted in the hook
    }
  };
  
  const hasExistingDocument = Boolean(userVerificationDetails?.data?.[0]?.url);

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={buildValidation(isNigeria, hasExistingDocument)}
      onSubmit={handleSubmit}
    >
      {() => (
        <Form>
          <StepLayout
            step={3}
            totalSteps={4}
            title="Verify Your Identity"
            buttonLabel={isLoading ? "Verifying..." : "Verify"}
            onButtonClick={() =>
              document
                .querySelector<HTMLFormElement>("form")
                ?.requestSubmit()
            }
          >
            <div className="space-y-5">

                {/* Existing verification info (if any) */}
                {userVerificationDetails?.data?.[0] && (
                  <div className="rounded-md bg-gray-50 border border-gray-200 p-3 text-sm">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Existing verification:</span>{" "}
                      {userVerificationDetails?.data?.[0]?.type ?? "-"}
                    </p>
                    {userVerificationDetails?.data?.[0]?.url && (
                      <p className="mt-2">
                        <a
                          href={userVerificationDetails?.data?.[0]?.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 underline"
                        >
                          View submitted document
                        </a>
                      </p>
                    )}
                  </div>
                )}

              {/* 🇳🇬 ONLY SHOW NIN INPUT FOR NIGERIA */}
              {/* {isNigeria && (
                <Input
                  name="nin"
                  label="NIN Number"
                  placeholder="Enter your NIN"
                />
              )} */}

              {/* 📸 ONE UPLOAD FIELD FOR BOTH FLOWS */}
              <CustomUpload
                name="docImage"
                label={
                  isNigeria
                    ? "Upload your NIN slip"
                    : "Upload government issued ID"
                }
                placeholder="Upload Image"
              />

            </div>
          </StepLayout>
        </Form>
      )}
    </Formik>
  );
};

export default VerifyIdentity;
