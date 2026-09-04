"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { ApiErrorResponse } from "@spt/types/error";
import api from "@spt/utils/apiClient";

import { INSTITUTION_EMAIL_KEY } from "./useInstitutionForgotPasswordMutation";

import type { AxiosError } from "axios";

// Handed back by the reset-code check and required by the reset-password
// step, so a code can't be replayed once the reset itself has happened.
export const INSTITUTION_RESET_TOKEN_KEY = "institutionResetToken";

interface Payload {
  email: string;
  code: string;
}

interface VerifyCodeResponse {
  message: string;
  data: {
    reset_token: string;
  };
}

export const useInstitutionVerifyCodeMutation = () => {
  const router = useRouter();

  const verifyCode = async (
    payload: Payload,
  ): Promise<VerifyCodeResponse> => {
    return (await api.post("/institution/auth/verify-code", payload)).data;
  };

  const mutation = useMutation<
    VerifyCodeResponse,
    AxiosError<ApiErrorResponse>,
    Payload
  >({
    mutationKey: ["institution-verify-code"],
    mutationFn: verifyCode,
  });

  const verifyCodeHandler = async (
    code: string,
    { setSubmitting }: any,
  ) => {
    const email =
      typeof window !== "undefined"
        ? localStorage.getItem(INSTITUTION_EMAIL_KEY) || ""
        : "";

    try {
      const response = await mutation.mutateAsync({ email, code });

      if (response?.data?.reset_token) {
        localStorage.setItem(
          INSTITUTION_RESET_TOKEN_KEY,
          response.data.reset_token,
        );
      }

      toast.success(response?.message || "Code verified 🎉");
      router.push("/institution/reset-password");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error ||
          error?.response?.data?.message ||
          error?.message ||
          "Invalid or expired code",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return {
    isLoading: mutation.isPending,
    verifyCodeHandler,
  };
};
