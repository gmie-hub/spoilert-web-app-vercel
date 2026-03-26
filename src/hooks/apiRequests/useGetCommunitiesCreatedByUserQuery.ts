"use client";

import { useQuery } from "@tanstack/react-query";

import type { ApiErrorResponse } from "@spt/types/error";
import api from "@spt/utils/apiClient";

import type { AxiosError } from "axios";

export const useGetCommunitiesCreatedByUserQuery = (
  params?: { user_id?: number | string; page?: number; per_page?: number },
  enabled = true
) => {
  const { user_id, page, per_page } = params ?? {};

  const fetchCreatedByUser = async (): Promise<any> => {
    const reqParams: Record<string, any> = {};
    if (typeof user_id !== "undefined") reqParams.user_id = user_id;
    if (page) reqParams.page = page;
    reqParams.per_page = per_page ?? 20;

    return (await api.get(`/communities/user`, { params: reqParams })).data;
  };

  const { data, isLoading, isError, error } = useQuery<any, AxiosError<ApiErrorResponse>>({
    queryKey: ["communities-created-by-user", { user_id, page, per_page }],
    queryFn: fetchCreatedByUser,
    enabled: Boolean(enabled && typeof user_id !== "undefined"),
  });

  const errorMessage =
    error?.response?.data?.message || error?.message || "Failed to fetch user's communities";

  return {
    data: data?.data?.data ?? data?.data ?? data,
    pagination: data?.data ?? null,
    isLoading,
    isError,
    errorMessage,
  };
};

export default useGetCommunitiesCreatedByUserQuery;
