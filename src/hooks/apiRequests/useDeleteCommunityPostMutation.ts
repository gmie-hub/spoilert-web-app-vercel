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

export const useDeleteCommunityPostMutation = () => {
  const queryClient = useQueryClient();

  const deletePost = async (postId: string | number): Promise<DeleteResponse> => {
    return (await api.delete(`/communities/posts/${postId}`)).data;
  };

  const mutation = useMutation<DeleteResponse, AxiosError<ApiErrorResponse>, string | number>({
    mutationKey: ["delete-community-post"],
    mutationFn: deletePost,
  });

  const deletePostHandler = async (postId: string | number) => {
    try {
      const res = await mutation.mutateAsync(postId);
      try {
        queryClient.invalidateQueries({ queryKey: ["community-posts"] });
      }catch (err) {
        // Log and continue — query invalidation failure shouldn't block the flow
        // eslint-disable-next-line no-console
        console.warn("Failed to invalidate community queries", err);
      }
      toast.success(res?.message || "Post deleted");
      return res;
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error || error?.response?.data?.message || error?.message || "Failed to delete post",
      );
      throw error;
    }
  };

  return { deletePostHandler, isLoading: mutation.isPending };
};

export default useDeleteCommunityPostMutation;
