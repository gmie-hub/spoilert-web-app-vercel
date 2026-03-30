"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import api from "@spt/utils/apiClient";

import type { AxiosError } from "axios";

type Payload = { community_id: string | number; user_id: string | number };

const restrictUser = async (payload: Payload) => {
  return (await api.post("/communities/restrict", payload)).data;
};

export const useRestrictCommunityUserMutation = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<any, AxiosError, Payload>({
    mutationKey: ["restrict-community-user"],
    mutationFn: restrictUser,
    onSuccess: () => {
      try {
        queryClient.invalidateQueries({ queryKey: ["user-community-detail"] });
        queryClient.invalidateQueries({ queryKey: ["user-communities"] });
      } catch  {
        // ignore
      }
    },
  });

  const errorMessage = (mutation.error as any)?.response?.data?.message || (mutation.error as any)?.message || "Failed to restrict user";

  return {
    restrictAsync: mutation.mutateAsync,
    isRestricting: (mutation as any).isPending || (mutation as any).isLoading || false,
    isError: mutation.isError,
    errorMessage,
  };
};

export default useRestrictCommunityUserMutation;
