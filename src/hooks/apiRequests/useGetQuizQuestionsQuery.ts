"use client";

import { useMemo } from "react";

import { useQuery } from "@tanstack/react-query";

import type {
  QuizQuestion,
  QuizQuestionOption,
  QuizQuestionType,
} from "@spt/screens/main/spoils/quiz/types";
import type { ApiErrorResponse } from "@spt/types/error";
import api from "@spt/utils/apiClient";

import type { AxiosError } from "axios";

// Server question shape returned by GET /questions?quiz_id=
interface ServerQuizQuestion {
  id: number | string;
  quiz_id?: number;
  type?: string;
  question?: string;
  options?: unknown;
  answer?: string | null;
}

const makeOptionId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;

const normalizeType = (type?: string): QuizQuestionType =>
  type === "multiple_choice" ? "multiple_choice" : "fill_in_the_blank";

// `options` can arrive as a JSON string, a comma-separated string, an array of
// strings, or an array of { text, isCorrect } objects — handle all of them.
const parseOptions = (raw: unknown, answer: string): QuizQuestionOption[] => {
  let value: unknown = raw;

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return [];
    try {
      value = JSON.parse(trimmed);
    } catch {
      value = trimmed.split(",").map((part) => part.trim());
    }
  }

  if (!Array.isArray(value)) return [];

  return value.map((option) => {
    const text =
      typeof option === "string"
        ? option
        : String(
            (option as { text?: unknown; option?: unknown })?.text ??
              (option as { option?: unknown })?.option ??
              option,
          );

    const isCorrect =
      option && typeof option === "object" && "isCorrect" in option
        ? Boolean((option as { isCorrect?: unknown }).isCorrect)
        : text === answer;

    return { id: makeOptionId(), isCorrect, text };
  });
};

const mapServerQuestion = (question: ServerQuizQuestion): QuizQuestion => {
  const type = normalizeType(question.type);
  const answer = question.answer ?? "";

  return {
    id: String(question.id),
    prompt: question.question ?? "",
    type,
    answer: type === "fill_in_the_blank" ? answer : "",
    options:
      type === "multiple_choice" ? parseOptions(question.options, answer) : [],
  };
};

export const useGetQuizQuestionsQuery = (
  quizId?: number | string | null,
  options?: { enabled?: boolean },
) => {
  const fetchQuestions = async () =>
    (await api.get(`questions?quiz_id=${quizId}`)).data;

  const { data, isLoading, isError, error } = useQuery<
    any,
    AxiosError<ApiErrorResponse>
  >({
    queryKey: ["quiz-questions", quizId],
    queryFn: fetchQuestions,
    enabled: (options?.enabled ?? true) && Boolean(quizId),
  });

  const questions: QuizQuestion[] = useMemo(() => {
    const list: ServerQuizQuestion[] = Array.isArray(data?.data)
      ? data.data
      : Array.isArray(data?.data?.data)
        ? data.data.data
        : Array.isArray(data)
          ? data
          : [];

    return list.map(mapServerQuestion);
  }, [data]);

  const errorMessage =
    error?.response?.data?.message ||
    error?.message ||
    "Failed to fetch questions";

  return { questions, isLoading, isError, errorMessage };
};

export default useGetQuizQuestionsQuery;
