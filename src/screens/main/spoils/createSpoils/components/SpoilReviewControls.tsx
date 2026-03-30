"use client";

import { type FC, useState } from "react";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import useCreateLessonMutation from "@spt/hooks/apiRequests/useCreateLessonMutation";
import useCreateModuleMutation from "@spt/hooks/apiRequests/useCreateModuleMutation";
import useDeleteLesson from "@spt/hooks/apiRequests/useDeleteLesson";
import useDeleteModule from "@spt/hooks/apiRequests/useDeleteModule";
import { useCreateSpoilMutation } from "@spt/hooks/apiRequests/useCreateSpoilMutation";
import useGetSpoilDetailsQuery from "@spt/hooks/apiRequests/useGetSpoilDetailsQuery";
import useUpdateLessonMutation from "@spt/hooks/apiRequests/useUpdateLessonMutation";
import useUpdateModuleMutation from "@spt/hooks/apiRequests/useUpdateModuleMutation";
import useUpdateSpoilMutation from "@spt/hooks/apiRequests/useUpdateSpoilMutation";
import useCreateSpoilStore from "@spt/store/createSpoilStore";
import type { OutlineData } from "@spt/types";

import CreateCommunityModal from "../components/CreateCommunityModal";
import CreateCommunitySuccessModal from "../components/CreateCommunitySuccessModal";
import CreateScheduledCommunityModal from "../components/CreateScheduledCommunityModal";
import ReviewModal from "../components/ReviewModal";
import ScheduleSpoilPremiereModal, {
  type SchedulePremiereFormState,
} from "../components/ScheduleSpoilPremiereModal";
import SpoilScheduledModal from "../components/SpoilScheduledModal";
import ReviewActionButtons from "../steps/components/ReviewActionButtons";
import { mapSpoilDetailsToOutline } from "../steps/spoilBasicsHelpers";
import { createQuizAndQuestions } from "../utils/quizHelpers";

import type { BasicsFormData, SpoilTypeOption } from "../types";


interface Props {
  isEditMode?: boolean;
  spoilId?: number | string | null;
  selectedType: SpoilTypeOption;
  onPrevious: () => void;
  onSubmit: () => void;
}

const isServerEntityId = (value: string | number) => /^\d+$/.test(String(value));

const getLessonUpdatePayload = (lesson: OutlineData["modules"][number]["lessons"][number]) => ({
  lessonId: lesson.id,
  title: lesson.title,
  type: lesson.type,
  content: lesson.type === "text" ? lesson.content : undefined,
  file: lesson.file instanceof File ? lesson.file : null,
  description: lesson.description ?? "",
});

const syncOutlineChanges = async ({
  spoilId,
  currentOutline,
  initialOutline,
  createModuleHandler,
  createLessonHandler,
  updateModuleHandler,
  updateLessonHandler,
  deleteModuleHandler,
  deleteLessonHandler,
}: {
  spoilId: number | string;
  currentOutline: OutlineData;
  initialOutline: OutlineData;
  createModuleHandler: (payload: {
    title: string;
    description?: string;
    spoil_id: number | string;
  }) => Promise<any>;
  createLessonHandler: (
    moduleId: number | string,
    lessons: {
      title: string;
      type: string;
      content?: string;
      file?: File | null;
      description?: string;
    }[],
  ) => Promise<any>;
  updateModuleHandler: (payload: {
    moduleId: number | string;
    title: string;
    description?: string;
  }) => Promise<any>;
  updateLessonHandler: (payload: {
    lessonId: number | string;
    title: string;
    type: string;
    content?: string;
    file?: File | null;
    description?: string;
  }) => Promise<any>;
  deleteModuleHandler: (id: number | string) => Promise<any>;
  deleteLessonHandler: (id: number | string) => Promise<any>;
}) => {
  const initialModules = new Map(
    initialOutline.modules.map((module) => [String(module.id), module]),
  );
  const currentModules = new Map(
    currentOutline.modules.map((module) => [String(module.id), module]),
  );

  for (const [moduleId, module] of initialModules.entries()) {
    if (!currentModules.has(moduleId) && isServerEntityId(moduleId)) {
      await deleteModuleHandler(moduleId);
    } else if (currentModules.has(moduleId)) {
      const currentModule = currentModules.get(moduleId)!;
      const initialLessons = new Map(
        module.lessons.map((lesson) => [String(lesson.id), lesson]),
      );
      const currentLessons = new Map(
        currentModule.lessons.map((lesson) => [String(lesson.id), lesson]),
      );

      for (const [lessonId] of initialLessons.entries()) {
        if (!currentLessons.has(lessonId) && isServerEntityId(lessonId)) {
          await deleteLessonHandler(lessonId);
        }
      }
    }
  }

  for (const module of currentOutline.modules) {
    if (isServerEntityId(module.id)) {
      await updateModuleHandler({
        moduleId: module.id,
        title: module.title,
        description: module.description,
      });

      for (const lesson of module.lessons) {
        if (isServerEntityId(lesson.id)) {
          await updateLessonHandler(getLessonUpdatePayload(lesson));
        } else {
          await createLessonHandler(module.id, [
            {
              title: lesson.title,
              type: lesson.type,
              content: lesson.type === "text" ? lesson.content : undefined,
              file: lesson.file instanceof File ? lesson.file : null,
              description: lesson.description ?? "",
            },
          ]);
        }
      }

      continue;
    }

    const moduleRes = await createModuleHandler({
      title: module.title,
      description: module.description,
      spoil_id: spoilId,
    });
    const createdModuleId =
      moduleRes?.data?.id ??
      moduleRes?.data?.module_id ??
      moduleRes?.data?.data?.id ??
      null;

    if (createdModuleId && module.lessons.length > 0) {
      await createLessonHandler(
        createdModuleId,
        module.lessons.map((lesson) => ({
          title: lesson.title,
          type: lesson.type,
          content: lesson.type === "text" ? lesson.content : undefined,
          file: lesson.file instanceof File ? lesson.file : null,
          description: lesson.description ?? "",
        })),
      );
    }
  }
};

const SpoilReviewControls: FC<Props> = ({
  isEditMode = false,
  spoilId = null,
  selectedType,
  onPrevious,
  onSubmit,
}) => {
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

  const { createSpoilHandler } = useCreateSpoilMutation();
  const { updateSpoilHandler } = useUpdateSpoilMutation();
  const { createModuleHandler } = useCreateModuleMutation();
  const { createLessonHandler } = useCreateLessonMutation();
  const { updateModuleHandler } = useUpdateModuleMutation();
  const { updateLessonHandler } = useUpdateLessonMutation();
  const { deleteModuleHandler } = useDeleteModule();
  const { deleteLessonHandler } = useDeleteLesson();
  const { data: spoilDetails } = useGetSpoilDetailsQuery(spoilId);
  const router = useRouter();

  const updateEditedSpoil = async (
    overrides: Partial<BasicsFormData> = {},
    options?: { redirectAfterSuccess?: boolean },
  ) => {
    if (!isEditMode || !spoilId) {
      return false;
    }

    const { basics, outline } = useCreateSpoilStore.getState();
    const mergedBasics = {
      ...(basics as BasicsFormData),
      ...overrides,
      type: selectedType,
    };

    await updateSpoilHandler(
      spoilId,
      mergedBasics,
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
        await updateEditedSpoil({ is_draft: 0 });
      } catch {
        // update handlers already show toast feedback
      }

      return;
    }

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

      if (response?.data?.id) {
        setIsReviewModalOpen(true);
      }
    } catch {
      // ignore
    }
  };

  const handleCloseModal = () => setIsReviewModalOpen(false);

  const handleCreateCommunityFromReview = () => {
    setIsReviewModalOpen(false);
    setIsCreateCommunitySuccessModalOpen(true);
  };

  const handleSkipCommunityFromReview = () => {
    setIsReviewModalOpen(false);
    onSubmit();
  };

  const handleSchedulePremiereClick = () => setIsSchedulePremiereModalOpen(true);

  const handleSaveToDraftClick = async () => {
    if (isEditMode) {
      try {
        await updateEditedSpoil({ is_draft: 1 });
      } catch {
        // update handlers already show toast feedback
      }
      return;
    }

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

      // const res = await createSpoilHandler(
      //   new FormData(),
      //   { setSubmitting: (_: boolean) => {} },
      //   createModuleHandler,
      //   createLessonHandler,
      // );

      try {
        try {
          useCreateSpoilStore.getState().resetDraft?.();
          if (typeof window !== "undefined") sessionStorage.removeItem("advanced-spoil-step");
        } catch (clearErr) {
          // eslint-disable-next-line no-console
          console.error("Failed to clear draft storage:", clearErr);
        }

        router.push("/create-spoils");
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error("Navigation to /create-spoils failed", e);
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
        if (isEditMode && spoilId) {
          await updateEditedSpoil(
            {
              scheduledDate: values.date,
              scheduledTime: values.time,
              is_draft: 0,
              expiryDate: useCreateSpoilStore.getState().basics.expiryDate,
              type: selectedType,
            },
            { redirectAfterSuccess: false },
          );
          setIsSchedulePremiereModalOpen(false);
          setIsSpoilScheduledModalOpen(true);
          return;
        }

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
    })();
  };

  const handleCreateCommunity = () => {
    setIsCreateCommunityModalOpen(false);
    setIsCreateCommunitySuccessModalOpen(true);
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
    </>
  );
};

export default SpoilReviewControls;
