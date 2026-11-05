"use client";

import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

import type { ApiErrorResponse } from "@spt/types/error";
import api from "@spt/utils/apiClient";

import { toLecturerEarningsOverview } from "./useGetLecturerEarningsOverviewQuery";
import { flattenOverview, pickNumber } from "./useGetLecturersDashboardQuery";

export interface LecturerRevenueSplit {
  lecturerPercent: number | null;
  institutionPercent: number | null;
}

interface LecturerDetailsResponse {
  status?: boolean;
  message?: string;
  data?: unknown;
}

const percentKeys = (party: "lecturer" | "institution") => [
  `${party}_percentage`,
  `${party}_percent`,
  `${party}_split_percentage`,
  `${party}_split_percent`,
  `${party}_split`,
  `${party}_share_percentage`,
  `${party}_share_percent`,
];

// Bare `lecturer` / `institution` only count inside a split bag; elsewhere
// they're earnings amounts.
const toRevenueSplit = (payload: unknown): LecturerRevenueSplit => {
  const source = flattenOverview(payload);
  const split = flattenOverview(source.revenue_split ?? source.split);

  return {
    lecturerPercent:
      pickNumber(split, ["lecturer", ...percentKeys("lecturer")]) ??
      pickNumber(source, percentKeys("lecturer")),
    institutionPercent:
      pickNumber(split, ["institution", ...percentKeys("institution")]) ??
      pickNumber(source, percentKeys("institution")),
  };
};

// One lecturer, as the institution sees them. Keyed by the lecturer record's id
// (the one in /institution/lecturers/{id}), not their user id.
const useGetLecturerDetailsQuery = (lecturerId?: number | string | null) => {
  const { data, isLoading, isError, error } = useQuery<
    LecturerDetailsResponse,
    AxiosError<ApiErrorResponse>
  >({
    queryKey: ["lecturer-details", lecturerId],
    queryFn: async () => (await api.get(`/lecturers/${lecturerId}`)).data,
    enabled: Boolean(lecturerId),
  });

  return {
    overview: toLecturerEarningsOverview(data?.data),
    split: toRevenueSplit(data?.data),
    isLoading,
    isError,
    errorMessage:
      error?.response?.data?.error ||
      error?.response?.data?.message ||
      error?.message ||
      "Failed to fetch lecturer details",
  };
};

export default useGetLecturerDetailsQuery;
