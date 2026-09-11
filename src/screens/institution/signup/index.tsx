"use client";

import { useState } from "react";

import { Form, Formik, type FormikHelpers } from "formik";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import * as Yup from "yup";

import { Card } from "@spt/components";
import { validations } from "@spt/utils/validation";

import ReviewStep from "./components/ReviewStep";
import StepForm from "./components/StepForm";
import StepIndicator from "./components/StepIndicator";
import SuccessStep from "./components/SuccessStep";
import { SIGNUP_STEPS, type SignupStep } from "./constants";

import type { InstitutionApplicationValues } from "./types";

const initialValues: InstitutionApplicationValues = {
  institutionName: "",
  institutionType: "",
  country: "",
  state: "",
  city: "",
  institutionAddress: "",
  officialEmail: "",
  phone: "",
  repFullName: "",
  repEmail: "",
  repPhone: "",
  repPosition: "",
};

const stepSchemas: Record<
  Exclude<SignupStep, "review" | "success">,
  Yup.ObjectSchema<any>
> = {
  institution: Yup.object({
    institutionName: Yup.string().trim().required("Institution name is required"),
    institutionType: Yup.string().required("Select an institution type"),
    country: Yup.string().required("Select a country"),
    state: Yup.string().required("Select a state"),
    city: Yup.string().trim().required("City is required"),
    institutionAddress: Yup.string().trim().required("Institution address is required"),
    officialEmail: validations.email,
    phone: validations.phoneNumber,
  }),
  contact: Yup.object({
    repFullName: Yup.string().trim().min(2, "Too short").required("Full name is required"),
    repEmail: validations.email,
    repPhone: validations.phoneNumber,
    repPosition: Yup.string().required("Select a position"),
  }),
};

const childVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

const InstitutionSignup = () => {
  const router = useRouter();
  const [step, setStep] = useState<SignupStep>("institution");

  const goTo = (target: SignupStep) => setStep(target);

  const goNext = () => {
    const index = SIGNUP_STEPS.indexOf(step);
    const next = SIGNUP_STEPS[index + 1];
    if (next) setStep(next);
  };

  const goBack = () => {
    const index = SIGNUP_STEPS.indexOf(step);
    const prev = SIGNUP_STEPS[index - 1];
    if (prev) setStep(prev);
  };

  const handleStepSubmit = async (
    values: InstitutionApplicationValues,
    helpers: FormikHelpers<InstitutionApplicationValues>,
  ) => {
    if (step === "review" || step === "success") return;

    const schema = stepSchemas[step];
    try {
      await schema.validate(values, { abortEarly: false });
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const touched = error.inner.reduce(
          (acc, item) => {
            if (item.path) acc[item.path] = true;
            return acc;
          },
          {} as Record<string, boolean>,
        );
        helpers.setTouched(touched, true);
      }
      helpers.setSubmitting(false);
      return;
    }

    helpers.setSubmitting(false);
    goNext();
  };

  return (
    <main className="w-full bg-white">
      <Formik
        initialValues={initialValues}
        validationSchema={
          step === "review" || step === "success"
            ? undefined
            : stepSchemas[step]
        }
        validateOnBlur
        validateOnChange={false}
        onSubmit={handleStepSubmit}
      >
        {(formik) => (
          <Form className="w-full">
            <Card className="mx-auto my-10 w-full max-w-[648px] rounded-2xl border border-gray-100 bg-white p-8 shadow-[0_18px_50px_rgba(15,23,42,0.06)] sm:p-10 sm:my-14">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  variants={childVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, y: -8, transition: { duration: 0.2 } }}
                >
                  {step === "success" ? (
                    <SuccessStep
                      onContinue={() => router.push("/")}
                      onGotMail={() => router.push("/institution/onboarding")}
                    />
                  ) : (
                    <>
                      <h1 className="text-center text-2xl font-semibold text-[#212529] sm:text-[28px]">
                        Apply as an Institution
                      </h1>

                      <StepIndicator activeStep={step} />

                      {step === "review" ? (
                        <ReviewStep
                          values={formik.values}
                          isSubmitting={formik.isSubmitting}
                          onEdit={goTo}
                          onSubmit={() => {
                            formik.setSubmitting(false);
                            setStep("success");
                          }}
                        />
                      ) : (
                        <StepForm step={step} formik={formik} onBack={goBack} />
                      )}
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
            </Card>
          </Form>
        )}
      </Formik>
    </main>
  );
};

export default InstitutionSignup;
