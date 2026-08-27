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
  register_method: string;
}

interface SignupResponse {
  message: string;
  data: any;
}

export const useSignupMutation = () => {
  const router = useRouter();

  const signUp = async (payload: Payload): Promise<SignupResponse> => {
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
    { setSubmitting }: any,
  ) => {
    const payload: Payload = {
      first_name: values.firstName,
      last_name: values.lastName,
      username: values.username,
      email: values.email,
      password: values.password,
      register_method: "WEB"
    };

    try {
      // Verify the reCAPTCHA token server-side before creating the account.
      const verifyRes = await fetch("/api/verify-recaptcha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: values.recaptcha }),
      });
      const verifyData = await verifyRes.json();

      if (!verifyData.success) {
        toast.error(
          verifyData.message ||
            "reCAPTCHA verification failed. Please try again.",
        );
        return;
      }

      await mutation.mutateAsync(payload);
      toast.success("Account created successfully 🎉");
      localStorage.setItem("userEmail", values.email);

      router.push("/auth/email-verification");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error ||
          error?.response?.data?.message ||
          error?.message ||
          "Signup failed",
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
