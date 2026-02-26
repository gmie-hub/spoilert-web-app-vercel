"use client";

import { type FC, useState } from "react";

import { useRouter } from "next/navigation";

import useGetSpoilByIdQuery from "@spt/hooks/apiRequests/getSpoilByIdQuery";
import useCreateLessonMutation from "@spt/hooks/apiRequests/useCreateLessonMutation";
import useCreateModuleMutation from "@spt/hooks/apiRequests/useCreateModuleMutation";
import { useCreateSpoilMutation } from "@spt/hooks/apiRequests/useCreateSpoilMutation";
import { useAuthStore } from "@spt/store/authStore";
import useCreateSpoilStore from "@spt/store/createSpoilStore";

import CreateCommunityModal from "../components/CreateCommunityModal";
import CreateCommunitySuccessModal from "../components/CreateCommunitySuccessModal";
import CreateScheduledCommunityModal from "../components/CreateScheduledCommunityModal";
import ReviewModal from "../components/ReviewModal";
import ScheduleSpoilPremiereModal, {
  type SchedulePremiereFormState,
} from "../components/ScheduleSpoilPremiereModal";
import SpoilScheduledModal from "../components/SpoilScheduledModal";

import CertificateSection from "./components/CertificateSection";
import ReviewActionButtons from "./components/ReviewActionButtons";
import SpoilBasicsSection from "./components/SpoilBasicsSection";
import SpoilOutlineSection from "./components/SpoilOutlineSection";
import { mapSpoilDataToForm } from "./spoilBasicsHelpers";

import type { BasicsFormData, OutlineData, SpoilTypeOption } from "../types";

interface SpoilReviewStepProps {
  // `basics` may be omitted — when present it's used only as a fallback
  basics?: BasicsFormData;
  outline: OutlineData;
  selectedType: SpoilTypeOption;
  onPrevious: () => void;
  onSubmit: () => void;
  // Assuming these are passed for the "Edit" functionality
  onEditBasics?: () => void;
  onEditOutline?: () => void;
}

const SpoilReviewStep: FC<SpoilReviewStepProps> = ({
  basics,
  outline,
  selectedType,
  onPrevious,
  onSubmit,
  onEditBasics,
  onEditOutline,
}) => {
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isPublishCommunityModalOpen, setIsPublishCommunityModalOpen] =
    useState(false);
  const [isSchedulePremiereModalOpen, setIsSchedulePremiereModalOpen] =
    useState(false);
  const [isCreateCommunityModalOpen, setIsCreateCommunityModalOpen] =
    useState(false);
  const [
    isCreateCommunitySuccessModalOpen,
    setIsCreateCommunitySuccessModalOpen,
  ] = useState(false);
  const [isSpoilScheduledModalOpen, setIsSpoilScheduledModalOpen] =
    useState(false);
  const [scheduledDateTime, setScheduledDateTime] =
    useState<SchedulePremiereFormState | null>(null);

  const { createSpoilHandler } = useCreateSpoilMutation();
  const { createModuleHandler } = useCreateModuleMutation();
  const { createLessonHandler } = useCreateLessonMutation();
  const router = useRouter();

  const handlePublishClick = async () => {
    try {
      const formData = new FormData();

      // Assuming `basics` and `outline` are available in the component
      if (basics?.title) formData.append("title", basics.title);
      if (outline) formData.append("outline", JSON.stringify(outline));

      const response = await createSpoilHandler(
        formData,
        {},
        createModuleHandler,
        createLessonHandler,
      );

      if (response?.data?.id) {
        // Show the review modal on full success (spoil + modules + lessons)
        setIsReviewModalOpen(true);
      }
    } catch (error) {
      // error handled by toast or UI
      // Optionally, handle error state here
    }
  };

  const handleCloseModal = () => {
    setIsReviewModalOpen(false);
  };

  const handleCreateCommunityFromReview = () => {
    setIsReviewModalOpen(false);
    // setIsPublishCommunityModalOpen(true);
    setIsCreateCommunitySuccessModalOpen(true);
  };

  const handleSkipCommunityFromReview = () => {
    setIsReviewModalOpen(false);
    // Just close the modal without submitting
    onSubmit();
  };

  // const handlePublishCommunityOkay = () => {
  //   setIsPublishCommunityModalOpen(false);
  //   setTimeout(() => {
  //     onSubmit();
  //   }, 100);
  // };

  const handleSchedulePremiereClick = () => {
    setIsSchedulePremiereModalOpen(true);
  };

  const handleSaveToDraftClick = async () => {
    try {
      // mark draft in persisted basics
      setBasicsInDraft?.({ ...(storedBasics ?? {}), is_draft: 1 } as any);

      // call same publish endpoints (create spoil -> modules -> lessons)
      const res = await createSpoilHandler(
        new FormData(),
        { setSubmitting: (_: boolean) => {} },
        createModuleHandler,
        createLessonHandler,
      );
      if (res?.data?.id) {
        // Draft saved, ID: res.data.id
      }
      try {
        // clear persisted draft and step before navigating away
        try {
          resetDraft?.();
          if (typeof window !== "undefined") {
            sessionStorage.removeItem("advanced-spoil-step");
          }
        } catch (clearErr) {
          // ignore clear errors
          // eslint-disable-next-line no-console
          console.error("Failed to clear draft storage:", clearErr);
        }

        router.push("/create-spoils");
      } catch (e) {
        // ignore navigation errors
        // eslint-disable-next-line no-console
        console.error("Navigation to /create-spoils failed", e);
      }
      // after saving to draft, go back to previous step
      // onPrevious();
    } catch (e) {
      // error handled by toast or UI
      // still go back to previous step
      onPrevious();
    }
  };

  const handleSchedulePremiereSubmit = (values: SchedulePremiereFormState) => {
    setScheduledDateTime(values);

    // persist schedule into the draft basics
    try {
      setBasicsInDraft?.({
        ...(storedBasics ?? {}),
        scheduledDate: values.date,
        scheduledTime: values.time,
      } as any);
    } catch (e) {
      // do not block UI on failure
      // eslint-disable-next-line no-console
      console.error("Failed to persist scheduled date into draft:", e);
    }

    // Also trigger the same publish flow (create spoil -> modules -> lessons)
    (async () => {
      try {
        // createSpoilHandler reads data from the persisted draft store internally
        const res = await createSpoilHandler(
          new FormData(),
          { setSubmitting: (_: boolean) => {} },
          createModuleHandler,
          createLessonHandler,
        );

        // Only show the scheduled confirmation modal when create spoil succeeded
        if (res?.data?.id) {
          setIsSchedulePremiereModalOpen(false);
          setIsSpoilScheduledModalOpen(true);
        } else {
          // fallback: close schedule modal and open create-community flow
          setIsSchedulePremiereModalOpen(false);
          // setIsCreateCommunityModalOpen(true);
        }
      } catch (err) {
        // error handled by toast or UI
        setIsSchedulePremiereModalOpen(false);
        // setIsCreateCommunityModalOpen(true);
      }
    })();
  };

  const handleCreateCommunity = () => {
    setIsCreateCommunityModalOpen(false);
    setIsCreateCommunitySuccessModalOpen(true);
    // Add your create community logic here
  };

  const handleSkipCommunity = () => {
    setIsCreateCommunityModalOpen(false);
    setIsSpoilScheduledModalOpen(true);
  };

  const handleSpoilScheduledClose = () => {
    setIsSpoilScheduledModalOpen(false);
    // clear persisted draft and step before navigating away
    try {
      resetDraft?.();
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("advanced-spoil-step");
      }
    } catch (clearErr) {
      // eslint-disable-next-line no-console
      console.error("Failed to clear draft storage:", clearErr);
    }

    // navigate to create spoils page
    try {
      router.push("/create-spoils");
    } catch (e) {
      // ignore navigation errors
      // eslint-disable-next-line no-console
      console.error("Navigation to /create-spoils failed", e);
    }
  };

  const handleCreateCommunitySuccessClose = () => {
    setIsCreateCommunitySuccessModalOpen(false);
    // clear persisted draft and step before navigating away
    try {
      resetDraft?.();
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("advanced-spoil-step");
      }
    } catch (clearErr) {
      // eslint-disable-next-line no-console
      console.error("Failed to clear draft storage:", clearErr);
    }

    // navigate to create spoils page
    try {
      router.push("/create-spoils");
    } catch (e) {
      // ignore navigation errors
      // eslint-disable-next-line no-console
      console.error("Navigation to /create-spoils failed", e);
    }
  };

  const storedSpoilId = useAuthStore((s) => s.createdSpoilId);
  const { data: spoilData } = useGetSpoilByIdQuery(storedSpoilId);

  // Prefer the API payload, fall back to `basics` prop, then persisted draft
  const storedBasics = useCreateSpoilStore((s) => s.basics);
  const setBasicsInDraft = useCreateSpoilStore((s) => s.setBasics);
  const resetDraft = useCreateSpoilStore((s) => s.resetDraft);
  const displayBasics: BasicsFormData | undefined =
    spoilData != null
      ? mapSpoilDataToForm(spoilData)
      : (basics ?? storedBasics);

  // Prefer the API payload for outline, fall back to `outline` prop, then persisted draft
  const storedOutline = useCreateSpoilStore((s) => s.outline);
  const displayOutline = spoilData ?? outline ?? storedOutline;

  return (
    <div className="rounded-3xl bg-white p-8 shadow-sm md:max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Spoil Review</h2>
      </div>

      <CertificateSection />

      <div className="space-y-4">
        <p>Review the Spoil you created and publish</p>

        <SpoilBasicsSection
          basics={displayBasics as BasicsFormData}
          selectedType={selectedType}
          onEdit={onEditBasics}
        />

        {selectedType !== "simple" && (
          <SpoilOutlineSection
            outline={displayOutline as any}
            onEdit={onEditOutline}
          />
        )}
      </div>

      <ReviewActionButtons
        onPublish={handlePublishClick}
        onSchedulePremiere={handleSchedulePremiereClick}
        onSaveToDraft={handleSaveToDraftClick}
      />

      <ReviewModal
        open={isReviewModalOpen}
        onClose={handleCloseModal}
        onCreateCommunity={handleCreateCommunityFromReview}
        onSkip={handleSkipCommunityFromReview}
      />

      <CreateCommunityModal
        open={isPublishCommunityModalOpen}
        onClose={() => setIsPublishCommunityModalOpen(false)}
        // onOkay={handlePublishCommunityOkay}
      />

      <ScheduleSpoilPremiereModal
        open={isSchedulePremiereModalOpen}
        onClose={() => setIsSchedulePremiereModalOpen(false)}
        onSubmit={handleSchedulePremiereSubmit}
      />

      <CreateScheduledCommunityModal
        open={isCreateCommunityModalOpen}
        onClose={() => setIsCreateCommunityModalOpen(false)}
        onCreateCommunity={handleCreateCommunity}
        onSkip={handleSkipCommunity}
        scheduledDateTime={scheduledDateTime}
      />

      <SpoilScheduledModal
        open={isSpoilScheduledModalOpen}
        onClose={handleSpoilScheduledClose}
        scheduledDateTime={scheduledDateTime}
      />

      <CreateCommunitySuccessModal
        open={isCreateCommunitySuccessModalOpen}
        onClose={handleCreateCommunitySuccessClose}
      />
    </div>
  );
};

export default SpoilReviewStep;
