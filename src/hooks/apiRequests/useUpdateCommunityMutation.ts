"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import type { ApiErrorResponse } from "@spt/types/error";
import api from "@spt/utils/apiClient";

import type { AxiosError } from "axios";

interface UpdateResponse {
  message?: string;
  data?: any;
}

export const useUpdateCommunityMutation = () => {
  const queryClient = useQueryClient();

  const updateCommunity = async (args: { id: string | number; payload: Record<string, any> }): Promise<UpdateResponse> => {
    const { id, payload } = args;
    return (await api.patch(`/communities/${id}`, payload)).data;
  };

  const mutation = useMutation<UpdateResponse, AxiosError<ApiErrorResponse>, { id: string | number; payload: Record<string, any> }>(
    {
      mutationKey: ["update-community"],
      mutationFn: updateCommunity,
    }
  );

  const updateCommunityHandler = async (id: string | number, payload: Record<string, any>) => {
    try {
      const res = await mutation.mutateAsync({ id, payload });
      try {
        queryClient.invalidateQueries({ queryKey: ["communities"] });
        queryClient.invalidateQueries({ queryKey: ["communities-created-by-user"] });
        queryClient.invalidateQueries({ queryKey: ["community-detail", { id }] });
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn("Failed to invalidate community queries", err);
      }
      toast.success(res?.message || "Community updated");
      return res;
    } catch (error: any) {
      toast.error(error?.response?.data?.error || error?.response?.data?.message || error?.message || "Failed to update community");
      throw error;
    }
  };

  return { updateCommunityHandler, isLoading: mutation.isPending };
};

export default useUpdateCommunityMutation;
