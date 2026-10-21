"use client";

import { useQuery } from "@tanstack/react-query";

import type { ApiErrorResponse } from "@spt/types/error";
import api from "@spt/utils/apiClient";

import type { AxiosError } from "axios";

export interface UserDetails {
  id: number;
  first_name?: string | null;
  middle_name?: string | null;
  last_name?: string | null;
  username?: string | null;
  email?: string | null;
  avatar?: string | null;
  // 1 or 0
  is_active?: number | boolean | null;
  last_login?: string | null;
  created_at?: string | null;
}

interface UserDetailsResponse {
  message: string;
  status: boolean;
  data: UserDetails | null;
}

// Any user's record by id: GET /users/{id}, the request the admin portal uses
// for a learner's overview.
const useGetUserDetailsQuery = (userId: number | string) => {
  const { data, isLoading, isError, error } = useQuery<
    UserDetailsResponse,
    AxiosError<ApiErrorResponse>
  >({
    queryKey: ["user-details", String(userId)],
    queryFn: async () => (await api.get(`/users/${userId}`)).data,
    enabled: Boolean(userId),
  });

  return {
    user: data?.data ?? null,
    isLoading,
    isError,
    errorMessage:
      error?.response?.data?.error ||
      error?.response?.data?.message ||
      error?.message ||
      "Failed to fetch user details",
  };
};

export default useGetUserDetailsQuery;
