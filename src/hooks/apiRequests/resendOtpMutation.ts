"use client";

import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { ApiErrorResponse } from "@spt/types/error";
import api from "@spt/utils/apiClient";

import type { AxiosError } from "axios";

interface ResendOtpPayload {
  email: string;
}

interface ResendOtpResponse {
  message: string;
}

export const useResendOtpMutation = () => {
  const resendOtp = async (
    payload: ResendOtpPayload,
  ): Promise<ResendOtpResponse> => {
    return (await api.post("/auth/resend-otp", payload)).data;
  };

  const mutation = useMutation<
    ResendOtpResponse,
    AxiosError<ApiErrorResponse>,
    ResendOtpPayload
  >({
    mutationKey: ["resend-otp"],
    mutationFn: resendOtp,
  });

  const resendOtpHandler = async (email: string) => {
    try {
      await mutation.mutateAsync({ email });
      toast.success("OTP resent successfully 📩");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error ||
          error?.response?.data?.message ||
          error?.message ||
          "Failed to resend OTP",
      );
    }
  };

  return {
    resendOtpHandler,
    isLoading: mutation.isPending,
  };
};
