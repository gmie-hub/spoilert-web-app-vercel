"use client";

import { useQuery } from "@tanstack/react-query";

import type { ApiErrorResponse } from "@spt/types/error";
import api from "@spt/utils/apiClient";

import type { AxiosError } from "axios";

// Fetch details for a specific user community by id
export const useGetUserCommunityDetailQuery = (community_id: string | number, search?: string) => {
  const fetchUserCommunityDetail = async (): Promise<any> => {
    const q = search ? `&search=${encodeURIComponent(search)}` : "";
    return (await api.get(`/communities/user?community_id=${community_id}${q}`)).data;
  };

  const { data, isLoading, isError, error } = useQuery<any, AxiosError<ApiErrorResponse>>({
    queryKey: ["user-community-detail", community_id, search],
    queryFn: fetchUserCommunityDetail,
    enabled: !!community_id,
  });

  const errorMessage =
    error?.response?.data?.message || error?.message || "Failed to fetch user community detail";

  return {
    data: data?.data?.data ?? data?.data ?? data,
    isLoading,
    isError,
    errorMessage,
  };
};

export default useGetUserCommunityDetailQuery;