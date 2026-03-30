"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import type { ApiErrorResponse } from "@spt/types/error";
import api from "@spt/utils/apiClient";

import type { AxiosError } from "axios";

interface JoinCommunityPayload {
  community_id: number | string;
}

interface JoinCommunityResponse {
  message?: string;
  data?: any;
  [key: string]: any;
}

const useJoinCommunityMutation = () => {
  const joinCommunity = async (
    payload: JoinCommunityPayload,
  ): Promise<JoinCommunityResponse> => {
    return (await api.post("/communities/join", payload)).data;
  };

  const queryClient = useQueryClient();

  const mutation = useMutation<
    JoinCommunityResponse,
    AxiosError<ApiErrorResponse>,
    JoinCommunityPayload
  >({
    mutationKey: ["join-community"],
    mutationFn: joinCommunity,
  });

  const joinCommunityHandler = async (
    community_id: number | string,
  ) => {
    try {
      const response = await mutation.mutateAsync({ community_id });

      try {
        await queryClient.invalidateQueries({ queryKey: ["communities"] });
      } catch (err) {
        // log and continue
        // eslint-disable-next-line no-console
        console.warn("Failed to invalidate communities query", err);
      }

      toast.success(response?.message || "Joined community successfully");

      return response;
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error ||
          error?.response?.data?.message ||
          error?.message ||
          "Failed to join community",
      );

      return null;
    }
  };

  return {
    joinCommunityHandler,
    isLoading: mutation.isPending,
  };
};

export default useJoinCommunityMutation;
