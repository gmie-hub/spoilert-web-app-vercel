import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { ApiErrorResponse } from "@spt/types/error";
import api from "@spt/utils/apiClient";
import { SpoilResponse } from "@spt/utils/spoils";

interface GetSpoilsByCategoryParams {
  category_id: number | null;
  search?: string;
}

export const useGetSpoilsByCategoryQuery = (
  params?: GetSpoilsByCategoryParams,
  enabled: boolean = false,
) => {
  const fetchSpoilsByCategory = async (): Promise<SpoilResponse> => {
    return (
      await api.get("spoils", {
        params: {
          category_id: params?.category_id,
          ...(params?.search ? { search: params.search } : {}),
        },
      })
    )?.data;
  };

  const { data, isLoading, error, isError } = useQuery<
    SpoilResponse,
    AxiosError<ApiErrorResponse>
  >({
    queryKey: ["spoils-by-category", params?.category_id, params?.search],
    queryFn: fetchSpoilsByCategory,
    enabled: enabled && params?.category_id !== null,
  });

  return {
    data,
    isLoading,
    error,
    isError,
  };
};
