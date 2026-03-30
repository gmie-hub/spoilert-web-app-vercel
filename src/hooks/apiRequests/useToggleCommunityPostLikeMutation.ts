"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { ApiErrorResponse } from "@spt/types/error";
import api from "@spt/utils/apiClient";

import type { AxiosError } from "axios";

export const useToggleCommunityPostLikeMutation = () => {
  const queryClient = useQueryClient();

  const toggleLike = async (postId: string | number): Promise<any> => {
    return (await api.post(`/communities/posts/likes/${postId}`)).data;
  };

  const mutation = useMutation<any, AxiosError<ApiErrorResponse>, string | number>({
    mutationKey: ["toggle-community-post-like"],
    mutationFn: toggleLike,
  });

  const toggleLikeHandler = async (postId: string | number) => {
    try {
      const res = await mutation.mutateAsync(postId);
      try {
        queryClient.invalidateQueries({ queryKey: ["community-posts"] });
        queryClient.invalidateQueries({ queryKey: ["communities"] });
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn("Failed to invalidate community queries", err);
      }
      return res;
    } catch (error) {
      throw error;
    }
  };

  return { toggleLikeHandler, isLoading: mutation.isPending };
};

export default useToggleCommunityPostLikeMutation;
