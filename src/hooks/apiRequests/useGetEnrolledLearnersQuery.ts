"use client";

import { useQuery } from "@tanstack/react-query";

import type { ApiErrorResponse } from "@spt/types/error";
import api from "@spt/utils/apiClient";

import type { AxiosError } from "axios";

export interface EnrolledLearner {
  id: number;
  user_id?: number;
  percentage_completed?: number;
  status?: "ongoing" | "completed" | "not_started";
  created_at?: string;
  learner?: {
    id: number;
    first_name: string;
    last_name: string;
    avatar?: string | null;
  } | null;
  user?: {
    id: number;
    first_name: string;
    last_name: string;
    avatar?: string | null;
  } | null;
}

interface EnrolledLearnersResponse {
  message: string;
  status: boolean;
  data: EnrolledLearner[] | { data: EnrolledLearner[] };
}

const useGetEnrolledLearnersQuery = (spoilId: number | string, enabled = true) => {
  const { data, isLoading, isError, error } = useQuery<
    EnrolledLearnersResponse,
    AxiosError<ApiErrorResponse>
  >({
    queryKey: ["enrolled-learners", spoilId],
    queryFn: async () => (await api.get(`/spoils/${spoilId}/learners`)).data,
    enabled: Boolean(spoilId) && enabled,
  });

  const learners: EnrolledLearner[] = Array.isArray(data?.data)
    ? (data.data as EnrolledLearner[])
    : ((data?.data as any)?.data ?? []);

  return {
    learners,
    isLoading,
    isError,
    errorMessage:
      error?.response?.data?.message ||
      error?.message ||
      "Failed to fetch enrolled learners",
  };
};

export default useGetEnrolledLearnersQuery;
