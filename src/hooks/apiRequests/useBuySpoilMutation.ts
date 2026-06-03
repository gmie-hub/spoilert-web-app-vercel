"use client";

import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import type { ApiErrorResponse } from "@spt/types/error";
import api from "@spt/utils/apiClient";

import type { AxiosError } from "axios";

interface BuySpoilPayload {
  spoil_id: number | string;
  gateway: "FLUTTERWAVE" | string;
}

interface BuySpoilResponse {
  message?: string;
  data?: any;
  [key: string]: any;
}

const useBuySpoilMutation = () => {
  const buySpoil = async (payload: BuySpoilPayload): Promise<BuySpoilResponse> => {
    return (await api.post("/spoils/learner/buy", payload)).data;
  };

  const mutation = useMutation<
    BuySpoilResponse,
    AxiosError<ApiErrorResponse>,
    BuySpoilPayload
  >({
    mutationKey: ["buy-spoil"],
    mutationFn: buySpoil,
  });

  const buySpoilHandler = async (
    spoil_id: number | string,
    gateway: "FLUTTERWAVE" | string = "FLUTTERWAVE",
    options?: { successMessage?: string },
  ) => {
    try {
      const response = await mutation.mutateAsync({ spoil_id, gateway });

      // When a caller supplies `successMessage` we show exactly that and ignore
      // the backend message (e.g. free spoils show "Spoil enrolled successfully"
      // instead of the payment-oriented copy the API returns).
      toast.success(
        options?.successMessage ||
          response?.message ||
          "Payment initialized successfully",
      );

      return response;
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error ||
          error?.response?.data?.message ||
          error?.message ||
          "Failed to initialize payment",
      );

      return null;
    }
  };

  return {
    buySpoilHandler,
    isLoading: mutation.isPending,
  };
};

export default useBuySpoilMutation;
