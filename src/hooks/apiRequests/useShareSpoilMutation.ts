"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import type { ApiErrorResponse } from "@spt/types/error";
import api from "@spt/utils/apiClient";

import type { AxiosError } from "axios";

interface ShareSpoilPayload {
  spoil_id: number;
}

interface ShareSpoilResponse {
  status?: boolean;
  message?: string;
  data?: unknown;
}

const useShareSpoilMutation = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    ShareSpoilResponse,
    AxiosError<ApiErrorResponse>,
    ShareSpoilPayload
  >({
    mutationKey: ["share-spoil"],
    mutationFn: async (payload) =>
      (await api.post("/spoils/shares", payload)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["spoil-details"] });
    },
  });

  const shareSpoil = async (spoil_id: number) => {
    try {
      const response = await mutation.mutateAsync({ spoil_id });
      toast.success(response?.message || "Spoil shared successfully");
      return response;
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to share spoil",
      );
      return null;
    }
  };

  return {
    shareSpoil,
    isLoading: mutation.isPending,
  };
};

export default useShareSpoilMutation;
