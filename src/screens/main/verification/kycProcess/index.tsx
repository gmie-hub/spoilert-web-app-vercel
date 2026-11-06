/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useRef, useState } from "react";

import Stack from "@mui/material/Stack";

import { Card, Stepper } from "@spt/components";
import { useGetUserVerificationDetails } from "@spt/hooks/apiRequests/useGetUserVerificationDetailsQuery";
import { useAuthStore } from "@spt/store/authStore";

import AddBankAccountStep from "./addBankAccount";
import BankAccAddedSucessful from "./bankAccAddedSucessful";
import KYCInProgress from "./kycInProgress";
import KYCRejected from "./kycRejected";
import KYCApproved from "./kysApproved";
import PhoneNoVerifySucessful from "./phoneNoVerifySucessful";
import SelectCountryStep from "./selectCountry";
import VerifyIdentity from "./verifyIdentityNIN";
import VerifyPhoneNumberStep from "./verifyPhone";
import VerifyPhoneOtp from "./verifyPhoneOtp";

const KYCProcess = () => {
  const authUser = useAuthStore((state) => state.user);
  const verificationStatus = authUser?.verification_status;
  const { userVerificationDetails, isLoading: isLoadingVerification } =
    useGetUserVerificationDetails(authUser?.id || 0);
  const phoneVerified = Boolean(authUser?.phone_verified_at);

  // All hooks must be called before any return
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set());
  const [showOtp, setShowOtp] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showBankSuccess, setShowBankSuccess] = useState(false);
  const [forceRetry, setForceRetry] = useState(false);
  const hasResumed = useRef(false);

  // Mark all steps as complete when verificationStatus is 0 or 1
  useEffect(() => {
    if (verificationStatus === 0 || verificationStatus === 1) {
      setActiveStep(steps.length);
    }
  }, [verificationStatus]);

  // Country and phone are already done for a phone-verified user, so skip
  // straight to Verify Identity instead of starting the flow over.
  const resumeAtVerifyIdentity = () => {
    // The identity step and its upload pick NIN vs ID from the country chosen
    // on the skipped first step, so fall back to the profile's country.
    try {
      if (!localStorage.getItem("selectedCountry") && authUser?.country) {
        localStorage.setItem("selectedCountry", authUser.country);
      }
    } catch {
      // ignore if localStorage is unavailable
    }
    setForceRetry(false);
    setActiveStep(VERIFY_IDENTITY_STEP);
  };

  useEffect(() => {
    if (hasResumed.current || !phoneVerified || isLoadingVerification) return;
    hasResumed.current = true;
    // Any existing record has its own screen: in progress / approved show
    // their status, and rejected shows the reason first (retry resumes here).
    if (userVerificationDetails?.data?.[0]?.status !== undefined) return;
    resumeAtVerifyIdentity();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phoneVerified, isLoadingVerification, userVerificationDetails]);

  const goToNextStep = () => {
    setActiveStep((prev) => prev + 1);
    setForceRetry(false);
  };

  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };

  const renderStepContent = () => {
    if (showSuccess) {
      return (
        <PhoneNoVerifySucessful
          onContinue={() => {
            setShowSuccess(false);
            goToNextStep();
          }}
        />
      );
    }
    if (showBankSuccess) {
      return <BankAccAddedSucessful onShowKYCInProgress={() => {
        setShowBankSuccess(false);
      }} />;
    }
    if (showOtp) {
      return (
        <VerifyPhoneOtp
          onNext={() => {
            setShowOtp(false);
            setShowSuccess(true);
          }}
        />
      );
    }
    if (forceRetry) return <SelectCountryStep onNext={goToNextStep} userVerificationDetails={userVerificationDetails} />;
    if (verificationStatus === 0) return <KYCInProgress />;
    if (verificationStatus === 1) return <KYCApproved />;
    // Only show the Rejected screen automatically when the user hasn't retried
    // and is still on the initial step. If they've started the flow (activeStep>0)
    // or triggered a retry, let the stepper UI render the appropriate step.
    if (verificationStatus === 2 && !forceRetry && activeStep === 0)
      return (
        <KYCRejected
          userVerificationDetails={userVerificationDetails}
          onRetry={
            phoneVerified
              ? resumeAtVerifyIdentity
              : () => { setActiveStep(0); setForceRetry(true); }
          }
        />
      );

    switch (activeStep + 1) {
      case 1:
        return <SelectCountryStep onNext={goToNextStep} userVerificationDetails={userVerificationDetails} />;
      case 2:
        return (
          <VerifyPhoneNumberStep
            onNext={goToNextStep}
            onSuccess={() => setShowOtp(true)}
            userVerificationDetails={userVerificationDetails}
          />
        );
      case 3:
        return <VerifyIdentity onNext={goToNextStep} userVerificationDetails={userVerificationDetails} />;
      case 4:
        return <AddBankAccountStep onNext={() => setShowBankSuccess(true)}
        
        // userVerificationDetails={userVerificationDetails}
         />;
      default:
        return null;
    }
  };

  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      spacing={{ xs: 2, md: 4 }}
      mr={{ xs: 2, md: 20 }}
      ml={{ xs: 2, md: 10 }}
      my={{ xs: 2, md: 8 }}
    >
      <Stack className="border border-gray-lightest rounded-xl py-4 pl-2 md:pl-4 gap-4">
        <h3 className="text-black text-xl font-medium">
          Verification Progress
        </h3>
        <p>Complete the verification process to start creating Spoylz</p>

        <Stepper
          steps={steps}
          activeStep={activeStep}
          isStepSkipped={isStepSkipped}
        />
      </Stack>

      <Card>{renderStepContent()}</Card>
    </Stack>
  );
};

export default KYCProcess;

const steps = [
  "Select Country",
  "Verify Phone Number",
  "Verify Identity (NIN for Nigerians & government issued ID for other countries)",
  "Add Bank Account",
];

const VERIFY_IDENTITY_STEP = 2;
