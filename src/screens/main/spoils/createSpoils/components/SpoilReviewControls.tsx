"use client";

import type { FC } from "react";

import SpoilReviewModals from "../components/SpoilReviewModals";
import { useSpoilReviewControls } from "../hooks/useSpoilReviewControls";
import ReviewActionButtons from "../steps/components/ReviewActionButtons";

import type { SpoilTypeOption } from "../types";

interface Props {
  isEditMode?: boolean;
  spoilId?: number | string | null;
  selectedType: SpoilTypeOption;
  onPrevious: () => void;
  onSubmit: () => void;
}

const SpoilReviewControls: FC<Props> = ({
  isEditMode = false,
  spoilId = null,
  selectedType,
  onPrevious,
  onSubmit,
}) => {
  const {
    isReviewModalOpen,
    isPublishCommunityModalOpen,
    isSchedulePremiereModalOpen,
    isCreateCommunityModalOpen,
    isCreateCommunitySuccessModalOpen,
    isSpoilScheduledModalOpen,
    scheduledDateTime,
    isSavingDraft,
    isPublishing,
    isScheduling,
    isCreatingCommunity,
    handlePublishClick,
    handleCloseModal,
    handleCreateCommunityFromReview,
    handleSkipCommunityFromReview,
    handlePublishCommunityOkay,
    handleSchedulePremiereClick,
    handleSaveToDraftClick,
    handleSchedulePremiereSubmit,
    handleCreateCommunity,
    handleSkipCommunity,
    handleSpoilScheduledClose,
    handleCreateCommunitySuccessClose,
    setIsPublishCommunityModalOpen,
    setIsSchedulePremiereModalOpen,
    setIsCreateCommunityModalOpen,
  } = useSpoilReviewControls({
    isEditMode,
    spoilId,
    selectedType,
    onPrevious,
    onSubmit,
  });

  return (
    <>
      <ReviewActionButtons
        onPublish={handlePublishClick}
        onSchedulePremiere={handleSchedulePremiereClick}
        onSaveToDraft={handleSaveToDraftClick}
        isSavingDraft={isSavingDraft}
        isPublishing={isPublishing}
        isScheduling={isScheduling}
      />

      <SpoilReviewModals
        isReviewModalOpen={isReviewModalOpen}
        onCloseReviewModal={handleCloseModal}
        onCreateCommunityFromReview={handleCreateCommunityFromReview}
        onSkipCommunityFromReview={handleSkipCommunityFromReview}
        isPublishCommunityModalOpen={isPublishCommunityModalOpen}
        onClosePublishCommunityModal={() => setIsPublishCommunityModalOpen(false)}
        onPublishCommunityOkay={handlePublishCommunityOkay}
        isCreatingCommunity={isCreatingCommunity}
        isSchedulePremiereModalOpen={isSchedulePremiereModalOpen}
        onCloseSchedulePremiereModal={() => setIsSchedulePremiereModalOpen(false)}
        onSubmitSchedulePremiere={handleSchedulePremiereSubmit}
        isCreateCommunityModalOpen={isCreateCommunityModalOpen}
        onCloseCreateCommunityModal={() => setIsCreateCommunityModalOpen(false)}
        onCreateCommunity={handleCreateCommunity}
        onSkipCommunity={handleSkipCommunity}
        scheduledDateTime={scheduledDateTime}
        isSpoilScheduledModalOpen={isSpoilScheduledModalOpen}
        onCloseSpoilScheduledModal={handleSpoilScheduledClose}
        isCreateCommunitySuccessModalOpen={isCreateCommunitySuccessModalOpen}
        onCloseCreateCommunitySuccessModal={handleCreateCommunitySuccessClose}
      />
    </>
  );
};

export default SpoilReviewControls;
