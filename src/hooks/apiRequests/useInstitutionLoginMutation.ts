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

// Only institution accounts may use the institution portal; learners, tutors
// and admins are turned away before anything is stored.
const INSTITUTION_ROLE = "institution";

export const useInstitutionLoginMutation = () => {
  const router = useRouter();

  const login = async (payload: Payload): Promise<LoginResponse> => {
    return (await api.post("/auth/login", payload)).data;
  };

  const mutation = useMutation<
    LoginResponse,
    AxiosError<ApiErrorResponse>,
    Payload
  >({
    mutationKey: ["institution-login"],
    mutationFn: login,
  });

  const loginHandler = async (values: FormikValues, { setSubmitting }: any) => {
    const payload: Payload = {
      email: values.email,
      password: values.password,
    };

    try {
      const response = await mutation.mutateAsync(payload);

      const user = response.data?.user;

      if (String(user?.role).toLowerCase() !== INSTITUTION_ROLE) {
        toast.error("Only institution accounts can log in here.");
        return;
      }

      useAuthStore.getState().setAuth({ user, token: response.data.token });

      toast.success("Logged in successfully 🎉");
      router.push("/institution/dashboard");
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        error?.message ||
        "Login failed";

      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return {
    isLoading: mutation.isPending,
    loginHandler,
  };
};
