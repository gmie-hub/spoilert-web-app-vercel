/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";

import Stack from "@mui/material/Stack";

import { Card, Stepper } from "@spt/components";
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

  // All hooks must be called before any return
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set());
  const [showOtp, setShowOtp] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showBankSuccess, setShowBankSuccess] = useState(false);

  const goToNextStep = () => {
    setActiveStep((prev) => prev + 1);
  };

  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };

  const renderStepContent = () => {
    if (showSuccess) {
      return <PhoneNoVerifySucessful onContinue={() => {
        setShowSuccess(false);
        goToNextStep();
      }} />;
    }
    if (showBankSuccess) {
      return <BankAccAddedSucessful />;
    }
    if (showOtp) {
      return <VerifyPhoneOtp onNext={() => {
        setShowOtp(false);
        setShowSuccess(true);
      }} />;
    }
    if (verificationStatus === 0) return <KYCInProgress />;
    if (verificationStatus === 1) return <KYCRejected />;
    if (verificationStatus === 2) return <KYCApproved />;
    switch (activeStep + 1) {
      case 1:
        return <SelectCountryStep onNext={goToNextStep} />;
      case 2:
        return (
          <VerifyPhoneNumberStep onNext={goToNextStep} onSuccess={() => setShowOtp(true)} />
        );
      case 3:
        return (
          <VerifyIdentity onNext={goToNextStep} />
        );
      case 4:
        return (
          <AddBankAccountStep onNext={() => setShowBankSuccess(true)} />
        );
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
        <p>Complete the verification process to start creating spoils</p>

        <Stepper
          steps={steps}
          activeStep={activeStep}
          isStepSkipped={isStepSkipped}
        />
      </Stack>

      <Card>
        {renderStepContent()}
      </Card>
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
