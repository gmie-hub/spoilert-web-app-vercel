"use client";

import { useQuery } from "@tanstack/react-query";

import { useAuthStore } from "@spt/store/authStore";
import type { ApiErrorResponse } from "@spt/types/error";
import api from "@spt/utils/apiClient";

import type { AxiosError } from "axios";

export interface LessonResponse {
  id: number;
  title: string;
  slug: string;
  type: "file" | "video" | "pdf" | "text";
  content: string | null;
  content_url: string | null;
  file: string | null;
  description: string | null;
  module_id: number;
  spoil_id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

interface LessonsPagination {
  current_page: number;
  data: LessonResponse[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: { url: string | null; label: string; active: boolean }[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

interface LessonsApiResponse {
  message: string;
  status: boolean;
  data: LessonsPagination;
}

export const useGetLessonQuery = (
  spoilId?: number | string | null,
) => {
  const storedSpoilId = useAuthStore.getState().createdSpoilId;
  const resolvedSpoilId = spoilId ?? storedSpoilId;

  const fetchLessons = async (): Promise<LessonsApiResponse> => {
    return (
      await api.get(`/lessons?spoil_id=${resolvedSpoilId}`)
    ).data;
  };

  const { data, isLoading, isError, error } = useQuery<
    LessonsApiResponse,
    AxiosError<ApiErrorResponse>
  >({
    queryKey: ["lessons", resolvedSpoilId],
    queryFn: fetchLessons,
    enabled: !!resolvedSpoilId,
  });

  const errorMessage =
    error?.response?.data?.message ||
    error?.message ||
    "Failed to fetch lessons";

  return {
    data: data?.data?.data ?? [],
    pagination: data?.data,
    isLoading,
    isError,
    lessonErrorMessage: errorMessage,
  };
};

export default useGetLessonQuery;
