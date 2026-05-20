"use client";

import { useQuery } from "@tanstack/react-query";

import type { ApiErrorResponse } from "@spt/types/error";
import api from "@spt/utils/apiClient";

import type { AxiosError } from "axios";

export interface VerifyPaymentData {
  reference: string;
  status: string;
  amount?: string | number;
  currency?: string;
  gateway?: string;
  paid_at?: string | null;
  [key: string]: any;
}

interface VerifyPaymentResponse {
  status?: boolean;
  message?: string;
  data?: VerifyPaymentData;
}

const SUCCESS_VALUES = new Set([
  "success",
  "successful",
  "paid",
  "completed",
]);

export const useVerifyPaymentQuery = (reference?: string | null) => {
  const fetchVerification = async (): Promise<VerifyPaymentResponse> => {
    return (await api.get(`/payments/verify/${reference}`)).data;
  };

  const { data, isLoading, isError, error, isFetching, refetch } = useQuery<
    VerifyPaymentResponse,
    AxiosError<ApiErrorResponse>
  >({
    queryKey: ["verify-payment", reference],
    queryFn: fetchVerification,
    enabled: !!reference && reference.trim() !== "",
    retry: false,
  });

  const paymentStatus = data?.data?.status?.toLowerCase();
  const isSuccess =
    !!data &&
    !isError &&
    (data.status === true || (!!paymentStatus && SUCCESS_VALUES.has(paymentStatus)));

  const errorMessage =
    error?.response?.data?.message ||
    error?.message ||
    data?.message ||
    "We couldn't verify your payment.";

  return {
    data: data?.data ?? null,
    isSuccess,
    isLoading: isLoading || isFetching,
    isError,
    errorMessage,
    refetch,
  };
};

export default useVerifyPaymentQuery;
