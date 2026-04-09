"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import type { ApiErrorResponse } from "@spt/types/error";
import api from "@spt/utils/apiClient";

import type { AxiosError } from "axios";

export interface CreateSpoilTemplatePayload {
  template: {
    name: string;
    description: string;
    fields: Array<{
      name: string;
      type: string;
    }>;
  };
  spoil_id: number;
}

interface CreateSpoilTemplateResponse {
  message: string;
  status?: boolean;
  data?: any;
}

export const useCreateSpoilTemplateMutation = () => {
  const queryClient = useQueryClient();

  const createSpoilTemplate = async (
    payload: CreateSpoilTemplatePayload,
  ): Promise<CreateSpoilTemplateResponse> => {
    return (await api.post("/certificates/template/spoil", payload)).data;
  };

  const mutation = useMutation<
    CreateSpoilTemplateResponse,
    AxiosError<ApiErrorResponse>,
    CreateSpoilTemplatePayload
  >({
    mutationKey: ["create-spoil-template"],
    mutationFn: createSpoilTemplate,
  });

  const createSpoilTemplateHandler = async (
    payload: CreateSpoilTemplatePayload,
  ) => {
    try {
      const res = await mutation.mutateAsync(payload);

      queryClient.invalidateQueries({
        queryKey: ["certificate-templates"],
      });
      queryClient.invalidateQueries({
        queryKey: ["spoil-template", payload.spoil_id],
      });

      toast.success(res?.message || "Certificate template created successfully");
      return res;
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error ||
          error?.response?.data?.message ||
          error?.message ||
          "Failed to create certificate template",
      );
      throw error;
    }
  };

  return {
    createSpoilTemplateHandler,
    isLoading: mutation.isPending,
  };
};

export default useCreateSpoilTemplateMutation;
