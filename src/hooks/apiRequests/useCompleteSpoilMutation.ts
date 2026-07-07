"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import type { ApiErrorResponse } from "@spt/types/error";
import api from "@spt/utils/apiClient";

import type { AxiosError } from "axios";

interface CompleteSpoilPayload {
  spoil_id: number | string;
}

export interface SpoilCertificate {
  id: number;
  cert_id: string;
  url: string;
  // `resolved_url` is the fully-qualified verification link the QR code should
  // point to (…/verify-certificate/qrcode/{cert_id}).
  resolved_url?: string;
  status?: string;
  generated_at?: string;
  spoil_id?: number;
  user_id?: number;
  tutor_id?: number;
  [key: string]: unknown;
}

interface CompleteSpoilData {
  progress_percentage?: number;
  certificate?: SpoilCertificate | null;
  [key: string]: unknown;
}

interface CompleteSpoilResponse {
  message: string;
  status?: boolean;
  data?: CompleteSpoilData;
}

interface CompleteSpoilOptions {
  /** Suppress the success/error toasts (used when completing silently to fetch
   * the certificate, e.g. on the certificate page). */
  silent?: boolean;
}

const useCompleteSpoilMutation = () => {
  const queryClient = useQueryClient();

  const completeSpoil = async (
    payload: CompleteSpoilPayload,
  ): Promise<CompleteSpoilResponse> => {
    return (await api.post("/spoils/learner/complete", payload)).data;
  };

  const mutation = useMutation<
    CompleteSpoilResponse,
    AxiosError<ApiErrorResponse>,
    CompleteSpoilPayload
  >({
    mutationKey: ["complete-spoil"],
    mutationFn: completeSpoil,
  });

  const completeSpoilHandler = async (
    spoilId: number | string,
    options?: CompleteSpoilOptions,
  ) => {
    const silent = options?.silent ?? false;

    try {
      const response = await mutation.mutateAsync({ spoil_id: spoilId });
      if (!silent) {
        toast.success(response?.message || "Spoil completed successfully");
      }
      queryClient.invalidateQueries({ queryKey: ["spoil-details", spoilId] });

      return response;
    } catch (error: any) {
      if (!silent) {
        toast.error(
          error?.response?.data?.error ||
            error?.response?.data?.message ||
            error?.message ||
            "Failed to complete Spoylz",
        );
      }

      return null;
    }
  };

  return {
    completeSpoilHandler,
    isCompletingSpoil: mutation.isPending,
  };
};

export default useCompleteSpoilMutation;
