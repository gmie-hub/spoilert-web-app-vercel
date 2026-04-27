"use client";

import { useQuery } from "@tanstack/react-query";

import type { ApiErrorResponse } from "@spt/types/error";
import api from "@spt/utils/apiClient";

import type { AxiosError } from "axios";

export interface PromotionPackage {
  id: number;
  name: string;
  duration: number;
  amount: string;
  created_at?: string;
  updated_at?: string;
}

interface PromotionPackagesResponse {
  status?: boolean;
  message?: string;
  data?: PromotionPackage[] | { data?: PromotionPackage[] };
}

const extractPackages = (
  response?: PromotionPackagesResponse | PromotionPackage[],
): PromotionPackage[] => {
  if (!response) return [];
  if (Array.isArray(response)) return response;
  if (Array.isArray(response.data)) return response.data;
  const nested = (response.data as { data?: PromotionPackage[] })?.data;
  if (Array.isArray(nested)) return nested;
  return [];
};

export const useGetPromotionPackagesQuery = () => {
  const { data, isLoading, error, isError } = useQuery<
    PromotionPackagesResponse | PromotionPackage[],
    AxiosError<ApiErrorResponse>
  >({
    queryKey: ["promotion-packages"],
    queryFn: async () => (await api.get("/promotion-packages")).data,
    staleTime: 5 * 60 * 1000,
  });

  const errorMessage =
    error?.response?.data?.message ||
    error?.message ||
    "Failed to fetch promotion packages";

  return {
    packages: extractPackages(data),
    isLoading,
    isError,
    errorMessage,
  };
};

export default useGetPromotionPackagesQuery;
