"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import type { ApiErrorResponse } from "@spt/types/error";
import api from "@spt/utils/apiClient";

import type { AxiosError } from "axios";

interface UpdateLessonPayload {
  lessonId: number | string;
  title: string;
  type: string;
  content?: string;
  file?: File | null;
  description?: string;
}

interface UpdateLessonResponse {
  message: string;
  data: any;
}

export const useUpdateLessonMutation = () => {
  const queryClient = useQueryClient();

  const updateLesson = async ({
    lessonId,
    title,
    type,
    content,
    file,
    description,
  }: UpdateLessonPayload): Promise<UpdateLessonResponse> => {
    const formData = new FormData();
    formData.append("_method", "patch");
    formData.append("name", title);
    formData.append("type", type);

    if (type === "text" && content) {
      formData.append("content", content);
    }

    if (type !== "text" && file instanceof File) {
      formData.append("file", file);
    }

    formData.append("description", description ?? "");

    return (
      await api.post(`/lessons/${lessonId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
    ).data;
  };

  const mutation = useMutation<
    UpdateLessonResponse,
    AxiosError<ApiErrorResponse>,
    UpdateLessonPayload
  >({
    mutationKey: ["update-lesson"],
    mutationFn: updateLesson,
  });

  const updateLessonHandler = async (payload: UpdateLessonPayload) => {
    try {
      const res = await mutation.mutateAsync(payload);
      toast.success("Lesson updated");

      queryClient.invalidateQueries({ queryKey: ["lessons"] });

      return res;
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error ||
          error?.response?.data?.message ||
          error?.message ||
          "Failed to update lesson",
      );
      throw error;
    }
  };

  return { updateLessonHandler, isUpdating: mutation.isPending };
};

export default useUpdateLessonMutation;
