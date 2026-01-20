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
  code: string;
}

interface VerifyOtpResponse {
  message: string;
  data?: any; // optional, can contain user info if backend returns
}

export const useVerifyEmailMutation = () => {
  const router = useRouter();

  const verifyEmail = async (payload: Payload): Promise<VerifyOtpResponse> => {
    return (await api.post("/auth/verify-otp", payload)).data;
  };

  const mutation = useMutation<
    VerifyOtpResponse,
    AxiosError<ApiErrorResponse>,
    Payload
  >({
    mutationKey: ["verify-otp"],
    mutationFn: verifyEmail,
  });

  const verifyEmailHandler = async (
    values: FormikValues,
    { setSubmitting }: any
  ) => {
    const payload: Payload = {
      email: values.email,
      code: values.code,
    };

    try {
      const response = await mutation.mutateAsync(payload);
      toast.success(response.message || "Email verified successfully 🎉");
        localStorage.removeItem("userEmail");

      // Redirect user after verification
      router.push("/auth/account-created-successfully"); // or any post-verification route
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Verification failed"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return {
    isLoading: mutation.isPending,
    verifyEmailHandler,
  };
};
