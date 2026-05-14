import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

import type { ApiErrorResponse } from "@spt/types/error";
import api from "@spt/utils/apiClient";

export interface PublicPromotionSpoil {
  id: number;
  title: string;
  slug: string;
  cover_image_url: string | null;
  price: string;
  amount?: number | null;
  display_amount?: number | null;
  pricing?: string | null;
  average_rating?: number | null;
  ratings_count?: number | null;
  likes_count?: number | null;
  shares_count?: number | null;
  enrolled_users?: number | null;
  is_bookmarked?: boolean;
  is_liked_by_current_user?: boolean;
  category: { id: number; name: string } | null;
  tutor?: {
    first_name: string;
    last_name: string;
    avatar?: string | null;
  } | null;
  institution: { name: string } | null;
}

export interface PublicPromotionDatum {
  id: number;
  spoil_id: number;
  status: "active" | "expired";
  start_date: string;
  end_date: string;
  spoil: PublicPromotionSpoil | null;
}

interface PublicPromotionsResponse {
  status?: boolean;
  message?: string;
  data?: PublicPromotionDatum[] | { current_page?: number; data?: PublicPromotionDatum[] };
}

const extractPromotions = (response?: PublicPromotionsResponse): PublicPromotionDatum[] => {
  if (!response) return [];
  if (Array.isArray(response.data)) return response.data;
  const nested = (response.data as { data?: PublicPromotionDatum[] })?.data;
  if (Array.isArray(nested)) return nested;
  return [];
};

export const useGetPublicPromotionsQuery = () => {
  const { data, isLoading, error, isError } = useQuery<
    PublicPromotionsResponse,
    AxiosError<ApiErrorResponse>
  >({
    queryKey: ["public-promotions"],
    queryFn: async () => (await api.get("/promotions")).data,
  });

  const errorMessage =
    error?.response?.data?.message ||
    error?.message ||
    "Failed to fetch promoted spoils";

  const promotions = extractPromotions(data);
  const activePromotions = promotions.filter((p) => p.status === "active");

  return {
    promotions,
    activePromotions,
    isLoading,
    isError,
    errorMessage,
  };
};
