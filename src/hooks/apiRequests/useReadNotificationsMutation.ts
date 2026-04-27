"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import type { ApiErrorResponse } from "@spt/types/error";
import api from "@spt/utils/apiClient";

import type { AxiosError } from "axios";

type ReadNotificationsPayload =
  | { ids: number[] }
  | { mark_all: boolean };

interface ReadNotificationsResponse {
  message: string;
  status: boolean;
}

export const useReadNotificationsMutation = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    ReadNotificationsResponse,
    AxiosError<ApiErrorResponse>,
    ReadNotificationsPayload
  >({
    mutationKey: ["read-notifications"],
    mutationFn: async (payload) =>
      (await api.post("/notifications/users/read", payload)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to mark notifications as read",
      );
    },
  });

  const readNotificationsHandler = async (ids: number[]) => {
    await mutation.mutateAsync({ ids });
  };

  const markAllAsRead = async () => {
    await mutation.mutateAsync({ mark_all: true });
  };

  return {
    readNotificationsHandler,
    markAllAsRead,
    isLoading: mutation.isPending,
  };
};

export default useReadNotificationsMutation;
