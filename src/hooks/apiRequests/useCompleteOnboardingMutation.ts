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
  password_confirmation: string;
}

interface CompleteOnboardingResponse {
  message: string;
}

// Returned when the invite link was already used (or never existed) — the
// institution has most likely onboarded already, so send them to log in.
const INVALID_LINK_PATTERN = /invalid or already used onboarding link/i;

export const useCompleteOnboardingMutation = () => {
  const router = useRouter();

  const completeOnboarding = async (
    payload: Payload,
  ): Promise<CompleteOnboardingResponse> => {
    return (await api.post("/onboarding/complete", payload)).data;
  };

  const mutation = useMutation<
    CompleteOnboardingResponse,
    AxiosError<ApiErrorResponse>,
    Payload
  >({
    mutationKey: ["complete-onboarding"],
    mutationFn: completeOnboarding,
  });

  const completeOnboardingHandler = async (
    values: FormikValues,
    actions: any,
    token: string,
    onSuccess?: () => void,
  ) => {
    const { setSubmitting } = actions;

    try {
      const payload: Payload = {
        token,
        password: values.password,
        password_confirmation: values.confirmPassword,
      };

      const response = await mutation.mutateAsync(payload);

      toast.success(response?.message || "Password created successfully 🎉");
      onSuccess?.();
    } catch (error: any) {
      const message =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        error?.message ||
        "Failed to complete onboarding";

      const isUsedLink = INVALID_LINK_PATTERN.test(message);

      // Toasts stack newest-on-top, so the hint goes first to sit under the error.
      if (isUsedLink) {
        toast(
          "Already onboarded? Please log in. If you forgot your password, click \"Forgot Password?\" to reset it.",
          { icon: "ℹ️", duration: 8000 },
        );
      }
      toast.error(message);

      // The Toaster lives in the root layout, so both toasts survive the redirect.
      if (isUsedLink) router.replace("/institution/login");
    } finally {
      setSubmitting(false);
    }
  };

  return {
    isLoading: mutation.isPending,
    completeOnboardingHandler,
  };
};
