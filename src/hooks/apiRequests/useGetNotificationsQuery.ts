"use client";

import { useQuery } from "@tanstack/react-query";

import type { ApiErrorResponse } from "@spt/types/error";
import api from "@spt/utils/apiClient";

import type { AxiosError } from "axios";

export interface UserNotification {
  id: number;
  type: string;
  title: string;
  body: string;
  is_read: number;
  created_at: string;
  route: string;
  section: string;
  meta: Record<string, unknown>;
  user_id: number;
  notification_id: number | null;
  deleted_at: string | null;
  updated_at: string;
}

interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  next_page_url: string | null;
  prev_page_url: string | null;
}

interface NotificationsResponse {
  message: string;
  status: boolean;
  data: PaginationMeta & { data: UserNotification[] };
}

interface GetNotificationsParams {
  page?: number;
  per_page?: number;
}

export const useGetNotificationsQuery = (params?: GetNotificationsParams) => {
  const page = params?.page ?? 1;
  const per_page = params?.per_page ?? 10;

  const { data, isLoading, isError, error, refetch } = useQuery<
    NotificationsResponse,
    AxiosError<ApiErrorResponse>
  >({
    queryKey: ["notifications", { page, per_page }],
    queryFn: async () =>
      (await api.get("/notifications/users", { params: { page, per_page } })).data,
  });

  const errorMessage =
    error?.response?.data?.message ||
    error?.message ||
    "Failed to fetch notifications";

  return {
    data: data?.data?.data ?? [],
    pagination: data?.data ?? null,
    isLoading,
    isError,
    error,
    errorMessage,
    refetch,
  };
};

export default useGetNotificationsQuery;
