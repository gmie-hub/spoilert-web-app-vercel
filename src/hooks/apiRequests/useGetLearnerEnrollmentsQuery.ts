"use client";

import { useQuery } from "@tanstack/react-query";

import type { ApiErrorResponse } from "@spt/types/error";
import api from "@spt/utils/apiClient";

import type { AxiosError } from "axios";

export interface LearnerEnrollment {
  id: number;
  spoil_id?: number | null;
  status?: string | null;
  // e.g. "33.33"
  progress_percentage?: number | string | null;
  created_at?: string | null;
  spoil?: {
    id: number;
    title?: string | null;
    type?: string | null;
    cover_image_url?: string | null;
    tutor?: {
      id?: number;
      first_name?: string | null;
      last_name?: string | null;
      avatar?: string | null;
    } | null;
  } | null;
}

// Directly, or as a paginated page.
type EnrollmentsPage =
  | LearnerEnrollment[]
  | { data?: LearnerEnrollment[]; items?: LearnerEnrollment[]; last_page?: number };

interface EnrollmentsResponse {
  message: string;
  status: boolean;
  data: EnrollmentsPage;
}

const fetchEnrollmentsPage = async (userId: number | string, page: number) =>
  (await api.get<EnrollmentsResponse>("/spoils/learner", { params: { user_id: userId, page } })).data
    .data;

const pageItems = (page: EnrollmentsPage) =>
  Array.isArray(page) ? page : (page?.data ?? page?.items ?? []);

// Every Spoylz one learner is enrolled on, whatever its status:
// GET /spoils/learner?user_id=, the request the admin portal uses for a
// learner's "Spoils Enrolled".
const useGetLearnerEnrollmentsQuery = (userId: number | string) => {
  const { data, isLoading, isError, error } = useQuery<
    LearnerEnrollment[],
    AxiosError<ApiErrorResponse>
  >({
    queryKey: ["learner-enrollments", String(userId)],
    // When the list is paginated, pull every page so no Spoylz is left out.
    queryFn: async () => {
      const firstPage = await fetchEnrollmentsPage(userId, 1);
      const lastPage = Array.isArray(firstPage) ? 1 : (firstPage?.last_page ?? 1);
      const otherPages = await Promise.all(
        Array.from({ length: Math.max(0, lastPage - 1) }, (_, index) =>
          fetchEnrollmentsPage(userId, index + 2),
        ),
      );
      return [firstPage, ...otherPages].flatMap(pageItems);
    },
    enabled: Boolean(userId),
  });

  return {
    enrollments: data ?? [],
    isLoading,
    isError,
    errorMessage:
      error?.response?.data?.error ||
      error?.response?.data?.message ||
      error?.message ||
      "Failed to fetch enrolled Spoylz",
  };
};

export default useGetLearnerEnrollmentsQuery;
