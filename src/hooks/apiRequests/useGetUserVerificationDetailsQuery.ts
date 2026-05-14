// import { useQuery } from "@tanstack/react-query";
// import { AxiosError } from "axios";

// import { ApiErrorResponse } from "@spt/types/error";
// import api from "@spt/utils/apiClient";

// export interface VerificationUser {
//   id: number;
//   email: string;
//   username: string;
//   first_name: string;
//   last_name: string;
//   // Add other user fields as needed
// }

// export interface VerificationItem {
//   id: number;
//   user_id: number;
//   type: string;
//   value: string;
//   status: number;
//   url: string;
//   created_at: string;
//   updated_at: string;
//   deleted_at: string | null;
//   data: VerificationUser;
// }

// export interface UserVerificationDetailsResponse {
//   message: string;
//   status: boolean;
//   current_page: number;
//   data: VerificationItem[];
//   first_page_url: string;
//   from: number;
//   last_page: number;
//   last_page_url: string;
//   next_page_url: string | null;
//   path: string;
//   per_page: number;
//   prev_page_url: string | null;
//   to: number;
//   total: number;
//   links: any[];
// }

// export const useGetUserVerificationDetails = () => {
//   const fetchUserDetails = async (): Promise<UserVerificationDetailsResponse> => {
//     return (await api.get("verifications?user_id=68")).data;
//   };

//   const { data, isLoading, error, isError } = useQuery<
//     UserVerificationDetailsResponse,
//     AxiosError<ApiErrorResponse>
//   >({
//     queryKey: ["user-verification-details", 68],
//     queryFn: fetchUserDetails,
//   });

//   const errorMessage =
//     error?.response?.data?.message ||
//     error?.message ||
//     "Failed to fetch user verification details";

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

/* =========================
   USER TYPES
========================= */

export interface VerificationUser {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
}

/* =========================
   VERIFICATION ITEM
========================= */

export interface VerificationItem {
  id: number;
  user_id: number;
  type: string;
  value: string;
  status: number;
  url: string;
  comment?: string | null;
  rejection_reason?: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  data: VerificationUser; // nested user object
}

/* =========================
   PAGINATED RESPONSE
========================= */

export interface UserVerificationDetailsResponse {
  message: string;
  status: boolean;
  current_page: number;
  data: VerificationItem[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
  links: any[];
}

/* =========================
   HOOK
========================= */

export const useGetUserVerificationDetails = (userId: number) => {
  const fetchUserDetails = async (): Promise<UserVerificationDetailsResponse> => {
    const response = await api.get(`verifications?user_id=${userId}`);

    // 🔥 unwrap here so we avoid data.data everywhere
    return response.data.data;
  };

  const { data, isLoading, error, isError } = useQuery<
    UserVerificationDetailsResponse,
    AxiosError<ApiErrorResponse>
  >({
    queryKey: ["user-verification-details", userId],
    queryFn: fetchUserDetails,
    enabled: !!userId, // prevents running if userId is undefined/null
  });

  const errorMessage =
    error?.response?.data?.message ||
    error?.message ||
    "Failed to fetch user verification details";

  return {
    userVerificationDetails: data,
    verificationItems: data?.data ?? [],
    isLoading,
    isError,
    errorMessage,
  };
};