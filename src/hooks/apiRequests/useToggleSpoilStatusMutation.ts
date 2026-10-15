"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import type { ApiErrorResponse } from "@spt/types/error";
import api from "@spt/utils/apiClient";

import type { AxiosError } from "axios";

interface ToggleSpoilStatusPayload {
  id: number | string;
  isActive: boolean;
}

// Enables or disables a spoil: a multipart POST carrying `_method=patch` and
// `is_active`, the same request the admin portal sends.
const useToggleSpoilStatusMutation = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    { message?: string },
    AxiosError<ApiErrorResponse>,
    ToggleSpoilStatusPayload
  >({
    mutationKey: ["toggle-spoil-status"],
    mutationFn: async ({ id, isActive }) => {
      const formData = new FormData();
      formData.append("_method", "patch");
      formData.append("is_active", isActive ? "1" : "0");

      return (
        await api.post(`/spoils/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
      ).data;
    },
    onSuccess: (_, { isActive }) => {
      toast.success(isActive ? "Spoylz enabled successfully" : "Spoylz disabled successfully");
      queryClient.invalidateQueries({ queryKey: ["spoil-details"] });
      queryClient.invalidateQueries({ queryKey: ["spoils-page"] });
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.error ||
          error?.response?.data?.message ||
          error?.message ||
          "Failed to update the Spoylz status. Try again.",
      );
    },
  });

  return {
    toggleSpoilStatus: mutation.mutateAsync,
    isToggling: mutation.isPending,
  };
};

export default useToggleSpoilStatusMutation;
