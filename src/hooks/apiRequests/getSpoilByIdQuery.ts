"use client";

import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { useAuthStore } from "@spt/store/authStore";
import type { ApiErrorResponse } from "@spt/types/error";
import api from "@spt/utils/apiClient";

const fetchSpoilById = async (id: number | string) => {
	const res = await api.get(`/spoils/${id}`);
	return res.data;
};

export const useGetSpoilByIdQuery = (spoilId?: number | string | null) => {
	const storedSpoilId = useAuthStore.getState().createdSpoilId;
	const resolvedSpoilId = spoilId ?? storedSpoilId;

	const { data, isLoading, isError, error } = useQuery({
		queryKey: ["spoil", resolvedSpoilId],
		queryFn: () => fetchSpoilById(resolvedSpoilId as number | string),
		enabled: !!resolvedSpoilId,
	}) as {
		data?: any;
		isLoading: boolean;
		isError: boolean;
		error?: AxiosError<ApiErrorResponse> | null;
	};

	const errorMessage =
		(error as AxiosError<ApiErrorResponse>)?.response?.data?.message ||
		(error as AxiosError)?.message ||
		"Failed to fetch spoil";

	return {
		data: data?.data ?? null,
		isLoading,
		isError,
		errorMessage,
	};
};

export default useGetSpoilByIdQuery;

