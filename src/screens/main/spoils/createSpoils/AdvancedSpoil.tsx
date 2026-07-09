"use client";

import { useEffect, useState } from "react";

import Stack from "@mui/material/Stack";
import { useRouter, useSearchParams } from "next/navigation";

import CustomStepper from "@spt/components/stepper";
import useGetSpoilDetailsQuery from "@spt/hooks/apiRequests/useGetSpoilDetailsQuery";
import { useAuthStore } from "@spt/store/authStore";
import { useCreateSpoilStore } from "@spt/store/createSpoilStore";

import {
  mapSpoilDataToForm,
  mapSpoilDetailsToOutline,
} from "./steps/spoilBasicsHelpers";
import SpoilBasicsStep from "./steps/SpoilBasicsStep";
import SpoilOutlineStep from "./steps/SpoilOutlineStep";
import SpoilReviewStep from "./steps/SpoilReviewStep";

const steps = ["Spoylz Basics", "Spoylz Outline", "Spoylz Review"];

const STEP_KEY = "advanced-spoil-step";

const AdvancedSpoil = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const spoilIdParam = searchParams.get("spoilId");
  const isEditMode = Boolean(spoilIdParam);
  const [activeStep, setActiveStep] = useState(
    () => {
    if (typeof window === "undefined") return 0;
    const saved = sessionStorage.getItem(STEP_KEY);
    return saved ? Number(saved) : 0;
  });

  useEffect(() => {
    sessionStorage.setItem(STEP_KEY, String(activeStep));
  }, [activeStep]);

  const basicsData = useCreateSpoilStore((s) => s.basics);
  const setBasicsData = useCreateSpoilStore((s) => s.setBasics);
  const outlineData = useCreateSpoilStore((s) => s.outline);
  const setOutlineData = useCreateSpoilStore((s) => s.setOutline);
  const resetDraft = useCreateSpoilStore((s) => s.resetDraft);
  const loadedSpoilId = useCreateSpoilStore((s) => s.loadedSpoilId);
  const setLoadedSpoilId = useCreateSpoilStore((s) => s.setLoadedSpoilId);
  const setCertificateTemplate = useCreateSpoilStore(
    (s) => s.setCertificateTemplate,
  );

  const createdSpoilId = useAuthStore((s) => s.createdSpoilId);
  const setCreatedSpoilIdInStore = useAuthStore((s) => s.setCreatedSpoilId);
  const { data: spoilData, isLoading: isSpoilLoading } =
    useGetSpoilDetailsQuery(spoilIdParam);

  useEffect(() => {
    if (!spoilData || !isEditMode) {
      return;
    }

    // Only pull the spoil from the server the first time we open it. If the
    // local draft already represents this spoil (e.g. we just came back from
    // the certificate flow), keep the user's in-progress edits instead of
    // overwriting them with the saved copy.
    if (String(loadedSpoilId) === String(spoilData.id)) {
      return;
    }

    setBasicsData(mapSpoilDataToForm(spoilData));
    setOutlineData(mapSpoilDetailsToOutline(spoilData));
    setCertificateTemplate(null);
    setCreatedSpoilIdInStore?.(Number(spoilData.id));
    setLoadedSpoilId(spoilData.id);
  }, [
    isEditMode,
    loadedSpoilId,
    setBasicsData,
    setCertificateTemplate,
    setCreatedSpoilIdInStore,
    setLoadedSpoilId,
    setOutlineData,
    spoilData,
  ]);

  // While creating a brand-new spoil there is no `spoilId` in the URL, but once
  // the draft is saved server-side it gets an id. Remember it so that returning
  // here in edit mode (the certificate flow comes back with `?spoilId=`) treats
  // this draft as already-loaded and preserves the local edits.
  useEffect(() => {
    if (isEditMode || !createdSpoilId) {
      return;
    }

    if (String(loadedSpoilId) !== String(createdSpoilId)) {
      setLoadedSpoilId(createdSpoilId);
    }
  }, [isEditMode, createdSpoilId, loadedSpoilId, setLoadedSpoilId]);

  const goToNextStep = () =>
    setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
  
  const goToPreviousStep = () =>
    setActiveStep((prev) => Math.max(prev - 1, 0));

  const handleBackToSelection = () => {
    router.push("/create-spoils");
  };

  // const resetAll = () => {
  //   setBasicsData(initialBasicsState);
  //   setOutlineData(initialOutlineState);
  //   setCreatedSpoilId(null);
  //   setActiveStep(0);
  //   sessionStorage.removeItem(STEP_KEY);
  //   router.push("/create-spoils");
  // };

  // const handleSubmitSpoil = async () => {
  //   if (createdSpoilId) {
  //     resetAll();
  //     return;
  //   }

  //   try {
  //     const res = await createSpoilHandler(basicsData, {});
  //     const createdId =
  //       res?.data?.id ?? res?.data?.spoil_id ?? res?.data?.data?.id ?? null;

  //     if (createdId) {
  //       setCreatedSpoilId(Number(createdId));
  //       setOutlineData(
  //         (prev) => ({ ...prev, spoil_id: createdId } as OutlineData),
  //       );
  //       setCreatedSpoilIdInStore?.(Number(createdId));
  //     }
  //   } catch {
  //     // createSpoilHandler shows toast
  //   } finally {
  //     resetAll();
  //   }
  // };

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
            // onCreated={(id: number) => {
            //   setCreatedSpoilId(id);
            //   setOutlineData(
            //     (prev) => ({ ...prev, spoil_id: id } as OutlineData),
            //   );
            //   setCreatedSpoilIdInStore?.(id);
            // }}
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
            isEditMode={isEditMode}
            spoilId={spoilIdParam}
            hasCertificate={Number(spoilData?.has_certificate ?? 0) === 1}
            onPrevious={goToPreviousStep}
            onSubmit={() => {
              resetDraft();
              setCreatedSpoilIdInStore?.(null);
              setActiveStep(0);
              sessionStorage.removeItem(STEP_KEY);
              router.push(isEditMode ? "/profile/my-spoils" : "/create-spoils");
            }}
            onEditBasics={() => setActiveStep(0)}
            onEditOutline={() => setActiveStep(1)}
          />
        );
      default:
        return null;
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
    <Stack
      mr={{ xs: 2, md: 20 }}
      ml={{ xs: 2, md: 10 }}
      my={{ xs: 2, md: 6 }}
      spacing={4}
    >
      <Stack spacing={1}>
        <p className="text-sm font-medium text-gray-500">Advanced Spoylz</p>
        <h3 className="text-2xl font-semibold text-black">
          {isEditMode ? "Edit Advanced Spoylz" : "Create an Advanced Spoylz"}
        </h3>
      </Stack>

      <Stack
        direction={{ xs: "column", lg: "row" }}
        spacing={{ xs: 4, lg: 6 }}
      >
        <div className="w-full rounded-3xl bg-white p-6 shadow-sm lg:max-w-xs">
          <h4 className="text-xl font-semibold text-gray-900">
            Spoylz Progress
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
