"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { ApiErrorResponse } from "@spt/types/error";
import api from "@spt/utils/apiClient";

import type { AxiosError } from "axios";

export const useToggleCommunityCommentLikeMutation = () => {
  const queryClient = useQueryClient();

  const toggleLike = async (commentId: string | number): Promise<any> => {
    return (await api.post(`/communities/posts/comment/like/${commentId}`)).data;
  };

  const mutation = useMutation<any, AxiosError<ApiErrorResponse>, string | number>({
    mutationKey: ["toggle-community-comment-like"],
    mutationFn: toggleLike,
  });

  const toggleLikeHandler = async (commentId: string | number) => {
    const res = await mutation.mutateAsync(commentId);
    try {
      queryClient.invalidateQueries({ queryKey: ["community-posts"] });
      queryClient.invalidateQueries({ queryKey: ["community-comments"] });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn("Failed to invalidate community queries", err);
    }
    return res;
  };

  return { toggleLikeHandler, isLoading: mutation.isPending };
};

export default useToggleCommunityCommentLikeMutation;
