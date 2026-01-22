/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";

import Stack from "@mui/material/Stack";

import { Card, Stepper } from "@spt/components";

import SelectCountryStep from "./selectCountry";


const KYCProcess = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set());

  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };

  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      spacing={{ xs: 2, md: 4 }}
      mr={{ xs: 2, md: 20 }}
      ml={{ xs: 2, md: 4 }}
    >
      <div className="border border-gray-lightest">
        <Stepper
          steps={steps}
          activeStep={activeStep}
          isStepSkipped={isStepSkipped}
        />
      </div>

      <Card>
        <SelectCountryStep />
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
