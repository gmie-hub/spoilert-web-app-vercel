"use client";

import { useInfiniteQuery } from "@tanstack/react-query";

import { useAuthStore } from "@spt/store/authStore";
import type { ApiErrorResponse } from "@spt/types/error";
import api from "@spt/utils/apiClient";

import type { AxiosError } from "axios";

export const useGetUserCommunitiesQuery = (
  params?: {
    per_page?: number;
    user_id?: number | string;
    has_joined?: boolean;
    search?: string;
  },
  enabled = true,
  includeHasJoined = true,
) => {
  const { per_page, user_id, search } = params ?? {};
  const authUserId = useAuthStore((s) => s.user?.id);
  const resolvedUserId = typeof user_id !== "undefined" ? user_id : authUserId;

  const result = useInfiniteQuery<any, AxiosError<ApiErrorResponse>>({
    queryKey: ["user-communities", { per_page, user_id, includeHasJoined, search }],
    queryFn: async ({ pageParam }) => {
      const reqParams: Record<string, any> = {};
      if (typeof resolvedUserId !== "undefined") reqParams.user_id = resolvedUserId;
      reqParams.page = pageParam;
      reqParams.per_page = per_page ?? 20;
      if (search && String(search).trim().length) reqParams.search = String(search).trim();
      return (await api.get(`/communities/user`, { params: reqParams })).data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage: any) => {
      const pagination = lastPage?.data;
      if (pagination?.next_page_url) {
        return (pagination.current_page ?? 1) + 1;
      }
      return undefined;
    },
    enabled,
  });

  const errorMessage =
    result.error?.response?.data?.message ||
    result.error?.message ||
    "Failed to fetch user communities";

  const allData =
    result.data?.pages?.flatMap((page: any) => {
      return page?.data?.data ?? page?.data ?? page ?? [];
    }) ?? [];

  const lastPage = result.data?.pages?.[result.data.pages.length - 1];
  const pagination = lastPage?.data ?? null;

  return {
    data: allData,
    pagination,
    isLoading: result.isLoading,
    isError: result.isError,
    errorMessage,
    fetchNextPage: result.fetchNextPage,
    hasNextPage: result.hasNextPage,
    isFetchingNextPage: result.isFetchingNextPage,
  };
};

export default useGetUserCommunitiesQuery;
