"use client";

import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

import type { ApiErrorResponse } from "@spt/types/error";
import api from "@spt/utils/apiClient";

export interface EarningSpoil {
  spoil_name: string;
  cover_image: string | null;
  total_enrolled: number;
  total_amount: number;
}

export interface EarningsOverview {
  total_earning: string;
  spoils_created: number;
}

export interface EarningsBreakdownData {
  overview: EarningsOverview;
  data: EarningSpoil[];
}

interface EarningsBreakdownInner {
  overview?: EarningsOverview;
  data?: EarningSpoil[];
}

interface EarningsBreakdownResponse {
  status?: boolean;
  message?: string;
  data?: EarningsBreakdownInner;
}

export const useGetEarningsBreakdownQuery = (userId?: number | null) => {
  const { data, isLoading, error, isError } = useQuery<
    EarningsBreakdownResponse,
    AxiosError<ApiErrorResponse>
  >({
    queryKey: ["earnings-breakdown", userId],
    queryFn: async () =>
      (await api.get(`/analytics/payments/earnings?user_id=${userId}`)).data,
    enabled: !!userId,
  });

  const errorMessage =
    error?.response?.data?.message ||
    error?.message ||
    "Failed to fetch earnings breakdown";

  const inner = data?.data;
  const earnings: EarningsBreakdownData | null = inner
    ? {
        overview: inner.overview ?? { total_earning: "0", spoils_created: 0 },
        data: Array.isArray(inner.data) ? inner.data : [],
      }
    : null;

  return {
    earnings,
    isLoading,
    isError,
    errorMessage,
  };
};
