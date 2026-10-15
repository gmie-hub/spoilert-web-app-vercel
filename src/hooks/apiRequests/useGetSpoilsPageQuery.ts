"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import type { ApiErrorResponse } from "@spt/types/error";
import api from "@spt/utils/apiClient";

import type { AxiosError } from "axios";

export interface SpoilListItem {
  id: number;
  title: string;
  type: string | null;
  tutor_id: number;
  cover_image_url: string | null;
  pricing: string | null;
  amount: number | null;
  enrolled_users: number | null;
  is_active: number;
  created_at: string;
  tutor: { id: number; first_name: string; last_name: string } | null;
  category: { id: number; name: string } | null;
}

interface SpoilsPageResponse {
  message: string;
  status: boolean;
  data: {
    current_page: number;
    last_page: number;
    total: number;
    data: SpoilListItem[];
  };
}

export const SPOILS_PAGE_SIZE = 20;

// One page of spoils, optionally searched — the same request the admin
// portal's Spoil Management list makes.
const useGetSpoilsPageQuery = (page: number, search?: string) => {
  const { data, isLoading, isError, error } = useQuery<
    SpoilsPageResponse,
    AxiosError<ApiErrorResponse>
  >({
    queryKey: ["spoils-page", page, search ?? ""],
    queryFn: async () =>
      (
        await api.get("/spoils", {
          params: { per_page: SPOILS_PAGE_SIZE, page, ...(search ? { search } : {}) },
        })
      ).data,
    placeholderData: keepPreviousData,
  });

  return {
    spoils: data?.data?.data ?? [],
    lastPage: data?.data?.last_page ?? 1,
    isLoading,
    isError,
    errorMessage:
      error?.response?.data?.error ||
      error?.response?.data?.message ||
      error?.message ||
      "Failed to fetch spoylz",
  };
};

export default useGetSpoilsPageQuery;
