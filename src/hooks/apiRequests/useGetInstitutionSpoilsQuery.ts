import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { ApiErrorResponse } from "@spt/types/error";
import api from "@spt/utils/apiClient";
import { SpoilResponse } from "@spt/utils/spoils";

export const useGetInstitutionSpoilsQuery = (params?: {
  trending?: boolean;
  skill?: boolean;
  development?: boolean;
  is_institution?: boolean;
}) => {
  const fetchInstitutionSpoils = async (): Promise<SpoilResponse> => {
    const query = new URLSearchParams({ per_page: "30" });
    if (params?.trending) query.set("trending", "true");
    if (params?.skill) query.set("skill", "true");
    if (params?.development) query.set("development", "true");
    if (params?.is_institution) query.set("is_institution", "1");
    return (await api.get(`spoils?${query.toString()}`))?.data;
  };

  const { data, isLoading, error, isError } = useQuery<
    SpoilResponse,
    AxiosError<ApiErrorResponse>
  >({
    queryKey: ["institution-spoils", params],
    queryFn: fetchInstitutionSpoils,
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
