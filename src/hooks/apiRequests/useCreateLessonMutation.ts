"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import type { ApiErrorResponse } from "@spt/types/error";
import api from "@spt/utils/apiClient";

import type { AxiosError } from "axios";

interface CreateLessonResponse {
  message: string;
  data: any;
}

export const useCreateLessonMutation = () => {
  const queryClient = useQueryClient();

  const createLesson = async (payload: FormData): Promise<CreateLessonResponse> => {
    return (
      await api.post("/lessons", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      })
    ).data;
  };

  const mutation = useMutation<
    CreateLessonResponse,
    AxiosError<ApiErrorResponse>,
    FormData
  >({
    mutationKey: ["create-lesson"],
    mutationFn: createLesson,
  });

  const createLessonHandler = async (
    moduleId: number | string,
    lessons: { title: string; type: string; content?: string; file?: File | null; description?: string }[],
  ) => {
    try {
      const formData = new FormData();
      formData.append("module_id", String(moduleId));

      lessons.forEach((lesson, index) => {
        formData.append(`lessons[${index}][title]`, lesson.title);
        formData.append(`lessons[${index}][type]`, lesson.type);

        if (lesson.type === "text" && lesson.content) {
          formData.append(`lessons[${index}][content]`, lesson.content);
        }

        if (lesson.type !== "text" && lesson.file instanceof File) {
          formData.append(`lessons[${index}][file]`, lesson.file);
        }

        // description (optional)
        formData.append(`lessons[${index}][description]`, lesson.description ?? "");
      });

      const res = await mutation.mutateAsync(formData);
      toast.success("Lesson created successfully");

      queryClient.invalidateQueries({ queryKey: ["lessons"] });

      return res;
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error ||
          error?.response?.data?.message ||
          error?.message ||
          "Failed to create lesson",
      );
      throw error;
    }
  };

  return { createLessonHandler, isLoading: mutation.isPending };
};

export default useCreateLessonMutation;
