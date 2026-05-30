"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { useAuthStore } from "@spt/store/authStore";
import type { ApiErrorResponse } from "@spt/types/error";
import api from "@spt/utils/apiClient";

import type { AxiosError } from "axios";

interface AddBookmarkPayload {
  spoil_id: number;
}

interface AddBookmarkResponse {
  status?: boolean;
  message?: string;
  data?: unknown;
}

const useAddBookmarkMutation = () => {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  const mutation = useMutation<
    AddBookmarkResponse,
    AxiosError<ApiErrorResponse>,
    AddBookmarkPayload
  >({
    mutationKey: ["add-bookmark"],
    mutationFn: async (payload) =>
      (await api.post("/bookmarks", payload)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["all-spoils"] });
      queryClient.invalidateQueries({ queryKey: ["institution-spoils"] });
      queryClient.invalidateQueries({ queryKey: ["spoils-by-category"] });
      queryClient.invalidateQueries({ queryKey: ["spoil-details"] });
    },
  });

  const addBookmark = async (spoil_id: number) => {
    try {
      const response = await mutation.mutateAsync({ spoil_id });
      toast.success(response?.message || "Bookmarked successfully");
      return response;
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to bookmark spoylz ",
      );
      return null;
    }
  };

  return {
    addBookmark,
    isLoading: mutation.isPending,
  };
};

export default useAddBookmarkMutation;
