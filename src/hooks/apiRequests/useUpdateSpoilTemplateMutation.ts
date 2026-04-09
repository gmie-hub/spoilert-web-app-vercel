"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import type { ApiErrorResponse } from "@spt/types/error";
import api from "@spt/utils/apiClient";

import type { AxiosError } from "axios";

export interface UpdateSpoilTemplatePayload {
  template: {
    name: string;
    description: string;
    fields: Array<{
      name: string;
      type: string;
    }>;
  };
}

interface UpdateSpoilTemplateResponse {
  message: string;
  status?: boolean;
  data?: any;
}

export const useUpdateSpoilTemplateMutation = () => {
  const queryClient = useQueryClient();

  const updateSpoilTemplate = async ({
    spoilId,
    payload,
  }: {
    spoilId: number;
    payload: UpdateSpoilTemplatePayload;
  }): Promise<UpdateSpoilTemplateResponse> => {
    return (
      await api.patch(`/certificates/template/${spoilId}/spoil`, payload)
    ).data;
  };

  const mutation = useMutation<
    UpdateSpoilTemplateResponse,
    AxiosError<ApiErrorResponse>,
    { spoilId: number; payload: UpdateSpoilTemplatePayload }
  >({
    mutationKey: ["update-spoil-template"],
    mutationFn: updateSpoilTemplate,
  });

  const updateSpoilTemplateHandler = async (
    spoilId: number,
    payload: UpdateSpoilTemplatePayload,
  ) => {
    try {
      const res = await mutation.mutateAsync({ spoilId, payload });

      queryClient.invalidateQueries({
        queryKey: ["certificate-templates"],
      });
      queryClient.invalidateQueries({
        queryKey: ["spoil-template", spoilId],
      });

      toast.success(res?.message || "Certificate template updated successfully");
      return res;
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error ||
          error?.response?.data?.message ||
          error?.message ||
          "Failed to update certificate template",
      );
      throw error;
    }
  };

  return {
    updateSpoilTemplateHandler,
    isLoading: mutation.isPending,
  };
};

export default useUpdateSpoilTemplateMutation;
