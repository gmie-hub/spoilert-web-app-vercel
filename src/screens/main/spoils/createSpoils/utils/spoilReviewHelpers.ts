import toast from "react-hot-toast";

import useCreateSpoilStore from "@spt/store/createSpoilStore";
import type { OutlineData } from "@spt/types";

import { createQuizAndQuestions } from "./quizHelpers";

export const isServerEntityId = (value: string | number) => /^\d+$/.test(String(value));

const getLessonUpdatePayload = (lesson: OutlineData["modules"][number]["lessons"][number]) => ({
  lessonId: lesson.id,
  title: lesson.title,
  type: lesson.type,
  content: lesson.type === "text" ? lesson.content : undefined,
  file: lesson.file instanceof File ? lesson.file : null,
  description: lesson.description ?? "",
});

export const getCreatedSpoilId = (response: any) =>
  response?.data?.id ?? response?.data?.spoil_id ?? response?.data?.data?.id ?? null;

export const clearPersistedAdvancedDraft = () => {
  try {
    if (typeof window !== "undefined") {
      localStorage.removeItem("advanced-spoil-draft");
      sessionStorage.removeItem("advanced-spoil-draft");
    }
  } catch {
    // ignore storage errors
  }
};

export const resetDraftProgress = () => {
  try {
    useCreateSpoilStore.getState().resetDraft?.();
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("advanced-spoil-step");
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Failed to clear draft storage:", error);
  }
};

export const validateDraftQuizzes = () => {
  const errors: string[] = [];

  try {
    const basics = useCreateSpoilStore.getState().basics ?? {};
    const outline = useCreateSpoilStore.getState().outline ?? { modules: [] };

    const checkQuiz = (quiz: any, label: string) => {
      if (!quiz) return;

      const questionCount = Array.isArray(quiz.questions)
        ? quiz.questions.length
        : (quiz.overview?.numberOfQuestions ? Number(quiz.overview.numberOfQuestions) : 0);
      const timeLimit = quiz.overview?.timeLimit ?? quiz.time_limit ?? null;

      if (!questionCount || questionCount <= 0) {
        errors.push(`${label}: add at least one question`);
      }
      if (!timeLimit) {
        errors.push(`${label}: time limit is required`);
      }
    };

    checkQuiz((basics as any).preQuiz, "Pre-spoil quiz");
    checkQuiz((basics as any).postQuiz, "Post-spoil quiz");

    (outline.modules || []).forEach((module: any, index: number) => {
      if (module.quiz) {
        checkQuiz(module.quiz, `Module ${index + 1} quiz`);
      }
    });
  } catch {
    // ignore validation lookup failures
  }

  if (errors.length > 0) {
    toast.error(errors.join("; "));
    return false;
  }

  return true;
};

export const buildQuizCallbacks = () => ({
  onSpoilCreated: async (spoilId: number | string) => {
    try {
      const basics = useCreateSpoilStore.getState().basics ?? {};
      const preQuiz = (basics as any).preQuiz;
      const postQuiz = (basics as any).postQuiz;

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
    } catch {
      // ignore callback failures
    }
  },

  onModuleCreated: async (moduleId: number | string, moduleRes?: any, originalModule?: any) => {
    try {
      const outline = useCreateSpoilStore.getState().outline ?? { modules: [] };
      const localModuleId = originalModule?.id ?? null;
      let quizConfig: any = null;

      if (localModuleId) {
        const localModule = (outline.modules || []).find(
          (module: any) => String(module.id) === String(localModuleId),
        );
        if (localModule && (localModule as any).quiz) {
          quizConfig = (localModule as any).quiz;
        }
      }

      if (!quizConfig) {
        return;
      }

      try {
        await createQuizAndQuestions(quizConfig, { type: "module", moduleId, moduleRes });
      } catch {
        // ignore per original behavior
      }
    } catch {
      // ignore callback failures
    }
  },
});

export const syncOutlineChanges = async ({
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
