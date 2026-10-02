"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import type { LecturerFormValues } from "@spt/screens/institution/lecturers/components/AddLecturerModal";
import type { ApiErrorResponse } from "@spt/types/error";
import api from "@spt/utils/apiClient";

import type { AxiosError } from "axios";

interface Payload {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  faculty: string;
  department: string;
  position: string;
}

interface AddLecturerResponse {
  message: string;
  status: boolean;
  data: unknown;
}

const useAddLecturerMutation = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<AddLecturerResponse, AxiosError<ApiErrorResponse>, Payload>({
    mutationKey: ["add-lecturer"],
    mutationFn: async (payload) => (await api.post("/lecturers", payload)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["institution-lecturers"] });
    },
  });

  const addLecturerHandler = async (values: LecturerFormValues): Promise<boolean> => {
    try {
      await mutation.mutateAsync({
        first_name: values.firstName.trim(),
        last_name: values.lastName.trim(),
        email: values.email.trim(),
        phone_number: values.phone.trim(),
        faculty: values.faculty.trim(),
        department: values.department.trim(),
        position: values.position.trim(),
      });
      return true;
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error ||
          error?.response?.data?.message ||
          error?.message ||
          "Failed to add lecturer. Please try again.",
      );
      return false;
    }
  };

  return {
    isLoading: mutation.isPending,
    addLecturerHandler,
  };
};

export default useAddLecturerMutation;
