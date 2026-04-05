import type { Lesson, Module, OutlineData, QuizConfig } from "@spt/types";

import type { FormikHelpers } from "formik";

const generateId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

interface ModuleFormState {
  title: string;
  description: string;
}

interface LessonFormState {
  title: string;
  type: "video" | "pdf" | "text";
  content: string;
  file: File | null;
  description: string;
}

interface QuizFormState {
  title: string;
  description: string;
}

export const createModuleHandlers = (
  data: OutlineData,
  updateOutline: (updates: Partial<OutlineData>) => void,
  modalState: { editingId: string | null },
  closeModal: () => void,
) => {
  const handleSubmit = (
    values: ModuleFormState,
    helpers: FormikHelpers<ModuleFormState>,
    serverId?: string | number,
  ) => {
    const payload = {
      title: values.title.trim(),
      description: values.description.trim(),
    };

    if (modalState.editingId) {
      const updatedModules = data.modules.map((module: Module) =>
        module.id === modalState.editingId ? { ...module, ...payload } : module,
      );
      updateOutline({ modules: updatedModules });
    } else {
      const newModule: Module = {
        id: serverId ? String(serverId) : generateId(),
        ...payload,
        lessons: [],
      };
      updateOutline({ modules: [...data.modules, newModule] });
    }

    helpers.setSubmitting(false);
    closeModal();
  };

  const handleDelete = (moduleId: string) => {
    const updatedModules = data.modules.filter(
      (module: Module) => module.id !== moduleId,
    );
    updateOutline({ modules: updatedModules });
  };

  return { handleSubmit, handleDelete };
};

export const createLessonHandlers = (
  data: OutlineData,
  updateOutline: (updates: Partial<OutlineData>) => void,
  modalState: { moduleId: string | null; lessonId: string | null },
  closeModal: () => void,
) => {
  const handleSubmit = (
    values: LessonFormState,
    helpers: FormikHelpers<LessonFormState>,
  ) => {
    if (!modalState.moduleId) {
      helpers.setSubmitting(false);
      return;
    }

    const targetModule = data.modules.find(
      (module: Module) => module.id === modalState.moduleId,
    );

    if (!targetModule) {
      helpers.setSubmitting(false);
      return;
    }

    const existingLesson = modalState.lessonId
      ? targetModule.lessons.find(
          (lesson: Lesson) => lesson.id === modalState.lessonId,
        )
      : undefined;

    const fileAsset =
      values.type === "text"
        ? null
        : (values.file ?? existingLesson?.file ?? null);
    const resolvedFileName =
      values.type === "text"
        ? undefined
        : fileAsset instanceof File
          ? fileAsset.name
          : typeof fileAsset === "string"
            ? fileAsset.split("/").pop()
            : existingLesson?.fileName;

    const newLesson: Lesson = {
      id: modalState.lessonId ?? generateId(),
      title: values.title.trim(),
      type: values.type,
      content: values.type === "text" ? values.content.trim() : "",
      file: values.type === "text" ? null : fileAsset,
      fileName: resolvedFileName,
      description: values.description?.trim() ?? "",
    };

    const updatedModules = data.modules.map((module: Module) => {
      if (module.id !== modalState.moduleId) {
        return module;
      }

      const lessons = existingLesson
        ? module.lessons.map((lesson: Lesson) =>
            lesson.id === existingLesson.id ? newLesson : lesson,
          )
        : [...module.lessons, newLesson];

      return { ...module, lessons };
    });

    updateOutline({ modules: updatedModules });
    helpers.setSubmitting(false);
    closeModal();
  };

  const handleDelete = (moduleId: string, lessonId: string) => {
    const updatedModules = data.modules.map((module: Module) => {
      if (module.id !== moduleId) {
        return module;
      }
      return {
        ...module,
        lessons: module.lessons.filter(
          (lesson: Lesson) => lesson.id !== lessonId,
        ),
      };
    });
    updateOutline({ modules: updatedModules });
  };

  return { handleSubmit, handleDelete };
};

export const createQuizHandler = (
  updateOutline: (updates: Partial<OutlineData>) => void,
  modalState: { variant: "pre" | "post" },
  closeModal: () => void,
) => {
  const handleSubmit = (
    values: QuizFormState,
    helpers: FormikHelpers<QuizFormState>,
  ) => {
    const quizConfig: QuizConfig = {
      id: modalState.variant + generateId(),
      title: values.title.trim(),
      description: values.description.trim(),
    };

    updateOutline(
      modalState.variant === "pre"
        ? { preQuiz: quizConfig }
        : { postQuiz: quizConfig },
    );

    helpers.setSubmitting(false);
    closeModal();
  };

  return { handleSubmit };
};
