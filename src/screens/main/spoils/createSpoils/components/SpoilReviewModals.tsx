"use client";

import { type FC } from "react";

import CreateCommunityModal from "./CreateCommunityModal";
import CreateCommunitySuccessModal from "./CreateCommunitySuccessModal";
import CreateScheduledCommunityModal from "./CreateScheduledCommunityModal";
import ReviewModal from "./ReviewModal";
import ScheduleSpoilPremiereModal, {
  type SchedulePremiereFormState,
} from "./ScheduleSpoilPremiereModal";
import SpoilScheduledModal from "./SpoilScheduledModal";

interface Props {
  isReviewModalOpen: boolean;
  onCloseReviewModal: () => void;
  onCreateCommunityFromReview: () => void;
  onSkipCommunityFromReview: () => void;

  isPublishCommunityModalOpen: boolean;
  onClosePublishCommunityModal: () => void;
  onPublishCommunityOkay: () => void;
  isCreatingCommunity?: boolean;

  isSchedulePremiereModalOpen: boolean;
  onCloseSchedulePremiereModal: () => void;
  onSubmitSchedulePremiere: (values: SchedulePremiereFormState) => void;

  isCreateCommunityModalOpen: boolean;
  onCloseCreateCommunityModal: () => void;
  onCreateCommunity: () => void;
  onSkipCommunity: () => void;
  scheduledDateTime: SchedulePremiereFormState | null;

  isSpoilScheduledModalOpen: boolean;
  onCloseSpoilScheduledModal: () => void;

  isCreateCommunitySuccessModalOpen: boolean;
  onCloseCreateCommunitySuccessModal: () => void;
}

const SpoilReviewModals: FC<Props> = ({
  isReviewModalOpen,
  onCloseReviewModal,
  onCreateCommunityFromReview,
  onSkipCommunityFromReview,

  isPublishCommunityModalOpen,
  onClosePublishCommunityModal,
  onPublishCommunityOkay,
  isCreatingCommunity = false,

  isSchedulePremiereModalOpen,
  onCloseSchedulePremiereModal,
  onSubmitSchedulePremiere,

  isCreateCommunityModalOpen,
  onCloseCreateCommunityModal,
  onCreateCommunity,
  onSkipCommunity,
  scheduledDateTime,

  isSpoilScheduledModalOpen,
  onCloseSpoilScheduledModal,

  isCreateCommunitySuccessModalOpen,
  onCloseCreateCommunitySuccessModal,
}) => {
  return (
    <>
      <ReviewModal
        open={isReviewModalOpen}
        onClose={onCloseReviewModal}
        onCreateCommunity={onCreateCommunityFromReview}
        onSkip={onSkipCommunityFromReview}
      />

      <CreateCommunityModal
        open={isPublishCommunityModalOpen}
        onClose={onClosePublishCommunityModal}
        onOkay={onPublishCommunityOkay}
        isLoading={isCreatingCommunity}
      />

      <ScheduleSpoilPremiereModal
        open={isSchedulePremiereModalOpen}
        onClose={onCloseSchedulePremiereModal}
        onSubmit={onSubmitSchedulePremiere}
      />

      <CreateScheduledCommunityModal
        open={isCreateCommunityModalOpen}
        onClose={onCloseCreateCommunityModal}
        onCreateCommunity={onCreateCommunity}
        onSkip={onSkipCommunity}
        scheduledDateTime={scheduledDateTime}
        isLoading={isCreatingCommunity}
      />

      <SpoilScheduledModal
        open={isSpoilScheduledModalOpen}
        onClose={onCloseSpoilScheduledModal}
        scheduledDateTime={scheduledDateTime}
      />

      <CreateCommunitySuccessModal
        open={isCreateCommunitySuccessModalOpen}
        onClose={onCloseCreateCommunitySuccessModal}
      />
    </>
  );
};

export default SpoilReviewModals;
