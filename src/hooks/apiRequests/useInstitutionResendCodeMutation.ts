"use client";

import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { ApiErrorResponse } from "@spt/types/error";
import api from "@spt/utils/apiClient";

import type { AxiosError } from "axios";

interface ResendCodePayload {
  email: string;
}

interface ResendCodeResponse {
  message: string;
}

export const useInstitutionResendCodeMutation = () => {
  const resendCode = async (
    payload: ResendCodePayload,
  ): Promise<ResendCodeResponse> => {
    return (await api.post("/institution/auth/resend-code", payload)).data;
  };

  const mutation = useMutation<
    ResendCodeResponse,
    AxiosError<ApiErrorResponse>,
    ResendCodePayload
  >({
    mutationKey: ["institution-resend-code"],
    mutationFn: resendCode,
  });

  const resendCodeHandler = async (email: string) => {
    try {
      await mutation.mutateAsync({ email });
      toast.success("Code resent successfully 📩");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error ||
          error?.response?.data?.message ||
          error?.message ||
          "Failed to resend code",
      );
    }
  };

  return {
    resendCodeHandler,
    isLoading: mutation.isPending,
  };
};
