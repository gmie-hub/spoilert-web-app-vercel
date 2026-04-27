"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import type { ApiErrorResponse } from "@spt/types/error";
import api from "@spt/utils/apiClient";

import type { AxiosError } from "axios";

interface ToggleSpoilLikePayload {
  spoil_id: number;
}

interface ToggleSpoilLikeResponse {
  status?: boolean;
  message?: string;
  data?: unknown;
}

const useToggleSpoilLikeMutation = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    ToggleSpoilLikeResponse,
    AxiosError<ApiErrorResponse>,
    ToggleSpoilLikePayload
  >({
    mutationKey: ["toggle-spoil-like"],
    mutationFn: async (payload) =>
      (await api.post("/spoils/likes/toggle", payload)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["spoil-details"] });
    },
  });

  const toggleLike = async (spoil_id: number) => {
    try {
      const response = await mutation.mutateAsync({ spoil_id });
      toast.success(response?.message || "Like updated");
      return response;
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to update like",
      );
      return null;
    }
  };

  return {
    toggleLike,
    isLoading: mutation.isPending,
  };
};

export default useToggleSpoilLikeMutation;
