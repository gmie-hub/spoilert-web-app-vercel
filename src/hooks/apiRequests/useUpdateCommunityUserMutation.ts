"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import api from "@spt/utils/apiClient";

import type { AxiosError } from "axios";

type Payload = { community_id: string | number; user_id: string | number; action: string };

const updateCommunityUser = async (payload: Payload) => {
  // POST to /communities/user with query params: action
  const { community_id, user_id, action } = payload;
  const url = `/communities/user?community_id=${encodeURIComponent(String(community_id))}&user_id=${encodeURIComponent(String(user_id))}&action=${encodeURIComponent(String(action))}`;
  return (await api.post(url)).data;
};

export const useUpdateCommunityUserMutation = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<any, AxiosError, Payload>({
    mutationKey: ["update-community-user"],
    mutationFn: updateCommunityUser,
    onSuccess: () => {
      // invalidate related queries (use filter-object form to satisfy TS types)
      queryClient.invalidateQueries({ queryKey: ["user-community-detail"] });
      queryClient.invalidateQueries({ queryKey: ["user-communities"] });
      queryClient.invalidateQueries({ queryKey: ["communities-created-by-user"] });
    },
  });

  const errorMessage = (mutation.error as any)?.response?.data?.message || (mutation.error as any)?.message || "Failed to update community user";

  return {
    updateAsync: mutation.mutateAsync,
    isUpdating: (mutation as any).isPending || (mutation as any).isLoading || false,
    isError: mutation.isError,
    errorMessage,
  };
};

export default useUpdateCommunityUserMutation;
