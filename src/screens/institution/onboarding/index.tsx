"use client";

import { useState } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { SuccessModal } from "@spt/components";

import CompletionStep from "./components/CompletionStep";
import CreatePasswordStep from "./components/CreatePasswordStep";
import Overview, { type OnboardingStepInfo } from "./components/Overview";

type OnboardingView = "overview" | "create-password" | "complete";

const INITIAL_STEPS: OnboardingStepInfo[] = [
  {
    title: "Institution Profile",
    description: "Basic information and representative details",
    status: "done",
  },
  {
    title: "Create Password",
    description: "Create your log in password",
    status: "active",
  },
];

const InstitutionAccountSetup = ({
  institutionName = "University of Lagos",
}: {
  institutionName?: string;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  // Comes from the onboarding link, e.g. /onboarding?token=...&email=name%40domain.com
  const email = searchParams.get("email") || "";
  const [view, setView] = useState<OnboardingView>("overview");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [steps, setSteps] = useState<OnboardingStepInfo[]>(INITIAL_STEPS);

  const renderView = () => {
    switch (view) {
      case "create-password":
        return (
          <CreatePasswordStep
            institutionName={institutionName}
            institutionEmail={email}
            token={token}
            onSuccess={() => setShowPasswordModal(true)}
          />
        );
      case "complete":
        return (
          <CompletionStep
            steps={steps}
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

      {showPasswordModal && (
        <SuccessModal
          title="Password Created Successfully 🎉"
          description="You can now log in with your email and the password you just created"
          buttonLabel="Complete Account Set-Up"
          onContinue={() => {
            setShowPasswordModal(false);
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
