"use client";

import { useQuery } from "@tanstack/react-query";

import type { ApiErrorResponse } from "@spt/types/error";
import api from "@spt/utils/apiClient";

import type { AxiosError } from "axios";

export const useGetCommunityDetailQuery = (communityId?: string | number, enabled = true) => {
  const fetchCommunity = async (): Promise<any> => {
    if (!communityId) return null;
    return (await api.get(`/communities/${communityId}`)).data;
  };

  const { data, isLoading, isError, error } = useQuery<any, AxiosError<ApiErrorResponse>>({
    queryKey: ["community-detail", communityId],
    queryFn: fetchCommunity,
    enabled: !!communityId && enabled,
  });

  const errorMessage = error?.response?.data?.message || error?.message || "Failed to fetch community detail";

  return {
    data: data?.data?.data ?? data?.data ?? data,
    isLoading,
    isError,
    errorMessage,
  };
};

export default useGetCommunityDetailQuery;
