"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { ApiErrorResponse } from "@spt/types/error";
import api from "@spt/utils/apiClient";

import type { AxiosError } from "axios";
import type { FormikValues } from "formik";

// Separate localStorage key from the consumer flow's "userEmail" so an
// institution admin resetting a password can't clobber (or be clobbered by)
// a learner reset happening in another tab.
export const INSTITUTION_EMAIL_KEY = "institutionEmail";

interface Payload {
  email: string;
}

interface ForgotPasswordResponse {
  message: string;
}

export const useInstitutionForgotPasswordMutation = () => {
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
    mutationKey: ["institution-forgot-password"],
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

      toast.success(response?.message || "Verification code sent 📬");
      localStorage.setItem(INSTITUTION_EMAIL_KEY, values.email);

      router.push("/institution/reset-password");

      resetForm();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error ||
          error?.response?.data?.message ||
          error?.message ||
          "Failed to send verification code",
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
