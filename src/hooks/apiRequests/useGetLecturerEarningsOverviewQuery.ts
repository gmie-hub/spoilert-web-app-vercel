"use client";

import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

import type { ApiErrorResponse } from "@spt/types/error";
import api from "@spt/utils/apiClient";

import { flattenOverview, pickCount, pickNumber } from "./useGetLecturersDashboardQuery";

export interface LecturerEarningsOverview {
  totalRevenue: number | null;
  totalSpoils: number | null;
  totalStudents: number | null;
  institutionEarnings: number | null;
  lecturerEarnings: number | null;
}

interface LecturerEarningsOverviewResponse {
  status?: boolean;
  message?: string;
  data?: unknown;
}

export const toLecturerEarningsOverview = (payload: unknown): LecturerEarningsOverview => {
  const source = flattenOverview(payload);

  return {
    totalRevenue: pickNumber(source, [
      "total_revenue_generated",
      "total_revenue",
      "revenue_generated",
      "total_gross_revenue",
      "gross_revenue",
    ]),
    totalSpoils: pickCount(source, [
      "total_spoils_created",
      "total_spoylz_created",
      "total_spoils",
      "total_spoylz",
      "spoils_created",
      "spoils_count",
      "spoils",
    ]),
    totalStudents: pickCount(source, [
      "students_enrolled",
      "total_students_enrolled",
      "total_students",
      "total_enrolled",
      "enrolled_students",
      "students_count",
      "total_learners",
      "students",
      "learners",
    ]),
    institutionEarnings: pickNumber(source, [
      "total_institutional_earnings",
      "institutional_earnings",
      "institution_earnings",
      "total_institution_earnings",
      "institution_earning",
      "total_institution_earning",
      "institution_share",
      "institution",
    ]),
    lecturerEarnings: pickNumber(source, [
      "lecturer_earnings",
      "total_lecturer_earnings",
      "lecturer_earning",
      "total_lecturer_earning",
      "lecturer_share",
      "total_earning",
      "total_earnings",
      "lecturer",
    ]),
  };
};

// One lecturer's totals, as the institution sees them. Keyed by the lecturer
// record's id (the one in /institution/lecturers/{id}), not their user id.
const useGetLecturerEarningsOverviewQuery = (lecturerId?: number | string | null) => {
  const { data, isLoading, isError, error } = useQuery<
    LecturerEarningsOverviewResponse,
    AxiosError<ApiErrorResponse>
  >({
    queryKey: ["lecturer-earnings-overview", lecturerId],
    queryFn: async () =>
      (await api.get("/lecturers/earnings/overview", { params: { lecturer_id: lecturerId } })).data,
    enabled: Boolean(lecturerId),
  });

  return {
    overview: toLecturerEarningsOverview(data?.data),
    isLoading,
    isError,
    errorMessage:
      error?.response?.data?.error ||
      error?.response?.data?.message ||
      error?.message ||
      "Failed to fetch earnings overview",
  };
};

export default useGetLecturerEarningsOverviewQuery;
