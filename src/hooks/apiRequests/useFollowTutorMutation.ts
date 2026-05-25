"use client";

import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import type { ApiErrorResponse } from "@spt/types/error";
import api from "@spt/utils/apiClient";

import type { AxiosError } from "axios";

interface FollowTutorPayload {
  tutor_id: number;
}

interface FollowTutorResponse {
  message?: string;
  data?: any;
  [key: string]: any;
}

const useFollowTutorMutation = () => {
  const followTutor = async (
    payload: FollowTutorPayload,
  ): Promise<FollowTutorResponse> => {
    return (await api.post("/followers", payload)).data;
  };

  const mutation = useMutation<
    FollowTutorResponse,
    AxiosError<ApiErrorResponse>,
    FollowTutorPayload
  >({
    mutationKey: ["follow-tutor"],
    mutationFn: followTutor,
  });

  const followTutorHandler = async (tutor_id: number) => {
    try {
      const response = await mutation.mutateAsync({ tutor_id });
      toast.success(response?.message || "Tutor followed successfully");
      return response;
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error ||
          error?.response?.data?.message ||
          error?.message ||
          "Failed to follow tutor",
      );
      return null;
    }
  };

  return {
    followTutorHandler,
    isLoading: mutation.isPending,
  };
};

export default useFollowTutorMutation;
