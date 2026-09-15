"use client";

import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { INSTITUTION_COUNTRIES, INSTITUTION_POSITIONS } from "@spt/screens/institution/signup/constants";
import type { InstitutionApplicationValues } from "@spt/screens/institution/signup/types";
import { ApiErrorResponse } from "@spt/types/error";
import api from "@spt/utils/apiClient";

import type { AxiosError } from "axios";

interface ContactPayload {
  full_name: string;
  email: string;
  phone: string;
  position: string;
}

interface Payload {
  name: string;
  type: string;
  state: string;
  address: string;
  city: string;
  country: string;
  official_email: string;
  phone: string;
  contact: ContactPayload;
}

interface ApplicationResponse {
  message: string;
}

export const useInstitutionApplicationMutation = () => {
  const submitApplication = async (payload: Payload): Promise<ApplicationResponse> => {
    return (await api.post("/applications", payload)).data;
  };

  const mutation = useMutation<ApplicationResponse, AxiosError<ApiErrorResponse>, Payload>({
    mutationKey: ["institution-application"],
    mutationFn: submitApplication,
  });

  const applyHandler = async (values: InstitutionApplicationValues): Promise<boolean> => {
    const countryLabel =
      INSTITUTION_COUNTRIES.find((option) => option.value === values.country)?.label ?? values.country;
    const positionLabel =
      INSTITUTION_POSITIONS.find((option) => option.value === values.repPosition)?.label ?? values.repPosition;

    const payload: Payload = {
      name: values.institutionName,
      type: values.institutionType,
      state: values.state,
      address: values.institutionAddress,
      city: values.city,
      country: countryLabel,
      official_email: values.officialEmail,
      phone: values.phone,
      contact: {
        full_name: values.repFullName,
        email: values.repEmail,
        phone: values.repPhone,
        position: positionLabel,
      },
    };

    try {
      const response = await mutation.mutateAsync(payload);
      toast.success(response?.message || "Application submitted successfully 🎉");
      return true;
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error ||
          error?.response?.data?.message ||
          error?.message ||
          "Failed to submit application. Please try again.",
      );
      return false;
    }
  };

  return {
    isLoading: mutation.isPending,
    applyHandler,
  };
};
