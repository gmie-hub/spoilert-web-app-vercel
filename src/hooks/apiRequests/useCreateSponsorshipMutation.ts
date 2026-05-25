"use client";

import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import type { ApiErrorResponse } from "@spt/types/error";
import api from "@spt/utils/apiClient";

import type { AxiosError } from "axios";

interface CreateSponsorshipPayload {
  spoil_id: number;
  quantity: number;
}

interface SponsorshipPayment {
  id: number;
  reference: string;
  gateway: string;
  amount: number;
  currency: string;
  payment_link: string;
  status: string | null;
}

export interface SponsorshipPaymentData {
  status: string;
  enrollment: null;
  payment: SponsorshipPayment;
}

interface CreateSponsorshipResponse {
  status?: boolean;
  message?: string;
  data?: SponsorshipPaymentData;
}

const useCreateSponsorshipMutation = () => {
  const mutation = useMutation<
    CreateSponsorshipResponse,
    AxiosError<ApiErrorResponse>,
    CreateSponsorshipPayload
  >({
    mutationKey: ["create-sponsorship"],
    mutationFn: async (payload) =>
      (await api.post("/sponsorships/sponsor", payload)).data,
  });

  const createSponsorship = async (spoil_id: number, quantity: number) => {
    try {
      const response = await mutation.mutateAsync({ spoil_id, quantity });
      toast.success(response?.message || "Sponsorship created successfully");
      return response;
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to create sponsorship",
      );
      return null;
    }
  };

  return {
    createSponsorship,
    isLoading: mutation.isPending,
  };
};

export default useCreateSponsorshipMutation;
