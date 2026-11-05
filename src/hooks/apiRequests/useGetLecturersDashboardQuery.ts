"use client";

import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

import type { ApiErrorResponse } from "@spt/types/error";
import api from "@spt/utils/apiClient";

export interface LecturersDashboardOverview {
  totalLecturers: number | null;
  totalSpoils: number | null;
  totalStudents: number | null;
  revenueToday: number | null;
  revenueThisWeek: number | null;
  revenueThisMonth: number | null;
  revenueOvertime: number | null;
}

interface LecturersDashboardResponse {
  status?: boolean;
  message?: string;
  data?: unknown;
}

const emptyOverview: LecturersDashboardOverview = {
  totalLecturers: null,
  totalSpoils: null,
  totalStudents: null,
  revenueToday: null,
  revenueThisWeek: null,
  revenueThisMonth: null,
  revenueOvertime: null,
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);

export const pickNumber = (source: Record<string, unknown>, keys: string[]): number | null => {
  for (const key of keys) {
    const value = source[key];
    if (value == null || value === "" || typeof value === "object") continue;
    const amount = Number(value);
    if (Number.isFinite(amount)) return amount;
  }
  return null;
};

export const pickCount = (source: Record<string, unknown>, keys: string[]): number | null => {
  const fromNumber = pickNumber(source, keys);
  if (fromNumber != null) return fromNumber;

  for (const key of keys) {
    const value = source[key];
    if (Array.isArray(value)) return value.length;
  }
  return null;
};

// Overview / revenue / stats bags get merged so both `total_lecturers` and
// `revenue.today` resolve without callers knowing the nesting.
export const flattenOverview = (payload: unknown): Record<string, unknown> => {
  if (!isRecord(payload)) return {};

  const nested = ["overview", "revenue", "stats", "totals", "counts", "earnings"]
    .map((key) => payload[key])
    .filter(isRecord);

  return Object.assign({}, payload, ...nested);
};

const toOverview = (payload: unknown): LecturersDashboardOverview => {
  const source = flattenOverview(payload);

  return {
    totalLecturers: pickCount(source, [
      "total_lecturers",
      "lecturers_count",
      "lecturer_count",
      "totalLecturers",
      "lecturers",
    ]),
    totalSpoils: pickCount(source, [
      "total_spoils",
      "total_spoylz",
      "spoils_count",
      "spoils_created",
      "totalSpoils",
      "spoils",
    ]),
    totalStudents: pickCount(source, [
      "total_students",
      "students_count",
      "total_learners",
      "learners_count",
      "enrolled_students",
      "totalStudents",
      "students",
      "learners",
    ]),
    revenueToday: pickNumber(source, [
      "total_revenue_today",
      "revenue_today",
      "today_revenue",
      "today",
    ]),
    revenueThisWeek: pickNumber(source, [
      "total_revenue_this_week",
      "revenue_this_week",
      "this_week_revenue",
      "week_revenue",
      "this_week",
      "week",
    ]),
    revenueThisMonth: pickNumber(source, [
      "total_revenue_this_month",
      "revenue_this_month",
      "this_month_revenue",
      "month_revenue",
      "this_month",
      "month",
    ]),
    revenueOvertime: pickNumber(source, [
      "total_revenue_overtime",
      "revenue_overtime",
      "overtime_revenue",
      "total_revenue",
      "total_earning",
      "total_earnings",
      "overtime",
    ]),
  };
};

const useGetLecturersDashboardQuery = () => {
  const { data, isLoading, isError, error } = useQuery<
    LecturersDashboardResponse,
    AxiosError<ApiErrorResponse>
  >({
    queryKey: ["lecturers-dashboard"],
    queryFn: async () => (await api.get("/lecturers/dashboard")).data,
  });

  return {
    overview: data?.data != null ? toOverview(data.data) : emptyOverview,
    isLoading,
    isError,
    errorMessage:
      error?.response?.data?.error ||
      error?.response?.data?.message ||
      error?.message ||
      "Failed to fetch dashboard overview",
  };
};

export default useGetLecturersDashboardQuery;
