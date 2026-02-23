import { useQuery } from "@tanstack/react-query";

import type { ApiErrorResponse } from "@spt/types/error";
// import type { CategoryResponse } from "@spt/types/spoils";
import api from "@spt/utils/apiClient";
import { CategoriesResponse } from "@spt/utils/spoils";

import type { AxiosError } from "axios";


export const useGetAllCategoriesQuery = ( page?:number) => {
  const fetchCategories = async (): Promise<CategoriesResponse> => {
    return (await api.get(`/categories?per_page=${20}&page=${page}`))?.data;
  };

  const { data, isLoading,isError, error } = useQuery<
  CategoriesResponse,
  AxiosError<ApiErrorResponse>
>({
    queryKey: ["categories",page],
    queryFn: fetchCategories
  })

  
  const errorMessage =
    error?.response?.data?.message ||
    error?.message ||
    "Failed to fetch categories";


  return {
    data: data?.data,
    isLoading,
    categoryErrorMessage: errorMessage,
    isError,
  }
};
