"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { ApiErrorResponse } from "@spt/types/error";
import api from "@spt/utils/apiClient";

import { INSTITUTION_EMAIL_KEY } from "./useInstitutionForgotPasswordMutation";

import type { AxiosError } from "axios";
import type { FormikValues } from "formik";

interface Payload {
  code: string;
  password: string;
  password_confirmation?: string;
  email: string;
}

interface ResetPasswordResponse {
  message: string;
}

export const useInstitutionResetPasswordMutation = () => {
  const router = useRouter();

  const resetPassword = async (
    payload: Payload,
  ): Promise<ResetPasswordResponse> => {
    return (await api.post("/auth/reset-password", payload)).data;
  };

  const mutation = useMutation<
    ResetPasswordResponse,
    AxiosError<ApiErrorResponse>,
    Payload
  >({
    mutationKey: ["institution-reset-password"],
    mutationFn: resetPassword,
  });

  const resetPasswordHandler = async (values: FormikValues, actions: any) => {
    const { setSubmitting } = actions;
    const email =
      typeof window !== "undefined"
        ? localStorage.getItem(INSTITUTION_EMAIL_KEY) || ""
        : "";

    try {
      const payload: Payload = {
        code: values?.otp,
        password: values.password,
        password_confirmation: values.password,
        email,
      };

      const response = await mutation.mutateAsync(payload);

      toast.success(response?.message || "Password reset successful 🔐");
      if (typeof window !== "undefined") {
        localStorage.removeItem(INSTITUTION_EMAIL_KEY);
      }

      router.push("/institution/reset-password-successfully");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error ||
          error?.response?.data?.message ||
          error?.message ||
          "Password reset failed",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return {
    isLoading: mutation.isPending,
    resetPasswordHandler,
  };
};
