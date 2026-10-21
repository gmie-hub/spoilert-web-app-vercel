"use client";

import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import type { ApiErrorResponse } from "@spt/types/error";
import api from "@spt/utils/apiClient";

import type { AxiosError } from "axios";

interface Payload {
  email: string;
}

interface ResendInvitationResponse {
  message: string;
  status: boolean;
}

const useResendInvitationMutation = () => {
  const mutation = useMutation<ResendInvitationResponse, AxiosError<ApiErrorResponse>, Payload>({
    mutationKey: ["resend-invitation"],
    mutationFn: async (payload) => (await api.post("/onboarding/resend", payload)).data,
  });

  const resendInvitationHandler = async (email: string): Promise<boolean> => {
    try {
      await mutation.mutateAsync({ email: email.trim() });
      toast.success("Invitation resent successfully");
      return true;
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error ||
          error?.response?.data?.message ||
          error?.message ||
          "Failed to resend invitation. Please try again.",
      );
      return false;
    }
  };

  return {
    isLoading: mutation.isPending,
    resendInvitationHandler,
  };
};

export default useResendInvitationMutation;
