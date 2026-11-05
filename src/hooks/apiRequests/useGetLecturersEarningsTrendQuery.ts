"use client";

import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

import type { ApiErrorResponse } from "@spt/types/error";
import api from "@spt/utils/apiClient";

export interface EarningsTrendFilters {
  year?: number;
  from_date?: string;
  to_date?: string;
}

export interface EarningsTrendSeries {
  key: string;
  label: string;
  color: string;
  /** Naira amounts for Jan–Dec. */
  values: number[];
}

interface LecturersEarningsTrendResponse {
  status?: boolean;
  message?: string;
  data?: unknown;
}

const SERIES_COLORS = ["#013B4D", "#DA8543", "#0D9488"];

const MONTH_INDEX: Record<string, number> = {
  jan: 0,
  january: 0,
  feb: 1,
  february: 1,
  mar: 2,
  march: 2,
  apr: 3,
  april: 3,
  may: 4,
  jun: 5,
  june: 5,
  jul: 6,
  july: 6,
  aug: 7,
  august: 7,
  sep: 8,
  sept: 8,
  september: 8,
  oct: 9,
  october: 9,
  nov: 10,
  november: 10,
  dec: 11,
  december: 11,
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);

const emptyMonths = () => Array.from({ length: 12 }, () => 0);

const monthIndex = (value: unknown): number | null => {
  if (typeof value === "number" && Number.isFinite(value)) {
    if (value >= 1 && value <= 12) return value - 1;
    if (value >= 0 && value <= 11) return value;
    return null;
  }

  if (typeof value !== "string") return null;

  const raw = value.trim();
  const iso = raw.match(/(?:^|\D)(\d{4})-(\d{1,2})(?:-|$)/);
  if (iso) {
    const month = Number(iso[2]);
    if (month >= 1 && month <= 12) return month - 1;
  }

  const numeric = Number(raw);
  if (raw !== "" && Number.isFinite(numeric)) return monthIndex(numeric);

  return MONTH_INDEX[raw.toLowerCase()] ?? MONTH_INDEX[raw.toLowerCase().slice(0, 3)] ?? null;
};

const toAmount = (value: unknown): number => {
  if (value == null || value === "" || typeof value === "object") return 0;
  const amount = Number(value);
  return Number.isFinite(amount) ? amount : 0;
};

const pointAmount = (point: Record<string, unknown>) =>
  point.amount ??
  point.total ??
  point.value ??
  point.revenue ??
  point.earnings ??
  point.total_amount ??
  point.total_earning ??
  0;

const pointMonth = (point: Record<string, unknown>) =>
  point.month ?? point.month_name ?? point.label ?? point.period ?? point.date ?? point.name;

const valuesFromPoints = (points: Record<string, unknown>[]): number[] => {
  const values = emptyMonths();
  points.forEach((point) => {
    const index = monthIndex(pointMonth(point));
    if (index != null) values[index] = toAmount(pointAmount(point));
  });
  return values;
};

const valuesFromUnknown = (value: unknown): number[] | null => {
  if (Array.isArray(value)) {
    if (value.length === 0) return emptyMonths();
    if (value.every(isRecord)) return valuesFromPoints(value);
    if (value.every((item) => item == null || typeof item !== "object")) {
      const values = emptyMonths();
      value.slice(0, 12).forEach((item, index) => {
        values[index] = toAmount(item);
      });
      return values;
    }
    return null;
  }

  if (!isRecord(value)) return null;

  const values = emptyMonths();
  let found = false;
  Object.entries(value).forEach(([key, amount]) => {
    const index = monthIndex(key);
    if (index == null || typeof amount === "object") return;
    values[index] = toAmount(amount);
    found = true;
  });
  return found ? values : null;
};

const seriesFromList = (
  items: Record<string, unknown>[],
  fallbackLabel: string,
): EarningsTrendSeries[] =>
  items.map((item, index) => ({
    key: String(item.key ?? item.id ?? item.label ?? item.name ?? index),
    label: String(item.label ?? item.name ?? fallbackLabel),
    color: SERIES_COLORS[index % SERIES_COLORS.length],
    values:
      valuesFromUnknown(item.data ?? item.values ?? item.trend ?? item.months ?? item) ?? emptyMonths(),
  }));

const namedSeriesColor = (key: string) => (key === "institution" ? 0 : 1);

const toTrendSeries = (payload: unknown): EarningsTrendSeries[] => {
  if (payload == null) return [];

  if (Array.isArray(payload)) {
    if (payload.every(isRecord) && payload.some((item) => Array.isArray(item.data) || Array.isArray(item.values))) {
      return seriesFromList(payload, "Revenue");
    }
    const values = valuesFromUnknown(payload);
    return values ? [{ key: "revenue", label: "Revenue", color: SERIES_COLORS[0], values }] : [];
  }

  if (!isRecord(payload)) return [];

  if (Array.isArray(payload.datasets)) {
    const datasets = payload.datasets.filter(isRecord);
    const labels = Array.isArray(payload.labels) ? payload.labels : [];
    return datasets.map((dataset, index) => {
      const rawValues = dataset.data ?? dataset.values;
      if (Array.isArray(rawValues) && labels.length === rawValues.length) {
        const values = emptyMonths();
        labels.forEach((label, i) => {
          const month = monthIndex(label);
          if (month != null) values[month] = toAmount(rawValues[i]);
        });
        return {
          key: String(dataset.key ?? dataset.label ?? index),
          label: String(dataset.label ?? dataset.name ?? "Revenue"),
          color: SERIES_COLORS[index % SERIES_COLORS.length],
          values,
        };
      }
      return {
        key: String(dataset.key ?? dataset.label ?? index),
        label: String(dataset.label ?? dataset.name ?? "Revenue"),
        color: SERIES_COLORS[index % SERIES_COLORS.length],
        values: valuesFromUnknown(rawValues) ?? emptyMonths(),
      };
    });
  }

  const named: { key: string; label: string; raw: unknown }[] = [
    { key: "lecturer", label: "Lecturer Earnings", raw: payload.lecturer_earnings ?? payload.lecturer },
    {
      key: "institution",
      label: "Institution Earnings",
      raw: payload.institution_earnings ?? payload.institution,
    },
  ];

  const namedSeries = named.flatMap(({ key, label, raw }) => {
    const values = valuesFromUnknown(raw);
    return values ? [{ key, label, color: SERIES_COLORS[namedSeriesColor(key)], values }] : [];
  });
  if (namedSeries.length) return namedSeries;

  const nested =
    payload.trend ??
    payload.monthly_trend ??
    payload.earnings_trend ??
    payload.series ??
    payload.earnings ??
    payload.revenue ??
    payload.months ??
    payload.monthly ??
    payload.data;

  if (Array.isArray(nested) && nested.every(isRecord) && nested.some((item) => Array.isArray(item.data) || Array.isArray(item.values))) {
    return seriesFromList(nested, "Revenue");
  }

  const values = valuesFromUnknown(nested) ?? valuesFromUnknown(payload);
  return values ? [{ key: "revenue", label: "Revenue", color: SERIES_COLORS[0], values }] : [];
};

const useGetLecturersEarningsTrendQuery = (filters: EarningsTrendFilters = {}) => {
  const params: Record<string, string | number> = {};
  if (filters.year) params.year = filters.year;
  if (filters.from_date) params.from_date = filters.from_date;
  if (filters.to_date) params.to_date = filters.to_date;

  const { data, isLoading, isError, error } = useQuery<
    LecturersEarningsTrendResponse,
    AxiosError<ApiErrorResponse>
  >({
    queryKey: ["lecturers-earnings-trend", params],
    queryFn: async () => (await api.get("/lecturers/earnings/trend", { params })).data,
  });

  return {
    series: toTrendSeries(data?.data),
    isLoading,
    isError,
    errorMessage:
      error?.response?.data?.error ||
      error?.response?.data?.message ||
      error?.message ||
      "Failed to fetch revenue trend",
  };
};

export default useGetLecturersEarningsTrendQuery;
