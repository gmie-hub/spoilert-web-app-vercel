/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";

import Stack from "@mui/material/Stack";

import { Card, Stepper } from "@spt/components";

// import SelectCountryStep from "./selectCountry";
import VerificationProgress from "./verificationProgress";

const KYCProcess = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [skipped, setSkipped] = useState(new Set());

  const isStepSkipped = (step: number) => {
    return skipped.has(step);
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
        <h3 className="text-black text-xl font-medium">Verification Progress</h3>
        <p>Complete the verification process to start creating spoils</p>

        <Stepper
          steps={steps}
          activeStep={activeStep}
          isStepSkipped={isStepSkipped}
        />
      </Stack>

      <Card>
        <VerificationProgress />
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
