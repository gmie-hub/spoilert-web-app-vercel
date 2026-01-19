"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { ApiErrorResponse } from "@spt/types/error";
import api from "@spt/utils/apiClient";

import type { AxiosError } from "axios";
import type { FormikValues } from "formik";



interface Payload {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password: string;
}

interface SignupResponse {
  message: string;
  data: any;
}

export const useSignupMutation = () => {
  const router = useRouter();

  const signUp = async (
    payload: Payload
  ): Promise<SignupResponse> => {
    return (await api.post("/auth/register", payload)).data;
  };

  const mutation = useMutation<
    SignupResponse,
    AxiosError<ApiErrorResponse>,
    Payload
  >({
    mutationKey: ["signup"],
    mutationFn: signUp,
  });

const signupHandler = async (
  values: FormikValues,
  { setSubmitting }: any
) => {
  const payload: Payload = {
    first_name: values.firstName,
    last_name: values.lastName,
    username: values.username,
    email: values.email,
    password: values.password,
  };

  try {
    await mutation.mutateAsync(payload);
    toast.success("Account created successfully 🎉");
    router.push("/auth/login");
  } catch (error: any) {
    toast.error(
      error?.response?.data?.message ||
        error?.message ||
        "Signup failed"
    );
  } finally {
    setSubmitting(false);
  }
};


  return {
    isLoading: mutation.isPending,
    signupHandler,
  };
};