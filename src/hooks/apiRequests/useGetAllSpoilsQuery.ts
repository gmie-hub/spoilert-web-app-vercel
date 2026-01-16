import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { ApiErrorResponse } from "@spt/types/error";
import api from "@spt/utils/apiClient";
import { SpoilResponse } from "@spt/utils/spoils";

export const useGetAllSpoilsQuery = () => {
  const fetchAllSpoils = async (): Promise<SpoilResponse> => {
    return (await api.get(`spoils?per_page=30`))?.data;
  };

  const { data, isLoading, error, isError } = useQuery<
    SpoilResponse,
    AxiosError<ApiErrorResponse>
  >({
    queryKey: ["institution-spoils"],
    queryFn: fetchAllSpoils,
  });

  const errorMessage =
    error?.response?.data?.message ||
    error?.message ||
    "Failed to fetch Communities";

  return {
    data,
    isLoading,
    isError,
    errorMessage,
  };
};
