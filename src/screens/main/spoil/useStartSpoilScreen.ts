"use client";

import { useEffect, useMemo, useState } from "react";

import { useRouter } from "next/navigation";

import HeroImage from "@spt/assets/icons/heroimage3.svg";
import useCompleteLessonMutation from "@spt/hooks/apiRequests/useCompleteLessonMutation";
import useCompleteSpoilMutation from "@spt/hooks/apiRequests/useCompleteSpoilMutation";
import useGetSpoilDetailsQuery from "@spt/hooks/apiRequests/useGetSpoilDetailsQuery";

import {
  getInitialSelection,
  getModuleUnlockBlocker,
  getSpoilQuizGate,
  isModuleUnlocked,
  splitLearningOutcomes,
} from "./startSpoilUtils";

import type { SpoilLesson, SpoilModule } from "./startSpoilUtils";

/**
 * All state, gating and actions behind the Start Spoil page. The page itself
 * only renders what this returns.
 */
export const useStartSpoilScreen = (spoilId: number | string) => {
  const router = useRouter();
  const { completeLessonHandler, isCompletingLesson } = useCompleteLessonMutation();
  const { completeSpoilHandler, isCompletingSpoil } = useCompleteSpoilMutation();
  const { data: spoil, isLoading, isError, errorMessage } =
    useGetSpoilDetailsQuery(spoilId);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [activeModuleId, setActiveModuleId] = useState<number | null>(null);
  const [activeLessonId, setActiveLessonId] = useState<number | null>(null);
  const [openModuleIds, setOpenModuleIds] = useState<Set<number>>(new Set());
  const [isCongratsOpen, setIsCongratsOpen] = useState(false);
  // Id of the lesson whose content is currently shown inline in the panel.
  const [openedLessonId, setOpenedLessonId] = useState<number | null>(null);

  useEffect(() => {
    if (!spoil) return;

    const initialSelection = getInitialSelection(spoil);
    setActiveModuleId(initialSelection.moduleId);
    setActiveLessonId(initialSelection.lessonId);
    setOpenModuleIds(
      initialSelection.moduleId ? new Set([initialSelection.moduleId]) : new Set(),
    );
  }, [spoil]);

  // Pre-quiz gate: a learner must pass the pre-Spoylz quiz before they can take
  // any lesson. Send them to the quiz until it is passed.
  useEffect(() => {
    if (!spoil) return;

    const gate = getSpoilQuizGate(spoil);
    if (gate.preQuiz && !gate.isPreSatisfied) {
      router.replace(`/spoil/${spoil.id}/pre-spoil-quiz`);
    }
  }, [spoil, router]);

  // Later-module gate: if the active module is still locked because an earlier
  // module quiz has not been passed, open that quiz instead of its content.
  useEffect(() => {
    if (!spoil || activeModuleId == null) return;

    const modulesList = spoil.modules ?? [];
    const index = modulesList.findIndex((module) => module.id === activeModuleId);
    if (index <= 0) return;

    const gate = getSpoilQuizGate(spoil);
    const blocker = getModuleUnlockBlocker(modulesList, index, gate);

    if (blocker?.reason === "quiz") {
      router.replace(
        `/spoil/${spoil.id}/module-quiz?moduleId=${blocker.module.id}`,
      );
      return;
    }

    if (blocker?.reason === "incomplete") {
      const fallbackLesson =
        blocker.module.lessons?.find(
          (lesson) => lesson.status?.toLowerCase() === "current",
        ) ?? blocker.module.lessons?.[0];

      setActiveModuleId(blocker.module.id);
      setActiveLessonId(fallbackLesson?.id ?? null);
      setOpenModuleIds(new Set([blocker.module.id]));
    }
  }, [spoil, activeModuleId, router]);

  const modules = useMemo(() => spoil?.modules ?? [], [spoil?.modules]);
  const learningItems = useMemo(
    () => splitLearningOutcomes(spoil?.what_to_learn),
    [spoil?.what_to_learn],
  );
  const totalLessons = useMemo(
    () =>
      modules.reduce(
        (count, module) => count + (module.lessons?.length ?? 0),
        0,
      ),
    [modules],
  );
  const completedLessonsCount = useMemo(
    () =>
      modules.reduce(
        (count, module) =>
          count +
          (module.lessons?.filter((lesson) => lesson.status === "completed")
            .length ?? 0),
        0,
      ),
    [modules],
  );

  const activeModule = useMemo(
    () => modules.find((module) => module.id === activeModuleId) ?? modules[0] ?? null,
    [activeModuleId, modules],
  );
  const activeLesson = useMemo(() => {
    if (!activeModule) return null;

    return (
      activeModule.lessons?.find((lesson) => lesson.id === activeLessonId) ??
      activeModule.lessons?.[0] ??
      null
    );
  }, [activeLessonId, activeModule]);

  const quizGate = useMemo(
    () => (spoil ? getSpoilQuizGate(spoil) : null),
    [spoil],
  );

  // While a gate is active the effects above redirect to the quiz; the page
  // shows this message so lesson content never flashes on screen.
  const redirectMessage = useMemo(() => {
    if (!quizGate) return null;

    if (quizGate.preQuiz && !quizGate.isPreSatisfied) {
      return "Taking you to the pre-Spoylz quiz...";
    }

    const activeModuleIndex = modules.findIndex(
      (module) => module.id === activeModule?.id,
    );
    const blocker =
      activeModuleIndex >= 0
        ? getModuleUnlockBlocker(modules, activeModuleIndex, quizGate)
        : null;

    return blocker?.reason === "quiz" ? "Taking you to the module quiz..." : null;
  }, [activeModule?.id, modules, quizGate]);

  const activeLessonIsCompleted = activeLesson
    ? activeLesson.status === "completed"
    : false;
  const canCompleteSpoil = totalLessons > 0 && completedLessonsCount >= totalLessons;

  const handleToggleModule = (moduleId: number) => {
    if (!quizGate) return;

    const index = modules.findIndex((module) => module.id === moduleId);
    if (index < 0 || !isModuleUnlocked(modules, index, quizGate)) {
      return;
    }

    setOpenModuleIds((current) => {
      const next = new Set(current);

      if (next.has(moduleId)) {
        next.delete(moduleId);
      } else {
        next.add(moduleId);
      }

      return next;
    });
  };

  const handleLockedModule = (module: SpoilModule) => {
    if (!spoil || !quizGate) return false;

    const index = modules.findIndex((item) => item.id === module.id);
    const blocker = getModuleUnlockBlocker(modules, index, quizGate);

    if (blocker?.reason === "quiz") {
      router.push(`/spoil/${spoil.id}/module-quiz?moduleId=${blocker.module.id}`);
      return true;
    }

    if (blocker?.reason === "incomplete") {
      const fallbackLesson =
        blocker.module.lessons?.find(
          (lesson) => lesson.status?.toLowerCase() === "current",
        ) ?? blocker.module.lessons?.[0];

      setActiveModuleId(blocker.module.id);
      setActiveLessonId(fallbackLesson?.id ?? null);
      setOpenModuleIds((current) => new Set([...current, blocker.module.id]));
      return true;
    }

    return false;
  };

  const handleSelectModule = (module: SpoilModule) => {
    if (handleLockedModule(module)) {
      return;
    }

    setActiveModuleId(module.id);
    setActiveLessonId(module.lessons?.[0]?.id ?? null);
    setOpenModuleIds((current) => new Set([...current, module.id]));
  };

  const handleSelectLesson = (module: SpoilModule, lesson: SpoilLesson) => {
    if (handleLockedModule(module)) {
      return;
    }

    setActiveModuleId(module.id);
    setActiveLessonId(lesson.id);
  };

  // Make the lesson active, then open its content inline — the same behaviour
  // as the hero play button, triggered from the sidebar "Open".
  const handleOpenLesson = (module: SpoilModule, lesson: SpoilLesson) => {
    if (handleLockedModule(module)) {
      return;
    }

    handleSelectLesson(module, lesson);

    if (lesson.content_url) {
      // Open the file inline in the panel (same as the hero "open" action).
      setOpenedLessonId(lesson.id);
    }
  };

  const handleOpenLessonContent = () => {
    if (activeModule && handleLockedModule(activeModule)) {
      return;
    }

    if (!activeLesson?.content_url) {
      return;
    }

    // Show the file inline in the panel instead of opening a new tab.
    setOpenedLessonId(activeLesson.id);
  };

  const handleCompleteLesson = async () => {
    if (!spoil || !quizGate || !activeLesson) {
      return;
    }

    // Already completed — don't call the API again or re-open the modal.
    if (activeLessonIsCompleted) {
      return;
    }

    if (activeModule && handleLockedModule(activeModule)) {
      return;
    }

    if (isCompletingLesson) {
      return;
    }

    const response = await completeLessonHandler(activeLesson.id);

    if (!response) {
      return;
    }

    const remainingInModule =
      activeModule?.lessons?.filter(
        (lesson) =>
          lesson.id !== activeLesson.id &&
          lesson.status?.toLowerCase() !== "completed",
      ) ?? [];
    const moduleQuiz = activeModule
      ? quizGate.getModuleQuiz(activeModule.id)
      : null;
    const moduleQuizPending =
      !!moduleQuiz &&
      !!activeModule &&
      !quizGate.isModuleQuizSatisfied(activeModule.id);

    // Last lesson in this module — send the learner to the module quiz before
    // they can open the next module's content.
    if (remainingInModule.length === 0 && moduleQuizPending && activeModule) {
      router.push(`/spoil/${spoil.id}/module-quiz?moduleId=${activeModule.id}`);
      return;
    }

    // If this was the last outstanding lesson, the whole Spoylz is now 100%
    // complete — mark it complete so the certificate is generated. Respect the
    // post-quiz gate: when a post-Spoylz quiz is still outstanding we leave the
    // spoil for the learner to finish via the sidebar "Complete Spoil" action.
    const justCompletedFinalLesson =
      totalLessons > 0 &&
      completedLessonsCount + (activeLessonIsCompleted ? 0 : 1) >= totalLessons;
    const postQuizPending = quizGate.postQuiz && !quizGate.isPostSatisfied;

    if (justCompletedFinalLesson && !postQuizPending) {
      await completeSpoilHandler(spoil.id);
    }

    // Celebrate the completed lesson; the card offers the certificate when one
    // is available (has_certificate === 1).
    setIsCongratsOpen(true);
  };

  const handleCompleteSpoil = async () => {
    if (!spoil || !quizGate || isCompletingSpoil) {
      return;
    }

    // Post-quiz gate: the learner must take the post-Spoylz quiz before the
    // spoil can be marked complete.
    if (quizGate.postQuiz && !quizGate.isPostSatisfied) {
      router.push(`/spoil/${spoil.id}/post-spoil-quiz`);
      return;
    }

    const response = await completeSpoilHandler(spoil.id);

    if (response) {
      // After successfully completing a spoil, take the learner to My Learnings
      // and show the completed tab so they can access their certificate.
      router.push(`/my-learnings?tab=completed`);
    }
  };

  return {
    activeLesson,
    activeLessonIsCompleted,
    activeModule,
    canCompleteSpoil,
    closeCongrats: () => setIsCongratsOpen(false),
    closeContent: () => setOpenedLessonId(null),
    completedLessonsCount,
    errorMessage,
    handleCompleteLesson,
    handleCompleteSpoil,
    handleOpenLesson,
    handleOpenLessonContent,
    handleSelectLesson,
    handleSelectModule,
    handleToggleModule,
    heroImage: spoil?.cover_image_url || HeroImage,
    isCompletingLesson,
    isCompletingSpoil,
    isCongratsOpen,
    isContentOpen: !!activeLesson && openedLessonId === activeLesson.id,
    isError,
    isLoading,
    isSidebarVisible,
    learningItems,
    modules,
    openModuleIds,
    redirectMessage,
    setIsSidebarVisible,
    spoil,
    totalLessons,
  };
};
