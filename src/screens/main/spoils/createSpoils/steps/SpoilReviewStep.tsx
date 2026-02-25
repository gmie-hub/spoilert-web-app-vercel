"use client";

import { type FC, useState } from "react";

import useGetSpoilByIdQuery from "@spt/hooks/apiRequests/getSpoilByIdQuery";
import { useAuthStore } from "@spt/store/authStore";

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

  const storedSpoilId = useAuthStore.getState().createdSpoilId;
  const { data: spoilData } = useGetSpoilByIdQuery(storedSpoilId);

  // Prefer the API payload, fall back to `basics` prop if API data not available
  const displayBasics: BasicsFormData | undefined =
    spoilData != null ? mapSpoilDataToForm(spoilData) : basics;

  // Map various possible API shapes into the `OutlineData` shape expected by the UI
  const mapApiToOutline = (api: any) => {
    if (!api) return { modules: [] } as OutlineData;

    // Try common module containers
    const modulesRaw =
      api.modules || api.modules_data || api.outline?.modules || [];
    // Lessons might be embedded under each module, or provided as a top-level list
    const lessonsPool = api.lessons || api.module_lessons || [];

    const normalizeLesson = (l: any) => ({
      id: l.id ?? l.lesson_id ?? Math.random().toString(36).slice(2, 9),
      title: l.title ?? l.name ?? l.lesson_title ?? "Untitled Lesson",
      type: (l.type || l.lesson_type || "text").toString().toLowerCase(),
      content: l.content ?? l.body ?? "",
      file: l.file ?? l.file_url ?? null,
      fileName: l.file_name ?? l.fileName ?? l.filename ?? undefined,
    });

    const modules = (Array.isArray(modulesRaw) ? modulesRaw : []).map(
      (m: any, idx: number) => {
        const moduleId = m.id ?? m.module_id ?? idx;
        // lessons directly on module
        let lessons: any[] = [];
        if (Array.isArray(m.lessons) && m.lessons.length)
          lessons = m.lessons.map(normalizeLesson);
        else if (Array.isArray(lessonsPool) && lessonsPool.length)
          lessons = lessonsPool
            .filter(
              (ls: any) =>
                ls.module_id === moduleId ||
                ls.module === moduleId ||
                ls.module?.id === moduleId,
            )
            .map(normalizeLesson);

        return {
          id: moduleId,
          title: m.title ?? m.name ?? `Module ${idx + 1}`,
          description: m.description ?? m.desc ?? "",
          lessons,
        } as any;
      },
    );

    return {
      modules,
      spoil_id: api.id ?? api.spoil_id ?? undefined,
    } as OutlineData;
  };

  const outlineForUI = mapApiToOutline(spoilData);

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
          onEdit={onEditBasics}
        />

        <SpoilOutlineSection outline={outlineForUI} onEdit={onEditOutline} />
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
