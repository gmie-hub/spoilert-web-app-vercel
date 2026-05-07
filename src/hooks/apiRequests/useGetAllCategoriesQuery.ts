import { keepPreviousData, useQuery } from "@tanstack/react-query";

import type { ApiErrorResponse } from "@spt/types/error";
import api from "@spt/utils/apiClient";
import { CategoriesResponse } from "@spt/utils/spoils";

import type { AxiosError } from "axios";


export const useGetAllCategoriesQuery = (page?: number, search?: string) => {
  const fetchCategories = async (): Promise<CategoriesResponse> => {
    return (
      await api.get("/categories", {
        params: {
          per_page: 20,
          page,
          ...(search ? { search } : {}),
        },
      })
    )?.data;
  };

  const { data, isLoading, isError, error } = useQuery<
    CategoriesResponse,
    AxiosError<ApiErrorResponse>
  >({
    queryKey: ["categories", page, search],
    queryFn: fetchCategories,
    placeholderData: keepPreviousData,
  });

  const errorMessage =
    error?.response?.data?.message ||
    error?.message ||
    "Failed to fetch categories";

  return {
    data: data?.data,
    isLoading,
    categoryErrorMessage: errorMessage,
    isError,
  };
};
