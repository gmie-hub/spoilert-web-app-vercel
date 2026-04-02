"use client";

import { useEffect, useState } from "react";

import Stack from "@mui/material/Stack";
import { useRouter, useSearchParams } from "next/navigation";

import useCreateSpoilMutation from "@spt/hooks/apiRequests/useCreateSpoilMutation";
import useGetSpoilDetailsQuery from "@spt/hooks/apiRequests/useGetSpoilDetailsQuery";
import useUpdateSpoilMutation from "@spt/hooks/apiRequests/useUpdateSpoilMutation";
import { useAuthStore } from "@spt/store/authStore";

import { mapSpoilDataToForm } from "./steps/spoilBasicsHelpers";
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
  const searchParams = useSearchParams();
  const spoilIdParam = searchParams.get("spoilId");
  const isEditMode = Boolean(spoilIdParam);
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

  const { createSpoilHandler } = useCreateSpoilMutation();
  const { updateSpoilHandler } = useUpdateSpoilMutation();
  const { data: spoilData, isLoading: isSpoilLoading } =
    useGetSpoilDetailsQuery(spoilIdParam);
  const setCreatedSpoilIdInStore = useAuthStore((s) => s.setCreatedSpoilId);

  useEffect(() => {
    if (!spoilData || !isEditMode) {
      return;
    }

    setBasicsData(mapSpoilDataToForm(spoilData));
    setCreatedSpoilIdInStore?.(Number(spoilData.id));
  }, [isEditMode, setCreatedSpoilIdInStore, spoilData]);

  const handleBackToSelection = () => {
    router.push("/create-spoils");
  };

  const resetAll = () => {
    setBasicsData(initialBasicsState);
    setCreatedSpoilIdInStore?.(null);
    setActiveStep("basics");
    sessionStorage.removeItem(STEP_KEY);
    router.push(isEditMode ? "/profile/my-spoils" : "/create-spoils");
  };

  const handleSubmitSpoil = async () => {
    if (isEditMode && spoilIdParam) {
      try {
        await updateSpoilHandler(
          spoilIdParam,
          {
            ...basicsData,
            type: "simple",
            is_active: 1,
            is_draft: 0,
            status: 0,
          },
          { setSubmitting: () => {} },
        );
      } catch {
        return;
      }

      resetAll();
      return;
    }

    try {
      const res = await createSpoilHandler(
        { ...basicsData, type: "simple" },
        {},
      );
      const createdId =
        res?.data?.id ?? res?.data?.spoil_id ?? res?.data?.data?.id ?? null;

      if (createdId) {
        setCreatedSpoilIdInStore?.(Number(createdId));
      }
    } catch {
      // createSpoilHandler shows toast
    } finally {
      resetAll();
    }
  };

  if (isEditMode && isSpoilLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-2 sm:px-4">
        <p className="text-sm text-[#5F6B76]">Loading spoil details...</p>
      </div>
    );
  }

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
                {isEditMode ? "Edit Simple Spoil" : "Create a Simple Spoil"}
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
              />
            ) : (
              <SpoilReviewStep
                basics={basicsData}
                outline={emptyOutline}
                selectedType="simple"
                isEditMode={isEditMode}
                spoilId={spoilIdParam}
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
