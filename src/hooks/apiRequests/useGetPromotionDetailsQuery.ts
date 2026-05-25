"use client";

import { useQuery } from "@tanstack/react-query";

import type { ApiErrorResponse } from "@spt/types/error";
import api from "@spt/utils/apiClient";

import type { PromotionDatum } from "./useGetPromotionsQuery";
import type { AxiosError } from "axios";

interface PromotionDetailsResponse {
  status?: boolean;
  message?: string;
  data?: PromotionDatum | PromotionDatum[] | { current_page?: number; data?: PromotionDatum[] };
}

const extractDetail = (response?: PromotionDetailsResponse): PromotionDatum | null => {
  if (!response?.data) return null;
  if (Array.isArray(response.data)) return response.data[0] ?? null;
  const nested = (response.data as { data?: PromotionDatum[] })?.data;
  if (Array.isArray(nested)) return nested[0] ?? null;
  if (typeof response.data === "object" && "id" in response.data) return response.data as PromotionDatum;
  return null;
};

export const useGetPromotionDetailsQuery = (id: number | null) => {
  const fetchDetails = async (): Promise<PromotionDetailsResponse> => {
    return (await api.get(`/promotions?id=${id}`)).data;
  };

  const { data, isLoading, error, isError, refetch } = useQuery<
    PromotionDetailsResponse,
    AxiosError<ApiErrorResponse>
  >({
    queryKey: ["promotion-details", id],
    queryFn: fetchDetails,
    enabled: id !== null,
  });

  const errorMessage =
    error?.response?.data?.message ||
    error?.message ||
    "Failed to fetch promotion details";

  return {
    promotion: extractDetail(data),
    isLoading,
    isError,
    errorMessage,
    refetch,
  };
};

export default useGetPromotionDetailsQuery;
