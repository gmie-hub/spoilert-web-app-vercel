"use client";

import { useQuery } from "@tanstack/react-query";

import type { ApiErrorResponse } from "@spt/types/error";
import api from "@spt/utils/apiClient";

import type { AxiosError } from "axios";

export interface EnrolledLearner {
  id: number;
  user_id?: number;
  percentage_completed?: number;
  status?: "ongoing" | "completed" | "not_started";
  created_at?: string;
  learner?: {
    id: number;
    first_name: string;
    last_name: string;
    username?: string | null;
    avatar?: string | null;
  } | null;
  user?: {
    id: number;
    first_name: string;
    last_name: string;
    username?: string | null;
    avatar?: string | null;
  } | null;
}

// GET /spoils/tutor lists each spoil's learners as users, with their enrollment
// on that spoil when the API includes it (Laravel's `pivot`).
interface TutorSpoilLearner {
  id: number;
  first_name: string;
  last_name: string;
  username?: string | null;
  avatar?: string | null;
  pivot?: {
    status?: EnrolledLearner["status"] | null;
    created_at?: string | null;
  } | null;
}

interface TutorSpoil {
  id: number;
  learners?: TutorSpoilLearner[] | null;
}

// The tutor's spoils, each with its learners — directly or paginated.
interface TutorSpoilsResponse {
  message: string;
  status: boolean;
  data: TutorSpoil[] | { data?: TutorSpoil[]; items?: TutorSpoil[] };
}

const toEnrolledLearner = (learner: TutorSpoilLearner): EnrolledLearner => ({
  id: learner.id,
  user_id: learner.id,
  status: learner.pivot?.status ?? undefined,
  created_at: learner.pivot?.created_at ?? undefined,
  learner,
});

// Everyone enrolled on one of the tutor's spoils (GET /spoils/tutor?spoil_id=).
const useGetEnrolledLearnersQuery = (spoilId: number | string, enabled = true) => {
  const { data, isLoading, isError, error } = useQuery<
    TutorSpoilsResponse,
    AxiosError<ApiErrorResponse>
  >({
    queryKey: ["enrolled-learners", spoilId],
    queryFn: async () =>
      (await api.get(`/spoils/tutor?spoil_id=${spoilId}`)).data,
    enabled: Boolean(spoilId) && enabled,
  });

  const list = data?.data;
  const spoils = Array.isArray(list) ? list : (list?.data ?? list?.items ?? []);
  // The API doesn't filter by spoil_id yet (other spoils can come first), so
  // use the requested spoil when it's listed and, for now, the first otherwise.
  const spoil =
    spoils.find((item) => String(item.id) === String(spoilId)) ?? spoils[0];
  const learners = (spoil?.learners ?? []).map(toEnrolledLearner);

  return {
    learners,
    isLoading,
    isError,
    errorMessage:
      error?.response?.data?.message ||
      error?.message ||
      "Failed to fetch enrolled learners",
  };
};

export default useGetEnrolledLearnersQuery;
