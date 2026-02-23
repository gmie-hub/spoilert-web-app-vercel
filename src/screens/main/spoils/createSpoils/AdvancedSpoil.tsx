"use client";

import { useEffect, useState } from "react";

import Stack from "@mui/material/Stack";
import { useRouter } from "next/navigation";

import CustomStepper from "@spt/components/stepper";
import useCreateSpoilMutation from "@spt/hooks/apiRequests/useCreateSpoilMutation";
import { useAuthStore } from "@spt/store/authStore";

import SpoilBasicsStep from "./steps/SpoilBasicsStep";
import SpoilOutlineStep from "./steps/SpoilOutlineStep";
import SpoilReviewStep from "./steps/SpoilReviewStep";

import type { BasicsFormData, OutlineData } from "./types";

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

const STEP_KEY = "advanced-spoil-step";

const AdvancedSpoil = () => {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(
    () => {
    if (typeof window === "undefined") return 0;
    const saved = sessionStorage.getItem(STEP_KEY);
    return saved ? Number(saved) : 0;
  });

  useEffect(() => {
    sessionStorage.setItem(STEP_KEY, String(activeStep));
  }, [activeStep]);

  const [basicsData, setBasicsData] =
    useState<BasicsFormData>(initialBasicsState);
  const [outlineData, setOutlineData] =
    useState<OutlineData>(initialOutlineState);
  const [createdSpoilId, setCreatedSpoilId] = useState<number | null>(null);

  const { createSpoilHandler } = useCreateSpoilMutation();
  const setCreatedSpoilIdInStore = useAuthStore((s) => s.setCreatedSpoilId);

  const goToNextStep = () =>
    setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
  const goToPreviousStep = () =>
    setActiveStep((prev) => Math.max(prev - 1, 0));

  const handleBackToSelection = () => {
    router.push("/create-spoils");
  };

  const resetAll = () => {
    setBasicsData(initialBasicsState);
    setOutlineData(initialOutlineState);
    setCreatedSpoilId(null);
    setActiveStep(0);
    sessionStorage.removeItem(STEP_KEY);
    router.push("/create-spoils");
  };

  const handleSubmitSpoil = async () => {
    if (createdSpoilId) {
      resetAll();
      return;
    }

    try {
      const res = await createSpoilHandler(basicsData, {});
      const createdId =
        res?.data?.id ?? res?.data?.spoil_id ?? res?.data?.data?.id ?? null;

      if (createdId) {
        setCreatedSpoilId(Number(createdId));
        setOutlineData(
          (prev) => ({ ...prev, spoil_id: createdId } as OutlineData),
        );
        setCreatedSpoilIdInStore?.(Number(createdId));
      }
    } catch {
      // createSpoilHandler shows toast
    } finally {
      resetAll();
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <SpoilBasicsStep
            data={basicsData}
            onChange={setBasicsData}
            onNext={goToNextStep}
            selectedType="advanced"
            onBackToSelection={handleBackToSelection}
            onCreated={(id: number) => {
              setCreatedSpoilId(id);
              setOutlineData(
                (prev) => ({ ...prev, spoil_id: id } as OutlineData),
              );
              setCreatedSpoilIdInStore?.(id);
            }}
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
            selectedType="advanced"
            onPrevious={goToPreviousStep}
            onSubmit={handleSubmitSpoil}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Stack
      mr={{ xs: 2, md: 20 }}
      ml={{ xs: 2, md: 10 }}
      my={{ xs: 2, md: 6 }}
      spacing={4}
    >
      <Stack spacing={1}>
        <p className="text-sm font-medium text-gray-500">Advanced Spoil</p>
        <h3 className="text-2xl font-semibold text-black">
          Create an Advanced Spoil
        </h3>
      </Stack>

      <Stack
        direction={{ xs: "column", lg: "row" }}
        spacing={{ xs: 4, lg: 6 }}
      >
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

export default AdvancedSpoil;
