"use client";

import { useQuery } from "@tanstack/react-query";

import { useAuthStore } from "@spt/store/authStore";
import type { ApiErrorResponse } from "@spt/types/error";
import api from "@spt/utils/apiClient";

import type { AxiosError } from "axios";

export interface PromotionSpoil {
  id: number;
  title: string;
  slug: string;
  cover_image_url: string | null;
  price: string;
  category: { id: number; name: string } | null;
  institution: { name: string } | null;
}

export interface PromotionDatum {
  id: number;
  spoil_id: number;
  user_id: number;
  promotion_package_id: number;
  amount: string;
  status: "active" | "expired";
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
  spoil: PromotionSpoil | null;
}

interface PromotionsResponse {
  status?: boolean;
  message?: string;
  data?: PromotionDatum[] | { current_page?: number; data?: PromotionDatum[] };
}

const extractPromotions = (response?: PromotionsResponse): PromotionDatum[] => {
  if (!response) return [];
  if (Array.isArray(response.data)) return response.data;
  const nested = (response.data as { data?: PromotionDatum[] })?.data;
  if (Array.isArray(nested)) return nested;
  return [];
};

export const useGetPromotionsQuery = () => {
  const user = useAuthStore((state) => state.user);
  const userId = user?.id;

  const fetchPromotions = async (): Promise<PromotionsResponse> => {
    return (await api.get("/promotions")).data;
  };

  const { data, isLoading, error, isError, refetch } = useQuery<
    PromotionsResponse,
    AxiosError<ApiErrorResponse>
  >({
    queryKey: ["promotions", userId],
    queryFn: fetchPromotions,
    enabled: !!userId,
  });

  const errorMessage =
    error?.response?.data?.message ||
    error?.message ||
    "Failed to fetch promotions";

  const promotions = extractPromotions(data);

  return {
    data,
    promotions,
    activePromotions: promotions.filter((p) => p.status === "active"),
    expiredPromotions: promotions.filter((p) => p.status === "expired"),
    isLoading,
    isError,
    errorMessage,
    refetch,
  };
};

export default useGetPromotionsQuery;
