"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import useInstitutionId from "@spt/hooks/useInstitutionId";
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
  // What the spoil has earned each side of the revenue split.
  lecturer_amount?: number | string | null;
  institution_amount?: number | string | null;
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

// One page of the institution's spoils, optionally searched — the same request
// the admin portal's Spoil Management list makes, scoped by `institution_id`.
const useGetSpoilsPageQuery = (page: number, search?: string) => {
  const { institutionId, isResolved } = useInstitutionId();

  const { data, isLoading, isError, error } = useQuery<
    SpoilsPageResponse,
    AxiosError<ApiErrorResponse>
  >({
    queryKey: ["spoils-page", institutionId, page, search ?? ""],
    queryFn: async () =>
      (
        await api.get("/spoils", {
          params: {
            per_page: SPOILS_PAGE_SIZE,
            page,
            // Left out when the institution's id can't be found, so the list still loads.
            ...(institutionId != null && { institution_id: institutionId }),
            ...(search ? { search } : {}),
          },
        })
      ).data,
    placeholderData: keepPreviousData,
    // Waits for the institution's id so the list isn't fetched twice.
    enabled: isResolved,
  });

  return {
    spoils: data?.data?.data ?? [],
    lastPage: data?.data?.last_page ?? 1,
    // Still loading while the institution's id is being looked up.
    isLoading: isLoading || !isResolved,
    isError,
    errorMessage:
      error?.response?.data?.error ||
      error?.response?.data?.message ||
      error?.message ||
      "Failed to fetch spoylz",
  };
};

export default useGetSpoilsPageQuery;
