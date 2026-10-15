"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import type { ApiErrorResponse } from "@spt/types/error";
import api from "@spt/utils/apiClient";

import type { AxiosError } from "axios";

export interface SpoilReview {
  id: number;
  rating: number;
  comment?: string | null;
  created_at: string;
  user: { id: number; first_name: string; last_name: string } | null;
}

interface SpoilReviewsResponse {
  message: string;
  status: boolean;
  data: {
    current_page: number;
    last_page: number;
    total: number;
    data: SpoilReview[];
  };
}

const useGetSpoilReviewsQuery = (spoilId: number | string, page = 1) => {
  const { data, isLoading, isError, error } = useQuery<
    SpoilReviewsResponse,
    AxiosError<ApiErrorResponse>
  >({
    queryKey: ["spoil-reviews", spoilId, page],
    queryFn: async () =>
      (await api.get("reviews", { params: { spoil_id: spoilId, page } })).data,
    enabled: Boolean(spoilId),
    placeholderData: keepPreviousData,
  });

  return {
    reviews: data?.data?.data ?? [],
    lastPage: data?.data?.last_page ?? 1,
    isLoading,
    isError,
    errorMessage:
      error?.response?.data?.error ||
      error?.response?.data?.message ||
      error?.message ||
      "Failed to fetch reviews",
  };
};

export default useGetSpoilReviewsQuery;
