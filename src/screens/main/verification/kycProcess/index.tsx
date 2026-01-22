import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { useState } from "react";

const KYCProcess = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set());

  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };

  return (
    <Stack>
      <Box border="1px solid #EFEFEF">
        
      </Box>
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
