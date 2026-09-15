"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { SuccessModal } from "@spt/components";

import AddBankAccountStep, { type BankDetails } from "./components/AddBankAccountStep";
import CompletionStep from "./components/CompletionStep";
import ConfirmBankAccount from "./components/ConfirmBankAccount";
import CreatePasswordStep from "./components/CreatePasswordStep";
import OtpStep from "./components/OtpStep";
import Overview, { type OnboardingStepInfo } from "./components/Overview";

type OnboardingView =
  | "overview"
  | "create-password"
  | "verify-email"
  | "verify-phone"
  | "add-bank"
  | "confirm-bank"
  | "complete";

type SuccessModalKind = "password" | "email" | "phone" | "bank" | null;

const INITIAL_STEPS: OnboardingStepInfo[] = [
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

const InstitutionAccountSetup = ({
  institutionName = "University of Lagos",
  institutionEmail = "adetounoshikoya@gmail.com",
  institutionPhone = "09012345678",
}: {
  institutionName?: string;
  institutionEmail?: string;
  institutionPhone?: string;
}) => {
  const router = useRouter();
  const [view, setView] = useState<OnboardingView>("overview");
  const [modal, setModal] = useState<SuccessModalKind>(null);
  const [steps, setSteps] = useState<OnboardingStepInfo[]>(INITIAL_STEPS);
  const [, setBankDetails] = useState<BankDetails | null>(null);

  const activeStepTitle = steps.find((step) => step.status === "active")?.title;

  const renderView = () => {
    switch (view) {
      case "create-password":
        return (
          <CreatePasswordStep
            institutionName={institutionName}
            institutionEmail={institutionEmail}
            onSuccess={() => setModal("password")}
          />
        );
      case "verify-email":
        return (
          <OtpStep
            title="Verify Your Email"
            description={`We've sent a 6-digit code to ${institutionEmail}. Enter it below to verify your email.`}
            onSubmit={() => setModal("email")}
          />
        );
      case "verify-phone":
        return (
          <OtpStep
            title="Verify Your Phone Number"
            description={`We've sent a 6-digit code to ${institutionPhone}. Enter it below to verify your phone number.`}
            onSubmit={() => setModal("phone")}
          />
        );
      case "add-bank":
        return (
          <AddBankAccountStep
            onNext={(details) => {
              setBankDetails(details);
              setView("confirm-bank");
            }}
          />
        );
      case "confirm-bank":
        return (
          <ConfirmBankAccount
            isSaving={false}
            onBack={() => setView("add-bank")}
            onConfirm={() => setModal("bank")}
          />
        );
      case "complete":
        return (
          <CompletionStep
            onLogin={() => router.push("/institution/login")}
            onBackHome={() => router.push("/")}
          />
        );
      case "overview":
      default:
        return (
          <Overview
            institutionName={institutionName}
            steps={steps}
            onContinue={() =>
              setView(activeStepTitle === "Add Bank Account" ? "add-bank" : "create-password")
            }
          />
        );
    }
  };

  return (
    <>
      {renderView()}

      {modal === "password" && (
        <SuccessModal
          title="Password Created Successfully 🎉"
          description="You can now log in with your email and the password you just created"
          onContinue={() => {
            setModal(null);
            setView("verify-email");
          }}
        />
      )}

      {modal === "email" && (
        <SuccessModal
          title="Email Verified Successfully 🎉"
          description="Your email address has been verified. Let's verify your phone number next."
          onContinue={() => {
            setModal(null);
            setView("verify-phone");
          }}
        />
      )}

      {modal === "phone" && (
        <SuccessModal
          title="Phone Number Verified Successfully 🎉"
          description="Your phone number has been verified. Next, add a bank account to receive your institution earnings."
          onContinue={() => {
            setModal(null);
            setSteps((prev) =>
              prev.map((step) => {
                if (step.title === "Create Password") return { ...step, status: "done" };
                if (step.title === "Add Bank Account") return { ...step, status: "active" };
                return step;
              }),
            );
            setView("overview");
          }}
        />
      )}

      {modal === "bank" && (
        <SuccessModal
          title="Bank Account Added Successfully 🎉"
          description="Your institution bank account has been added successfully."
          buttonLabel="Complete Account Set-Up"
          onContinue={() => {
            setModal(null);
            setSteps((prev) =>
              prev.map((step) =>
                step.title === "Add Bank Account" ? { ...step, status: "done" } : step,
              ),
            );
            setView("complete");
          }}
        />
      )}
    </>
  );
};

export default InstitutionAccountSetup;
