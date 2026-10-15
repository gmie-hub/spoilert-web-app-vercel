"use client";

import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

import type { ApiErrorResponse } from "@spt/types/error";
import api from "@spt/utils/apiClient";

import type { EarningSpoil, EarningsBreakdownData, EarningsOverview } from "./useGetEarningsBreakdownQuery";

interface LecturerEarningsBreakdownResponse {
  status?: boolean;
  message?: string;
  // { overview, data: [...] }, or the rows on their own.
  data?: { overview?: EarningsOverview; data?: EarningSpoil[] } | EarningSpoil[];
}

// One lecturer's earnings per Spoylz, as the institution sees them. Keyed by the
// lecturer record's id (the one in /institution/lecturers/{id}), not their user id.
const useGetLecturerEarningsBreakdownQuery = (lecturerId?: number | string | null) => {
  const { data, isLoading, error, isError } = useQuery<
    LecturerEarningsBreakdownResponse,
    AxiosError<ApiErrorResponse>
  >({
    queryKey: ["lecturer-earnings-breakdown", lecturerId],
    queryFn: async () =>
      (await api.get("/lecturers/earnings/breakdown", { params: { lecturer_id: lecturerId } })).data,
    enabled: Boolean(lecturerId),
  });

  const inner = data?.data;
  const earnings: EarningsBreakdownData | null = inner
    ? Array.isArray(inner)
      ? {
          // No overview came with the rows, so the total is their sum.
          overview: {
            total_earning: String(inner.reduce((sum, row) => sum + (Number(row.total_amount) || 0), 0)),
            spoils_created: inner.length,
          },
          data: inner,
        }
      : {
          overview: inner.overview ?? { total_earning: "0", spoils_created: 0 },
          data: Array.isArray(inner.data) ? inner.data : [],
        }
    : null;

  return {
    earnings,
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
