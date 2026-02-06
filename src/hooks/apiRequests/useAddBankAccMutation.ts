"use client";

import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { ApiErrorResponse } from "@spt/types/error";
import api from "@spt/utils/apiClient";

import type { AxiosError } from "axios";

interface AddBankAccountPayload {
  account_number: string;
  bank_id: number;
}

interface AddBankAccountResponse {
  message: string;
  // add other fields returned by your API if any
}

export const useAddBankAccountMutation = () => {
  const addBankAccount = async (
    payload: AddBankAccountPayload
  ): Promise<AddBankAccountResponse> => {
    return (await api.post("banks/add", payload)).data;
  };

  const mutation = useMutation<
    AddBankAccountResponse,
    AxiosError<ApiErrorResponse>,
    AddBankAccountPayload
  >({
    mutationKey: ["add-bank-account"],
    mutationFn: addBankAccount,
  });

  const addBankAccountHandler = async (account_number: string, bank_id: number) => {
    try {
      await mutation.mutateAsync({ account_number, bank_id });
      toast.success("Bank account added successfully 🏦");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to add bank account"
      );
    }
  };

  return {
    addBankAccountHandler,
    isLoading: mutation.isPending,
  };
};
