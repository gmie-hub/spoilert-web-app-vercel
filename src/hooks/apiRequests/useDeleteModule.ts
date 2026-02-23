"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import type { ApiErrorResponse } from "@spt/types/error";
import api from "@spt/utils/apiClient";

import type { AxiosError } from "axios";

interface DeleteResponse {
  message: string;
  data: any;
}

export const useDeleteModule = () => {
  const queryClient = useQueryClient();

  const deleteModule = async (id: number | string): Promise<DeleteResponse> => {
    // Build form data per backend expectation (user requested _method: patch)
    const fd = new FormData();
    fd.append("_method", "patch");

    // axios supports a request body for DELETE via the `data` option
    const res = await api.delete(`/modules/${id}`, { data: fd });
    return res.data;
  };

  const mutation = useMutation<
    DeleteResponse,
    AxiosError<ApiErrorResponse>,
    number | string
  >({
    mutationKey: ["delete-module"],
    mutationFn: deleteModule,
  });

  const deleteModuleHandler = async (id: number | string) => {
    try {
      const res = await mutation.mutateAsync(id);
      toast.success("Module deleted");
      queryClient.invalidateQueries({
        queryKey: ["modules"],
      });
      return res;
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to delete module";
      toast.error(message);
      throw err;
    }
  };

  return {
    deleteModuleHandler,
    isLoading: mutation.isPending,
  };
};

export default useDeleteModule;
