import { useState } from "react";

import {
  createLessonHandlers,
  createModuleHandlers,
  createQuizHandler,
} from "./outlineHandlers";

import type { Lesson, Module, OutlineData } from "../types";

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

  const [collapsedModules, setCollapsedModules] = useState<Record<string, boolean>>(
    {},
  );

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
            file: lesson.type === "text" ? null : lesson.file ?? null,
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
    handleModuleSubmit: moduleHandlers.handleSubmit,
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
