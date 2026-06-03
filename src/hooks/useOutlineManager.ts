import { useState } from "react";

import type { Lesson, LessonTypeOption, Module, OutlineData } from "@spt/types";

import {
  createLessonHandlers,
  createModuleHandlers,
  createQuizHandler,
} from "./outlineHandlers";

interface LessonFormState {
  title: string;
  type: LessonTypeOption;
  content: string;
  file: File | string | null;
  description: string;
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
      type: "file",
      content: "",
      file: null,
      description: "",
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
        type: "file",
        content: "",
        file: null,
        description: "",
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
            // Keep the existing upload (a stored URL string) so the edit modal
            // can show its name + remove control instead of an empty field.
            file: lesson.type === "text" ? null : (lesson.file ?? null),
            description: lesson.description ?? "",
          }
        : {
            title: "",
            type: "file",
            content: "",
            file: null,
            description: "",
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
