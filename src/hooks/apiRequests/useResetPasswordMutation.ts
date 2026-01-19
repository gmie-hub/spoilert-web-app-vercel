"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { ApiErrorResponse } from "@spt/types/error";
import api from "@spt/utils/apiClient";

import type { AxiosError } from "axios";
import type { FormikValues } from "formik";

interface Payload {
  token: string;
  password: string;
  password_confirmation?:string
}

interface ResetPasswordResponse {
  message: string;
}

export const useResetPasswordMutation = () => {
  const router = useRouter();

  const resetPassword = async (
    payload: Payload
  ): Promise<ResetPasswordResponse> => {
    return (await api.post("/auth/reset-password", payload)).data;
  };

  const mutation = useMutation<
    ResetPasswordResponse,
    AxiosError<ApiErrorResponse>,
    Payload
  >({
    mutationKey: ["reset-password"],
    mutationFn: resetPassword,
  });

  const resetPasswordHandler = async (
    values: FormikValues,
    actions: any,
    token: string,
  ) => {
    const { setSubmitting } = actions;

    try {
      const payload: Payload = {
        token,
        password: values.password,
        password_confirmation:values.password
      };

      const response = await mutation.mutateAsync(payload);

      toast.success(
        response?.message || "Password reset successful 🔐"
      );

      router.push("/auth/signin");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Password reset failed"
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
