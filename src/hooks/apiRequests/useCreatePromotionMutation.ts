"use client";

import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import type { ApiErrorResponse } from "@spt/types/error";
import api from "@spt/utils/apiClient";

import type { AxiosError } from "axios";

interface CreatePromotionPayload {
  spoil_id: number;
  promotion_package_id: number;
}

export interface PromotionData {
  id: number;
  spoil_id: number;
  tutor_id: number;
  user_id: number;
  promotion_package_id: number;
  amount: string;
  net_amount: string;
  charge: number;
  tax_amount: number;
  currency: string;
  gateway: string;
  reference: string;
  payment_url: string;
  type: string;
  created_at: string;
  updated_at: string;
}

interface CreatePromotionResponse {
  status?: boolean;
  message?: string;
  data?: PromotionData;
}

const useCreatePromotionMutation = () => {
  const mutation = useMutation<
    CreatePromotionResponse,
    AxiosError<ApiErrorResponse>,
    CreatePromotionPayload
  >({
    mutationKey: ["create-promotion"],
    mutationFn: async (payload) =>
      (await api.post("/promotions", payload)).data,
  });

  const createPromotion = async (
    spoil_id: number,
    promotion_package_id: number,
  ) => {
    try {
      const response = await mutation.mutateAsync({
        spoil_id,
        promotion_package_id,
      });
      toast.success(response?.message || "spoylz promoted successfully");
      return response;
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to promote spoylz ",
      );
      return null;
    }
  };

  return {
    createPromotion,
    isLoading: mutation.isPending,
  };
};

export default useCreatePromotionMutation;
