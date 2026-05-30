"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import type { ApiErrorResponse } from "@spt/types/error";
import api from "@spt/utils/apiClient";

import type { AxiosError } from "axios";

interface CompleteSpoilPayload {
  spoil_id: number | string;
}

interface CompleteSpoilResponse {
  message: string;
  data?: any;
}

const useCompleteSpoilMutation = () => {
  const queryClient = useQueryClient();

  const completeSpoil = async (
    payload: CompleteSpoilPayload,
  ): Promise<CompleteSpoilResponse> => {
    return (await api.post("/spoils/learner/complete", payload)).data;
  };

  const mutation = useMutation<
    CompleteSpoilResponse,
    AxiosError<ApiErrorResponse>,
    CompleteSpoilPayload
  >({
    mutationKey: ["complete-spoil"],
    mutationFn: completeSpoil,
  });

  const completeSpoilHandler = async (spoilId: number | string) => {
    try {
      const response = await mutation.mutateAsync({ spoil_id: spoilId });
      toast.success(response?.message || "Spoil completed successfully");
      queryClient.invalidateQueries({ queryKey: ["spoil-details", spoilId] });

      return response;
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error ||
          error?.response?.data?.message ||
          error?.message ||
          "Failed to complete Spoylz",
      );

      return null;
    }
  };

  return {
    completeSpoilHandler,
    isCompletingSpoil: mutation.isPending,
  };
};

export default useCompleteSpoilMutation;
