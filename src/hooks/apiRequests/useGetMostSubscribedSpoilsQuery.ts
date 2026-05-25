import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { ApiErrorResponse } from "@spt/types/error";
import api from "@spt/utils/apiClient";
import { SpoilResponse } from "@spt/utils/spoils";

export const useGetMostSubscribedSpoilsQuery = () => {
  const fetchMostSubscribedSpoils = async (): Promise<SpoilResponse> => {
    return (
      await api.get("spoils", {
        params: { most_subscribed: true },
      })
    )?.data;
  };

  const { data, isLoading, error, isError } = useQuery<
    SpoilResponse,
    AxiosError<ApiErrorResponse>
  >({
    queryKey: ["most-subscribed-spoils"],
    queryFn: fetchMostSubscribedSpoils,
  });

  const errorMessage =
    error?.response?.data?.message ||
    error?.message ||
    "Failed to fetch most subscribed spoils";

  return {
    data,
    isLoading,
    isError,
    errorMessage,
  };
};

export default useGetMostSubscribedSpoilsQuery;
