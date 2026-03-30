"use client";

import { type FC, useState } from "react";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import useCreateCommunityMutation from "@spt/hooks/apiRequests/useCreateCommunityMutation";
import useCreateLessonMutation from "@spt/hooks/apiRequests/useCreateLessonMutation";
import useCreateModuleMutation from "@spt/hooks/apiRequests/useCreateModuleMutation";
import { useCreateSpoilMutation } from "@spt/hooks/apiRequests/useCreateSpoilMutation";
import useCreateSpoilStore from "@spt/store/createSpoilStore";

import CreateCommunityModal from "../components/CreateCommunityModal";
import CreateCommunitySuccessModal from "../components/CreateCommunitySuccessModal";
import CreateScheduledCommunityModal from "../components/CreateScheduledCommunityModal";
import ReviewModal from "../components/ReviewModal";
import ScheduleSpoilPremiereModal, {
  type SchedulePremiereFormState,
} from "../components/ScheduleSpoilPremiereModal";
import SpoilScheduledModal from "../components/SpoilScheduledModal";
import ReviewActionButtons from "../steps/components/ReviewActionButtons";
import { createQuizAndQuestions } from "../utils/quizHelpers";


interface Props {
  onPrevious: () => void;
  onSubmit: () => void;
}

const SpoilReviewControls: FC<Props> = ({ onPrevious, onSubmit }) => {
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isPublishCommunityModalOpen, setIsPublishCommunityModalOpen] =
    useState(false);
  const [isSchedulePremiereModalOpen, setIsSchedulePremiereModalOpen] =
    useState(false);
  const [isCreateCommunityModalOpen, setIsCreateCommunityModalOpen] =
    useState(false);
  const [isCreateCommunitySuccessModalOpen, setIsCreateCommunitySuccessModalOpen] =
    useState(false);
  const [isSpoilScheduledModalOpen, setIsSpoilScheduledModalOpen] = useState(false);
  const [scheduledDateTime, setScheduledDateTime] =
    useState<SchedulePremiereFormState | null>(null);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);
  const [createdSpoilId, setCreatedSpoilId] = useState<number | null>(null);

  const { createSpoilHandler } = useCreateSpoilMutation();
  const { createModuleHandler } = useCreateModuleMutation();
  const { createLessonHandler } = useCreateLessonMutation();
  const { createCommunityHandler, isLoading: isCreatingCommunity } = useCreateCommunityMutation();
  const router = useRouter();

  const handlePublishClick = async () => {
    setIsPublishing(true);
    try {
      // Validate persisted quiz drafts (pre/post/module) before making API calls
      const validateDraftQuizzes = () => {
        const errors: string[] = [];
        try {
          const basics = useCreateSpoilStore.getState().basics ?? {};
          const outline = useCreateSpoilStore.getState().outline ?? { modules: [] };

          const checkQuiz = (quiz: any, label: string) => {
            if (!quiz) return;
            const qCount = Array.isArray(quiz.questions) ? quiz.questions.length : (quiz.overview?.numberOfQuestions ? Number(quiz.overview.numberOfQuestions) : 0);
            const timeLimit = quiz.overview?.timeLimit ?? quiz.time_limit ?? null;
            if (!qCount || qCount <= 0) errors.push(`${label}: add at least one question`);
            if (!timeLimit) errors.push(`${label}: time limit is required`);
          };

          checkQuiz((basics as any).preQuiz, "Pre-spoil quiz");
          checkQuiz((basics as any).postQuiz, "Post-spoil quiz");

          (outline.modules || []).forEach((m: any, idx: number) => {
            if (m.quiz) {
              checkQuiz(m.quiz, `Module ${idx + 1} quiz`);
            }
          });
        } catch  {
          // ignore
        }

        if (errors.length > 0) {
          toast.error(errors.join("; "));
          return false;
        }
        return true;
      };

      if (!validateDraftQuizzes()) return;

      // Remove advanced-spoil-draft from storage
      try {
        if (typeof window !== "undefined") {
          localStorage.removeItem("advanced-spoil-draft");
          sessionStorage.removeItem("advanced-spoil-draft");
        }
      } catch {
        // ignore errors
      }

      const formData = new FormData();

      // quiz/question creation logic extracted to ../utils/quizHelpers.createQuizAndQuestions

      // prepare callbacks to create quiz after spoil/module creation
      const callbacks = {
        onSpoilCreated: async (spoilId: number | string) => {
          try {
            const basics = useCreateSpoilStore.getState().basics ?? {};
            const preQuiz = (basics as any).preQuiz;
            const postQuiz = (basics as any).postQuiz;

            // use extracted helper to create quiz and post questions
            try {
              await createQuizAndQuestions(preQuiz, { type: "pre", spoilId });
            } catch {
              // ignore per original behavior
            }

            try {
              await createQuizAndQuestions(postQuiz, { type: "post", spoilId });
            } catch {
              // ignore per original behavior
            }
          } catch  {
            // ignore errors
          }
        },

        onModuleCreated: async (moduleId: number | string, moduleRes?: any, originalModule?: any) => {
          try {
            const outline = useCreateSpoilStore.getState().outline ?? { modules: [] };
            const localModuleId = originalModule?.id ?? null;
            let quizConfig: any = null;

            if (localModuleId) {
              const localModule = (outline.modules || []).find((m: any) => String(m.id) === String(localModuleId));
              if (localModule && (localModule as any).quiz) {
                quizConfig = (localModule as any).quiz;
              }
            }

            if (!quizConfig) return;

            try {
              await createQuizAndQuestions(quizConfig, { type: "module", moduleId, moduleRes });
            } catch {
              // ignore per original behavior
            }
          } catch  {
            // ignore
          }
        },

        // onLessonsCreated: async (_moduleId: number | string, _lessonRes?: any) => {
        //   // no-op for now
        // },
      };

      const response = await createSpoilHandler(
        formData,
        {},
        createModuleHandler,
        createLessonHandler,
        callbacks,
      );

      const createdId = response?.data?.id ?? response?.data?.spoil_id ?? response?.data?.data?.id ?? null;
      if (createdId) {
        setCreatedSpoilId(Number(createdId));
        setIsReviewModalOpen(true);
      }
    } catch {
      // ignore
    }
    finally {
      setIsPublishing(false);
    }
  };

  const handleCloseModal = () => setIsReviewModalOpen(false);

  const handleCreateCommunityFromReview = () => {
    // create a community for the newly created spoil
    (async () => {
      setIsReviewModalOpen(false);
      try {
        if (!createdSpoilId) throw new Error("No spoil id available");
        await createCommunityHandler({ spoil_id: createdSpoilId });
        setIsCreateCommunitySuccessModalOpen(true);
      } catch  {
        // if creation fails, keep UX simple: show toast already handled by hook
      }
    })();
  };

  const handleSkipCommunityFromReview = () => {
    setIsReviewModalOpen(false);
    onSubmit();
  };

  const handleSchedulePremiereClick = () => setIsSchedulePremiereModalOpen(true);

  const handleSaveToDraftClick = async () => {
    setIsSavingDraft(true);
    try {
      try {
        if (typeof window !== "undefined") {
          localStorage.removeItem("advanced-spoil-draft");
          sessionStorage.removeItem("advanced-spoil-draft");
        }
      } catch  {
        // ignore
      }

      // mark draft in persisted basics
      const setBasicsInDraft = useCreateSpoilStore.getState().setBasics;
      const storedBasics = useCreateSpoilStore.getState().basics;
      setBasicsInDraft?.({ ...(storedBasics ?? {}), is_draft: 1 } as any);

      // Persist draft to server using createSpoilHandler. createSpoilHandler
      // reads basics from the store when given a FormData as first arg.
      let res: any = null;
      try {
        res = await createSpoilHandler(
          new FormData(),
          { setSubmitting: () => {} },
          createModuleHandler,
          createLessonHandler,
        );
      } catch (e) {
        // swallow error but log for debugging
        // eslint-disable-next-line no-console
        console.error("Save to draft failed:", e);
      }

      try {
        const createdId = res?.data?.id ?? res?.data?.spoil_id ?? res?.data?.data?.id ?? null;
        if (createdId) {
          try {
            useCreateSpoilStore.getState().resetDraft?.();
            if (typeof window !== "undefined") sessionStorage.removeItem("advanced-spoil-step");
          } catch (clearErr) {
            // eslint-disable-next-line no-console
            console.error("Failed to clear draft storage:", clearErr);
          }

          try {
            router.push("/create-spoils");
          } catch (e) {
            // eslint-disable-next-line no-console
            console.error("Navigation to /create-spoils failed", e);
          }
        } else {
          toast.error("Failed to save draft. Please try again.");
        }
      } finally {
        setIsSavingDraft(false);
      }
    } catch {
      onPrevious();
    }
  };

  const handleSchedulePremiereSubmit = (values: SchedulePremiereFormState) => {
    setScheduledDateTime(values);

    try {
      const setBasicsInDraft = useCreateSpoilStore.getState().setBasics;
      const storedBasics = useCreateSpoilStore.getState().basics;
      setBasicsInDraft?.({ ...(storedBasics ?? {}), scheduledDate: values.date, scheduledTime: values.time } as any);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("Failed to persist scheduled date into draft:", e);
    }

    (async () => {
      try {
        setIsScheduling(true);
        const res = await createSpoilHandler(
          new FormData(),
          { setSubmitting: () => {} },
          createModuleHandler,
          createLessonHandler,
        );

        if (res?.data?.id) {
          setIsSchedulePremiereModalOpen(false);
          setIsSpoilScheduledModalOpen(true);
        } else {
          setIsSchedulePremiereModalOpen(false);
        }
      } catch {
        setIsSchedulePremiereModalOpen(false);
      }
      finally {
        setIsScheduling(false);
      }
    })();
  };

  const handleCreateCommunity = () => {
    // called from scheduled flow — create community for the created spoil
    (async () => {
      setIsCreateCommunityModalOpen(false);
      try {
        if (!createdSpoilId) throw new Error("No spoil id available");
        await createCommunityHandler({ spoil_id: createdSpoilId });
        setIsCreateCommunitySuccessModalOpen(true);
      } catch {
        // toast handled in hook
      }
    })();
  };

  const handleSkipCommunity = () => {
    setIsCreateCommunityModalOpen(false);
    setIsSpoilScheduledModalOpen(true);
  };

  const handleSpoilScheduledClose = () => {
    setIsSpoilScheduledModalOpen(false);
    try {
      useCreateSpoilStore.getState().resetDraft?.();
      if (typeof window !== "undefined") sessionStorage.removeItem("advanced-spoil-step");
    } catch (clearErr) {
      // eslint-disable-next-line no-console
      console.error("Failed to clear draft storage:", clearErr);
    }

    try {
      router.push("/create-spoils");
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("Navigation to /create-spoils failed", e);
    }
  };

  const handleCreateCommunitySuccessClose = () => {
    setIsCreateCommunitySuccessModalOpen(false);
    try {
      useCreateSpoilStore.getState().resetDraft?.();
      if (typeof window !== "undefined") sessionStorage.removeItem("advanced-spoil-step");
    } catch (clearErr) {
      // eslint-disable-next-line no-console
      console.error("Failed to clear draft storage:", clearErr);
    }

    try {
      router.push("/create-spoils");
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("Navigation to /create-spoils failed", e);
    }
  };

//   const storedSpoilId = useAuthStore((s) => s.createdSpoilId);
//   const { data: spoilData } = useGetSpoilByIdQuery(storedSpoilId);

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

      <ReviewModal
        open={isReviewModalOpen}
        onClose={handleCloseModal}
        onCreateCommunity={handleCreateCommunityFromReview}
        onSkip={handleSkipCommunityFromReview}
      />

      <CreateCommunityModal
        open={isPublishCommunityModalOpen}
        onClose={() => setIsPublishCommunityModalOpen(false)}
        onOkay={() => {
          (async () => {
            try {
              if (!createdSpoilId) throw new Error("No spoil id available");
              await createCommunityHandler({ spoil_id: createdSpoilId });
              setIsPublishCommunityModalOpen(false);
              setIsCreateCommunitySuccessModalOpen(true);
            } catch  {
              // hook already shows toast on error
            }
          })();
        }}
        isLoading={isCreatingCommunity}
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
        isLoading={isCreatingCommunity}
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
    </>
  );
};

export default SpoilReviewControls;
