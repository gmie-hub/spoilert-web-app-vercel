"use client";

import { useQuery } from "@tanstack/react-query";

import type { ApiErrorResponse } from "@spt/types/error";
import api from "@spt/utils/apiClient";

import type { AxiosError } from "axios";

export interface LearnerProgressModule {
  id: number;
  title: string;
  lessons_no?: number;
  lessons_count?: number;
  status?: "completed" | "ongoing" | "not_started";
  percentage_completed?: number;
}

export interface LearnerProgressData {
  user?: {
    id: number;
    first_name: string;
    last_name: string;
    avatar?: string | null;
  } | null;
  learner?: {
    id: number;
    first_name: string;
    last_name: string;
    avatar?: string | null;
  } | null;
  percentage_completed?: number;
  progress?: number;
  total_modules?: number;
  modules_no?: number;
  total_modules_completed?: number;
  modules_completed?: number;
  total_modules_pending?: number;
  modules_pending?: number;
  current_module?: string | null;
  current_lesson?: string | null;
  pre_spoil_quiz_score?: number | null;
  post_spoil_quiz_score?: number | null;
  date_enrolled?: string | null;
  created_at?: string | null;
  status?: "ongoing" | "completed" | "not_started";
  modules?: LearnerProgressModule[];
}

interface LearnerProgressResponse {
  message: string;
  status: boolean;
  data: LearnerProgressData;
}

const useGetLearnerProgressQuery = (
  spoilId: number | string,
  learnerId: number | string,
  enabled = true,
) => {
  const { data, isLoading, isError, error } = useQuery<
    LearnerProgressResponse,
    AxiosError<ApiErrorResponse>
  >({
    queryKey: ["learner-progress", spoilId, learnerId],
    queryFn: async () =>
      (await api.get(`/spoils/${spoilId}/learners/${learnerId}`)).data,
    enabled: Boolean(spoilId) && Boolean(learnerId) && enabled,
  });

  return {
    progress: data?.data ?? null,
    isLoading,
    isError,
    errorMessage:
      error?.response?.data?.message ||
      error?.message ||
      "Failed to fetch learner progress",
  };
};

export default useGetLearnerProgressQuery;
