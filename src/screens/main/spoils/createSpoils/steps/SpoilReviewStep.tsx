"use client";

import { type FC, useState } from "react";

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

import type { BasicsFormData, OutlineData, SpoilTypeOption } from "../types";

interface SpoilReviewStepProps {
  basics: BasicsFormData;
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

  const handlePublishClick = () => {
    setIsReviewModalOpen(true);
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

  const handleSchedulePremiereSubmit = (values: SchedulePremiereFormState) => {
    setScheduledDateTime(values);
    setIsSchedulePremiereModalOpen(false);
    setIsCreateCommunityModalOpen(true);
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
    // Optionally navigate away or perform other actions
  };

  const handleCreateCommunitySuccessClose = () => {
    setIsCreateCommunitySuccessModalOpen(false);
    // Optionally navigate away or perform other actions
  };

  return (
    <div className="rounded-3xl bg-white p-8 shadow-sm md:max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Spoil Review</h2>
      </div>

      <CertificateSection />

      <div className="space-y-4">
        <p>Review the Spoil you created and publish</p>

        <SpoilBasicsSection basics={basics} onEdit={onEditBasics} />

        <SpoilOutlineSection outline={outline} onEdit={onEditOutline} />
      </div>

      <ReviewActionButtons
        onPublish={handlePublishClick}
        onSchedulePremiere={handleSchedulePremiereClick}
        onSaveToDraft={onPrevious}
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
