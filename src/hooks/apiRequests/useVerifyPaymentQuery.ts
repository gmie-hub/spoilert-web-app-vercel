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
  error?: string;
  data?: VerifyPaymentData | null;
}

interface VerifyPaymentParams {
  tx_ref?: string | null;
  transaction_id?: string | null;
}

const SUCCESS_VALUES = new Set([
  "success",
  "successful",
  "paid",
  "completed",
]);

export const useVerifyPaymentQuery = ({
  tx_ref,
  transaction_id,
}: VerifyPaymentParams) => {
  const fetchVerification = async (): Promise<VerifyPaymentResponse> => {
    return (
      await api.post("/payments/verify", {
        reference: tx_ref,
        transaction_id,
      })
    ).data;
  };

  const { data, isLoading, isError, error, isFetching, refetch } = useQuery<
    VerifyPaymentResponse,
    AxiosError<ApiErrorResponse>
  >({
    queryKey: ["verify-payment", tx_ref, transaction_id],
    queryFn: fetchVerification,
    enabled: !!tx_ref && !!transaction_id,
    retry: false,
  });

  const paymentStatus = data?.data?.status?.toLowerCase();
  const isSuccess =
    !!data &&
    !isError &&
    (data.status === true || (!!paymentStatus && SUCCESS_VALUES.has(paymentStatus)));

  const errorMessage =
    error?.response?.data?.error ||
    error?.response?.data?.message ||
    data?.error ||
    data?.message ||
    error?.message ||
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
