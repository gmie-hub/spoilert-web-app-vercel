"use client";

import { useQuery } from "@tanstack/react-query";

import type { ApiErrorResponse } from "@spt/types/error";
import api from "@spt/utils/apiClient";

import type { AxiosError } from "axios";

export interface TutorSpoilLearner {
  id: number;
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
  username?: string | null;
  avatar?: string | null;
}

export interface TutorSpoilChat {
  id: number;
  title: string;
  cover_image_url?: string | null;
  tutor_id?: number;
  enrolled_users?: number | null;
  learners?: TutorSpoilLearner[] | null;
}

interface TutorSpoilsPage {
  current_page?: number;
  last_page?: number;
  data?: TutorSpoilChat[];
}

interface TutorSpoilsResponse {
  message: string;
  status: boolean;
  data: TutorSpoilsPage | TutorSpoilChat[];
}

const fetchPage = async (page: number) =>
  (await api.get<TutorSpoilsResponse>("/spoils/tutor", { params: { page } })).data.data;

const pageItems = (page: TutorSpoilsPage | TutorSpoilChat[]) =>
  Array.isArray(page) ? page : (page?.data ?? []);

// GET /spoils/tutor: the signed-in tutor's spoils, each with its enrolled
// learners — what the mobile app's "Spoylz Chats > Spoylz Created" lists.
const useGetTutorSpoilChatsQuery = (enabled = true) => {
  const { data, isLoading, isError, error } = useQuery<
    TutorSpoilChat[],
    AxiosError<ApiErrorResponse>
  >({
    queryKey: ["tutor-spoil-chats"],
    // Pull every page so no spoil is left out.
    queryFn: async () => {
      const firstPage = await fetchPage(1);
      const lastPage = Array.isArray(firstPage) ? 1 : (firstPage?.last_page ?? 1);
      const otherPages = await Promise.all(
        Array.from({ length: Math.max(0, lastPage - 1) }, (_, index) => fetchPage(index + 2)),
      );
      return [firstPage, ...otherPages].flatMap(pageItems);
    },
    enabled,
  });

  return {
    spoils: data ?? [],
    isLoading,
    isError,
    errorMessage:
      error?.response?.data?.error ||
      error?.response?.data?.message ||
      error?.message ||
      "Failed to fetch your Spoylz",
  };
};

export default useGetTutorSpoilChatsQuery;
