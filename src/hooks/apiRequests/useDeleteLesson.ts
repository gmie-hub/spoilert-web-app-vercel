"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import type { ApiErrorResponse } from "@spt/types/error";
import api from "@spt/utils/apiClient";

import type { AxiosError } from "axios";

interface DeleteResponse {
  message: string;
  data: any;
}

export const useDeleteLesson = () => {
  const queryClient = useQueryClient();

  const deleteLesson = async (id: number | string): Promise<DeleteResponse> => {
    const fd = new FormData();
    fd.append("_method", "patch");

    const res = await api.delete(`/lessons/${id}`, { data: fd });
    return res.data;
  };

  const mutation = useMutation<
    DeleteResponse,
    AxiosError<ApiErrorResponse>,
    number | string
  >({
    mutationKey: ["delete-lesson"],
    mutationFn: deleteLesson,
  });

  const deleteLessonHandler = async (id: number | string) => {
    try {
      const res = await mutation.mutateAsync(id);
      toast.success("Lesson deleted");
      queryClient.invalidateQueries({
        queryKey: ["lessons"],
      });
      return res;
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to delete lesson";
      toast.error(message);
      throw err;
    }
  };

  return {
    deleteLessonHandler,
    isLoading: mutation.isPending,
  };
};

export default useDeleteLesson;
