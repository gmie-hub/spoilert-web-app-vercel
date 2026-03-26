"use client";

import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import type { ApiErrorResponse } from "@spt/types/error";
import api from "@spt/utils/apiClient";

import type { AxiosError } from "axios";

interface LeaveCommunityPayload {
  community_id: number | string;
}

interface LeaveCommunityResponse {
  message: string;
  data?: any;
}

export const useLeaveCommunityMutation = () => {
  const leaveCommunity = async (
    payload: LeaveCommunityPayload,
  ): Promise<LeaveCommunityResponse> => {
    return (await api.post("/communities/leave", payload)).data;
  };

  const mutation = useMutation<
    LeaveCommunityResponse,
    AxiosError<ApiErrorResponse>,
    LeaveCommunityPayload
  >({
    mutationKey: ["leave-community"],
    mutationFn: leaveCommunity,
  });

  const errorMessage = (mutation.error as any)?.response?.data?.message || (mutation.error as any)?.message || null;

  const leaveCommunityHandler = async (community_id: number | string) => {
    try {
      const response = await mutation.mutateAsync({ community_id });
      toast.success(response?.message || "Left community successfully");
      return response;
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error ||
          error?.response?.data?.message ||
          error?.message ||
          "Failed to leave community",
      );
      throw error;
    }
  };

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    leaveCommunityHandler,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    errorMessage,
  };
};

export default useLeaveCommunityMutation;
