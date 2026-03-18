"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import type { ApiErrorResponse } from "@spt/types/error";
import api from "@spt/utils/apiClient";

import type { AxiosError } from "axios";

interface CompleteLessonPayload {
  lesson_id: number | string;
}

interface CompleteLessonResponse {
  message: string;
  data?: any;
}

const useCompleteLessonMutation = () => {
  const queryClient = useQueryClient();

  const completeLesson = async (
    payload: CompleteLessonPayload,
  ): Promise<CompleteLessonResponse> => {
    return (await api.post("/lessons/complete", payload)).data;
  };

  const mutation = useMutation<
    CompleteLessonResponse,
    AxiosError<ApiErrorResponse>,
    CompleteLessonPayload
  >({
    mutationKey: ["complete-lesson"],
    mutationFn: completeLesson,
  });

  const completeLessonHandler = async (lessonId: number | string) => {
    try {
      const response = await mutation.mutateAsync({ lesson_id: lessonId });
      toast.success(response?.message || "Lesson completed successfully");
      queryClient.invalidateQueries({ queryKey: ["spoil-details"] });

      return response;
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error ||
          error?.response?.data?.message ||
          error?.message ||
          "Failed to complete lesson",
      );
      return null;
    }
  };

  return {
    completeLessonHandler,
    isCompletingLesson: mutation.isPending,
  };
};

export default useCompleteLessonMutation;
