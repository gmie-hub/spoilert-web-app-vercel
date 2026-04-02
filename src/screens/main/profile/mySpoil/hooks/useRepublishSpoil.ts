"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import type { ApiErrorResponse } from "@spt/types/error";
import api from "@spt/utils/apiClient";

import type { AxiosError } from "axios";

interface RepublishSpoilResponse {
  message: string;
  data: any;
}

export const useRepublishSpoil = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    RepublishSpoilResponse,
    AxiosError<ApiErrorResponse>,
    number | string
  >({
    mutationKey: ["republish-spoil"],
    mutationFn: async (id) => {
      const formData = new FormData();

      formData.append("_method", "patch");
      formData.append("is_active", "1");
      formData.append("is_draft", "0");
      formData.append("status", "0");

      return (
        await api.post(`/spoils/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
      ).data;
    },
    onSuccess: async (_, id) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["all-spoils"] }),
        queryClient.invalidateQueries({ queryKey: ["spoil-details", String(id)] }),
        queryClient.invalidateQueries({ queryKey: ["spoil-details", Number(id)] }),
      ]);
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.error ||
          error?.response?.data?.message ||
          error?.message ||
          "Failed to republish spoil",
      );
    },
  });

  return {
    republishSpoil: mutation.mutateAsync,
    isRepublishing: mutation.isPending,
  };
};

export default useRepublishSpoil;
