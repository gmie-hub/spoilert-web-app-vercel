"use client";

import { useQuery } from "@tanstack/react-query";

import { useAuthStore } from "@spt/store/authStore";
import type { ApiErrorResponse } from "@spt/types/error";
import api from "@spt/utils/apiClient";

import type { AxiosError } from "axios";

// Fetch all communities the user is in
export const useGetUserCommunitiesQuery = (
  params?: {
    page?: number;
    per_page?: number;
    user_id?: number | string;
    has_joined?: boolean;
    search?: string;  
  },
  enabled = true,
  includeHasJoined = true,
) => {
  const { page, per_page, user_id, search } = params ?? {};
  const authUserId = useAuthStore((s) => s.user?.id);
  const resolvedUserId = typeof user_id !== "undefined" ? user_id : authUserId;

  const fetchUserCommunities = async (): Promise<any> => {
    const reqParams: Record<string, any> = {};

    if (typeof resolvedUserId !== "undefined") reqParams.user_id = resolvedUserId;

    if (page) reqParams.page = page;
    reqParams.per_page = per_page ?? 20;
    if (search && String(search).trim().length) reqParams.search = String(search).trim();
    // if (includeHasJoined) reqParams.has_joined = true;

    return (await api.get(`/communities/user`, { params: reqParams })).data;
  };

  const { data, isLoading, isError, error } = useQuery<
    any,
    AxiosError<ApiErrorResponse>
  >({
    queryKey: [
      "user-communities",
      { page, per_page, user_id, includeHasJoined, search },
    ],
    queryFn: fetchUserCommunities,
    enabled,
  });

  const errorMessage =
    error?.response?.data?.message ||
    error?.message ||
    "Failed to fetch user communities";

  const raw = data as any;

  return {
    data: raw?.data?.data ?? raw?.data ?? raw,
    pagination: raw?.data ?? null,
    isLoading,
    isError,
    errorMessage,
  };
};

export default useGetUserCommunitiesQuery;
