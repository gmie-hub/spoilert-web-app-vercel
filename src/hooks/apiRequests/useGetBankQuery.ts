// import { useQuery } from "@tanstack/react-query";
// import { AxiosError } from "axios";

// import { ApiErrorResponse } from "@spt/types/error";
// import api from "@spt/utils/apiClient";

// /* ================================
//    Bank Types
// ================================ */

// export interface BankData {
//   id: number;
//   name: string;
//   code: string;
//   swift_code: string | null;
//   country: string;
//   provider: string | null;
//   is_active: number;
//   created_at: string;
//   updated_at: string;
// }

// export interface BankResponse {
//   message: string;
//   status: boolean;
//   data: BankData[];
// }

// /* ================================
//    Hook
// ================================ */

// export const useGetBanksQuery = (
//   country: string = "NG",
//   search: string = ""
// ) => {
//   const fetchBanks = async (): Promise<BankResponse> => {
//     return (
//       await api.get(`banks/${country}?search=${search}`)
//     )?.data;
//   };

//   const { data, isLoading, error, isError } = useQuery<
//     BankResponse,
//     AxiosError<ApiErrorResponse>
//   >({
//     queryKey: ["banks", country, search],
//     queryFn: fetchBanks,
//   });

//   const errorMessage =
//     error?.response?.data?.message ||
//     error?.message ||
//     "Failed to fetch Banks";

//   return {
//     data,
//     isLoading,
//     isError,
//     errorMessage,
//   };
// };


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
  data: BankData[];
}

/* ================================
   Hook
================================ */

export const useGetBanksQuery = (search?: string) => {
  const fetchBanks = async (): Promise<BankResponse> => {
    // Base endpoint (hardcoded NG)
    let endpoint = "banks/NG";

    // Only add search if it exists
    if (search && search.trim() !== "") {
      endpoint += `?search=${search}`;
    }

    return (await api.get(endpoint))?.data;
  };

  const { data, isLoading, error, isError } = useQuery<
    BankResponse,
    AxiosError<ApiErrorResponse>
  >({
    queryKey: ["banks", search],
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
