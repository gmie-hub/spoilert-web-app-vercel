"use client";

import { Suspense } from "react";

import InstitutionAccountSetup from "@spt/screens/institution/onboarding";

const InstitutionOnboardingPage = () => {
  return (
    <Suspense fallback={null}>
      <InstitutionAccountSetup />
    </Suspense>
  );
};

export default InstitutionOnboardingPage;
