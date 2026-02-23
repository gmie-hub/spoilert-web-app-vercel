"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import type { ApiErrorResponse } from "@spt/types/error";
import api from "@spt/utils/apiClient";

import type { AxiosError } from "axios";

interface UpdateModulePayload {
  moduleId: number | string;
  title: string;
  description?: string;
}

interface UpdateModuleResponse {
  message: string;
  data: any;
}

export const useUpdateModuleMutation = () => {
  const queryClient = useQueryClient();

  const updateModule = async ({
    moduleId,
    ...body
  }: UpdateModulePayload): Promise<UpdateModuleResponse> => {
    const formData = new FormData();
    formData.append("_method", "patch");
    formData.append("title", body.title);
    if (body.description) formData.append("description", body.description);

    return (
      await api.post(`/modules/${moduleId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
    ).data;
  };

  const mutation = useMutation<
    UpdateModuleResponse,
    AxiosError<ApiErrorResponse>,
    UpdateModulePayload
  >({
    mutationKey: ["update-module"],
    mutationFn: updateModule,
  });

  const updateModuleHandler = async (payload: UpdateModulePayload) => {
    try {
      const res = await mutation.mutateAsync(payload);
      toast.success("Module updated");

      queryClient.invalidateQueries({ queryKey: ["modules"] });

      return res;
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error ||
          error?.response?.data?.message ||
          error?.message ||
          "Failed to update module",
      );
      throw error;
    }
  };

  return { updateModuleHandler, isUpdating: mutation.isPending };
};

export default useUpdateModuleMutation;
