"use client";

import { useQuery } from "@tanstack/react-query";

import type { LearnerSpoilProgress } from "@spt/hooks/apiRequests/useGetLearnerSpoilProgressQuery";
import type { ApiErrorResponse } from "@spt/types/error";
import api from "@spt/utils/apiClient";

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

const STATUSES: NonNullable<LearnerProgressData["status"]>[] = [
  "completed",
  "ongoing",
  "not_started",
];

/** One of the statuses the progress page shows, or undefined. */
const toStatus = (value?: string | null) =>
  STATUSES.find((status) => status === value?.toLowerCase());

// The API can name the current module and lesson by id; show the title then.
const titleOf = (
  items: { id: number; title: string }[],
  value?: number | string | null,
) => {
  if (value == null || value === "") return null;
  return items.find((item) => String(item.id) === String(value))?.title ?? String(value);
};

// GET /spoils/{id}?user_id= returns the spoil as that learner sees it.
interface LearnerSpoilResponse {
  message: string;
  status: boolean;
  data?: LearnerSpoilProgress | null;
}

// The learner's progress, enrollment date and status are on their enrollment
// (`learner_spoil`), not on the spoil's own `status` / `created_at`.
const toLearnerProgress = (spoil: LearnerSpoilProgress): LearnerProgressData => {
  const enrollment = spoil.learner_spoil;
  const percentage = Number(enrollment?.progress_percentage ?? 0);
  const modules = spoil.modules ?? [];

  return {
    percentage_completed: percentage,
    total_modules: spoil.modules_no ?? modules.length,
    total_modules_completed: spoil.total_modules_completed ?? undefined,
    total_modules_pending: spoil.total_modules_pending ?? undefined,
    current_module: titleOf(modules, spoil.current_module),
    current_lesson: titleOf(
      modules.flatMap((module) => module.lessons ?? []),
      spoil.current_lesson,
    ),
    pre_spoil_quiz_score: spoil.pre_spoil_quiz?.highest_score ?? null,
    post_spoil_quiz_score: spoil.post_spoil_quiz?.highest_score ?? null,
    date_enrolled: enrollment?.date_enrolled ?? null,
    status:
      toStatus(enrollment?.status) ??
      (percentage >= 100 ? "completed" : percentage > 0 ? "ongoing" : "not_started"),
    modules: modules.map((module) => ({
      id: module.id,
      title: module.title,
      lessons_count: module.lessons?.length,
      status: toStatus(module.status),
      percentage_completed: module.percentage_completed ?? 0,
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
