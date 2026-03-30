"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import type { ApiErrorResponse } from "@spt/types/error";
import api from "@spt/utils/apiClient";

import type { AxiosError } from "axios";

interface CreatePostResponse {
  message: string;
  data: any;
}

export const useCreateCommunityPostMutation = () => {
  const queryClient = useQueryClient();

  const createPost = async (payload: FormData): Promise<CreatePostResponse> => {
    return (
      await api.post("/communities/posts", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      })
    ).data;
  };

  const mutation = useMutation<CreatePostResponse, AxiosError<ApiErrorResponse>, FormData>({
    mutationKey: ["create-community-post"],
    mutationFn: createPost,
  });

  const createPostHandler = async (payload: FormData) => {
    try {
      const res = await mutation.mutateAsync(payload);
      // Invalidate community posts so list refreshes
      try {
        queryClient.invalidateQueries({ queryKey: ["community-posts"] });
      } catch (err) {
        // Log and continue — query invalidation failure shouldn't block the flow
        // eslint-disable-next-line no-console
        console.warn("Failed to invalidate community queries", err);
      }

      toast.success(res?.message || "Post created");
      return res;
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error || error?.response?.data?.message || error?.message || "Failed to create post",
      );
      throw error;
    }
  };

  return { createPostHandler, isLoading: mutation.isPending };
};

export default useCreateCommunityPostMutation;
