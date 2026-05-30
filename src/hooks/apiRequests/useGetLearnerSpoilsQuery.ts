"use client";

import { useQuery } from "@tanstack/react-query";

import type { ApiErrorResponse } from "@spt/types/error";
import api from "@spt/utils/apiClient";

import type { AxiosError } from "axios";

export type LearnerSpoilStatus = "ongoing" | "completed" | "not_started";

export interface LearnerSpoilDatum {
  id: number;
  spoil_id?: number;
  progress_percentage?: string | number | null;
  percentage_completed?: number | null;
  progress?: number | null;
  spoil?: {
    id?: number;
    title?: string;
    cover_image_url?: string;
    category?: {
      name?: string;
    } | null;
  } | null;
  title?: string;
  cover_image_url?: string;
  category?: {
    name?: string;
  } | null;
  [key: string]: unknown;
}

interface LearnerSpoilsResponse {
  message: string;
  status: boolean;
  data?: {
    data?: LearnerSpoilDatum[];
    items?: LearnerSpoilDatum[];
    [key: string]: any;
  } | LearnerSpoilDatum[];
}

const extractSpoils = (response?: LearnerSpoilsResponse): LearnerSpoilDatum[] => {
  if (!response) {
    return [];
  }

  if (Array.isArray(response.data)) {
    return response.data;
  }

  if (Array.isArray(response.data?.data)) {
    return response.data.data;
  }

  if (Array.isArray(response.data?.items)) {
    return response.data.items;
  }

  return [];
};

export const useGetLearnerSpoilsQuery = (
  status: LearnerSpoilStatus,
  userId?: number,
  enabled: boolean = true,
) => {
  const fetchLearnerSpoils = async (): Promise<LearnerSpoilsResponse> => {
    const searchParams = new URLSearchParams({
      status,
      user_id: String(userId),
    });

    return (await api.get(`/spoils/learner?${searchParams.toString()}`)).data;
  };

  const { data, isLoading, error, isError } = useQuery<
    LearnerSpoilsResponse,
    AxiosError<ApiErrorResponse>
  >({
    queryKey: ["learner-spoils", status, userId],
    queryFn: fetchLearnerSpoils,
    enabled: Boolean(userId) && Boolean(enabled),
  });

  const errorMessage =
    error?.response?.data?.message ||
    error?.message ||
    "Failed to fetch learner spoylz ";

  return {
    data,
    spoils: extractSpoils(data),
    isLoading,
    isError,
    errorMessage,
  };
};

export default useGetLearnerSpoilsQuery;