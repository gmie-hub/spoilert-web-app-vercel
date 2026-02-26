"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { useAuthStore } from "@spt/store/authStore";
import type { ApiErrorResponse } from "@spt/types/error";
import api from "@spt/utils/apiClient";

import type { AxiosError } from "axios";

interface CreateModulePayload {
  title: string;
  description?: string;
  spoil_id: number | string;
}

interface CreateModuleResponse {
  message: string;
  data: any;
}

export const useCreateModuleMutation = () => {
    const queryClient = useQueryClient();

    
  const createModule = async (payload: CreateModulePayload): Promise<CreateModuleResponse> => {
    // if no spoil_id provided, try to use the last created spoil id from the persisted store
    const finalPayload = { ...payload } as any;
    if (!finalPayload.spoil_id) {
      const createdSpoilId = useAuthStore.getState().createdSpoilId;
      if (createdSpoilId) finalPayload.spoil_id = createdSpoilId;
    }

    return (await api.post("/modules", finalPayload)).data;
  };

  const mutation = useMutation<CreateModuleResponse, AxiosError<ApiErrorResponse>, CreateModulePayload>({
    mutationKey: ["create-module"],
    mutationFn: createModule,
  });

  const createModuleHandler = async (payload: CreateModulePayload) => {
    try {
      const res = await mutation.mutateAsync(payload);
      // toast.success("Module added");

        queryClient.invalidateQueries({
            queryKey: ["spoil"],
          });

      return res;
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error || error?.response?.data?.message || error?.message || "Failed to add module",
      );
      throw error;
    }
  };

  return { createModuleHandler, isLoading: mutation.isPending };
};

export default useCreateModuleMutation;
