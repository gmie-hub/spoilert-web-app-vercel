"use client";

import { useEffect, useState } from "react";

import Stack from "@mui/material/Stack";
import { useRouter } from "next/navigation";

import useCreateSpoilMutation from "@spt/hooks/apiRequests/useCreateSpoilMutation";
import { useAuthStore } from "@spt/store/authStore";

import SpoilBasicsStep from "./steps/SpoilBasicsStep";
import SpoilReviewStep from "./steps/SpoilReviewStep";

import type { BasicsFormData, OutlineData } from "./types";

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

const emptyOutline: OutlineData = {
  modules: [],
  preQuiz: undefined,
  postQuiz: undefined,
};

const STEP_KEY = "simple-spoil-step";

const SimpleSpoil = () => {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState<"basics" | "review">(() => {
    if (typeof window === "undefined") return "basics";
    const saved = sessionStorage.getItem(STEP_KEY);
    return saved === "review" ? "review" : "basics";
  });

  useEffect(() => {
    sessionStorage.setItem(STEP_KEY, activeStep);
  }, [activeStep]);

  const [basicsData, setBasicsData] =
    useState<BasicsFormData>(initialBasicsState);
  const [createdSpoilId, setCreatedSpoilId] = useState<number | null>(null);

  const { createSpoilHandler } = useCreateSpoilMutation();
  const setCreatedSpoilIdInStore = useAuthStore((s) => s.setCreatedSpoilId);

  const handleBackToSelection = () => {
    router.push("/create-spoils");
  };

  const resetAll = () => {
    setBasicsData(initialBasicsState);
    setCreatedSpoilId(null);
    setActiveStep("basics");
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
        setCreatedSpoilIdInStore?.(Number(createdId));
      }
    } catch {
      // createSpoilHandler shows toast
    } finally {
      resetAll();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-2 sm:px-4">
      <Stack
        mr={{ xs: 0, md: 20 }}
        ml={{ xs: 0, md: 10 }}
        my={{ xs: 2, md: 6 }}
        spacing={4}
        sx={{ width: '100%' }}
      >
        <div className="flex flex-col md:flex-row w-full items-start gap-4 md:gap-6">
          <div className="w-full md:w-64 mb-4 md:mb-0">
            <Stack spacing={1}>
              <p className="text-sm font-medium text-gray-500">Simple Spoil</p>
              <h3 className="text-2xl font-semibold text-black">
                Create a Simple Spoil
              </h3>
            </Stack>
          </div>

          <div className="flex-1 w-full">
            {activeStep === "basics" ? (
              <SpoilBasicsStep
                data={basicsData}
                onChange={setBasicsData}
                onNext={() => setActiveStep("review")}
                selectedType="simple"
                onBackToSelection={handleBackToSelection}
                onCreated={(id: number) => {
                  setCreatedSpoilId(id);
                  setCreatedSpoilIdInStore?.(id);
                }}
              />
            ) : (
              <SpoilReviewStep
                basics={basicsData}
                outline={emptyOutline}
                selectedType="simple"
                onPrevious={() => setActiveStep("basics")}
                onSubmit={handleSubmitSpoil}
                onEditBasics={() => setActiveStep("basics")}
              />
            )}
          </div>
        </div>
      </Stack>
    </div>
  );
};

export default SimpleSpoil;
