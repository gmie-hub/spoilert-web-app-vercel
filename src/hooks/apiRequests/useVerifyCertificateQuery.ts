"use client";

import { useQuery } from "@tanstack/react-query";

import type { ApiErrorResponse } from "@spt/types/error";
import api from "@spt/utils/apiClient";

import type { AxiosError } from "axios";

export interface CertificateVerificationData {
  certificate_title: string;
  certificate_id: string;
  recipient_name: string;
  spoil_title: string;
  tutor_name: string;
  date_issued: string;
}

interface CertificateVerificationResponse {
  message: string;
  status: boolean;
  data: CertificateVerificationData;
}

export const useVerifyCertificateQuery = (certificateId?: string | null) => {
  const fetchCertificate = async (): Promise<CertificateVerificationResponse> => {
    return (await api.get(`/spoils/verify-certificate/${certificateId}`)).data;
  };

  const { data, isLoading, isError, error, isFetching } = useQuery<
    CertificateVerificationResponse,
    AxiosError<ApiErrorResponse>
  >({
    queryKey: ["verify-certificate", certificateId],
    queryFn: fetchCertificate,
    enabled: !!certificateId && certificateId.trim() !== "",
    retry: false,
  });

  const errorMessage =
    error?.response?.data?.message ||
    error?.message ||
    "Certificate not found";

  return {
    data: data?.data ?? null,
    isLoading: isLoading && isFetching,
    isError,
    errorMessage,
  };
};

export default useVerifyCertificateQuery;
