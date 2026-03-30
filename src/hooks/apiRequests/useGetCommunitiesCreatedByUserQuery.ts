"use client";

import { useQuery } from "@tanstack/react-query";

import type { ApiErrorResponse } from "@spt/types/error";
import api from "@spt/utils/apiClient";

import type { AxiosError } from "axios";

export const useGetCommunitiesCreatedByUserQuery = (
  params?: { owner_id?: number | string; page?: number; per_page?: number; search?: string },
  enabled = true
) => {
  const { owner_id, page, per_page, search } = params ?? {};

  const fetchCreatedByUser = async (): Promise<any> => {
    const reqParams: Record<string, any> = {};
    if (page) reqParams.page = page;
    reqParams.per_page = per_page ?? 20;
    if (search && String(search).trim().length) reqParams.search = String(search).trim();
    if (typeof owner_id !== "undefined") reqParams.owner_id = owner_id;


    return (await api.get(`/communities`, { params: reqParams })).data;
  };

  const { data, isLoading, isError, error } = useQuery<any, AxiosError<ApiErrorResponse>>({
    queryKey: ["communities-created-by-user", { owner_id, page, per_page, search }],
    queryFn: fetchCreatedByUser,
    enabled: Boolean(enabled && typeof owner_id !== "undefined"),
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
