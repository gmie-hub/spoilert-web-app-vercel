"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { useAuthStore } from "@spt/store/authStore";
import { ApiErrorResponse } from "@spt/types/error";
import api from "@spt/utils/apiClient";

import type { AxiosError } from "axios";
import type { FormikValues } from "formik";


interface Payload {
  email: string;
  password: string;
}

interface LoginResponse {
  message: string;
  data: {
    token: string;
    user: any;
  };
}

export const useLoginMutation = () => {
    const router = useRouter();
  
  const login = async (payload: Payload): Promise<LoginResponse> => {
    return (await api.post("/auth/login", payload)).data;
  };

  const mutation = useMutation<LoginResponse, AxiosError<ApiErrorResponse>, Payload>({
    mutationKey: ["login"],
    mutationFn: login,
  });

  const loginHandler = async (values: FormikValues, { setSubmitting }: any) => {
    const payload: Payload = {
      email: values.email,
      password: values.password,
    };

    try {
      const response = await mutation.mutateAsync(payload);

      // Store token in localStorage (or cookies)
      // localStorage.setItem("token", response.data.token);
        if (response.data) {
      const { token, user } = response.data;
      useAuthStore.getState().setAuth({ user, token }); // save to Zustand
    }
      toast.success("Logged in successfully 🎉");

      // Redirect after login
      router.push("/"); // change this to your post-login route
    } catch (error: any) {
      toast.error(error?.response?.data?.error ||
        error?.response?.data?.message ||
          error?.message ||
          "Login failed"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return {
    isLoading: mutation.isPending,
    loginHandler,
  };
};
