"use client";

import { useMemo, useState } from "react";

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
  normalizeQuestions,
} from "./helpers";
import { usePreSpoilQuizFlow } from "./usePreSpoilQuizFlow";

import type { QuizStatItem } from "./types";

interface UsePreSpoilQuizScreenParams {
  spoilId: number | string;
  quizType?: "pre" | "post" | string;
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
  spoilId: number;
  spoilTitle: string;
  visitedQuestions: number[];
  onBack: () => void;
  onChangeResponse: (value: string) => void;
  onGoToQuestion: (index: number) => void;
  onNext: () => void;
  onPrevious: () => void;
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
    });
  }, [quizData, spoil?.quizzes, quizType]);

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
    handleStartQuiz,
    isLastQuestion,
    isSubmitting,
    remainingSeconds,
    responses,
    visitedQuestions,
  } = usePreSpoilQuizFlow({
    normalizedQuestions,
    quizDetailsData,
    quizStage,
    setQuizStage,
    spoilId: resolvedSpoilId,
  });

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
    spoilId: spoil.id,
    spoilTitle: spoil.title,
    visitedQuestions,
    onBack: handleBack,
    onChangeResponse: handleResponseChange,
    onGoToQuestion: handleGoToQuestion,
    onNext: handleNextQuestion,
    onPrevious: handlePreviousQuestion,
    onStartFlow: handleStartFlow,
    onStartSpoil: handleStartSpoil,
  };
};
