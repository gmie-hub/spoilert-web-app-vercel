"use client";

import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { useAuthStore } from "@spt/store/authStore";
import type { ApiErrorResponse } from "@spt/types/error";
import api from "@spt/utils/apiClient";

import type { AxiosError } from "axios";
import type { FormikValues } from "formik";

interface CreateSpoilResponse {
	message: string;
	data: any;
}

export const useCreateSpoilMutation = () => {
	const createSpoil = async (payload: FormData): Promise<CreateSpoilResponse> => {
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

	const createSpoilHandler = async (values: FormikValues, { setSubmitting }: any) => {
		try {
			const formData = new FormData();

			if (values.title) formData.append("title", values.title);
			if (values.pricing) formData.append("pricing", values.pricing);
			// backend expects category_id per screenshot
			if (values.category) formData.append("category_id", String(values.category));
			if (values.description) formData.append("description", values.description);
			if (values.expiryDate) formData.append("expires_at", values.expiryDate);
			if (values.learningOutcome) formData.append("what_to_learn", values.learningOutcome);
			if (values.amount) formData.append("amount", String(values.amount));
			if (values.institution) formData.append("institution", values.institution);
			if (values.courseCode) formData.append("course_code", values.courseCode);
            if (values.moduleCount) formData.append("modules_no", String(values.moduleCount));
            if (values.lessonCount) formData.append("lessons_no", String(values.lessonCount));

			// support coverImage or image field
			const file = values.coverImage ?? values.image ?? null;
			if (file) {
				// coverImage may be a File or an array; handle common shapes
				if (file instanceof File) formData.append("image", file);
				else if (Array.isArray(file) && file[0] instanceof File) formData.append("image", file[0]);
				else if ((file as any).file instanceof File) formData.append("image", (file as any).file);
			}

			const res = await mutation.mutateAsync(formData);

			// persist created spoil id in store for downstream usage (modules, etc.)
			const createdId = res?.data?.id ?? res?.data?.spoil_id ?? res?.data?.data?.id ?? null;
			if (createdId) {
				useAuthStore.getState().setCreatedSpoilId?.(Number(createdId));
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

 