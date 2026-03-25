"use client";

import { useQuery } from "@tanstack/react-query";

import type { ApiErrorResponse } from "@spt/types/error";
import api from "@spt/utils/apiClient";

import type { AxiosError } from "axios";

// Fetch all communities the user is in
export const useGetUserCommunitiesQuery = (
  params?: { page?: number; per_page?: number; owner_id?: number | string; has_joined?: boolean },
  enabled = true,
  includeHasJoined = true
) => {
  const { page, per_page, owner_id } = params ?? {};

  const fetchUserCommunities = async (): Promise<any> => {
    const reqParams: Record<string, any> = {};
    if (page) reqParams.page = page;
    reqParams.per_page = per_page ?? 20;
    if (includeHasJoined) reqParams.has_joined = true;
    if (typeof owner_id !== "undefined") reqParams.owner_id = owner_id;

    return (await api.get(`/communities`, { params: reqParams })).data;
  };

  const { data, isLoading, isError, error } = useQuery<any, AxiosError<ApiErrorResponse>>({
    queryKey: ["user-communities", { page, per_page, owner_id, includeHasJoined }],
    queryFn: fetchUserCommunities,
    enabled,
  });

  const errorMessage =
    error?.response?.data?.message || error?.message || "Failed to fetch user communities";

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