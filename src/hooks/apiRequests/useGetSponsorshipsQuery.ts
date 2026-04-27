"use client";

import { useQuery } from "@tanstack/react-query";

import { useAuthStore } from "@spt/store/authStore";
import type { ApiErrorResponse } from "@spt/types/error";
import api from "@spt/utils/apiClient";

import type { AxiosError } from "axios";

export interface SponsorshipCode {
  id: number;
  sponsorship_id: number;
  learner_id: number | null;
  code: string;
  redeemed_at: string | null;
}

export interface SponsorshipSpoil {
  id: number;
  title: string;
  slug: string;
  cover_image_url: string | null;
  tutor: { first_name: string; last_name: string } | null;
  tutor_id: number | null;
  category: { id: number; name: string } | null;
}

export interface SponsorshipSponsor {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

export interface SponsorshipDatum {
  id: number;
  is_admin: number;
  paid_at: string | null;
  payment_id: number | null;
  quantity: number;
  spoil_id: number;
  sponsor_id: number;
  status: string;
  total_amount: string;
  total_codes: number;
  total_redeemed: number;
  unit_amount: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  codes: SponsorshipCode[];
  spoil: SponsorshipSpoil | null;
  sponsor: SponsorshipSponsor | null;
}

interface SponsorshipsResponse {
  status?: boolean;
  message?: string;
  data?: SponsorshipDatum[] | { current_page?: number; data?: SponsorshipDatum[] };
}

const extractSponsorships = (response?: SponsorshipsResponse): SponsorshipDatum[] => {
  if (!response) return [];
  if (Array.isArray(response.data)) return response.data;
  const nested = (response.data as { data?: SponsorshipDatum[] })?.data;
  if (Array.isArray(nested)) return nested;
  return [];
};

export const useGetSponsorshipsQuery = (isAdmin: boolean = true) => {
  const user = useAuthStore((state) => state.user);
  const userId = user?.id;

  const fetchSponsorships = async (): Promise<SponsorshipsResponse> => {
    const params = new URLSearchParams({ is_admin: isAdmin ? "1" : "0" });
    return (await api.get(`/sponsorships?${params.toString()}`)).data;
  };

  const { data, isLoading, error, isError, refetch } = useQuery<
    SponsorshipsResponse,
    AxiosError<ApiErrorResponse>
  >({
    queryKey: ["sponsorships", userId, isAdmin],
    queryFn: fetchSponsorships,
    enabled: !!userId,
  });

  const errorMessage =
    error?.response?.data?.message ||
    error?.message ||
    "Failed to fetch sponsorships";

  return {
    data,
    sponsorships: extractSponsorships(data),
    isLoading,
    isError,
    errorMessage,
    refetch,
  };
};

export default useGetSponsorshipsQuery;
