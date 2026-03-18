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
  ) => {
    try {
      const response = await mutation.mutateAsync({ spoil_id, gateway });
      const paymentLink = response?.data?.payment?.payment_link;

      toast.success(response?.message || "Payment initialized successfully");

      if (paymentLink && typeof window !== "undefined") {
        toast.success("Opening payment link in a new tab...");
        // open in a new tab/window without affecting the current page
        window.open(paymentLink, "_blank", "noopener,noreferrer");
      }

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
