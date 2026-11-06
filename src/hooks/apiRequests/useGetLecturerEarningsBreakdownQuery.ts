"use client";

import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

import type { ApiErrorResponse } from "@spt/types/error";
import api from "@spt/utils/apiClient";

import type { LecturerSpoil } from "./useGetLecturerSpoilsQuery";

interface BreakdownPage {
  current_page: number;
  last_page: number;
  data: LecturerSpoil[];
}

interface LecturerEarningsBreakdownResponse {
  status?: boolean;
  message?: string;
  data?: BreakdownPage;
}

const fetchBreakdownPage = async (lecturerId: number | string, page: number) =>
  (
    await api.get<LecturerEarningsBreakdownResponse>("/lecturers/earnings/breakdown", {
      params: { lecturer_id: lecturerId, page },
    })
  ).data.data;

// One lecturer's Spoylz, each with what it has earned the lecturer and the
// institution. Keyed by the lecturer record's id (the one in
// /institution/lecturers/{id}), not their user id. Every page is fetched, as
// the table searches and pages through the rows itself.
const useGetLecturerEarningsBreakdownQuery = (lecturerId?: number | string | null) => {
  const { data, isLoading, error, isError } = useQuery<LecturerSpoil[], AxiosError<ApiErrorResponse>>({
    queryKey: ["lecturer-earnings-breakdown", lecturerId],
    queryFn: async () => {
      const firstPage = await fetchBreakdownPage(lecturerId as number | string, 1);
      const otherPages = await Promise.all(
        Array.from({ length: Math.max(0, (firstPage?.last_page ?? 1) - 1) }, (_, index) =>
          fetchBreakdownPage(lecturerId as number | string, index + 2),
        ),
      );
      return [firstPage, ...otherPages].flatMap((page) => page?.data ?? []);
    },
    enabled: Boolean(lecturerId),
  });

  return {
    spoils: data ?? [],
    isLoading,
    isError,
    errorMessage:
      error?.response?.data?.error ||
      error?.response?.data?.message ||
      error?.message ||
      "Failed to fetch earnings breakdown",
  };
};

export default useGetLecturerEarningsBreakdownQuery;
