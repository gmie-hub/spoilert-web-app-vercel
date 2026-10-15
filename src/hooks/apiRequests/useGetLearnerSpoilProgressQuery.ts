"use client";

import { useQuery } from "@tanstack/react-query";

import type { ApiErrorResponse } from "@spt/types/error";
import api from "@spt/utils/apiClient";

import type { AxiosError } from "axios";

interface QuizSummary {
  highest_score: number | null;
  attempts: number;
}

export interface LearnerSpoilProgress {
  modules_no?: number | null;
  total_modules_completed?: number | null;
  total_modules_pending?: number | null;
  // Ids of the module and lesson the learner is on.
  current_module?: number | string | null;
  current_lesson?: number | string | null;
  learner_spoil?: {
    date_enrolled?: string | null;
    status?: string | null;
    // e.g. "33.33"
    progress_percentage?: number | string | null;
  } | null;
  pre_spoil_quiz?: QuizSummary | null;
  post_spoil_quiz?: QuizSummary | null;
  modules?: {
    id: number;
    title: string;
    status?: string | null;
    percentage_completed?: number | null;
    lessons?: { id: number; title: string }[];
  }[];
}

interface LearnerSpoilProgressResponse {
  message: string;
  status: boolean;
  data: LearnerSpoilProgress;
}

// A spoil as one learner sees it, progress included: GET /spoils/{id}?user_id=,
// the same request the admin portal uses for a learner's progress details.
const useGetLearnerSpoilProgressQuery = (
  spoilId: number | string,
  learnerId: number | string,
) => {
  const { data, isLoading, isError, error } = useQuery<
    LearnerSpoilProgressResponse,
    AxiosError<ApiErrorResponse>
  >({
    queryKey: ["learner-spoil-progress", spoilId, learnerId],
    queryFn: async () =>
      (await api.get(`/spoils/${spoilId}`, { params: { user_id: learnerId } })).data,
    enabled: Boolean(spoilId) && Boolean(learnerId),
  });

  return {
    progress: data?.data ?? null,
    isLoading,
    isError,
    errorMessage:
      error?.response?.data?.error ||
      error?.response?.data?.message ||
      error?.message ||
      "Failed to fetch learner progress",
  };
};

export default useGetLearnerSpoilProgressQuery;
