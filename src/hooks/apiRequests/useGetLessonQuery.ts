"use client";

import { useQuery } from "@tanstack/react-query";

import type { ApiErrorResponse } from "@spt/types/error";
import api from "@spt/utils/apiClient";

import type { AxiosError } from "axios";

export interface LessonResponse {
  id: number;
  title: string;
  slug: string;
  type: "video" | "pdf" | "text";
  content: string | null;
  file: string | null;
  description: string | null;
  module_id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

interface LessonsApiResponse {
  message: string;
  status: boolean;
  data: LessonResponse[];
}

export const useGetLessonQuery = (
  moduleId: number | string | null | undefined,
  spoilId: number | string | null | undefined,
) => {
  const fetchLessons = async (): Promise<LessonsApiResponse> => {
    return (
      await api.get(`/lessons?module_id=${moduleId}&spoil_id=${spoilId}`)
    ).data;
  };

  const { data, isLoading, isError, error } = useQuery<
    LessonsApiResponse,
    AxiosError<ApiErrorResponse>
  >({
    queryKey: ["lessons", moduleId, spoilId],
    queryFn: fetchLessons,
    enabled: !!moduleId && !!spoilId,
  });

  const errorMessage =
    error?.response?.data?.message ||
    error?.message ||
    "Failed to fetch lessons";

  return {
    data: data?.data ?? [],
    isLoading,
    isError,
    lessonErrorMessage: errorMessage,
  };
};

export default useGetLessonQuery;
