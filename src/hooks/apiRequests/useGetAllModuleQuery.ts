import { useQuery } from "@tanstack/react-query";

import { ModulesResponse } from "@spt/screens/main/spoils/createSpoils/types";
import { useAuthStore } from "@spt/store/authStore";
import type { ApiErrorResponse } from "@spt/types/error";
import api from "@spt/utils/apiClient";

import type { AxiosError } from "axios";

export const useGetAllModulesQuery = (page?: number) => {
  const createdSpoilId = useAuthStore.getState().createdSpoilId;

  const fetchModules = async (): Promise<ModulesResponse> => {
    return (await api.get(`/modules?spoil_id=${createdSpoilId}`)).data;
  };

  const { data, isLoading, isError, error } = useQuery<
    ModulesResponse,
    AxiosError<ApiErrorResponse>
  >({
    queryKey: ["modules", page],
    queryFn: fetchModules,
  });

  const errorMessage =
    error?.response?.data?.message ||
    error?.message ||
    "Failed to fetch modules";

  return {
    data: data?.data?.data, // 👈 this returns only the modules array
    pagination: data?.data, // 👈 full pagination object if needed
    isLoading,
    isError,
    moduleErrorMessage: errorMessage,
  };
};
