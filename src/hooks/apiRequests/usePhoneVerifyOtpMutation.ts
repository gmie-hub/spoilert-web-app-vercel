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
  status?: boolean;
  error?: string;
  // Add other response fields if needed, e.g., token, user info
}

// `authToken` is for flows with no logged-in session (e.g. institution
// onboarding, where the token comes from the invite link) — it's sent instead
// of the stored auth token.
export const useVerifyOtpMutation = (authToken?: string) => {
  const verifyOtp = async (
    payload: VerifyOtpPayload,
  ): Promise<VerifyOtpResponse> => {
    const data: VerifyOtpResponse = (
      await api.post(
        "users/phone/verify-otp",
        payload,
        authToken
          ? { headers: { Authorization: `Bearer ${authToken}` } }
          : undefined,
      )
    ).data;

    // A wrong or expired code can come back as `status: false`, so treat it as
    // a failure even when the HTTP status is 2xx.
    if (data?.status === false) {
      throw new Error(data.error || data.message || "Invalid or expired OTP.");
    }

    return data;
  };

  const mutation = useMutation<
    VerifyOtpResponse,
    AxiosError<ApiErrorResponse>,
    VerifyOtpPayload
  >({
    mutationKey: ["verify-otp"],
    mutationFn: verifyOtp,
  });

  // Resolves to whether the code was accepted, so callers only move on when it was.
  const verifyOtpHandler = async (
    values: FormikValues,
    { setSubmitting }: any,
  ): Promise<boolean> => {
    const payload: VerifyOtpPayload = {
      code: values.code, // ensure your Formik field is named "otpCode"
    };

    try {
      const response = await mutation.mutateAsync(payload);
      toast.success(response.message || "OTP verified successfully ✅");
      return true;
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error ||
          error?.response?.data?.message ||
          error?.message ||
          "Failed to verify OTP",
      );
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  return {
    verifyOtpHandler,
    // Raw mutate for non-Formik callers (e.g. custom digit-box OTP inputs)
    // that handle the toasts themselves; it rejects on an invalid code.
    verifyOtp: mutation.mutateAsync,
    isLoading: mutation.isPending,
  };
};
