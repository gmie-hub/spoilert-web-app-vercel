"use client";

import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import type { ApiErrorResponse } from "@spt/types/error";
import api from "@spt/utils/apiClient";

import type { AxiosError } from "axios";

export interface QuizAnswer {
  question_id: number;
  selected_answer: string;
}

export interface SubmitQuizAttemptPayload {
  quiz_id: number;
  answers: QuizAnswer[];
}

export interface QuizAttemptAnswer {
  quiz_attempt_id: number;
  question_id: number;
  answer: string;
  is_correct: boolean;
  created_at: string;
  updated_at: string;
}

export interface QuizAttemptResult {
  score: number;
  total_questions: number;
  correct_answers: number;
  wrong_answers: number;
  answers: QuizAttemptAnswer[];
}

export interface SubmitQuizAttemptResponse {
  message?: string;
  status?: boolean;
  data?: QuizAttemptResult;
}

const useSubmitQuizAttemptMutation = () => {
  const mutation = useMutation<
    SubmitQuizAttemptResponse,
    AxiosError<ApiErrorResponse>,
    SubmitQuizAttemptPayload
  >({
    mutationKey: ["submit-quiz-attempt"],
    mutationFn: async (payload) => {
      return (await api.post("quiz/attempts", payload)).data;
    },
  });

  const submitQuizAttempt = async (
    quizId: number,
    responses: Record<number, string>,
  ): Promise<SubmitQuizAttemptResponse | null> => {
    const answers: QuizAnswer[] = Object.entries(responses).map(
      ([questionId, selectedAnswer]) => ({
        question_id: Number(questionId),
        selected_answer: selectedAnswer,
      }),
    );

    try {
      const response = await mutation.mutateAsync({ quiz_id: quizId, answers });
      toast.success(response?.message || "Quiz submitted successfully");
      return response;
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error ||
          error?.response?.data?.message ||
          error?.message ||
          "Failed to submit quiz",
      );
      return null;
    }
  };

  return {
    submitQuizAttempt,
    isSubmitting: mutation.isPending,
    isError: mutation.isError,
  };
};

export default useSubmitQuizAttemptMutation;
