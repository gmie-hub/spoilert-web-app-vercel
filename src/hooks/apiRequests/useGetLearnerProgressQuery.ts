"use client";

import { useQuery } from "@tanstack/react-query";

import type { ApiErrorResponse } from "@spt/types/error";
import api from "@spt/utils/apiClient";
import type { SpoilDetailsData } from "@spt/utils/spoils";

import type { AxiosError } from "axios";

export interface LearnerProgressModule {
  id: number;
  title: string;
  lessons_no?: number;
  lessons_count?: number;
  status?: "completed" | "ongoing" | "not_started";
  percentage_completed?: number;
}

export interface LearnerProgressData {
  user?: {
    id: number;
    first_name: string;
    last_name: string;
    avatar?: string | null;
  } | null;
  learner?: {
    id: number;
    first_name: string;
    last_name: string;
    avatar?: string | null;
  } | null;
  percentage_completed?: number;
  progress?: number;
  total_modules?: number;
  modules_no?: number;
  total_modules_completed?: number;
  modules_completed?: number;
  total_modules_pending?: number;
  modules_pending?: number;
  current_module?: string | null;
  current_lesson?: string | null;
  pre_spoil_quiz_score?: number | null;
  post_spoil_quiz_score?: number | null;
  date_enrolled?: string | null;
  created_at?: string | null;
  status?: "ongoing" | "completed" | "not_started";
  modules?: LearnerProgressModule[];
}

const MODULE_STATUSES: NonNullable<LearnerProgressModule["status"]>[] = [
  "completed",
  "ongoing",
  "not_started",
];

// GET /spoils/{id}?user_id= returns the spoil as that learner sees it, with
// their progress on it.
interface LearnerSpoilResponse {
  message: string;
  status: boolean;
  data?: SpoilDetailsData | null;
}

// The spoil's own `status` and `created_at` aren't the learner's, so their
// status comes from their progress and the date from their enrollment record.
const toLearnerProgress = (spoil: SpoilDetailsData): LearnerProgressData => {
  const percentage = Number(spoil.percentage_completed ?? 0);
  const enrollment = spoil.learner_spoil as { created_at?: string | null } | null;

  return {
    percentage_completed: percentage,
    total_modules: spoil.modules_no,
    total_modules_completed: spoil.total_modules_completed,
    total_modules_pending: spoil.total_modules_pending,
    current_module: spoil.current_module,
    current_lesson: spoil.current_lesson,
    pre_spoil_quiz_score: spoil.pre_spoil_quiz?.highest_score ?? null,
    post_spoil_quiz_score: spoil.post_spoil_quiz?.highest_score ?? null,
    date_enrolled: enrollment?.created_at ?? null,
    status:
      percentage >= 100 ? "completed" : percentage > 0 ? "ongoing" : "not_started",
    modules: spoil.modules?.map((module) => ({
      id: module.id,
      title: module.title,
      lessons_count: module.lessons?.length,
      status: MODULE_STATUSES.find(
        (value) => value === module.status?.toLowerCase(),
      ),
      percentage_completed: Number(module.percentage_completed ?? 0),
    })),
  };
};

const useGetLearnerProgressQuery = (
  spoilId: number | string,
  learnerId: number | string,
  enabled = true,
) => {
  const { data, isLoading, isError, error } = useQuery<
    LearnerSpoilResponse,
    AxiosError<ApiErrorResponse>
  >({
    queryKey: ["learner-progress", spoilId, learnerId],
    queryFn: async () =>
      (await api.get(`/spoils/${spoilId}?user_id=${learnerId}`)).data,
    enabled: Boolean(spoilId) && Boolean(learnerId) && enabled,
  });

  return {
    progress: data?.data ? toLearnerProgress(data.data) : null,
    isLoading,
    isError,
    errorMessage:
      error?.response?.data?.message ||
      error?.message ||
      "Failed to fetch learner progress",
  };
};

export default useGetLearnerProgressQuery;
