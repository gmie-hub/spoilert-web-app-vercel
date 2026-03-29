"use client";

import { useMutation } from "@tanstack/react-query";
import api from "@spt/utils/apiClient";
import type { AxiosError } from "axios";

const restrictUser = async (payload: { community_id: string | number; user_id: string | number }) => {
  return (await api.post("/communities/restrict", payload)).data;
};

export const useRestrictCommunityUserMutation = () => {
  const { mutateAsync, isLoading, isError, error } = useMutation<any, AxiosError>(restrictUser);

  const errorMessage = (error as any)?.response?.data?.message || (error as any)?.message || "Failed to restrict user";

  return {
    restrictAsync: mutateAsync,
    isRestricting: isLoading,
    isError,
    errorMessage,
  };
};

export default useRestrictCommunityUserMutation;
