"use client";

import { useQuery } from "@tanstack/react-query";

import type { ApiErrorResponse } from "@spt/types/error";
import api from "@spt/utils/apiClient";

import type { AxiosError } from "axios";

export interface SpoilLearner {
  id: number;
  first_name: string;
  last_name: string;
  email?: string | null;
  username?: string | null;
  avatar?: string | null;
  created_at?: string | null;
  progress_percentage?: number | string | null;
  status?: string | null;
}

// GET /spoils/learner/{id} returns the spoil with its enrolled learners.
interface SpoilLearnersResponse {
  message: string;
  status: boolean;
  data: { learners?: SpoilLearner[] } | null;
}

// Everyone enrolled on a spoil — the endpoint the admin portal uses.
const useGetSpoilLearnersQuery = (spoilId: number | string) => {
  const { data, isLoading, isError, error } = useQuery<
    SpoilLearnersResponse,
    AxiosError<ApiErrorResponse>
  >({
    queryKey: ["spoil-learners", spoilId],
    queryFn: async () => (await api.get(`/spoils/learner/${spoilId}`)).data,
    enabled: Boolean(spoilId),
  });

  return {
    learners: data?.data?.learners ?? [],
    isLoading,
    isError,
    errorMessage:
      error?.response?.data?.error ||
      error?.response?.data?.message ||
      error?.message ||
      "Failed to fetch enrolled learners",
  };
};

export default useGetSpoilLearnersQuery;
