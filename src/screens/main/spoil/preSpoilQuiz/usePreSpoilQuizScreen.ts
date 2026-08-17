"use client";

import { useEffect, useMemo, useState } from "react";

import { useRouter } from "next/navigation";

import { useGetQuizBySpoilId } from "@spt/hooks/apiRequests/useGetQuizBySpoilId";
import { useGetQuizDetailsQuery } from "@spt/hooks/apiRequests/useGetQuizDetailsQuery";
import useGetSpoilDetailsQuery from "@spt/hooks/apiRequests/useGetSpoilDetailsQuery";
import type { QuizDetailsData } from "@spt/types/quiz";

import { getSpoilQuizPageContent } from "./content";
import {
  type NormalizedQuestion,
  type QuizStage,
  getSpoilQuizByType,
  hasReachedPassMark,
  normalizeQuestions,
} from "./helpers";
import { usePreSpoilQuizFlow } from "./usePreSpoilQuizFlow";

import type { QuizStatItem } from "./types";

interface UsePreSpoilQuizScreenParams {
  spoilId: number | string;
  quizType?: "pre" | "post" | "module" | string;
  moduleId?: number | string | null;
}

interface PreSpoilQuizBaseState {
  breadcrumbLabel: string;
  description: string;
  pageTitle: string;
  primaryButtonLabel: string;
  quizStats: QuizStatItem[];
}

export interface ReadyPreSpoilQuizScreenState extends PreSpoilQuizBaseState {
  answeredQuestionsCount: number;
  correctAnswersCount: number;
  currentQuestion: NormalizedQuestion | null;
  currentQuestionIndex: number;
  hasAlreadyPassed: boolean;
  hasPassed: boolean;
  isLastQuestion: boolean;
  isQuizDetailsError: boolean;
  isQuizDetailsLoading: boolean;
  isSubmitting: boolean;
  normalizedQuestions: NormalizedQuestion[];
  preSpoilQuizPassMark?: string;
  preSpoilQuizTimeLimit?: number;
  quizDetailsData?: QuizDetailsData;
  quizDetailsErrorMessage: string;
  quizStage: QuizStage;
  remainingSeconds: number | null;
  responses: Record<number, string>;
  scorePercent: number;
  spoilId: number;
  spoilTitle: string;
  totalQuestionsCount: number;
  visitedQuestions: number[];
  onBack: () => void;
  onChangeResponse: (value: string) => void;
  onGoToQuestion: (index: number) => void;
  onNext: () => void;
  onPrevious: () => void;
  onRetry: () => void;
  onStartFlow: () => void;
  onStartSpoil: () => void;
}

type PreSpoilQuizScreenState =
  | { status: "loading" }
  | { message: string; status: "error" | "empty" }
  | ({ status: "ready" } & ReadyPreSpoilQuizScreenState);

export const usePreSpoilQuizScreen = ({
  spoilId,
  quizType = "pre",
  moduleId,
}: UsePreSpoilQuizScreenParams): PreSpoilQuizScreenState => {
  const router = useRouter();
  const [quizStage, setQuizStage] = useState<QuizStage>("intro");
  const resolvedSpoilId = Number.isFinite(Number(spoilId)) ? Number(spoilId) : 0;

  const {
    data: spoil,
    isLoading,
    isError,
    errorMessage,
  } = useGetSpoilDetailsQuery(spoilId);
  const { quizData } = useGetQuizBySpoilId(resolvedSpoilId);

  const preSpoilQuiz = useMemo(() => {
    return getSpoilQuizByType({
      quizData,
      spoilQuizzes: spoil?.quizzes,
      type: quizType,
      moduleId,
    });
  }, [quizData, spoil?.quizzes, quizType, moduleId]);

  const {
    quizDetailsData,
    isQuizDetailsLoading,
    quizDetailsErrorMessage,
    isQuizDetailsError,
  } = useGetQuizDetailsQuery(preSpoilQuiz?.id ?? 0, {
    enabled: quizStage === "quiz" || quizStage === "completed",
  });

  const normalizedQuestions = useMemo(
    () => normalizeQuestions(quizDetailsData?.questions),
    [quizDetailsData?.questions],
  );

  const {
    answeredQuestionsCount,
    correctAnswersCount,
    currentQuestion,
    currentQuestionIndex,
    handleGoToQuestion,
    handleNextQuestion,
    handlePreviousQuestion,
    handleResponseChange,
    handleRetryQuiz,
    handleStartQuiz,
    hasPassed,
    isLastQuestion,
    isSubmitting,
    remainingSeconds,
    responses,
    scorePercent,
    totalQuestionsCount,
    visitedQuestions,
  } = usePreSpoilQuizFlow({
    normalizedQuestions,
    quizDetailsData,
    quizStage,
    setQuizStage,
    spoilId: resolvedSpoilId,
  });

  // Whether the learner already passed this quiz in a previous session, from the
  // spoil summary (attempts + highest score) for the relevant quiz type.
  const hasAlreadyPassed = useMemo(() => {
    if (!spoil || !preSpoilQuiz) {
      return false;
    }

    const summary =
      quizType === "post"
        ? spoil.post_spoil_quiz
        : quizType === "module"
          ? spoil.module_spoil_quiz
          : spoil.pre_spoil_quiz;

    if (Number(summary?.attempts ?? 0) <= 0) {
      return false;
    }

    return hasReachedPassMark(
      Number(summary?.highest_score ?? 0),
      preSpoilQuiz.pass_mark,
    );
  }, [spoil, preSpoilQuiz, quizType]);

  // Already passed → no need to show the quiz again. Send the learner on to the
  // spoil. Only redirect from the intro so an in-progress or just-completed
  // attempt is never interrupted.
  useEffect(() => {
    if (hasAlreadyPassed && quizStage === "intro" && spoil) {
      router.replace(`/spoil/${spoil.id}/start`);
    }
  }, [hasAlreadyPassed, quizStage, spoil, router]);

  if (isLoading) {
    return { status: "loading" };
  }

  if (isError) {
    return { message: errorMessage, status: "error" };
  }

  if (!spoil) {
    return { message: "Quiz overview is unavailable.", status: "empty" };
  }

  const pageContent = getSpoilQuizPageContent({
    quizDatum: preSpoilQuiz,
    spoil,
    type: quizType,
  });

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }

    router.push(`/spoil/${spoil.id}`);
  };

  const handleStartSpoil = () => {
    router.push(`/spoil/${spoil.id}/start`);
  };

  const handleStartFlow = () => {
    if (!preSpoilQuiz) {
      handleStartSpoil();
      return;
    }

    handleStartQuiz();
  };

  return {
    status: "ready",
    answeredQuestionsCount,
    breadcrumbLabel: pageContent.pageCrumbLabel,
    correctAnswersCount,
    currentQuestion,
    currentQuestionIndex,
    description: pageContent.description,
    hasAlreadyPassed,
    hasPassed,
    isLastQuestion,
    isQuizDetailsError,
    isQuizDetailsLoading,
    isSubmitting,
    normalizedQuestions,
    pageTitle: pageContent.pageTitle,
    preSpoilQuizPassMark: preSpoilQuiz?.pass_mark,
    preSpoilQuizTimeLimit: preSpoilQuiz?.time_limit,
    primaryButtonLabel: pageContent.primaryButtonLabel,
    quizDetailsData,
    quizDetailsErrorMessage,
    quizStage,
    quizStats: pageContent.quizStats,
    remainingSeconds,
    responses,
    scorePercent,
    spoilId: spoil.id,
    spoilTitle: spoil.title,
    totalQuestionsCount,
    visitedQuestions,
    onBack: handleBack,
    onChangeResponse: handleResponseChange,
    onGoToQuestion: handleGoToQuestion,
    onNext: handleNextQuestion,
    onPrevious: handlePreviousQuestion,
    onRetry: handleRetryQuiz,
    onStartFlow: handleStartFlow,
    onStartSpoil: handleStartSpoil,
  };
};
