"use client";

import { useMutation } from "@tanstack/react-query";
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

export const useCompleteOnboardingMutation = () => {
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
      toast.error(
        error?.response?.data?.error ||
          error?.response?.data?.message ||
          error?.message ||
          "Failed to complete onboarding",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return {
    isLoading: mutation.isPending,
    completeOnboardingHandler,
  };
};
