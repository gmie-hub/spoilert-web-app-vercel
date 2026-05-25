import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import api from "@spt/utils/apiClient";

interface ChangePasswordPayload {
  current_password: string;
  password: string;
}

export function useChangePasswordMutation() {
  return useMutation({
    mutationFn: async (payload: ChangePasswordPayload) => {
      try {
        const { data } = await api.patch("/users/password", payload);
        toast.success(data?.message || "Password changed successfully");
        return data;
      } catch (error: any) {
        toast.error(
          error?.response?.data?.error ||
            error?.response?.data?.message ||
            error?.message ||
            "Failed to change password"
        );
        throw error;
      }
    },
  });
}
