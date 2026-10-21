"use client";

import { useQuery } from "@tanstack/react-query";

import type { ApiErrorResponse } from "@spt/types/error";
import api from "@spt/utils/apiClient";

import type { AxiosError } from "axios";

export interface EnrolledLearner {
  id: number;
  user_id?: number;
  percentage_completed?: number;
  status?: "ongoing" | "completed" | "not_started";
  created_at?: string;
  learner?: {
    id: number;
    first_name: string;
    last_name: string;
    username?: string | null;
    avatar?: string | null;
  } | null;
  user?: {
    id: number;
    first_name: string;
    last_name: string;
    username?: string | null;
    avatar?: string | null;
  } | null;
}

export interface EnrolledLearnersFilters {
  // Left out to list every status.
  status?: EnrolledLearner["status"];
  search?: string;
}

// GET /spoils/learner?spoil_id=&is_tutor=true lists the spoil's enrollments,
// each with the enrolled learner as `user` (or `learner`).
interface SpoilEnrollment extends EnrolledLearner {
  spoil_id?: number | null;
  // Progress has gone by several names on the learner endpoints.
  progress_percentage?: string | number | null;
  progress?: number | null;
}

// Directly, or as a paginated page.
type EnrollmentsPage =
  | SpoilEnrollment[]
  | { data?: SpoilEnrollment[]; items?: SpoilEnrollment[]; last_page?: number };

interface EnrollmentsResponse {
  message: string;
  status: boolean;
  data: EnrollmentsPage;
}

const toPercentage = (value?: string | number | null) => {
  if (value == null || value === "") return undefined;
  const percentage = Number(value);
  return Number.isFinite(percentage) ? percentage : undefined;
};

const toEnrolledLearner = (item: SpoilEnrollment): EnrolledLearner => ({
  ...item,
  percentage_completed: toPercentage(
    item.percentage_completed ?? item.progress_percentage ?? item.progress,
  ),
});

const fetchEnrollmentsPage = async (
  spoilId: number | string,
  page: number,
  { status, search }: EnrolledLearnersFilters,
) =>
  (
    await api.get<EnrollmentsResponse>("/spoils/learner", {
      params: {
        spoil_id: spoilId,
        is_tutor: true,
        page,
        ...(status ? { status } : {}),
        ...(search ? { search } : {}),
      },
    })
  ).data.data;

const pageItems = (page: EnrollmentsPage) =>
  Array.isArray(page) ? page : (page?.data ?? page?.items ?? []);

// Everyone enrolled on one of the tutor's spoils, optionally narrowed by
// status and a search, which the API applies.
const useGetEnrolledLearnersQuery = (
  spoilId: number | string,
  enabled = true,
  filters: EnrolledLearnersFilters = {},
) => {
  const status = filters.status || undefined;
  const search = filters.search?.trim() || undefined;

  const { data, isLoading, isError, error } = useQuery<
    SpoilEnrollment[],
    AxiosError<ApiErrorResponse>
  >({
    queryKey: ["enrolled-learners", spoilId, status ?? "", search ?? ""],
    // When the list is paginated, pull every page so no learner is left out.
    queryFn: async () => {
      const firstPage = await fetchEnrollmentsPage(spoilId, 1, { status, search });
      const lastPage = Array.isArray(firstPage) ? 1 : (firstPage?.last_page ?? 1);
      const otherPages = await Promise.all(
        Array.from({ length: Math.max(0, lastPage - 1) }, (_, index) =>
          fetchEnrollmentsPage(spoilId, index + 2, { status, search }),
        ),
      );
      return [firstPage, ...otherPages].flatMap(pageItems);
    },
    enabled: Boolean(spoilId) && enabled,
    // Keep the current learners on screen while a new filter loads, but never
    // carry over another spoil's.
    placeholderData: (previousData, previousQuery) =>
      String(previousQuery?.queryKey[1]) === String(spoilId) ? previousData : undefined,
  });

  // Only this spoil's enrollments, in case the API returns others alongside.
  const learners = (data ?? [])
    .filter((item) => item.spoil_id == null || String(item.spoil_id) === String(spoilId))
    .map(toEnrolledLearner);

  return {
    learners,
    isLoading,
    isError,
    errorMessage:
      error?.response?.data?.error ||
      error?.response?.data?.message ||
      error?.message ||
      "Failed to fetch enrolled learners",
  };
};

export default useGetEnrolledLearnersQuery;
