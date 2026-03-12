"use client";

import { useQuery } from "@tanstack/react-query";

import { useAuthStore } from "@spt/store/authStore";
import type { ApiErrorResponse } from "@spt/types/error";
import api from "@spt/utils/apiClient";
import { SpoilDetailsData } from "@spt/utils/spoils";

import type { AxiosError } from "axios";

interface SpoilDetailsResponse {
  message: string;
  status: boolean;
  data: SpoilDetailsData;
}

export const useGetSpoilDetailsQuery = (
  spoilId?: number | string | null,
) => {
  const storedSpoilId = useAuthStore((state) => state.createdSpoilId);
  const resolvedSpoilId = spoilId ?? storedSpoilId;

  const fetchSpoilDetails = async (): Promise<SpoilDetailsResponse> => {
    return (await api.get(`/spoils/${resolvedSpoilId}`)).data;
  };

  const { data, isLoading, isError, error } = useQuery<
    SpoilDetailsResponse,
    AxiosError<ApiErrorResponse>
  >({
    queryKey: ["spoil-details", resolvedSpoilId],
    queryFn: fetchSpoilDetails,
    enabled: !!resolvedSpoilId,
  });

  const errorMessage =
    error?.response?.data?.message ||
    error?.message ||
    "Failed to fetch spoil details";

  return {
    data: data?.data ?? null,
    isLoading,
    isError,
    errorMessage,
  };
};

export default useGetSpoilDetailsQuery;
