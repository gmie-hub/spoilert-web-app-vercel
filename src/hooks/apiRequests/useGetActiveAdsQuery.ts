import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { ApiErrorResponse } from "@spt/types/error";
import api from "@spt/utils/apiClient";

export interface Ad {
  id: number;
  title: string;
  image_url: string;
  cover_image_url?: string;
  url?: string | null;
  [key: string]: unknown;
}

export interface AdsResponse {
  status?: boolean;
  message?: string;
  data: Ad[] | { data: Ad[]; current_page?: number; [key: string]: unknown };
}

export const useGetActiveAdsQuery = () => {
  const fetchActiveAds = async (): Promise<AdsResponse> => {
    return (await api.get("ads/active"))?.data;
  };

  const { data, isLoading, error, isError } = useQuery<
    AdsResponse,
    AxiosError<ApiErrorResponse>
  >({
    queryKey: ["active-ads"],
    queryFn: fetchActiveAds,
  });

  const errorMessage =
    error?.response?.data?.message ||
    error?.message ||
    "Failed to load promoted ads";

  return {
    data,
    isLoading,
    isError,
    errorMessage,
  };
};
