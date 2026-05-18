"use client";

import { useQuery } from "@tanstack/react-query";

import { useAuthStore } from "@spt/store/authStore";
import type { ApiErrorResponse } from "@spt/types/error";
import api from "@spt/utils/apiClient";

import type { AxiosError } from "axios";

export interface PaymentDatum {
  id: number;
  user_id: number;
  tutor_id: number | null;
  spoil_id: number | null;
  promotion_package_id: number | null;
  reference: string;
  amount: string;
  charge: string;
  net_amount: string;
  tax_amount: string;
  currency: string;
  gateway: string;
  type: string;
  status: string;
  paid_at: string | null;
  payment_url: string | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  // optional legacy fields some backends may still include
  description?: string | null;
  account_credited?: string | null;
  rejection_reason?: string | null;
  transaction_type?: string | null;
  learner_name?: string | null;
}

interface PaymentsResponse {
  status?: boolean;
  message?: string;
  data?:
    | PaymentDatum[]
    | {
        current_page?: number;
        last_page?: number;
        total?: number;
        per_page?: number;
        data?: PaymentDatum[];
      };
}

export interface PaymentsFilters {
  from_date?: string;
  to_date?: string;
  page?: number;
  per_page?: number;
  roleOverride?: "tutor" | "learner";
}

const extractPayments = (response?: PaymentsResponse): PaymentDatum[] => {
  if (!response) return [];
  if (Array.isArray(response.data)) return response.data;
  const nested = (response.data as { data?: PaymentDatum[] })?.data;
  if (Array.isArray(nested)) return nested;
  return [];
};

const extractPagination = (
  response?: PaymentsResponse
): { current_page: number; last_page: number; total: number } => {
  if (!response || Array.isArray(response.data))
    return { current_page: 1, last_page: 1, total: 0 };
  const d = response.data as {
    current_page?: number;
    last_page?: number;
    total?: number;
  };
  return {
    current_page: d?.current_page ?? 1,
    last_page: d?.last_page ?? 1,
    total: d?.total ?? 0,
  };
};

export const useGetPaymentsQuery = (filters: PaymentsFilters = {}) => {
  const user = useAuthStore((state) => state.user);
  const userId = user?.id;
  const isTutor = user?.role === "tutor";

  const fetchPayments = async (): Promise<PaymentsResponse> => {
    const params = new URLSearchParams();
    if (userId) {
      const useTutorParam =
        filters.roleOverride === "tutor"
          ? true
          : filters.roleOverride === "learner"
            ? false
            : isTutor;
      if (useTutorParam) {
        params.set("tutor_id", String(userId));
      } else {
        params.set("user_id", String(userId));
      }
    }
    if (filters.from_date) params.set("from_date", filters.from_date);
    if (filters.to_date) params.set("to_date", filters.to_date);
    if (filters.page) params.set("page", String(filters.page));
    if (filters.per_page) params.set("per_page", String(filters.per_page));
    const query = params.toString();
    return (await api.get(`/payments${query ? `?${query}` : ""}`)).data;
  };

  const { data, isLoading, error, isError, refetch } = useQuery<
    PaymentsResponse,
    AxiosError<ApiErrorResponse>
  >({
    queryKey: ["payments", userId, filters.roleOverride ?? (isTutor ? "tutor" : "learner"), filters.from_date, filters.to_date, filters.page, filters.per_page],
    queryFn: fetchPayments,
    enabled: !!userId,
  });

  const errorMessage =
    error?.response?.data?.message ||
    error?.message ||
    "Failed to fetch payments";

  return {
    data,
    payments: extractPayments(data),
    pagination: extractPagination(data),
    isLoading,
    isError,
    errorMessage,
    refetch,
  };
};

export default useGetPaymentsQuery;
