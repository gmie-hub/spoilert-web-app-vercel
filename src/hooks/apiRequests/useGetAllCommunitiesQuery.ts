"use client";

import { useQuery } from "@tanstack/react-query";

import type { ApiErrorResponse } from "@spt/types/error";
import api from "@spt/utils/apiClient";

import type { AxiosError } from "axios";

export const useGetAllCommunitiesQuery = (
  params?: {
    page?: number;
    per_page?: number;
    paid?: boolean;
    free?: boolean;
    search?: string;
    locked?: number | string | boolean;
  },
  enabled = true
) => {
  const { page, per_page, paid, free, search, locked } = params ?? {};

  const fetchCommunities = async (): Promise<any> => {
    const parts: string[] = [];
    if (typeof paid !== "undefined") parts.push(paid ? "paid=true" : "paid=false");
    if (typeof free !== "undefined") parts.push(`free=${free}`);
    if (page) parts.push(`page=${page}`);
    if (typeof locked !== "undefined" && locked !== null) parts.push(`locked=${locked}`);
    if (search) parts.push(`search=${encodeURIComponent(String(search))}`);

    const queryString = parts.join("&");
    const perPage = per_page ?? 20;

    return (await api.get(`/communities?${queryString ? `${queryString}&` : ""}per_page=${perPage}`))?.data;
  };

  const { data, isLoading, isError, error } = useQuery<any, AxiosError<ApiErrorResponse>>({
    queryKey: ["communities", { page, per_page, paid, free, search, locked }],
    queryFn: fetchCommunities,
    enabled,
  });

  const errorMessage =
    error?.response?.data?.message || error?.message || "Failed to fetch communities";

  return {
    data: data?.data?.data ?? data?.data ?? data,
    pagination: data?.data ?? null,
    isLoading,
    isError,
    errorMessage,
  };
};

