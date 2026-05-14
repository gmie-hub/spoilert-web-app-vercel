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
  data?: PaymentDatum[] | { current_page?: number; data?: PaymentDatum[] };
}

export interface PaymentsFilters {
  from_date?: string;
  to_date?: string;
}

const extractPayments = (response?: PaymentsResponse): PaymentDatum[] => {
  if (!response) return [];
  if (Array.isArray(response.data)) return response.data;
  const nested = (response.data as { data?: PaymentDatum[] })?.data;
  if (Array.isArray(nested)) return nested;
  return [];
};

export const useGetPaymentsQuery = (filters: PaymentsFilters = {}) => {
  const user = useAuthStore((state) => state.user);
  const userId = user?.id;
  const isTutor = user?.role === "tutor";

  const fetchPayments = async (): Promise<PaymentsResponse> => {
    const params = new URLSearchParams();
    if (userId) {
      if (isTutor) {
        params.set("tutor_id", String(userId));
      } else {
        params.set("user_id", String(userId));
      }
    }
    if (filters.from_date) params.set("from_date", filters.from_date);
    if (filters.to_date) params.set("to_date", filters.to_date);
    const query = params.toString();
    return (await api.get(`/payments${query ? `?${query}` : ""}`)).data;
  };

  const { data, isLoading, error, isError, refetch } = useQuery<
    PaymentsResponse,
    AxiosError<ApiErrorResponse>
  >({
    queryKey: ["payments", userId, isTutor, filters.from_date, filters.to_date],
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
    isLoading,
    isError,
    errorMessage,
    refetch,
  };
};

export default useGetPaymentsQuery;
