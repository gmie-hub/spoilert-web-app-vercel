"use client";

import { useQuery } from "@tanstack/react-query";

import type { ApiErrorResponse } from "@spt/types/error";
import api from "@spt/utils/apiClient";

import type { SponsorshipDatum } from "./useGetSponsorshipsQuery";
import type { AxiosError } from "axios";

interface SponsorshipDetailsResponse {
  status?: boolean;
  message?: string;
  data?: SponsorshipDatum | SponsorshipDatum[] | { current_page?: number; data?: SponsorshipDatum[] };
}

const extractDetail = (response?: SponsorshipDetailsResponse): SponsorshipDatum | null => {
  if (!response?.data) return null;
  if (Array.isArray(response.data)) return response.data[0] ?? null;
  const nested = (response.data as { data?: SponsorshipDatum[] })?.data;
  if (Array.isArray(nested)) return nested[0] ?? null;
  if (typeof response.data === "object" && "id" in response.data) return response.data as SponsorshipDatum;
  return null;
};

export const useGetSponsorshipDetailsQuery = (id: number | null) => {
  const fetchDetails = async (): Promise<SponsorshipDetailsResponse> => {
    return (await api.get(`/sponsorships?id=${id}`)).data;
  };

  const { data, isLoading, error, isError, refetch } = useQuery<
    SponsorshipDetailsResponse,
    AxiosError<ApiErrorResponse>
  >({
    queryKey: ["sponsorship-details", id],
    queryFn: fetchDetails,
    enabled: id !== null,
  });

  const errorMessage =
    error?.response?.data?.message ||
    error?.message ||
    "Failed to fetch sponsorship details";

  return {
    sponsorship: extractDetail(data),
    isLoading,
    isError,
    errorMessage,
    refetch,
  };
};

export default useGetSponsorshipDetailsQuery;
