"use client";

import { useQuery } from "@tanstack/react-query";

import type { ApiErrorResponse } from "@spt/types/error";
import api from "@spt/utils/apiClient";

import type { AxiosError } from "axios";

export interface LecturerSpoil {
  id: number;
  title: string;
  description: string | null;
  cover_image_url: string | null;
  pricing: string | null;
  amount: number | null;
  course_code: string | null;
  modules_no: number | null;
  lessons_no: number | null;
  what_to_learn: string | null;
  // 1 published, 0 unpublished.
  status: number;
  enrolled_users: number | null;
  created_at: string;
  category: { id: number; name: string } | null;
}

interface SpoilsResponse {
  message: string;
  status: boolean;
  data: {
    current_page: number;
    last_page: number;
    data: LecturerSpoil[];
  };
}

const PER_PAGE = 50;

const fetchSpoilsPage = async (tutorId: number, status: number, page: number) =>
  (
    await api.get<SpoilsResponse>("spoils", {
      params: { tutor_id: tutorId, status, page, per_page: PER_PAGE },
    })
  ).data.data;

const fetchAllSpoils = async (tutorId: number, status: number) => {
  const firstPage = await fetchSpoilsPage(tutorId, status, 1);
  const otherPages = await Promise.all(
    Array.from({ length: Math.max(0, firstPage.last_page - 1) }, (_, index) =>
      fetchSpoilsPage(tutorId, status, index + 2),
    ),
  );
  return [firstPage, ...otherPages].flatMap((page) => page.data ?? []);
};

// Every published and unpublished spoil a lecturer created (drafts aren't
// listed), newest first. /spoils only returns one status per request.
const useGetLecturerSpoilsQuery = (tutorId?: number | null) => {
  const { data, isLoading, isError, error } = useQuery<
    LecturerSpoil[],
    AxiosError<ApiErrorResponse>
  >({
    queryKey: ["lecturer-spoils", tutorId],
    queryFn: async () => {
      const [published, unpublished] = await Promise.all([
        fetchAllSpoils(tutorId as number, 1),
        fetchAllSpoils(tutorId as number, 0),
      ]);
      return [...published, ...unpublished].sort((a, b) =>
        b.created_at.localeCompare(a.created_at),
      );
    },
    enabled: Boolean(tutorId),
  });

  return {
    spoils: data ?? [],
    isLoading,
    isError,
    errorMessage:
      error?.response?.data?.error ||
      error?.response?.data?.message ||
      error?.message ||
      "Failed to fetch the lecturer's spoylz",
  };
};

export default useGetLecturerSpoilsQuery;
