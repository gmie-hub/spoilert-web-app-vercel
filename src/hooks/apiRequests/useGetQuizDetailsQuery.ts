import { useQuery } from "@tanstack/react-query";

import type { ApiErrorResponse } from "@spt/types/error";
import { QuizDetailsResponse } from "@spt/types/quiz";
import api from "@spt/utils/apiClient";

import type { AxiosError } from "axios";


export const useGetQuizDetailsQuery = (
  quizId: number,
  options?: { enabled?: boolean },
) => {
  const fetchQuizDetails = async (): Promise<QuizDetailsResponse> => {
    return (await api.get(`quiz/${quizId}`))?.data;
  };

  const { data, isLoading, isError, error } = useQuery<
    QuizDetailsResponse,
    AxiosError<ApiErrorResponse>
  >({
    queryKey: ["getQuizDetails", quizId],
    queryFn: fetchQuizDetails,
    enabled: (options?.enabled ?? true) && !!quizId,
  });

  const errorMessage =
    error?.response?.data?.message ||
    error?.message ||
    "Failed to fetch quizzes details";

  return {
    quizDetailsData: data?.data,
    isQuizDetailsLoading: isLoading,
    quizDetailsErrorMessage: errorMessage,
    isQuizDetailsError: isError,
  };
};
