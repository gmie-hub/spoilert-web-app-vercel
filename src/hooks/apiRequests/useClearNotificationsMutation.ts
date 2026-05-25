"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import type { ApiErrorResponse } from "@spt/types/error";
import api from "@spt/utils/apiClient";

import type { AxiosError } from "axios";

interface ClearNotificationsPayload {
  mark_all: boolean;
}

interface ClearNotificationsResponse {
  message: string;
  status: boolean;
}

export const useClearNotificationsMutation = () => {
  const queryClient = useQueryClient();

  const clearNotifications = async (
    payload: ClearNotificationsPayload,
  ): Promise<ClearNotificationsResponse> => {
    return (await api.post("/notifications/users/clear", payload)).data;
  };

  const mutation = useMutation<
    ClearNotificationsResponse,
    AxiosError<ApiErrorResponse>,
    ClearNotificationsPayload
  >({
    mutationKey: ["clear-notifications"],
    mutationFn: clearNotifications,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("Notifications cleared");
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to clear notifications",
      );
    },
  });

  const clearNotificationsHandler = async () => {
    await mutation.mutateAsync({ mark_all: true });
  };

  return {
    clearNotificationsHandler,
    isLoading: mutation.isPending,
  };
};

export default useClearNotificationsMutation;
