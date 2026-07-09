"use client";

import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import type { ApiErrorResponse } from "@spt/types/error";
import api from "@spt/utils/apiClient";

import type { AxiosError } from "axios";
import type { FormikValues } from "formik";

interface UpdateSpoilResponse {
  message: string;
  data: any;
}

export const useUpdateSpoilMutation = () => {
  const updateSpoil = async ({ id, payload }: { id: number | string; payload: FormData }):
    Promise<UpdateSpoilResponse> => {
    // backend expects a POST with _method=patch for legacy compatibility
    return (
      await api.post(`/spoils/${id}`, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      })
    ).data;
  };

  const mutation = useMutation<
    UpdateSpoilResponse,
    AxiosError<ApiErrorResponse>,
    { id: number | string; payload: FormData }
  >({
    mutationKey: ["update-spoil"],
    mutationFn: updateSpoil,
  });

  const updateSpoilHandler = async (
    id: number | string,
    values: FormikValues,
    { setSubmitting }: any,
  ) => {
    try {
      const formData = new FormData();

      // include method override for patch
      formData.append("_method", "patch");

      if (values.title) formData.append("title", values.title);
      if (values.pricing) formData.append("pricing", values.pricing);
      if (values.category) formData.append("category_id", String(values.category));
      if (values.description) formData.append("description", values.description);
      if (values.expiryDate) formData.append("expires_at", values.expiryDate);
      if (values.learningOutcome) formData.append("what_to_learn", values.learningOutcome);
      if (values.amount) formData.append("amount", String(values.amount));
      if (values.institution) formData.append("institution", values.institution);
      if (values.courseCode) formData.append("course_code", values.courseCode);
      if (values.moduleCount) formData.append("modules_no", String(values.moduleCount));
      if (values.lessonCount) formData.append("lessons_no", String(values.lessonCount));
 
      if (values.type) formData.append("type", String(values.type));
      if (values.scheduledDate) {
        formData.append(
          "premiere_at",
          values.scheduledTime
            ? `${values.scheduledDate}T${values.scheduledTime}`
            : values.scheduledDate,
        );
      }
      if (values.is_draft != null) {
        formData.append(
          "is_draft",
          String(values.is_draft === true ? 1 : values.is_draft === false ? 0 : values.is_draft),
        );
      }
      if (values.is_active != null) {
        formData.append(
          "is_active",
          String(
            values.is_active === true ? 1 : values.is_active === false ? 0 : values.is_active,
          ),
        );
      }
      if (values.status != null) {
        formData.append(
          "status",
          String(values.status === true ? 1 : values.status === false ? 0 : values.status),
        );
      }

      // 1 when a certificate template is attached (added), 0 when removed.
      if (values.has_certificate != null) {
        formData.append(
          "has_certificate",
          String(
            values.has_certificate === true
              ? 1
              : values.has_certificate === false
                ? 0
                : values.has_certificate,
          ),
        );
      }

      if (values.type === "simple") {
        if (values.lessonType) formData.append("lesson_type", values.lessonType);
        if (values.lessonContent) formData.append("lesson_content", values.lessonContent);
      }

      const file = values.coverImage ?? values.image ?? null;
      if (file) {
        if (file instanceof File) formData.append("image", file);
        else if (Array.isArray(file) && file[0] instanceof File) formData.append("image", file[0]);
        else if ((file as any).file instanceof File) formData.append("image", (file as any).file);
      }

      const lessonFile = values.lessonFile ?? null;
      if (lessonFile instanceof File) {
        formData.append("lesson_file", lessonFile);
      }

      const res = await mutation.mutateAsync({ id, payload: formData });

      toast.success("Spoil updated successfully");
      return res;
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error || error?.response?.data?.message || error?.message || "Failed to update spoil",
      );
      throw error;
    } finally {
      setSubmitting?.(false);
    }
  };

  return {
    updateSpoilHandler,
    isLoading: mutation.isPending,
  };
};

export default useUpdateSpoilMutation;
