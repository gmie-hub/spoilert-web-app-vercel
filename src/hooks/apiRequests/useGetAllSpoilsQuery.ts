import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { ApiErrorResponse } from "@spt/types/error";
import api from "@spt/utils/apiClient";
import { SpoilResponse } from "@spt/utils/spoils";

interface GetAllSpoilsQueryParams {
  visibility?: string | null;
  is_draft?: boolean | null;
  upcoming?: boolean | null;
  tutor_id?: number | null;
  status?: number | null;
}

export const useGetAllSpoilsQuery = (
  params?: GetAllSpoilsQueryParams,
  enabled: boolean = true,
) => {
  const fetchAllSpoils = async (): Promise<SpoilResponse> => {
    return (
      await api.get("spoils", {
        params: {
          per_page: 30,
          ...(params?.visibility != null
            ? { visibility: params.visibility }
            : {}),
          ...(params?.is_draft != null ? { is_draft: params.is_draft } : {}),
          ...(params?.upcoming != null ? { upcoming: params.upcoming } : {}),
          ...(params?.tutor_id != null ? { tutor_id: params.tutor_id } : {}),
          ...(params?.status != null ? { status: params.status } : {}),
        },
      })
    )?.data;
  };

  const { data, isLoading, error, isError } = useQuery<
    SpoilResponse,
    AxiosError<ApiErrorResponse>
  >({
    queryKey: [
      "all-spoils",
      params?.visibility ?? null,
      params?.is_draft ?? null,
      params?.upcoming ?? null,
      params?.tutor_id ?? null,
      params?.status ?? null,
    ],
    queryFn: fetchAllSpoils,
    enabled,
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
