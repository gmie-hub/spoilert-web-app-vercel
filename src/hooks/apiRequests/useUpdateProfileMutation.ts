"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { useAuthStore } from "@spt/store/authStore";
import type { ApiErrorResponse } from "@spt/types/error";
import api from "@spt/utils/apiClient";

import type { AxiosError } from "axios";

interface UpdateProfilePayload {
  first_name?: string;
  last_name?: string;
  username?: string;
  phone_number?: string;
  country_code?: string;
  bio?: string;
  expertise?: string[];
}

interface UpdateProfileResponse {
  message?: string;
  data?: {
    user: any;
  };
}

export const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient();
  const setAuth = useAuthStore((state) => state.setAuth);
  const token = useAuthStore((state) => state.token);

  const updateProfile = async (payload: UpdateProfilePayload): Promise<UpdateProfileResponse> => {
    const user = useAuthStore.getState().user;
    if (!user?.id) throw new Error("User ID not found");
    return (
      await api.post(`/users/${user.id}`, { ...payload, _method: "patch" })
    ).data;
  };

  const mutation = useMutation<UpdateProfileResponse, AxiosError<ApiErrorResponse>, UpdateProfilePayload>({
    mutationKey: ["update-profile"],
    mutationFn: updateProfile,
  });

  const updateProfileHandler = async (payload: UpdateProfilePayload) => {
    try {
      const res = await mutation.mutateAsync(payload);
      
      // Update the auth store with new user data
      if (res?.data?.user && token) {
        setAuth({ user: res.data.user, token });
      }
      
      // Invalidate related queries
      try {
        queryClient.invalidateQueries({ queryKey: ["user-profile"] });
        queryClient.invalidateQueries({ queryKey: ["user-verification-details"] });
      } catch {
        // Silently ignore query invalidation errors
      }
      
      toast.success(res?.message || "Profile updated successfully");
      return res;
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        error?.message ||
        "Failed to update profile"
      );
      throw error;
    }
  };

  return { updateProfileHandler, isLoading: mutation.isPending };
};

export default useUpdateProfileMutation;
