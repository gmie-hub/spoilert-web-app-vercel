"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import useCreateCommunityMutation from "@spt/hooks/apiRequests/useCreateCommunityMutation";
import useCreateLessonMutation from "@spt/hooks/apiRequests/useCreateLessonMutation";
import useCreateModuleMutation from "@spt/hooks/apiRequests/useCreateModuleMutation";
import { useCreateSpoilMutation } from "@spt/hooks/apiRequests/useCreateSpoilMutation";
import useDeleteLesson from "@spt/hooks/apiRequests/useDeleteLesson";
import useDeleteModule from "@spt/hooks/apiRequests/useDeleteModule";
import useGetSpoilDetailsQuery from "@spt/hooks/apiRequests/useGetSpoilDetailsQuery";
import useUpdateLessonMutation from "@spt/hooks/apiRequests/useUpdateLessonMutation";
import useUpdateModuleMutation from "@spt/hooks/apiRequests/useUpdateModuleMutation";
import useUpdateSpoilMutation from "@spt/hooks/apiRequests/useUpdateSpoilMutation";
import useCreateSpoilStore from "@spt/store/createSpoilStore";

import { mapSpoilDetailsToOutline } from "../steps/spoilBasicsHelpers";
import {
  buildQuizCallbacks,
  clearPersistedAdvancedDraft,
  createSpoilCertificateTemplate,
  getCreatedSpoilId,
  resetDraftProgress,
  syncOutlineChanges,
  validateDraftQuizzes,
} from "../utils/spoilReviewHelpers";

import type { SchedulePremiereFormState } from "../components/ScheduleSpoilPremiereModal";
import type { BasicsFormData, SpoilTypeOption } from "../types";

interface UseSpoilReviewControlsParams {
  isEditMode?: boolean;
  spoilId?: number | string | null;
  selectedType: SpoilTypeOption;
  onPrevious: () => void;
  onSubmit: () => void;
}

export const useSpoilReviewControls = ({
  isEditMode = false,
  spoilId = null,
  selectedType,
  onPrevious,
  onSubmit,
}: UseSpoilReviewControlsParams) => {
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isPublishCommunityModalOpen, setIsPublishCommunityModalOpen] = useState(false);
  const [isSchedulePremiereModalOpen, setIsSchedulePremiereModalOpen] = useState(false);
  const [isCreateCommunityModalOpen, setIsCreateCommunityModalOpen] = useState(false);
  const [isCreateCommunitySuccessModalOpen, setIsCreateCommunitySuccessModalOpen] = useState(false);
  const [isSpoilScheduledModalOpen, setIsSpoilScheduledModalOpen] = useState(false);
  const [scheduledDateTime, setScheduledDateTime] = useState<SchedulePremiereFormState | null>(null);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);
  const [createdSpoilId, setCreatedSpoilId] = useState<number | null>(null);

  const { createSpoilHandler } = useCreateSpoilMutation();
  const { updateSpoilHandler } = useUpdateSpoilMutation();
  const { createModuleHandler } = useCreateModuleMutation();
  const { createLessonHandler } = useCreateLessonMutation();
  const { updateModuleHandler } = useUpdateModuleMutation();
  const { updateLessonHandler } = useUpdateLessonMutation();
  const { deleteModuleHandler } = useDeleteModule();
  const { deleteLessonHandler } = useDeleteLesson();
  const { data: spoilDetails } = useGetSpoilDetailsQuery(spoilId);
  const { createCommunityHandler, isLoading: isCreatingCommunity } = useCreateCommunityMutation();
  const router = useRouter();

  const routeAfterCompletion = () => {
    const destination = isEditMode ? "/profile/my-spoils" : "/create-spoils";

    try {
      router.push(destination);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`Navigation to ${destination} failed`, error);
    }
  };

  const updateEditedSpoil = async (
    overrides: Partial<BasicsFormData> = {},
    options?: { redirectAfterSuccess?: boolean },
  ) => {
    if (!isEditMode || !spoilId) {
      return false;
    }

    const { basics, outline, certificateTemplate } =
      useCreateSpoilStore.getState();
    const mergedBasics = {
      ...(basics as BasicsFormData),
      ...overrides,
      type: selectedType,
    };

    // Keep the spoil's certificate flag in sync with what the tutor has
    // attached or already saved on the spoil details.
    // when it isn't (they removed it). Mirrors the create flow — any non-simple
    // spoil can carry a certificate, free or paid.
    const hasExistingCertificate =
      Number(spoilDetails?.has_certificate ?? 0) === 1;
    const hasDraftCertificate = Boolean(certificateTemplate?.templateContent);
    const hasCertificate = Boolean(
      selectedType !== "simple" &&
        (hasDraftCertificate || hasExistingCertificate),
    );

    await updateSpoilHandler(
      spoilId,
      { ...mergedBasics, has_certificate: hasCertificate ? 1 : 0 },
      { setSubmitting: () => {} },
    );

    if (selectedType !== "simple") {
      await syncOutlineChanges({
        spoilId,
        currentOutline: outline,
        initialOutline: mapSpoilDetailsToOutline(spoilDetails),
        createModuleHandler,
        createLessonHandler,
        updateModuleHandler,
        updateLessonHandler,
        deleteModuleHandler,
        deleteLessonHandler,
      });
    }

    if (options?.redirectAfterSuccess !== false) {
      onSubmit();
    }

    return true;
  };

  const handlePublishClick = async () => {
    if (isEditMode && spoilId) {
      try {
        await updateEditedSpoil({ is_active: 1, is_draft: 0, status: 0 });
      } catch {
        // update handlers already show toast feedback
      }
      return;
    }

    setIsPublishing(true);
    try {
      if (!validateDraftQuizzes()) {
        return;
      }

      clearPersistedAdvancedDraft();

      const response = await createSpoilHandler(
        new FormData(),
        {},
        createModuleHandler,
        createLessonHandler,
        buildQuizCallbacks(),
      );

      const createdId = getCreatedSpoilId(response);
      if (createdId) {
        setCreatedSpoilId(Number(createdId));
        // On success, push the selected certificate template up with the new id.
        await createSpoilCertificateTemplate(createdId);
        setIsReviewModalOpen(true);
      }
    } catch {
      // ignore
    } finally {
      setIsPublishing(false);
    }
  };

  const handleSaveToDraftClick = async () => {
    if (isEditMode) {
      try {
        await updateEditedSpoil({ is_draft: 1 });
      } catch {
        // update handlers already show toast feedback
      }
      return;
    }

    setIsSavingDraft(true);
    try {
      clearPersistedAdvancedDraft();

      const setBasicsInDraft = useCreateSpoilStore.getState().setBasics;
      const storedBasics = useCreateSpoilStore.getState().basics;
      setBasicsInDraft?.({ ...(storedBasics ?? {}), is_draft: 1 } as any);

      let response: any = null;
      try {
        response = await createSpoilHandler(
          new FormData(),
          { setSubmitting: () => {} },
          createModuleHandler,
          createLessonHandler,
        );
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Save to draft failed:", error);
      }

      const createdId = getCreatedSpoilId(response);
      if (createdId) {
        resetDraftProgress();
        routeAfterCompletion();
      } else {
        toast.error("Failed to save draft. Please try again.");
      }
    } catch {
      onPrevious();
    } finally {
      setIsSavingDraft(false);
    }
  };

  const handleSchedulePremiereSubmit = (values: SchedulePremiereFormState) => {
    setScheduledDateTime(values);

    try {
      const setBasicsInDraft = useCreateSpoilStore.getState().setBasics;
      const storedBasics = useCreateSpoilStore.getState().basics;
      setBasicsInDraft?.({
        ...(storedBasics ?? {}),
        scheduledDate: values.date,
        scheduledTime: values.time,
      } as any);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Failed to persist scheduled date into draft:", error);
    }

    void (async () => {
      try {
        if (isEditMode && spoilId) {
          await updateEditedSpoil(
            {
              scheduledDate: values.date,
              scheduledTime: values.time,
              is_active: 1,
              is_draft: 0,
              status: 0,
              expiryDate: useCreateSpoilStore.getState().basics.expiryDate,
              type: selectedType,
            },
            { redirectAfterSuccess: false },
          );
          setIsSchedulePremiereModalOpen(false);
          setIsSpoilScheduledModalOpen(true);
          return;
        }

        setIsScheduling(true);
        const response = await createSpoilHandler(
          new FormData(),
          { setSubmitting: () => {} },
          createModuleHandler,
          createLessonHandler,
        );

        const createdId = getCreatedSpoilId(response);
        if (createdId) {
          setCreatedSpoilId(Number(createdId));
          // On success, push the selected certificate template up with the new id.
          await createSpoilCertificateTemplate(createdId);
          setIsSchedulePremiereModalOpen(false);
          setIsSpoilScheduledModalOpen(true);
        } else {
          setIsSchedulePremiereModalOpen(false);
        }
      } catch {
        setIsSchedulePremiereModalOpen(false);
      } finally {
        setIsScheduling(false);
      }
    })();
  };

  const createCommunityForSpoil = async (onSuccess: () => void) => {
    try {
      if (!createdSpoilId) {
        throw new Error("No spoil id available");
      }
      await createCommunityHandler({ spoil_id: createdSpoilId });
      onSuccess();
    } catch {
      // toast handled in mutation hook
    }
  };

  return {
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
    handleCloseModal: () => setIsReviewModalOpen(false),
    handleCreateCommunityFromReview: async () => {
      setIsReviewModalOpen(false);
      await createCommunityForSpoil(() => setIsCreateCommunitySuccessModalOpen(true));
    },
    handleSkipCommunityFromReview: () => {
      setIsReviewModalOpen(false);
      onSubmit();
    },
    handlePublishCommunityOkay: async () => {
      await createCommunityForSpoil(() => {
        setIsPublishCommunityModalOpen(false);
        setIsCreateCommunitySuccessModalOpen(true);
      });
    },
    handleSchedulePremiereClick: () => setIsSchedulePremiereModalOpen(true),
    handleSaveToDraftClick,
    handleSchedulePremiereSubmit,
    handleCreateCommunity: async () => {
      setIsCreateCommunityModalOpen(false);
      await createCommunityForSpoil(() => setIsCreateCommunitySuccessModalOpen(true));
    },
    handleSkipCommunity: () => {
      setIsCreateCommunityModalOpen(false);
      setIsSpoilScheduledModalOpen(true);
    },
    handleSpoilScheduledClose: () => {
      setIsSpoilScheduledModalOpen(false);
      resetDraftProgress();
      routeAfterCompletion();
    },
    handleCreateCommunitySuccessClose: () => {
      setIsCreateCommunitySuccessModalOpen(false);
      resetDraftProgress();
      routeAfterCompletion();
    },
    setIsPublishCommunityModalOpen,
    setIsSchedulePremiereModalOpen,
    setIsCreateCommunityModalOpen,
  };
};
