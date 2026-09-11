"use client";

import { useState } from "react";

import { Form, Formik } from "formik";
import * as Yup from "yup";

import { Card } from "@spt/components";
import Button from "@spt/components/button";
import Input from "@spt/components/input";
import { validations } from "@spt/utils/validation";

interface OnboardingStep {
  title: string;
  description: string;
  status: "done" | "active" | "pending";
}

const STEPS: OnboardingStep[] = [
  {
    title: "Institution Profile",
    description: "Basic information and representative details",
    status: "done",
  },
  {
    title: "Create Password",
    description: "Create your log in password, verify your email and phone number",
    status: "active",
  },
  {
    title: "Add Bank Account",
    description: "Required to receive your institution earnings",
    status: "pending",
  },
];

const activeIndex = STEPS.findIndex((step) => step.status === "active");
const progress = ((activeIndex + 1) / STEPS.length) * 100;

const passwordSchema = Yup.object({
  password: validations.password,
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords do not match")
    .required("Please re-enter your password"),
});

type OnboardingView = "overview" | "create-password";

const InstitutionAccountSetup = ({
  institutionName = "University of Lagos",
  institutionEmail = "adetounoshikoya@gmail.com",
}: {
  institutionName?: string;
  institutionEmail?: string;
}) => {
  const [view, setView] = useState<OnboardingView>("overview");

  if (view === "create-password") {
    return (
      <CreatePasswordStep
        institutionName={institutionName}
        institutionEmail={institutionEmail}
      />
    );
  }

  return (
    <OverviewStep onContinue={() => setView("create-password")} institutionName={institutionName} />
  );
};

const OverviewStep = ({
  onContinue,
  institutionName,
}: {
  onContinue: () => void;
  institutionName: string;
}) => (
  <main className="w-full bg-white">
    <Card className="mx-auto my-10 w-full max-w-[648px] rounded-2xl border border-gray-100 bg-white p-8 shadow-[0_18px_50px_rgba(15,23,42,0.06)] sm:p-10 sm:my-14">
      <h1 className="text-2xl font-semibold text-[#212529] sm:text-[28px]">
        Complete Your Institution Account Set Up
      </h1>
      <p className="mt-1 text-sm text-[#6B7280]">{institutionName}</p>

      <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full rounded-full bg-[var(--color-green)] transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mt-6 space-y-3">
        {STEPS.map((step, index) => (
          <StepRow key={step.title} step={step} index={index} />
        ))}
      </div>

      <Button type="button" className="mt-8 w-full" onClick={onContinue}>
        Continue
      </Button>
    </Card>
  </main>
);

const StepRow = ({ step, index }: { step: OnboardingStep; index: number }) => {
  const isActive = step.status === "active";
  const isDone = step.status === "done";

  return (
    <div
      className={`flex items-start gap-3 rounded-xl border p-4 ${
        isActive
          ? "border-[var(--color-blue-lightest)] bg-[var(--color-blue-lightest)]"
          : "border-gray-100 bg-white"
      }`}
    >
      <span
        className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
          isDone
            ? "bg-[var(--color-yellow)] text-white"
            : isActive
              ? "bg-[var(--color-blue)] text-white"
              : "bg-gray-100 text-gray-400"
        }`}
      >
        {isDone ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M20 6.5L9.5 17L4 11.5"
              stroke="white"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          index + 1
        )}
      </span>
      <div>
        <p
          className={`text-sm font-semibold ${
            isActive || isDone ? "text-[#212529]" : "text-gray-400"
          }`}
        >
          {step.title}
        </p>
        <p className={`text-sm ${isActive ? "text-[#6B7280]" : "text-gray-400"}`}>
          {step.description}
        </p>
      </div>
    </div>
  );
};

const CreatePasswordStep = ({
  institutionName,
  institutionEmail,
}: {
  institutionName: string;
  institutionEmail: string;
}) => (
  <main className="w-full bg-white">
    <Card className="mx-auto my-10 w-full max-w-[648px] rounded-2xl border border-gray-100 bg-white p-8 shadow-[0_18px_50px_rgba(15,23,42,0.06)] sm:p-10 sm:my-14">
      <h1 className="text-center text-2xl font-semibold text-[#212529] sm:text-[28px]">
        Create a Password
      </h1>
      <p className="mx-auto mt-2 max-w-[420px] text-center text-sm text-[#6B7280]">
        Create your log in password to access the {institutionName} institution
        account.
      </p>

      <Formik
        initialValues={{
          email: institutionEmail,
          password: "",
          confirmPassword: "",
        }}
        validationSchema={passwordSchema}
        validateOnBlur
        validateOnChange={false}
        onSubmit={(_values, actions) => {
          actions.setSubmitting(false);
        }}
      >
        {({ isValid, isSubmitting }) => (
          <Form className="mt-8 space-y-5">
            <Input name="email" label="Email Address" disabled />
            <Input
              name="password"
              type="password"
              label="Password"
              placeholder="Create your password"
            />
            <Input
              name="confirmPassword"
              type="password"
              label="Confirm Password"
              placeholder="Re-enter your password"
            />

            <Button
              type="submit"
              className="w-full"
              disabled={!isValid || isSubmitting}
            >
              Continue
            </Button>
          </Form>
        )}
      </Formik>
    </Card>
  </main>
);

export default InstitutionAccountSetup;
