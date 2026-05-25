import { useEffect, useMemo, useState } from "react";

import useSubmitQuizAttemptMutation from "@spt/hooks/apiRequests/useSubmitQuizAttemptMutation";
import type { QuizDetailsData } from "@spt/types/quiz";

import {
  type NormalizedQuestion,
  type QuizStage,
  normalizeAnswer,
} from "./helpers";

interface UsePreSpoilQuizFlowParams {
  normalizedQuestions: NormalizedQuestion[];
  quizDetailsData?: QuizDetailsData;
  quizStage: QuizStage;
  setQuizStage: (stage: QuizStage) => void;
  spoilId: number;
}

export const usePreSpoilQuizFlow = ({
  normalizedQuestions,
  quizDetailsData,
  quizStage,
  setQuizStage,
  spoilId,
}: UsePreSpoilQuizFlowParams) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<Record<number, string>>({});
  const [visitedQuestions, setVisitedQuestions] = useState<number[]>([0]);
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);

  const { submitQuizAttempt, isSubmitting } = useSubmitQuizAttemptMutation();

  const currentQuestion = normalizedQuestions[currentQuestionIndex] ?? null;
  const isLastQuestion =
    normalizedQuestions.length > 0 &&
    currentQuestionIndex === normalizedQuestions.length - 1;

  const answeredQuestionsCount = useMemo(
    () =>
      normalizedQuestions.filter((question) =>
        Boolean(responses[question.id]?.trim()),
      ).length,
    [normalizedQuestions, responses],
  );

  const correctAnswersCount = useMemo(
    () =>
      normalizedQuestions.filter(
        (question) =>
          normalizeAnswer(question.answer) ===
          normalizeAnswer(responses[question.id]),
      ).length,
    [normalizedQuestions, responses],
  );

  useEffect(() => {
    setQuizStage("intro");
    setCurrentQuestionIndex(0);
    setResponses({});
    setVisitedQuestions([0]);
    setRemainingSeconds(null);
  }, [spoilId, setQuizStage]);

  useEffect(() => {
    if (quizStage !== "quiz" || !quizDetailsData) {
      return;
    }

    const durationInSeconds = Math.max(
      Number(quizDetailsData.time_limit ?? 0) * 60,
      0,
    );
    setRemainingSeconds(durationInSeconds);

    if (durationInSeconds <= 0) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setRemainingSeconds((previousSeconds) => {
        if (previousSeconds === null || previousSeconds <= 1) {
          window.clearInterval(intervalId);
          return 0;
        }

        return previousSeconds - 1;
      });
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [quizDetailsData, quizStage]);

  useEffect(() => {
    if (quizStage !== "quiz") {
      return;
    }

    setVisitedQuestions((previousQuestions) =>
      previousQuestions.includes(currentQuestionIndex)
        ? previousQuestions
        : [...previousQuestions, currentQuestionIndex],
    );
  }, [currentQuestionIndex, quizStage]);

  useEffect(() => {
    if (
      quizStage === "quiz" &&
      (quizDetailsData?.time_limit ?? 0) > 0 &&
      remainingSeconds === 0
    ) {
      setQuizStage("completed");
    }
  }, [quizDetailsData?.time_limit, quizStage, remainingSeconds, setQuizStage]);

  const handleStartQuiz = () => setQuizStage("quiz");

  const handleResponseChange = (value: string) => {
    if (!currentQuestion) {
      return;
    }

    setResponses((previousResponses) => ({
      ...previousResponses,
      [currentQuestion.id]: value,
    }));
  };

  const handleGoToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  const handleNextQuestion = async () => {
    if (isLastQuestion) {
      if (quizDetailsData?.id) {
        const result = await submitQuizAttempt(quizDetailsData.id, responses);

        if (result) {
          setQuizStage("completed");
        }
      } else {
        setQuizStage("completed");
      }

      return;
    }

    setCurrentQuestionIndex((previousIndex) => previousIndex + 1);
  };

  const handlePreviousQuestion = () => {
    setCurrentQuestionIndex((previousIndex) => Math.max(previousIndex - 1, 0));
  };

  return {
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
    quizStage,
    remainingSeconds,
    responses,
    visitedQuestions,
  };
};
