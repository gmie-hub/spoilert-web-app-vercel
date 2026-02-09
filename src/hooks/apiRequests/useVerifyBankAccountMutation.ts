// "use client";

// import { useState } from "react";

// import { useMutation } from "@tanstack/react-query";
// import toast from "react-hot-toast";

// import { ApiErrorResponse } from "@spt/types/error";
// import api from "@spt/utils/apiClient";

// import type { AxiosError } from "axios";

// interface VerifyBankPayload {
//   account_number: string;
//   bank_id: number;
// }

// interface VerifyBankResponse {
//   account_name: string;
//   account_number: string;
//   bank_id: number;
//   message?: string;
// }

// export const useVerifyBankMutation = () => {
//   // State to store the last verified account
//   const [verifiedAccount, setVerifiedAccount] = useState<VerifyBankResponse | null>(null);

//   // Mutation function
//   const verifyBank = async (
//     payload: VerifyBankPayload
//   ): Promise<VerifyBankResponse> => {
//     return (await api.post("/banks/verify", payload)).data;
//   };

//   // React Query mutation
//   const mutation = useMutation<
//     VerifyBankResponse,
//     AxiosError<ApiErrorResponse>,
//     VerifyBankPayload
//   >({
//     mutationKey: ["verify-bank"],
//     mutationFn: verifyBank,
//     onSuccess: (data) => {
//       setVerifiedAccount(data); // save the response on success
//     },
//   });

//   // Handler
//   const verifyBankHandler = async (account_number: string, bank_id: number) => {
//     try {
//       const result = await mutation.mutateAsync({ account_number, bank_id });
//       toast.success("Bank account verified ✅");
//       return result; // still return for immediate use
//     } catch (error: any) {
//       toast.error(
//         error?.response?.data?.message ||
//           error?.message ||
//           "Failed to verify bank account"
//       );
//       return null;
//     }
//   };

//   return {
//     verifyBankHandler,
//     isLoading: mutation.isPending,
//     verifiedAccount, // latest saved verification response
//   };
// };

// "use client";

// import { useState } from "react";
// import { useMutation } from "@tanstack/react-query";

// import { ApiErrorResponse } from "@spt/types/error";
// import api from "@spt/utils/apiClient";
// import type { AxiosError } from "axios";

// interface VerifyBankPayload {
//   account_number: string;
//   bank_id: number;
// }

// interface VerifyBankResponse {
//   account_name?: string; // optional in case of error
//   account_number?: string;
//   bank_id?: number;
//   message?: string; // error message returned by API
// }

// export const useVerifyBankMutation = () => {
//   // State to store the latest verification result (success or error)
//   const [verifiedAccount, setVerifiedAccount] = useState<VerifyBankResponse | null>(null);

//   // Mutation function
//   const verifyBank = async (payload: VerifyBankPayload): Promise<VerifyBankResponse> => {
//     return (await api.post("/banks/verify", payload)).data;
//   };

//   // React Query mutation
//   const mutation = useMutation<VerifyBankResponse, AxiosError<ApiErrorResponse>, VerifyBankPayload>({
//     mutationKey: ["verify-bank"],
//     mutationFn: verifyBank,
//     onSuccess: (data) => {
//       setVerifiedAccount(data); // save success response
//     },
//     onError: (error: AxiosError<ApiErrorResponse>) => {
//       const msg = error?.response?.data?.message || error?.message || "Failed to verify bank account";
//       setVerifiedAccount({ message: msg }); // save error in state
//     },
//   });

//   // Handler
//   const verifyBankHandler = async (account_number: string, bank_id: number) => {
//     try {
//       return await mutation.mutateAsync({ account_number, bank_id });
//     } catch {
//       // Already handled in onError
//       return null;
//     }
//   };

//   return {
//     verifyBankHandler,
//     isLoading: mutation.isPending,
//     verifiedAccount, // contains latest result OR error
//   };
// };

"use client";

import { useState } from "react";

import { useMutation } from "@tanstack/react-query";

import { ApiErrorResponse } from "@spt/types/error";
import api from "@spt/utils/apiClient";

import type { AxiosError } from "axios";

// Payload sent to /banks/verify
interface VerifyBankPayload {
  account_number: string;
  bank_id: number;
}

// Match your backend response shape exactly
interface VerifyBankResponse {
  data?: {
    res?: {
      account_name?: string;
      account_number?: string;
      bank_id?: number;
    };
  };
  message?: string; // error message if any
}

export const useVerifyBankMutation = () => {
  const [verifiedAccount, setVerifiedAccount] =
    useState<VerifyBankResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  // Mutation function
  const verifyBank = async (
    payload: VerifyBankPayload,
  ): Promise<VerifyBankResponse> => {
    return (await api.post("/banks/verify", payload)).data;
  };

  // React Query mutation
  const mutation = useMutation<
    VerifyBankResponse,
    AxiosError<ApiErrorResponse>,
    VerifyBankPayload
  >({
    mutationKey: ["verify-bank"],
    mutationFn: verifyBank,
    onSuccess: (data) => {
      setVerifiedAccount(data);
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      const msg =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        error?.message ||
        "Failed to verify bank account";
      setErrorMessage(msg);
    },
  });

  const verifyBankHandler = async (account_number: string, bank_id: number) => {
    try {
      return await mutation.mutateAsync({ account_number, bank_id });
    } catch {
      return null; // already handled in onError
    }
  };

  return {
    verifyBankHandler,
    isLoading: mutation.isPending,
    verifiedAccount,
    errorMessage,
  };
};
