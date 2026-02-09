"use client";

import { useMemo, useState } from "react";

import Stack from "@mui/material/Stack";
import Image from "next/image";

import AdvancedSpoilIcon from "@spt/assets/icons/advanced-spoil.svg";
import SimpleSpoilIcon from "@spt/assets/icons/simple-spoil.svg";
import Button from "@spt/components/button";
import CustomStepper from "@spt/components/stepper";

import SpoilBasicsStep from "./steps/SpoilBasicsStep";
import SpoilOutlineStep from "./steps/SpoilOutlineStep";
import SpoilReviewStep from "./steps/SpoilReviewStep";

import type { BasicsFormData, OutlineData, SpoilTypeOption } from "./types";

const steps = ["Spoil Basics", "Spoil Outline", "Spoil Review"];

const initialBasicsState: BasicsFormData = {
  coverImage: null,
  title: "",
  category: "",
  institution: "",
  courseCode: "",
  pricing: "",
  amount: "",
  expiryDate: "",
  moduleCount: "",
  lessonCount: "",
  description: "",
  learningOutcome: "",
};

const initialOutlineState: OutlineData = {
  modules: [],
  preQuiz: undefined,
  postQuiz: undefined,
};

const CreateSpoil = () => {
  const [selectedType, setSelectedType] = useState<SpoilTypeOption | null>(
    null,
  );
  const [phase, setPhase] = useState<"selection" | "wizard">("selection");
  const [activeStep, setActiveStep] = useState(0);

  const [basicsData, setBasicsData] =
    useState<BasicsFormData>(initialBasicsState);
  const [outlineData, setOutlineData] =
    useState<OutlineData>(initialOutlineState);

  const spoilTypes = useMemo(
    () => [
      {
        icon: SimpleSpoilIcon,
        title: "Simple Spoil",
        description: "Create a spoil with single lessons",
        value: "simple" as const,
      },
      {
        icon: AdvancedSpoilIcon,
        title: "Advanced Spoil",
        description: "Create a spoil with multiple lessons",
        value: "advanced" as const,
      },
    ],
    [],
  );

  const handleSelect = (value: SpoilTypeOption) => {
    setSelectedType(value);
  };

  const handleSelectionContinue = () => {
    if (!selectedType) {
      return;
    }

    setPhase("wizard");
    setActiveStep(0);
  };

  const handleBackToSelection = () => {
    setPhase("selection");
    setActiveStep(0);
  };

  const resetAll = () => {
    setSelectedType(null);
    setBasicsData(initialBasicsState);
    setOutlineData(initialOutlineState);
    handleBackToSelection();
  };

  const goToNextStep = () =>
    setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
  const goToPreviousStep = () => setActiveStep((prev) => Math.max(prev - 1, 0));

  const handleSubmitSpoil = () => {
    console.log("Spoil payload", {
      type: selectedType,
      basics: basicsData,
      outline: outlineData,
    });

    if (typeof window !== "undefined") {
      window.alert("Spoil submitted for review!");
    }

    resetAll();
  };

  const renderStepContent = () => {
    if (!selectedType) {
      return null;
    }

    switch (activeStep) {
      case 0:
        return (
          <SpoilBasicsStep
            data={basicsData}
            onChange={setBasicsData}
            onNext={goToNextStep}
            selectedType={selectedType}
            onBackToSelection={handleBackToSelection}
          />
        );
      case 1:
        return (
          <SpoilOutlineStep
            data={outlineData}
            onChange={setOutlineData}
            onNext={goToNextStep}
            onPrevious={goToPreviousStep}
          />
        );
      case 2:
        return (
          <SpoilReviewStep
            basics={basicsData}
            outline={outlineData}
            selectedType={selectedType}
            onPrevious={goToPreviousStep}
            onSubmit={handleSubmitSpoil}
          />
        );
      default:
        return null;
    }
  };

  if (phase === "selection") {
    return (
      <Stack
        mr={{ xs: 2, md: 20 }}
        ml={{ xs: 2, md: 10 }}
        my={{ xs: 2, md: 6 }}
        spacing={6}
      >
        <h3 className="text-2xl font-semibold text-black">Create Spoil</h3>

        <Stack alignItems="center">
          <Stack width="fit-content" spacing={4}>
            <Stack alignItems={{ md: "center" }} spacing={{ md: 1 }}>
              <h1 className="text-xl font-semibold text-black md:text-[32px]">
                Choose Spoil Type
              </h1>

              <p className="text-center text-sm md:text-base">
                Select the type of spoil you want to create. Choose the option
                that best fits how detailed you want your spoil to be.
              </p>
            </Stack>

            <Stack direction="row" spacing={{ xs: 2, md: 4 }} width="100%">
              {spoilTypes.map((type) => (
                <Stack
                  key={type.value}
                  spacing={1}
                  flex={{ md: 1 }}
                  width={{ md: "100%" }}
                  onClick={() => handleSelect(type.value)}
                  className={`border rounded-xl p-4 cursor-pointer hover:shadow-lg transition-shadow duration-300 active:border-blue-primary ${
                    selectedType === type.value
                      ? "border-[var(--color-blue)] bg-blue-cool"
                      : "border-gray-lightest"
                  }`}
                >
                  <Image
                    src={type.icon}
                    alt={type.title}
                    width={24}
                    height={24}
                    className="md:h-[40px] md:w-[40px]"
                  />

                  <Stack spacing={1}>
                    <h2 className="text-black font-semibold md:text-xl">
                      {type.title}
                    </h2>
                    <p className="text-xs md:text-base">{type.description}</p>
                  </Stack>
                </Stack>
              ))}
            </Stack>

            <Button disabled={!selectedType} onClick={handleSelectionContinue}>
              Save and Continue
            </Button>
          </Stack>
        </Stack>
      </Stack>
    );
  }

  return (
    <Stack
      mr={{ xs: 2, md: 20 }}
      ml={{ xs: 2, md: 10 }}
      my={{ xs: 2, md: 6 }}
      spacing={4}
    >
      <Stack spacing={1}>
        <p className="text-sm font-medium text-gray-500">
          {selectedType === "advanced" ? "Advanced Spoil" : "Simple Spoil"}
        </p>
        <h3 className="text-2xl font-semibold text-black">
          Create an {selectedType === "advanced" ? "Advanced" : "Simple"} Spoil
        </h3>
      </Stack>

      <Stack direction={{ xs: "column", lg: "row" }} spacing={{ xs: 4, lg: 6 }}>
        <div className="w-full rounded-3xl bg-white p-6 shadow-sm lg:max-w-xs">
          <h4 className="text-xl font-semibold text-gray-900">
            Spoil Progress
          </h4>
          <p className="mt-1 text-sm text-gray-500">
            Track your progress across the three steps.
          </p>

          <div className="mt-6">
            <CustomStepper activeStep={activeStep} steps={steps} />
          </div>
        </div>

        <div className="flex-1">{renderStepContent()}</div>
      </Stack>
    </Stack>
  );
};

export default CreateSpoil;
