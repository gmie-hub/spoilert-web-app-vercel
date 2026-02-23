import { useState } from "react";

import useCreateModuleMutation from "@spt/hooks/apiRequests/useCreateModuleMutation";
import type { Lesson, Module, OutlineData } from "@spt/types";

import {
  createLessonHandlers,
  createModuleHandlers,
  createQuizHandler,
} from "./outlineHandlers";

interface LessonFormState {
  title: string;
  type: "video" | "pdf" | "text";
  content: string;
  file: File | null;
}

export const useOutlineManager = (
  data: OutlineData,
  onChange: (value: OutlineData) => void,
) => {
  const [moduleModalState, setModuleModalState] = useState({
    open: false,
    editingId: null as string | null,
    initialValues: { title: "", description: "" },
  });

  const [lessonModalState, setLessonModalState] = useState<{
    open: boolean;
    moduleId: string | null;
    lessonId: string | null;
    initialValues: LessonFormState;
  }>({
    open: false,
    moduleId: null,
    lessonId: null,
    initialValues: {
      title: "",
      type: "video",
      content: "",
      file: null,
    },
  });

  const [quizModalState, setQuizModalState] = useState({
    open: false,
    variant: "pre" as "pre" | "post",
    initialValues: { title: "", description: "" },
  });

  const [collapsedModules, setCollapsedModules] = useState<
    Record<string, boolean>
  >({});

  const updateOutline = (updates: Partial<OutlineData>) => {
    onChange({ ...data, ...updates });
  };

  const closeModuleModal = () => {
    setModuleModalState({
      open: false,
      editingId: null,
      initialValues: { title: "", description: "" },
    });
  };

  const openModuleModal = (module?: Module) => {
    setModuleModalState({
      open: true,
      editingId: module?.id ?? null,
      initialValues: module
        ? { title: module.title, description: module.description }
        : { title: "", description: "" },
    });
  };

  const closeLessonModal = () => {
    setLessonModalState({
      open: false,
      moduleId: null,
      lessonId: null,
      initialValues: {
        title: "",
        type: "video",
        content: "",
        file: null,
      },
    });
  };

  const openLessonModal = (moduleId: string, lesson?: Lesson) => {
    setLessonModalState({
      open: true,
      moduleId,
      lessonId: lesson?.id ?? null,
      initialValues: lesson
        ? {
            title: lesson.title,
            type: lesson.type,
            content: lesson.type === "text" ? lesson.content : "",
            file: lesson.type === "text" ? null : (lesson.file ?? null),
          }
        : {
            title: "",
            type: "video",
            content: "",
            file: null,
          },
    });
  };

  const closeQuizModal = () => {
    setQuizModalState({
      open: false,
      variant: "pre",
      initialValues: { title: "", description: "" },
    });
  };

  const openQuizModal = (variant: "pre" | "post") => {
    const quizData = variant === "pre" ? data.preQuiz : data.postQuiz;
    setQuizModalState({
      open: true,
      variant,
      initialValues: {
        title: quizData?.title ?? "",
        description: quizData?.description ?? "",
      },
    });
  };

  const toggleModuleCollapse = (moduleId: string) => {
    setCollapsedModules((prev) => ({ ...prev, [moduleId]: !prev[moduleId] }));
  };

  const moduleHandlers = createModuleHandlers(
    data,
    updateOutline,
    moduleModalState,
    closeModuleModal,
  );

  const { createModuleHandler, isLoading: isCreatingModule } = useCreateModuleMutation();

  // wrap module submit to also call API when creating a new module (not editing)
  const handleModuleSubmit = async (
    values: { title: string; description: string },
    helpers: any,
  ) => {
    // If editing, just use local handler
    if (moduleModalState.editingId) {
      moduleHandlers.handleSubmit(values, helpers);
      return;
    }

    // Try to create on server first when spoil_id is present so we can use server id
    // prefer canonical server field `spoil_id` (set in CreateSpoil.index when spoil is created)
    const spoilId = (data as any).spoil_id ?? null;
    if (spoilId) {
      try {
        const res = await createModuleHandler({
          title: values.title.trim(),
          description: values.description.trim(),
          spoil_id: spoilId,
        });

        const serverModuleId = res?.data?.id ?? res?.data?.module?.id ?? null;
        // Add locally using server id
        moduleHandlers.handleSubmit(values, helpers, serverModuleId ?? undefined);
        return;
      } catch (err) {
        // API error handled by hook (toast); fall back to local add
        moduleHandlers.handleSubmit(values, helpers);
        return;
      }
    }

    // No spoil id yet; create locally first for immediate UI feedback
    moduleHandlers.handleSubmit(values, helpers);
  };

  const lessonHandlers = createLessonHandlers(
    data,
    updateOutline,
    lessonModalState,
    closeLessonModal,
  );

  const quizHandlers = createQuizHandler(
    updateOutline,
    quizModalState,
    closeQuizModal,
  );

  return {
    moduleModalState,
    lessonModalState,
    quizModalState,
    collapsedModules,
    openModuleModal,
    closeModuleModal,
    handleModuleSubmit,
    handleDeleteModule: moduleHandlers.handleDelete,
    toggleModuleCollapse,
    openLessonModal,
    closeLessonModal,
    handleLessonSubmit: lessonHandlers.handleSubmit,
    handleDeleteLesson: lessonHandlers.handleDelete,
    openQuizModal,
    closeQuizModal,
    handleQuizSubmit: quizHandlers.handleSubmit,
  };
};
