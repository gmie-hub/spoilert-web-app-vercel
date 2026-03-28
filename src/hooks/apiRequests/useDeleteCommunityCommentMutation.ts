"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import type { ApiErrorResponse } from "@spt/types/error";
import api from "@spt/utils/apiClient";

import type { AxiosError } from "axios";

interface DeleteResponse {
  message: string;
  data?: any;
}

export const useDeleteCommunityCommentMutation = () => {
  const queryClient = useQueryClient();

  const deleteComment = async (commentId: string | number): Promise<DeleteResponse> => {
    return (await api.delete(`/communities/posts/comment/${commentId}`)).data;
  };

  const mutation = useMutation<DeleteResponse, AxiosError<ApiErrorResponse>, string | number>({
    mutationKey: ["delete-community-comment"],
    mutationFn: deleteComment,
  });

  const deleteCommentHandler = async (commentId: string | number) => {
    try {
      const res = await mutation.mutateAsync(commentId);
      try {
        queryClient.invalidateQueries({ queryKey: ["community-comments"] });
      } catch {}
      toast.success(res?.message || "Comment deleted");
      return res;
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error || error?.response?.data?.message || error?.message || "Failed to delete comment",
      );
      throw error;
    }
  };

  return { deleteCommentHandler, isLoading: mutation.isPending };
};

export default useDeleteCommunityCommentMutation;
