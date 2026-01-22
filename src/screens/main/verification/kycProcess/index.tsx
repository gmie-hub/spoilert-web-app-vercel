"use client";

import { useState } from "react";

import Stack from "@mui/material/Stack";

import { Card, Stepper } from "@spt/components";

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
      ms={{ xs: 2, md: 6 }}
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

      <Card></Card>
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
