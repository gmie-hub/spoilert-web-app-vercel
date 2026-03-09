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
    createModuleHandler?: (payload: { title: string; description: string; spoil_id: number }) => Promise<any>,
    createLessonHandler?: (moduleId: number | string, lessons: { title: string; type: string; content?: string; file?: File | null; description?: string }[]) => Promise<any>,
    callbacks?: {
      onSpoilCreated?: (spoilId: number | string) => void;
      // originalModule is the local/module object from the outline (client id)
      onModuleCreated?: (moduleId: number | string, moduleData?: any, originalModule?: any) => void;
      onLessonsCreated?: (moduleId: number | string, lessonRes?: any) => void;
    },
  ) => {
    try {
      const formData = new FormData();

      // Determine source of basics: either passed-in basics object (simple spoil flow)
      // or the persisted draft in the createSpoilStore (advanced flow).
      const maybeBasics = _;
      const isPassedBasics = maybeBasics && !(maybeBasics instanceof FormData) && typeof maybeBasics === "object" && (maybeBasics.title || maybeBasics.lessonType || maybeBasics.lessonContent || maybeBasics.lessonFile);

      const { basics: storeBasics, outline: storeOutline } = useCreateSpoilStore.getState();
      const basics = isPassedBasics ? maybeBasics : storeBasics;
      const outline = isPassedBasics ? storeOutline : storeOutline;

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

      // If a scheduled premiere was set, include it as `premiere_at` in ISO format
      if (basics.scheduledDate) {
		formData.append("premiere_at", basics.scheduledDate);
	  }
	  

    // If draft flag is set in basics, append it for the API
      if (basics.is_draft) {
        try {
          formData.append("is_draft", String(basics.is_draft === true ? 1 : basics.is_draft));
        } catch {
            // Failed to fetch cover image URL
          }
	}

      // If this is a simple-spoil, append simple-specific fields (whether basics came from args or store)
      if (basics && basics.type === "simple") {
        try {
          formData.append("type", "simple");

          if (basics.lessonType) formData.append("lesson_type", basics.lessonType);
          if (basics.lessonContent) formData.append("lesson_content", basics.lessonContent);

          const lessonFileRaw = (basics as any).lessonFile ?? null;
          if (lessonFileRaw instanceof File) {
            formData.append("lesson_file", lessonFileRaw);
          } else if (lessonFileRaw && typeof lessonFileRaw === "object" && (lessonFileRaw as any).dataUrl) {
            // persisted file object with dataUrl -> convert to File
            try {
              const { dataUrl, name, type } = lessonFileRaw as any;
              const blob = await (await fetch(dataUrl)).blob();
              const filename = name ?? `lesson.${type?.split("/")[1] ?? "bin"}`;
              const fileFromDataUrl = new File([blob], filename, { type: type ?? blob.type });
              formData.append("lesson_file", fileFromDataUrl);
            } catch {
              // Failed to convert persisted lesson file to File
            }
          } else if (lessonFileRaw && typeof lessonFileRaw === "string") {
            // URL string -> try fetch
            try {
              const blob = await (await fetch(lessonFileRaw)).blob();
              const fileFromUrl = new File([blob], "lesson.bin", { type: blob.type });
              formData.append("lesson_file", fileFromUrl);
            } catch {
              // Failed to fetch lesson file URL
            }
          }
        } catch {
            // Failed to fetch cover image URL
          }
      }

	  const storedCover = basics.coverImage ?? basics.image ?? null;
      if (storedCover) {
        // if it's already a File (selected this session)
        if (storedCover instanceof File) {
          formData.append("image", storedCover);
        } else if (Array.isArray(storedCover) && storedCover[0] instanceof File) {
          formData.append("image", storedCover[0]);
        } else if ((storedCover as any).file instanceof File) {
          formData.append("image", (storedCover as any).file);
        } else if (typeof storedCover === "object" && (storedCover as any).dataUrl) {
          // persisted data URL: convert to File
          const { dataUrl, name, type } = storedCover as any;
          try {
            const blob = await (await fetch(dataUrl)).blob();
            const filename = name ?? `cover.${type?.split("/")[1] ?? "jpg"}`;
            const fileFromDataUrl = new File([blob], filename, { type: type ?? blob.type });
            formData.append("image", fileFromDataUrl);
          } catch {
            // Failed to convert persisted cover image to File
          }
        } else if (typeof storedCover === "string") {
          // if it's a URL string (maybe remote), try to fetch and append
          try {
            const blob = await (await fetch(storedCover)).blob();
            const fileFromUrl = new File([blob], "cover.jpg", { type: blob.type });
            formData.append("image", fileFromUrl);
          } catch {
            // Failed to fetch cover image URL
          }
        }
      }

      const res = await mutation.mutateAsync(formData);

      const createdId =
        res?.data?.id ?? res?.data?.spoil_id ?? res?.data?.data?.id ?? null;
      if (createdId) {
        useAuthStore.getState().setCreatedSpoilId?.(Number(createdId));
        // notify caller about spoil creation
        try {
          callbacks?.onSpoilCreated?.(createdId);
        } catch {
          // ignore callback errors
        }

        // Call module creation endpoint for each module in outline
        if (typeof createModuleHandler === "function") {
          for (const module of outline.modules) {
              try {
                const moduleRes = await createModuleHandler({
                  title: module.title,
                  description: module.description,
                  spoil_id: createdId,
                });

                // extract created module id from response
                const moduleId = moduleRes?.data?.id ?? moduleRes?.data?.module_id ?? moduleRes?.data?.data?.id ?? null;

                // notify caller about module creation (include original module object)
                try {
                  if (moduleId) callbacks?.onModuleCreated?.(moduleId, moduleRes, module);
                } catch {
                  // ignore callback errors
                }

                // create lessons under the created module if handler provided
                if (moduleId && Array.isArray(module.lessons) && module.lessons.length > 0) {
                  if (typeof createLessonHandler === "function") {
                    try {
                      const lessonRes = await createLessonHandler(moduleId, module.lessons);
                      try {
                        callbacks?.onLessonsCreated?.(moduleId, lessonRes);
                      } catch {
                        // ignore callback errors
                      }
                    } catch {
                      // Error creating lessons for module
                    }
                  } else {
                    // createLessonHandler not provided; skipping lesson creation for module
                  }
                }
              } catch {
                // Error creating module, continue with next module
              }
          }
        } else {
          // createModuleHandler not provided; skipping module creation
        }
      }

      toast.success("Spoil created successfully 🎉");
      return res;
    } catch (error: any) {
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
