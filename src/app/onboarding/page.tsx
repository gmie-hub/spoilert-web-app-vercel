"use client";

import { Suspense } from "react";

import InstitutionAccountSetup from "@spt/screens/institution/onboarding";

const OnboardingPage = () => {
  return (
    <Suspense fallback={null}>
      <InstitutionAccountSetup />
    </Suspense>
  );
};

export default OnboardingPage;
