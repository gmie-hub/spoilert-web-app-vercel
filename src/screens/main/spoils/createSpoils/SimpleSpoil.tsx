"use client";

import { useEffect, useState } from "react";

import Stack from "@mui/material/Stack";
import { useRouter, useSearchParams } from "next/navigation";

import useCreateSpoilMutation from "@spt/hooks/apiRequests/useCreateSpoilMutation";
import useGetSpoilDetailsQuery from "@spt/hooks/apiRequests/useGetSpoilDetailsQuery";
import useUpdateLessonMutation from "@spt/hooks/apiRequests/useUpdateLessonMutation";
import useUpdateSpoilMutation from "@spt/hooks/apiRequests/useUpdateSpoilMutation";
import { useAuthStore } from "@spt/store/authStore";
import useCreateSpoilStore from "@spt/store/createSpoilStore";

import { mapSpoilDataToForm } from "./steps/spoilBasicsHelpers";
import SpoilBasicsStep from "./steps/SpoilBasicsStep";
import SpoilReviewStep from "./steps/SpoilReviewStep";

import type { OutlineData } from "./types";

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

  // Basics live in the persisted draft store (not local state) so they survive
  // navigating away to the certificate flow and back.
  const basicsData = useCreateSpoilStore((s) => s.basics);
  const setBasicsData = useCreateSpoilStore((s) => s.setBasics);
  const loadedSpoilId = useCreateSpoilStore((s) => s.loadedSpoilId);
  const setLoadedSpoilId = useCreateSpoilStore((s) => s.setLoadedSpoilId);

  const { createSpoilHandler } = useCreateSpoilMutation();
  const { updateSpoilHandler } = useUpdateSpoilMutation();
  const { updateLessonHandler } = useUpdateLessonMutation();
  const { data: spoilData, isLoading: isSpoilLoading } =
    useGetSpoilDetailsQuery(spoilIdParam);
  const createdSpoilId = useAuthStore((s) => s.createdSpoilId);
  const setCreatedSpoilIdInStore = useAuthStore((s) => s.setCreatedSpoilId);
  const resetDraft = useCreateSpoilStore((s) => s.resetDraft);

  useEffect(() => {
    if (!spoilData || !isEditMode) {
      return;
    }

    // Load from the server only the first time we open this spoil. On a later
    // return (e.g. from the certificate flow) keep the user's local edits.
    if (String(loadedSpoilId) === String(spoilData.id)) {
      return;
    }

    setBasicsData(mapSpoilDataToForm(spoilData));
    setCreatedSpoilIdInStore?.(Number(spoilData.id));
    setLoadedSpoilId(spoilData.id);
  }, [
    isEditMode,
    loadedSpoilId,
    setBasicsData,
    setCreatedSpoilIdInStore,
    setLoadedSpoilId,
    spoilData,
  ]);

  // Once a created draft gets an id, remember it so returning here in edit mode
  // recognises this draft as already-loaded and preserves the local edits.
  useEffect(() => {
    if (isEditMode || !createdSpoilId) {
      return;
    }

    if (String(loadedSpoilId) !== String(createdSpoilId)) {
      setLoadedSpoilId(createdSpoilId);
    }
  }, [isEditMode, createdSpoilId, loadedSpoilId, setLoadedSpoilId]);

  const handleBackToSelection = () => {
    router.push("/create-spoils");
  };

  const resetAll = () => {
    resetDraft(); // clears basics, outline, certificate and loadedSpoilId
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

        // Updating the spoil alone doesn't persist its lesson, so push the
        // simple-spoil lesson (text content or replacement file) through the
        // dedicated lesson endpoint. A simple spoil has exactly one lesson.
        const lesson = spoilData?.modules?.[0]?.lessons?.[0];
        if (lesson?.id) {
          const isText = basicsData.lessonType === "text";
          await updateLessonHandler({
            lessonId: lesson.id,
            title: lesson.title,
            // Keep the original concrete type (pdf/video/...) for file lessons;
            // the update endpoint uses it to decide between content and file.
            type: isText ? "text" : (lesson.type ?? "file"),
            content: isText ? basicsData.lessonContent : undefined,
            file:
              !isText && basicsData.lessonFile instanceof File
                ? basicsData.lessonFile
                : null,
            description: lesson.description ?? "",
          });
        }
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
        <p className="text-sm text-[#5F6B76]">Loading Spoylz details...</p>
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
        sx={{ width: "100%" }}
      >
        <div className="flex flex-col md:flex-row w-full items-start gap-4 md:gap-6">
          <div className="w-full md:w-64 mb-4 md:mb-0">
            <Stack spacing={1}>
              <p className="text-sm font-medium text-gray-500">Simple Spoylz</p>
              <h3 className="text-2xl font-semibold text-black">
                {isEditMode ? "Edit Simple Spoylz" : "Create a Simple Spoylz"}
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
