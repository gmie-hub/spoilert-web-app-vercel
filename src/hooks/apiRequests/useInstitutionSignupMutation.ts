"use client";

import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { useAuthStore } from "@spt/store/authStore";
import { ApiErrorResponse } from "@spt/types/error";
import api from "@spt/utils/apiClient";

import type { AxiosError } from "axios";

export interface InstitutionSignupValues {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  institutionName: string;
  website: string;
  institutionType: string;
  country: string;
  studentCount: string;
  primaryFocus: string;
  code: string;
  workspaceName: string;
}

interface RegisterPayload {
  full_name: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
  institution_name: string;
  website: string;
  institution_type: string;
  country: string;
  student_count: number | string;
  primary_focus: string;
  workspace_name: string;
  verification_code: string;
}

interface RegisterResponse {
  message: string;
  data?: {
    token?: string;
    user?: unknown;
  };
}

const splitFullName = (fullName: string) => {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  const firstName = parts[0] ?? "";
  const lastName = parts.slice(1).join(" ");

  return {
    first_name: firstName,
    last_name: lastName || firstName,
  };
};

export const useInstitutionSignupMutation = () => {
  const register = async (
    payload: RegisterPayload,
  ): Promise<RegisterResponse> => {
    return (await api.post("/institution/auth/register", payload)).data;
  };

  const mutation = useMutation<
    RegisterResponse,
    AxiosError<ApiErrorResponse>,
    RegisterPayload
  >({
    mutationKey: ["institution-signup"],
    mutationFn: register,
  });

  const signupHandler = async (values: InstitutionSignupValues) => {
    const names = splitFullName(values.fullName);
    const website = values.website.trim().match(/^https?:\/\//)
      ? values.website.trim()
      : `https://${values.website.trim()}`;
    const payload: RegisterPayload = {
      full_name: values.fullName.trim(),
      first_name: names.first_name,
      last_name: names.last_name,
      email: values.email.trim(),
      phone: values.phone.trim(),
      password: values.password,
      institution_name: values.institutionName.trim(),
      website,
      institution_type: values.institutionType,
      country: values.country,
      student_count: Number(values.studentCount) || values.studentCount,
      primary_focus: values.primaryFocus.trim(),
      workspace_name: values.workspaceName.trim(),
      verification_code: values.code,
    };

    try {
      const response = await mutation.mutateAsync(payload);

      if (response.data?.token) {
        useAuthStore.getState().setAuth({
          user: response.data.user,
          token: response.data.token,
        });
      }

      toast.success(
        response?.message || "Institution account created successfully 🎉",
      );
      return true;
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error ||
          error?.response?.data?.message ||
          error?.message ||
          "Could not create your institution account",
      );
      return false;
    }
  };

  return {
    isLoading: mutation.isPending,
    signupHandler,
  };
};
