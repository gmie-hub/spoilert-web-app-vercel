"use client";

import { useRef, useState } from "react";

import { Form, Formik, type FormikHelpers, type FormikProps } from "formik";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as Yup from "yup";

import LogoMark from "@spt/assets/icons/Group(2).svg";
import Button from "@spt/components/button";
import Input from "@spt/components/input";
import Select from "@spt/components/select";
import Stack from "@spt/components/stack";
import { useInstitutionResendCodeMutation } from "@spt/hooks/apiRequests/useInstitutionResendCodeMutation";
import {
  type InstitutionSignupValues,
  useInstitutionSignupMutation,
} from "@spt/hooks/apiRequests/useInstitutionSignupMutation";
import { validations } from "@spt/utils/validation";

import {
  INSTITUTION_COUNTRIES,
  INSTITUTION_TYPES,
  SIGNUP_STEPS,
  STEP_COPY,
  type SignupStep,
} from "./constants";

const childVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

const initialValues: InstitutionSignupValues = {
  fullName: "",
  email: "",
  phone: "",
  password: "",
  institutionName: "",
  website: "",
  institutionType: "",
  country: "",
  studentCount: "",
  primaryFocus: "",
  code: "",
  workspaceName: "",
};

const stepSchemas: Record<Exclude<SignupStep, "success">, Yup.ObjectSchema<any>> =
  {
    account: Yup.object({
      fullName: Yup.string().trim().min(2, "Too short").required("Full name is required"),
      email: validations.email,
      phone: validations.phoneNumber,
      password: validations.password,
    }),
    institution: Yup.object({
      institutionName: Yup.string()
        .trim()
        .required("Institution name is required"),
      website: Yup.string()
        .trim()
        .required("Institution website is required")
        .test("url", "Enter a valid website URL", (value) => {
          if (!value) return false;
          try {
            const url = /^https?:\/\//i.test(value)
              ? value
              : `https://${value}`;
            return Boolean(new URL(url).hostname.includes("."));
          } catch {
            return false;
          }
        }),
      institutionType: Yup.string().required("Select an institution type"),
      country: Yup.string().required("Select a country"),
    }),
    details: Yup.object({
      studentCount: Yup.string()
        .trim()
        .matches(/^\d+$/, "Enter a valid number")
        .required("Student count is required"),
      primaryFocus: Yup.string()
        .trim()
        .required("Primary focus is required"),
    }),
    verify: Yup.object({
      code: Yup.string()
        .length(6, "Enter the 6-digit code")
        .required("Verification code is required"),
    }),
    workspace: Yup.object({
      workspaceName: Yup.string()
        .trim()
        .min(3, "Workspace name is too short")
        .matches(
          /^[a-z0-9-]+$/,
          "Use lowercase letters, numbers and hyphens only",
        )
        .required("Workspace name is required"),
    }),
  };

const slugifyWorkspace = (value: string) =>
  value
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-");

const InstitutionSignup = () => {
  const router = useRouter();
  const [step, setStep] = useState<SignupStep>("account");
  const otpInputs = useRef<(HTMLInputElement | null)[]>([]);
  const { signupHandler, isLoading } = useInstitutionSignupMutation();
  const { resendCodeHandler, isLoading: isResending } =
    useInstitutionResendCodeMutation();

  const goNext = () => {
    const index = SIGNUP_STEPS.indexOf(step);
    const next = SIGNUP_STEPS[index + 1];
    if (next) setStep(next);
  };

  const handleStepSubmit = async (
    values: InstitutionSignupValues,
    helpers: FormikHelpers<InstitutionSignupValues>,
  ) => {
    if (step === "success") return;

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
        helpers.setTouched({ ...helpers.touched, ...touched }, true);
      }
      helpers.setSubmitting(false);
      return;
    }

    if (step === "workspace") {
      await signupHandler(values);
      setStep("success");
      helpers.setSubmitting(false);
      return;
    }

    helpers.setSubmitting(false);
    goNext();
  };

  return (
    <main className="w-full">
      <Formik
        initialValues={initialValues}
        validationSchema={
          step === "success" ? undefined : stepSchemas[step]
        }
        validateOnBlur
        validateOnChange={false}
        onSubmit={handleStepSubmit}
      >
        {(formik) => (
          <Form className="w-full">
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
                    onContinue={() => router.push("/institution/login")}
                  />
                ) : (
                  <StepForm
                    step={step}
                    formik={formik}
                    isLoading={isLoading}
                    isResending={isResending}
                    otpInputs={otpInputs}
                    onResend={() => resendCodeHandler(formik.values.email)}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </Form>
        )}
      </Formik>
    </main>
  );
};

const StepForm = ({
  step,
  formik,
  isLoading,
  isResending,
  otpInputs,
  onResend,
}: {
  step: Exclude<SignupStep, "success">;
  formik: FormikProps<InstitutionSignupValues>;
  isLoading: boolean;
  isResending: boolean;
  otpInputs: React.MutableRefObject<(HTMLInputElement | null)[]>;
  onResend: () => void;
}) => {
  const copy = STEP_COPY[step];

  return (
    <Stack className="w-full space-y-8" spacing="gap-0">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-blue-lightest)]">
        <Image src={LogoMark} alt="Spoylz" width={28} height={20} />
      </div>

      <div className="mt-8 space-y-2">
        <h1 className="text-[28px] font-semibold leading-tight tracking-[-0.03em] text-[#212529] sm:text-[32px]">
          {copy.title}
        </h1>
        <p className="text-sm leading-6 text-[#6B7280] sm:text-[15px]">
          {copy.subtitle}
        </p>
      </div>

      <div className="mt-8 space-y-5">
        {step === "account" && (
          <>
            <Input name="fullName" label="Full Name" placeholder="Full Name" />
            <Input
              name="email"
              type="email"
              label="Email Address"
              placeholder="Email Address"
            />
            <Input
              name="phone"
              label="Phone Number"
              placeholder="Phone Number"
              numericOnly
            />
            <Input
              name="password"
              type="password"
              label="Password"
              placeholder="Password"
            />
          </>
        )}

        {step === "institution" && (
          <>
            <Input
              name="institutionName"
              label="Institution Name"
              placeholder="Institution Name"
            />
            <Input
              name="website"
              label="Institution Website"
              placeholder="https://"
            />
            <Select
              name="institutionType"
              label="Institution Type"
              placeholder="Select institution type"
              options={INSTITUTION_TYPES}
            />
            <Select
              name="country"
              label="Country"
              placeholder="Select country"
              options={INSTITUTION_COUNTRIES}
              searchable
            />
          </>
        )}

        {step === "details" && (
          <>
            <Input
              name="studentCount"
              label="How many students do you have?"
              placeholder="e.g. 500"
              numericOnly
            />
            <Input
              name="primaryFocus"
              label="What is your institution's primary focus?"
              placeholder="e.g. STEM, Business, Arts"
            />
          </>
        )}

        {step === "verify" && (
          <OtpFields formik={formik} otpInputs={otpInputs} />
        )}

        {step === "workspace" && (
          <WorkspaceField
            value={formik.values.workspaceName}
            error={
              formik.touched.workspaceName
                ? formik.errors.workspaceName
                : undefined
            }
            onChange={(value) =>
              formik.setFieldValue("workspaceName", slugifyWorkspace(value))
            }
            onBlur={() => formik.setFieldTouched("workspaceName", true)}
          />
        )}
      </div>

      <Button
        type="submit"
        className="mt-8 w-full rounded-[14px] py-4"
        disabled={formik.isSubmitting || isLoading}
      >
        {isLoading && step === "workspace" ? "Creating account..." : copy.button}
      </Button>

      {step === "verify" ? (
        <p className="mt-6 text-center text-sm text-[#6B7280]">
          Didn&apos;t receive code?{" "}
          <button
            type="button"
            onClick={onResend}
            disabled={isResending || !formik.values.email}
            className="font-medium text-[var(--color-yellow)] hover:underline disabled:opacity-50"
          >
            {isResending ? "Resending..." : "Resend"}
          </button>
        </p>
      ) : (
        <p className="mt-6 text-center text-sm text-[#6B7280]">
          Already have an account?{" "}
          <Link
            href="/institution/login"
            className="font-medium text-[var(--color-yellow)] hover:underline"
          >
            Log In
          </Link>
        </p>
      )}
    </Stack>
  );
};

const OtpFields = ({
  formik,
  otpInputs,
}: {
  formik: FormikProps<InstitutionSignupValues>;
  otpInputs: React.MutableRefObject<(HTMLInputElement | null)[]>;
}) => {
  const code = formik.values.code ?? "";
  const hasError = Boolean(formik.touched.code && formik.errors.code);

  return (
    <div className="space-y-2">
      <div className="flex justify-between gap-2 sm:gap-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <input
            key={index}
            ref={(el) => {
              otpInputs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={code[index] || ""}
            aria-label={`Digit ${index + 1}`}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, "");
              if (!val) return;
              const next = (code.padEnd(6, " ").substring(0, index) + val + code.substring(index + 1))
                .replace(/\s/g, "")
                .slice(0, 6);
              formik.setFieldValue("code", next);
              formik.setFieldTouched("code", true, true);
              if (index < 5) otpInputs.current[index + 1]?.focus();
            }}
            onKeyDown={(e) => {
              if (e.key === "Backspace") {
                e.preventDefault();
                const chars = code.padEnd(6, " ").split("");
                chars[index] = " ";
                formik.setFieldValue("code", chars.join("").replace(/\s/g, ""));
                if (index > 0) otpInputs.current[index - 1]?.focus();
              }
            }}
            onPaste={(e) => {
              e.preventDefault();
              const paste = e.clipboardData
                .getData("Text")
                .replace(/\D/g, "")
                .slice(0, 6);
              if (!paste) return;
              formik.setFieldValue("code", paste);
              formik.setFieldTouched("code", true, true);
              otpInputs.current[Math.min(paste.length, 5)]?.focus();
            }}
            className={`h-12 w-11 rounded-xl border bg-[#FBFBFB] text-center text-lg font-semibold outline-none focus:border-[var(--color-blue)] sm:h-14 sm:w-12 ${
              hasError ? "border-red-500" : "border-gray-200"
            }`}
          />
        ))}
      </div>
      {hasError && (
        <p className="text-xs text-red-500">{formik.errors.code}</p>
      )}
    </div>
  );
};

const WorkspaceField = ({
  value,
  error,
  onChange,
  onBlur,
}: {
  value: string;
  error?: string;
  onChange: (value: string) => void;
  onBlur: () => void;
}) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium text-gray-700">Workspace Name</label>
    <div
      className={`flex h-12 overflow-hidden rounded-lg border ${
        error ? "border-red-500" : "border-gray-200"
      }`}
    >
      <input
        name="workspaceName"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder="your-institution"
        className="h-full min-w-0 flex-1 bg-[#FBFBFB] px-3 text-sm outline-none placeholder:text-gray-400"
      />
      <span className="flex shrink-0 items-center bg-[#F7F8F8] px-3 text-sm text-[#6B7280]">
        .spoylz.com
      </span>
    </div>
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
);

const SuccessStep = ({ onContinue }: { onContinue: () => void }) => (
    <Stack className="w-full text-center" spacing="gap-0" alignItems="center">
    <div className="flex h-[88px] w-[88px] items-center justify-center rounded-full border-[3px] border-[#013B4D] bg-[#E3F5FA]">
      <svg
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M20 6.5L9.5 17L4 11.5"
          stroke="#013B4D"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>

    <h1 className="mt-8 text-[28px] font-semibold tracking-[-0.03em] text-[#212529] sm:text-[32px]">
      Congratulations!
    </h1>
    <p className="mt-3 max-w-[340px] text-sm leading-7 text-[#6B7280] sm:text-[15px]">
      Your institution account has been created successfully.
    </p>

    <Button
      type="button"
      className="mt-8 w-full rounded-[14px] py-4"
      onClick={onContinue}
    >
      Go to Dashboard
    </Button>
  </Stack>
);

export default InstitutionSignup;
