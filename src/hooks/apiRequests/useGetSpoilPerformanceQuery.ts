"use client";

import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

import type { ApiErrorResponse } from "@spt/types/error";
import api from "@spt/utils/apiClient";

export interface PerformanceItem {
  title: string;
  total: number;
}

export interface SpoilPerformanceData {
  learners_enrolled: PerformanceItem[];
  revenue_generated: PerformanceItem[];
  completed_learners: PerformanceItem[];
  ongoing_learners: PerformanceItem[];
  not_started_learners: PerformanceItem[];
}

interface SpoilPerformanceResponse {
  status?: boolean;
  message?: string;
  data?: SpoilPerformanceData;
}

const empty: SpoilPerformanceData = {
  learners_enrolled: [],
  revenue_generated: [],
  completed_learners: [],
  ongoing_learners: [],
  not_started_learners: [],
};

export const useGetSpoilPerformanceQuery = () => {
  const { data, isLoading, error, isError } = useQuery<
    SpoilPerformanceResponse,
    AxiosError<ApiErrorResponse>
  >({
    queryKey: ["spoil-performance"],
    queryFn: async () => (await api.get("/analytics/spoil/performance")).data,
  });

  const errorMessage =
    error?.response?.data?.message ||
    error?.message ||
    "Failed to fetch spoylz  performance analytics";

  return {
    performance: data?.data ?? empty,
    isLoading,
    isError,
    errorMessage,
  };
};
