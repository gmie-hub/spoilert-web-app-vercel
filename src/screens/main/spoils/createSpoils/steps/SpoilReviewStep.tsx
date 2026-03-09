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
import api from "@spt/utils/apiClient";
import toast from "react-hot-toast";

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
        } catch (e) {
          // ignore
        }

        if (errors.length > 0) {
          // show first error as toast and also console
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
      } catch (e) {
        // ignore errors
      }

      const formData = new FormData();

      // Assuming `basics` and `outline` are available in the component
      if (basics?.title) formData.append("title", basics.title);
      if (outline) formData.append("outline", JSON.stringify(outline));

      // prepare callbacks to create quiz after spoil/module creation
      const callbacks = {
        onSpoilCreated: async (spoilId: number | string) => {
          try {
            // read pre/post quiz from persisted basics in advanced-spoil-draft
            const basics = useCreateSpoilStore.getState().basics ?? {};
            const preQuiz = (basics as any).preQuiz;
            const postQuiz = (basics as any).postQuiz;

            const createFullQuiz = async (quiz: any, type: string) => {
              if (!quiz) return;
              const fd = new FormData();
              if (quiz.title) fd.append("title", quiz.title);
              fd.append("type", type);
              fd.append("spoil_id", String(spoilId));
              if (quiz.description) fd.append("description", quiz.description ?? "");

              // number of questions
              const noOfQuestions = (quiz.overview?.numberOfQuestions && String(quiz.overview.numberOfQuestions)) || (Array.isArray(quiz.questions) ? String(quiz.questions.length) : "0");
              fd.append("no_of_questions", noOfQuestions);

              // time limit
              if (quiz.overview?.timeLimit) fd.append("time_limit", String(quiz.overview.timeLimit));

              // pass mark if provided
              if (quiz.overview?.pass_mark) fd.append("pass_mark", String(quiz.overview.pass_mark));

              // questions: transform to expected shape. Use array JSON string.
              if (Array.isArray(quiz.questions) && quiz.questions.length > 0) {
                const questionsPayload = quiz.questions.map((q: any) => {
                  // derive answer: prefer explicit q.answer, otherwise look for option with isCorrect
                  let answerVal = q.answer ?? q.correctAnswer ?? "";
                  if (!answerVal && Array.isArray(q.options)) {
                    const found = (q.options as any[]).find((opt: any) => opt && (opt.isCorrect === true || opt.is_correct === true || opt.correct === true));
                    if (found) answerVal = found.text ?? found.label ?? found;
                  }

                  return {
                    question: q.prompt ?? q.question ?? "",
                    type: q.type ?? "multiple_choice",
                    options: JSON.stringify((q.options ?? []).map((opt: any) => (opt && (opt.text ?? opt)) ?? opt)),
                    answer: answerVal ?? "",
                  };
                });
                fd.append("questions", JSON.stringify(questionsPayload));
              }

              try {
                await api.post("/quiz", fd, { headers: { "Content-Type": "multipart/form-data" } });
                toast.success(`Saved ${type} quiz`);
              } catch (err) {
                // eslint-disable-next-line no-console
                console.error(`Failed to create ${type} quiz`, err);
              }
            };

            await createFullQuiz(preQuiz, "pre");
            await createFullQuiz(postQuiz, "post");
          } catch (e) {
            // ignore errors
          }
        },

        onModuleCreated: async (moduleId: number | string, moduleRes?: any, originalModule?: any) => {
          try {
            // Try to read the module quiz from persisted outline in the create-spoil store
            const outline = useCreateSpoilStore.getState().outline ?? { modules: [] };
            const localModuleId = originalModule?.id ?? null;
            let quizConfig: any = null;

            if (localModuleId) {
              const localModule = (outline.modules || []).find((m: any) => String(m.id) === String(localModuleId));
              if (localModule && (localModule as any).quiz) {
                quizConfig = (localModule as any).quiz;
              }
            }

            // No fallback to sessionStorage: prefer persisted outline module quiz only

            if (!quizConfig) return;

            // Build FormData from the quizConfig and POST to /quiz using the server moduleId
            const fd = new FormData();
            if (quizConfig.title) fd.append("title", quizConfig.title);
            fd.append("type", "module");
            fd.append("module_id", String(moduleId));
            if (moduleRes && (moduleRes?.data?.spoil_id || moduleRes?.data?.module?.spoil_id)) {
              fd.append("spoil_id", String(moduleRes?.data?.spoil_id ?? moduleRes?.data?.module?.spoil_id));
            }
            if (quizConfig.description) fd.append("description", quizConfig.description);
            const noOfQuestions = (quizConfig.overview?.numberOfQuestions && String(quizConfig.overview.numberOfQuestions)) || (Array.isArray(quizConfig.questions) ? String(quizConfig.questions.length) : "0");
            fd.append("no_of_questions", noOfQuestions);
            if (quizConfig.overview?.timeLimit) fd.append("time_limit", String(quizConfig.overview.timeLimit));
            if (quizConfig.overview?.pass_mark) fd.append("pass_mark", String(quizConfig.overview.pass_mark));

            // include questions array if present
            if (Array.isArray(quizConfig.questions) && quizConfig.questions.length > 0) {
              const questionsPayload = quizConfig.questions.map((q: any) => {
                let answerVal = q.answer ?? q.correctAnswer ?? "";
                if (!answerVal && Array.isArray(q.options)) {
                  const found = (q.options as any[]).find((opt: any) => opt && (opt.isCorrect === true || opt.is_correct === true || opt.correct === true));
                  if (found) answerVal = found.text ?? found.label ?? found;
                }

                return {
                  question: q.prompt ?? q.question ?? "",
                  type: q.type ?? "multiple_choice",
                  options: JSON.stringify((q.options ?? []).map((opt: any) => (opt && (opt.text ?? opt)) ?? opt)),
                  answer: answerVal ?? "",
                };
              });
              fd.append("questions", JSON.stringify(questionsPayload));
            }

            try {
              await api.post("/quiz", fd, { headers: { "Content-Type": "multipart/form-data" } });
              toast.success("Saved module quiz");
            } catch (err) {
              // eslint-disable-next-line no-console
              console.error("Failed to create module quiz", err);
            }
          } catch (e) {
            // ignore
          }
        },

        onLessonsCreated: async (_moduleId: number | string, _lessonRes?: any) => {
          // no-op for now
        },
      };

      const response = await createSpoilHandler(
        formData,
        {},
        createModuleHandler,
        createLessonHandler,
        callbacks,
      );

      if (response?.data?.id) {
        // Show the review modal on full success (spoil + modules + lessons)
        setIsReviewModalOpen(true);
      }
    } catch {
            // Failed to fetch cover image URL
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
      // Remove advanced-spoil-draft from storage
      try {
        if (typeof window !== "undefined") {
          localStorage.removeItem("advanced-spoil-draft");
          sessionStorage.removeItem("advanced-spoil-draft");
        }
      } catch (e) {
        // ignore errors
      }

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
    } catch {
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
      } 
      catch  {
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
