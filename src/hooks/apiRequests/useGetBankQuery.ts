

import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { ApiErrorResponse } from "@spt/types/error";
import api from "@spt/utils/apiClient";

/* ================================
   Bank Types
================================ */

export interface BankData {
  id: number;
  name: string;
  code: string;
  swift_code: string | null;
  country: string;
  provider: string | null;
  is_active: number;
  created_at: string;
  updated_at: string;
}

export interface BankResponse {
  message: string;
  status: boolean;
  data: {
    data: BankData[];
    total?: number;
    per_page?: number;
    current_page?: number;
    last_page?: number;
  };
}

/* ================================
   Hook
================================ */

export const useGetBanksQuery = (search?: string, page: number = 1, perPage: number = 20) => {
  const fetchBanks = async (): Promise<BankResponse> => {
    let endpoint = `banks/NG?page=${page}&per_page=${perPage}`;
    if (search && search.trim() !== "") {
      endpoint += `&search=${search}`;
    }
    return (await api.get(endpoint))?.data;
  };

  const { data, isLoading, error, isError } = useQuery<
    BankResponse,
    AxiosError<ApiErrorResponse>
  >({
    queryKey: ["banks", search, page, perPage],
    queryFn: fetchBanks,
  });

  const errorMessage =
    error?.response?.data?.message ||
    error?.message ||
    "Failed to fetch Banks";

  return {
    data,
    isLoading,
    isError,
    errorMessage,
  };
};
