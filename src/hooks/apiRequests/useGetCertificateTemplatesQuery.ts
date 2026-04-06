import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

import type { ApiErrorResponse } from "@spt/types/error";
import api from "@spt/utils/apiClient";

export interface CertificateTemplatePayload {
  template_content: string;
  certificate_template_name: string;
}

export interface CertificateTemplate {
  id: number;
  code: string;
  type: string | null;
  template: CertificateTemplatePayload;
  is_active: boolean;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CertificateTemplatesPagination {
  current_page: number;
  data: CertificateTemplate[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

interface CertificateTemplatesResponse {
  message: string;
  status: boolean;
  data: CertificateTemplatesPagination;
}

const extractCertificateTemplates = (
  response?: CertificateTemplatesResponse,
): CertificateTemplate[] => {
  return response?.data?.data ?? [];
};

export const useGetCertificateTemplatesQuery = (options?: {
  enabled?: boolean;
}) => {
  const fetchCertificateTemplates =
    async (): Promise<CertificateTemplatesResponse> => {
      return (await api.get("/certificates/template")).data;
    };

  const { data, isLoading, error, isError } = useQuery<
    CertificateTemplatesResponse,
    AxiosError<ApiErrorResponse>
  >({
    queryKey: ["certificate-templates"],
    queryFn: fetchCertificateTemplates,
    enabled: options?.enabled ?? true,
  });

  const errorMessage =
    error?.response?.data?.message ||
    error?.message ||
    "Failed to fetch certificate templates";

  return {
    data,
    pagination: data?.data ?? null,
    templates: extractCertificateTemplates(data),
    isLoading,
    isError,
    errorMessage,
  };
};

export default useGetCertificateTemplatesQuery;
