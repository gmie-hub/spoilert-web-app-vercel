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

  const { data, isLoading, isFetching, isError, error } = useQuery<
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
    // True for every fetch (including a page-2+ or search refetch), unlike
    // `isLoading` which is only true once, on the very first load — callers
    // paginating/searching need this one to know when a fetch is in flight.
    isFetching,
    categoryErrorMessage: errorMessage,
    isError,
  };
};
