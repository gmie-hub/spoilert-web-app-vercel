"use client";

import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { ApiErrorResponse } from "@spt/types/error";
import api from "@spt/utils/apiClient";

import type { AxiosError } from "axios";
import type { FormikValues } from "formik";

// Payload interface
interface VerifyOtpPayload {
  code: string;
}

// Response interface (adjust if your API returns more data)
interface VerifyOtpResponse {
  message: string;
  // Add other response fields if needed, e.g., token, user info
}

export const useVerifyOtpMutation = () => {
  const verifyOtp = async (
    payload: VerifyOtpPayload,
  ): Promise<VerifyOtpResponse> => {
    return (await api.post("users/phone/verify-otp", payload)).data;
  };

  const mutation = useMutation<
    VerifyOtpResponse,
    AxiosError<ApiErrorResponse>,
    VerifyOtpPayload
  >({
    mutationKey: ["verify-otp"],
    mutationFn: verifyOtp,
  });

  const verifyOtpHandler = async (
    values: FormikValues,
    { setSubmitting }: any,
  ) => {
    const payload: VerifyOtpPayload = {
      code: values.code, // ensure your Formik field is named "otpCode"
    };

    try {
      const response = await mutation.mutateAsync(payload);
      toast.success(response.message || "OTP verified successfully ✅");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error ||
          error?.response?.data?.message ||
          error?.message ||
          "Failed to verify OTP",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return {
    verifyOtpHandler,
    isLoading: mutation.isPending,
  };
};
