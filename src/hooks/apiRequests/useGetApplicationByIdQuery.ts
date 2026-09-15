"use client";

import { useQuery } from "@tanstack/react-query";

import type { ApiErrorResponse } from "@spt/types/error";
import api from "@spt/utils/apiClient";

import type { AxiosError } from "axios";

export interface ApplicationContactResponse {
  full_name: string;
  email: string;
  phone: string;
  position: string;
}

export interface ApplicationResponseData {
  name: string;
  type: string;
  state: string;
  address: string;
  city: string;
  country: string;
  official_email: string;
  phone: string;
  contact: ApplicationContactResponse;
}

const fetchApplicationById = async (id: number | string) => {
  const res = await api.get(`/applications/${id}`);
  return res.data;
};

export const useGetApplicationByIdQuery = (applicationId?: number | string | null) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["application", applicationId],
    queryFn: () => fetchApplicationById(applicationId as number | string),
    enabled: !!applicationId,
  }) as {
    data?: any;
    isLoading: boolean;
    isError: boolean;
    error?: AxiosError<ApiErrorResponse> | null;
  };

  // This endpoint responds 200 OK even on failure (e.g. when unauthenticated),
  // encoding the failure as `{ status: false, error, data: null }` in the body
  // instead of a non-2xx status, so axios/react-query won't treat it as an error.
  const hasApiLevelError = data?.status === false;

  const errorMessage = hasApiLevelError
    ? data?.error || "Failed to fetch application details"
    : error?.response?.data?.message || error?.message || "Failed to fetch application details";

  return {
    data: hasApiLevelError ? null : ((data?.data ?? data ?? null) as ApplicationResponseData | null),
    isLoading,
    isError: isError || hasApiLevelError,
    errorMessage,
  };
};

export default useGetApplicationByIdQuery;
