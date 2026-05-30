"use client";

import { useQuery } from "@tanstack/react-query";

import { useAuthStore } from "@spt/store/authStore";
import type { ApiErrorResponse } from "@spt/types/error";
import api from "@spt/utils/apiClient";

import type { AxiosError } from "axios";

interface GetSpoilTemplateResponse {
  message: string;
  status: boolean;
  data: SpoilTemplateData | null;
}

interface SpoilTemplateData {
  id: number;
  tutor_id: number;
  spoil_id: number;
  template: Template;
  deleted_at: null;
  created_at: string;
  updated_at: string;
}

interface Template {
  name: string;
  fields: Field[];
  description: string;
}

interface Field {
  name: string;
  type: string;
}

export const useGetSpoilTemplateQuery = (
  spoilId?: number | string | null,
  options?: {
    enabled?: boolean;
  },
) => {
  const storedSpoilId = useAuthStore((state) => state.createdSpoilId);
  const resolvedSpoilId = spoilId ?? storedSpoilId;

  const fetchSpoilTemplate = async (): Promise<GetSpoilTemplateResponse> => {
    return (await api.get(`/certificates/template/${resolvedSpoilId}/spoil`)).data;
  };

  const { data, isLoading, isError, error } = useQuery<
    GetSpoilTemplateResponse,
    AxiosError<ApiErrorResponse>
  >({
    queryKey: ["spoil-template", resolvedSpoilId],
    queryFn: fetchSpoilTemplate,
    enabled: (options?.enabled ?? true) && !!resolvedSpoilId,
  });

  const errorMessage =
    error?.response?.data?.message ||
    error?.message ||
    "Failed to fetch spoylz template";

  return {
    data: data?.data ?? null,
    response: data,
    isLoading,
    isError,
    errorMessage,
  };
};

export default useGetSpoilTemplateQuery;
