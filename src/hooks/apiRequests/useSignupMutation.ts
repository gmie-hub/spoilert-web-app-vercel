import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { ApiErrorResponse } from "@spt/types/error";
import api from "@spt/utils/apiClient";

export interface SignUpPayload {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  username: string;
}

export interface SignUpResponse {
  message: string;
  data: {
    id: string;
    email: string;
    username: string;
  };
}

export const useSignUpMutation = () => {
  const signUpRequest = async (
    payload: SignUpPayload
  ): Promise<SignUpResponse> => {
    const response = await api.post("auth/register", payload);
    return response.data;
  };

  const mutation = useMutation<
    SignUpResponse,
    AxiosError<ApiErrorResponse>,
    SignUpPayload
  >({
    mutationFn: signUpRequest,
  });

  const errorMessage =
    mutation.error?.response?.data?.message ||
    mutation.error?.message ||
    "Signup failed";

  return {
    ...mutation,
    errorMessage,
  };
};
