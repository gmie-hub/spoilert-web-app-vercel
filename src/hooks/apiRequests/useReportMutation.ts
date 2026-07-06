"use client";

import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import type { ApiErrorResponse } from "@spt/types/error";
import api from "@spt/utils/apiClient";

import type { AxiosError } from "axios";

export interface ReportPayload {
  /** Id of the entity being reported. For a tutor this is the tutor id. */
  id: number;
  type: "tutor" | "spoil" | "community" | string;
  reason: string;
  description: string;
}

interface ReportResponse {
  message?: string;
  data?: any;
  [key: string]: any;
}

const useReportMutation = () => {
  const report = async (payload: ReportPayload): Promise<ReportResponse> => {
    return (await api.post("/reports", payload)).data;
  };

  const mutation = useMutation<
    ReportResponse,
    AxiosError<ApiErrorResponse>,
    ReportPayload
  >({
    mutationKey: ["report"],
    mutationFn: report,
  });

  const reportHandler = async (payload: ReportPayload) => {
    try {
      const response = await mutation.mutateAsync(payload);
      toast.success(response?.message || "Report submitted successfully");
      return response;
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error ||
          error?.response?.data?.message ||
          error?.message ||
          "Failed to submit report",
      );
      return null;
    }
  };

  return {
    reportHandler,
    isLoading: mutation.isPending,
  };
};

export default useReportMutation;
