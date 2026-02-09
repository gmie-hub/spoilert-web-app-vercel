"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { ApiErrorResponse } from "@spt/types/error";
import api from "@spt/utils/apiClient";

import type { AxiosError } from "axios";
import type { FormikValues } from "formik";

interface Payload {
  email: string;
}

interface ForgotPasswordResponse {
  message: string;
}

export const useForgotPasswordMutation = () => {
  const router = useRouter();

  const forgotPassword = async (
    payload: Payload,
  ): Promise<ForgotPasswordResponse> => {
    return (await api.post("/auth/forgot-password", payload)).data;
  };

  const mutation = useMutation<
    ForgotPasswordResponse,
    AxiosError<ApiErrorResponse>,
    Payload
  >({
    mutationKey: ["forgot-password"],
    mutationFn: forgotPassword,
  });

  const forgotPasswordHandler = async (
    values: FormikValues,
    { setSubmitting, resetForm }: any,
  ) => {
    const payload: Payload = {
      email: values.email,
    };

    try {
      const response = await mutation.mutateAsync(payload);

      toast.success(
        response?.message || "Password reset link sent. Check your email 📬",
      );
      localStorage.setItem("userEmail", values.email);

      router.push("/auth/reset-password");

      resetForm();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error ||
          error?.response?.data?.message ||
          error?.message ||
          "Failed to send reset link",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return {
    isLoading: mutation.isPending,
    forgotPasswordHandler,
  };
};
