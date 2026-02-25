"use client";

import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { useAuthStore } from "@spt/store/authStore";
import useCreateSpoilStore from "@spt/store/createSpoilStore";
import type { ApiErrorResponse } from "@spt/types/error";
import api from "@spt/utils/apiClient";


import type { AxiosError } from "axios";

interface CreateSpoilResponse {
  message: string;
  data: any;
}

export const useCreateSpoilMutation = () => {
  const createSpoil = async (
    payload: FormData,
  ): Promise<CreateSpoilResponse> => {
    return (
      await api.post("/spoils", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      })
    ).data;
  };

  const mutation = useMutation<
    CreateSpoilResponse,
    AxiosError<ApiErrorResponse>,
    FormData
  >({
    mutationKey: ["create-spoil"],
    mutationFn: createSpoil,
  });

  const createSpoilHandler = async (
    _: any,
    { setSubmitting }: any,
    createModuleHandler?: (payload: { title: string; description: string; spoil_id: number }) => Promise<any>
  ) => {
    try {
      const formData = new FormData();

      // Retrieve data directly from useCreateSpoilStore
      const { basics, outline } = useCreateSpoilStore.getState();

      if (basics.title) formData.append("title", basics.title);
      if (basics.pricing) formData.append("pricing", basics.pricing);
      if (basics.category)
        formData.append("category_id", String(basics.category));
      if (basics.description)
        formData.append("description", basics.description);
      if (basics.expiryDate) formData.append("expires_at", basics.expiryDate);
      if (basics.learningOutcome)
        formData.append("what_to_learn", basics.learningOutcome);
      if (basics.amount) formData.append("amount", String(basics.amount));
      if (basics.institution)
        formData.append("institution", basics.institution);
      if (basics.courseCode) formData.append("course_code", basics.courseCode);
      if (basics.moduleCount)
        formData.append("modules_no", String(basics.moduleCount));
      if (basics.lessonCount)
        formData.append("lessons_no", String(basics.lessonCount));

      const file = basics.coverImage ?? basics.image ?? null;
      if (file) {
        if (file instanceof File) formData.append("image", file);
        else if (Array.isArray(file) && file[0] instanceof File)
          formData.append("image", file[0]);
        else if ((file as any).file instanceof File)
          formData.append("image", (file as any).file);
      }

      const res = await mutation.mutateAsync(formData);

      const createdId =
        res?.data?.id ?? res?.data?.spoil_id ?? res?.data?.data?.id ?? null;
      if (createdId) {
        useAuthStore.getState().setCreatedSpoilId?.(Number(createdId));

        // Call module creation endpoint for each module in outline
        console.log("Created Spoil ID:", createdId);
        console.log("Modules to create:", outline.modules);

        if (typeof createModuleHandler === "function") {
          for (const module of outline.modules) {
            try {
              console.log("Creating module:", module);
              await createModuleHandler({
                title: module.title,
                description: module.description,
                spoil_id: createdId,
              });
            } catch (modError) {
              console.error("Error creating module", module, modError);
              // continue with next module
            }
          }
        } else {
          console.warn("createModuleHandler not provided; skipping module creation");
        }
      }

      toast.success("Spoil created successfully 🎉");
      return res;
    } catch (error: any) {
      console.error("Error creating spoil or modules:", error);
      toast.error(
        error?.response?.data?.error ||
          error?.response?.data?.message ||
          error?.message ||
          "Failed to create spoil",
      );
      throw error;
    } finally {
      setSubmitting?.(false);
    }
  };

  return {
    createSpoilHandler,
    isLoading: mutation.isPending,
  };
};

export default useCreateSpoilMutation;
