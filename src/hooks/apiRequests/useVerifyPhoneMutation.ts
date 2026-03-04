"use client";

import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { ApiErrorResponse } from "@spt/types/error";
import api from "@spt/utils/apiClient";

import type { AxiosError } from "axios";
import type { FormikValues } from "formik";

interface VerifyPhonePayload {
  country_code: string;
  phone_number: string;
}

interface VerifyPhoneResponse {
  message: string;
}

export const useVerifyPhoneMutation = () => {

  const sendOtp = async (
    payload: VerifyPhonePayload,
  ): Promise<VerifyPhoneResponse> => {
    return (await api.post("users/phone/send-otp", payload)).data;
  };

  const mutation = useMutation<
    VerifyPhoneResponse,
    AxiosError<ApiErrorResponse>,
    VerifyPhonePayload
  >({
    mutationKey: ["verify-phone"],
    mutationFn: sendOtp,
  });

  const sendOtpHandler = async (
    values: FormikValues,
    { setSubmitting }: any,
  ) => {
    const payload: VerifyPhonePayload = {
      country_code: values.countryCode.replace("+", ""), // remove + for API
      phone_number: values.phoneNumber,
    };

    try {
      await mutation.mutateAsync(payload);
      toast.success("OTP sent successfully 📲");

      // optional: navigate to next step for OTP verification
      // router.push("/auth/phone-verification");
    } catch (error: any) {
      const message =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        error?.message ||
        "Failed to send OTP";
      toast.error(message);
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  return {
    isLoading: mutation.isPending,
    sendOtpHandler,
  };
};
