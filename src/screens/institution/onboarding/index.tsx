"use client";

import { useState } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { SuccessModal } from "@spt/components";

import CompletionStep from "./components/CompletionStep";
import CreatePasswordStep from "./components/CreatePasswordStep";
import OtpStep from "./components/OtpStep";
import Overview, { type OnboardingStepInfo } from "./components/Overview";

type OnboardingView =
  | "overview"
  | "create-password"
  | "verify-phone"
  | "complete";

type SuccessModalKind = "password" | "phone" | null;

const INITIAL_STEPS: OnboardingStepInfo[] = [
  {
    title: "Institution Profile",
    description: "Basic information and representative details",
    status: "done",
  },
  {
    title: "Create Password",
    description: "Create your log in password and verify your phone number",
    status: "active",
  },
];

const InstitutionAccountSetup = ({
  institutionName = "University of Lagos",
  institutionEmail = "adetounoshikoya@gmail.com",
  institutionPhone = "09012345678",
  institutionCountryCode = "234",
}: {
  institutionName?: string;
  institutionEmail?: string;
  institutionPhone?: string;
  institutionCountryCode?: string;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [view, setView] = useState<OnboardingView>("overview");
  const [modal, setModal] = useState<SuccessModalKind>(null);
  const [steps, setSteps] = useState<OnboardingStepInfo[]>(INITIAL_STEPS);

  const renderView = () => {
    switch (view) {
      case "create-password":
        return (
          <CreatePasswordStep
            institutionName={institutionName}
            institutionEmail={institutionEmail}
            token={token}
            onSuccess={() => setModal("password")}
          />
        );
      case "verify-phone":
        return (
          <OtpStep
            title="Verify Your Phone Number"
            description={`We've sent a 6-digit code to ${institutionPhone}. Enter it below to verify your phone number.`}
            countryCode={institutionCountryCode}
            phoneNumber={institutionPhone.replace(/^0/, "")}
            onSubmit={() => setModal("phone")}
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
            onContinue={() => setView("create-password")}
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
            setView("verify-phone");
          }}
        />
      )}

      {modal === "phone" && (
        <SuccessModal
          title="Phone Number Verified Successfully 🎉"
          description="Your phone number has been verified. Your institution account set-up is complete."
          buttonLabel="Complete Account Set-Up"
          onContinue={() => {
            setModal(null);
            setSteps((prev) =>
              prev.map((step) =>
                step.title === "Create Password" ? { ...step, status: "done" } : step,
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
