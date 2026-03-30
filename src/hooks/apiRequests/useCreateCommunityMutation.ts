"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import type { ApiErrorResponse } from "@spt/types/error";
import api from "@spt/utils/apiClient";

import type { AxiosError } from "axios";

interface CreateCommunityPayload {
  spoil_id: number | string;
}

interface CreateCommunityResponse {
  message: string;
  data?: any;
}

export const useCreateCommunityMutation = () => {
  const queryClient = useQueryClient();

  const createCommunity = async (payload: CreateCommunityPayload): Promise<CreateCommunityResponse> => {
    return (await api.post("/communities", payload)).data;
  };

  const mutation = useMutation<CreateCommunityResponse, AxiosError<ApiErrorResponse>, CreateCommunityPayload>({
    mutationKey: ["create-community"],
    mutationFn: createCommunity,
  });

  const createCommunityHandler = async (payload: CreateCommunityPayload) => {
    try {
      const res = await mutation.mutateAsync(payload);
      // invalidate lists that may be affected
      try {
        queryClient.invalidateQueries({ queryKey: ["communities-created-by-user"] });
        queryClient.invalidateQueries({ queryKey: ["user-communities"] });
      } catch (err) {
        // ignore invalidation failures
        // eslint-disable-next-line no-console
        console.warn("Failed to invalidate community queries", err);
      }

      toast.success(res?.message || "Community created");
      return res;
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message || "Failed to create community");
      throw error;
    }
  };

  return { createCommunityHandler, isLoading: mutation.isPending };
};

export default useCreateCommunityMutation;
