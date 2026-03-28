"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import type { ApiErrorResponse } from "@spt/types/error";
import api from "@spt/utils/apiClient";

import type { AxiosError } from "axios";

interface CreateCommentResponse {
  message: string;
  data: any;
}

export const useCreateCommunityCommentMutation = () => {
  const queryClient = useQueryClient();

  const createComment = async (payload: { post_id: string | number; comment: string }): Promise<CreateCommentResponse> => {
    return (await api.post(`/communities/posts/comment`, payload)).data;
  };

  const mutation = useMutation<CreateCommentResponse, AxiosError<ApiErrorResponse>, { post_id: string | number; comment: string }>(
    {
      mutationKey: ["create-community-comment"],
      mutationFn: createComment,
    },
  );

  const createCommentHandler = async (payload: { post_id: string | number; comment: string }) => {
    try {
      const res = await mutation.mutateAsync(payload);
      try {
        queryClient.invalidateQueries({ queryKey: ["community-comments"] });
        queryClient.invalidateQueries({ queryKey: ["community-posts"] });
      } catch {}

      toast.success(res?.message || "Comment created");
      return res;
    } catch (error: any) {
      toast.error(error?.response?.data?.error || error?.response?.data?.message || error?.message || "Failed to create comment");
      throw error;
    }
  };

  return { createCommentHandler, isLoading: mutation.isPending };
};

export default useCreateCommunityCommentMutation;
