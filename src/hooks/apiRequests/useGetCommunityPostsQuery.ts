"use client";

import { useQuery } from "@tanstack/react-query";

import type { ApiErrorResponse } from "@spt/types/error";
import api from "@spt/utils/apiClient";

import type { AxiosError } from "axios";

export const useGetCommunityPostsQuery = (
  params?: {
    community_id?: string | number;
    page?: number;
    per_page?: number;
    search?: string;
  },
  enabled = true
) => {
  const { community_id, page, per_page, search } = params ?? {};

  const fetchPosts = async (): Promise<any> => {
    const parts: string[] = [];
    if (typeof community_id !== "undefined" && community_id !== null)
      parts.push(`community_id=${encodeURIComponent(String(community_id))}`);
    if (page) parts.push(`page=${page}`);
    if (search) parts.push(`search=${encodeURIComponent(String(search))}`);

    const queryString = parts.join("&");
    const perPage = per_page ?? 20;

    return (await api.get(`/communities/posts?${queryString ? `${queryString}&` : ""}per_page=${perPage}`))?.data;
  };

  const { data, isLoading, isError, error } = useQuery<any, AxiosError<ApiErrorResponse>>({
    queryKey: ["community-posts", { community_id, page, per_page, search }],
    queryFn: fetchPosts,
    enabled: Boolean(enabled && typeof community_id !== "undefined" && community_id !== null),
  });

  const errorMessage = error?.response?.data?.message || error?.message || "Failed to fetch community posts";

  return {
    data: data?.data?.data ?? data?.data ?? data,
    pagination: data?.data ?? null,
    isLoading,
    isError,
    errorMessage,
  };
};

export default useGetCommunityPostsQuery;
