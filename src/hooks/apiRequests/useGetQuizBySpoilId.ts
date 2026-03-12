import { useQuery } from "@tanstack/react-query";

import type { ApiErrorResponse } from "@spt/types/error";
import { QuizResponse } from "@spt/types/quiz";
import api from "@spt/utils/apiClient";

import type { AxiosError } from "axios";

export const useGetQuizBySpoilId = (id?: number | null) => {
  const resolvedId = id ?? 0;

  const fetchQuiz = async (): Promise<QuizResponse> => {
    return (await api.get(`quiz?spoil_id=${resolvedId}`))?.data;
  };

  const { data, isLoading, isError, error } = useQuery<
    QuizResponse,
    AxiosError<ApiErrorResponse>
  >({
    queryKey: ["getQuizBySpoilId", resolvedId],
    queryFn: fetchQuiz,
    enabled: Boolean(resolvedId),
  });

  const errorMessage =
    error?.response?.data?.message ||
    error?.message ||
    "Failed to fetch quizzes details";

  return {
    quizData: data?.data?.data,
    isQuizLoading: isLoading,
    quizErrorMessage: errorMessage,
    isError,
  };
};
