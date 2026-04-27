"use client";

import { useMemo } from "react";

import FallbackCoverImage from "@spt/assets/icons/heroimage1.svg";
import useGetLearnerSpoilsQuery from "@spt/hooks/apiRequests/useGetLearnerSpoilsQuery";
import { useAuthStore } from "@spt/store/authStore";

import type { LearningItem, MyLearningTabKey } from "./types";

const clampProgress = (value: number | null | undefined) => {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return 0;
  }

  return Math.max(0, Math.min(100, Math.round(value)));
};

const toNumber = (value: unknown): number | null => {
  if (typeof value === "number" && !Number.isNaN(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? null : parsed;
  }

  return null;
};

const mapToLearningItem = (
  spoil: {
    id: number;
    spoil_id?: number;
    spoil?: {
      id?: number;
      title?: string;
      cover_image_url?: string;
      category?: {
        name?: string;
      } | null;
    } | null;
    title?: string;
    spoil_title?: string;
    cover_image_url?: string;
    cover_image?: string;
    percentage_completed?: number | null;
    progress_percentage?: string | number | null;
    progress?: number | null;
    category?: {
      name?: string;
    } | null;
    category_name?: string;
  },
): LearningItem => ({
  id: spoil.spoil?.id || spoil.spoil_id || spoil.id,
  title: spoil.spoil?.title || spoil.title || spoil.spoil_title || "Untitled Spoil",
  category: spoil.spoil?.category?.name || spoil.category?.name || spoil.category_name || "General",
  coverImage:
    spoil.spoil?.cover_image_url ||
    spoil.cover_image_url ||
    spoil.cover_image ||
    FallbackCoverImage,
  progress: clampProgress(
    toNumber(spoil.percentage_completed) ??
      toNumber(spoil.progress_percentage) ??
      toNumber(spoil.progress),
  ),
  raw: spoil,
});

export const useMyLearningData = (status: MyLearningTabKey) => {
  const user = useAuthStore((state) => state.user);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const userId = user?.id;
  // For the 'ongoing' tab we want to include both 'ongoing' and 'not_started'
  // learner spoils. Call the query twice and merge results.
  const isOngoingTab = status === "ongoing";

  // Call both hooks unconditionally to preserve hook order — control fetching
  // using the `enabled` flag so the `not_started` request only runs when
  // the ongoing tab is active. For the completed tab, request `completed`.
  const primaryStatus: any = isOngoingTab ? "ongoing" : "completed";
  const primaryQuery = useGetLearnerSpoilsQuery(primaryStatus, userId, true);
  const notStartedQuery = useGetLearnerSpoilsQuery("not_started", userId, isOngoingTab);

  const combinedSpoils = useMemo(() => {
    const primary = primaryQuery?.spoils ?? [];
    const notStarted = notStartedQuery?.spoils ?? [];

    if (!isOngoingTab) return primary;

    // merge and dedupe by spoil id; prefer ongoing records over not_started
    const map = new Map<number, typeof primary[0] | typeof notStarted[0]>();
    [...notStarted, ...primary].forEach((s) => {
      const id = (s.spoil?.id ?? s.spoil_id ?? s.id) as number;
      if (id != null) map.set(id, s);
    });

    return Array.from(map.values());
  }, [primaryQuery?.spoils, notStartedQuery?.spoils, isOngoingTab]);

  const items = useMemo(
    () => (combinedSpoils ?? []).map((spoil) => mapToLearningItem(spoil)),
    [combinedSpoils],
  );

  const isLoading = (isOngoingTab ? (primaryQuery.isLoading || notStartedQuery.isLoading) : primaryQuery.isLoading) ?? false;
  const isError = (isOngoingTab ? (primaryQuery.isError || notStartedQuery.isError) : primaryQuery.isError) ?? false;
  const errorMessage = primaryQuery.errorMessage || notStartedQuery.errorMessage || "";


  return {
    items,
    isLoading: !hasHydrated || isLoading,
    isError: hasHydrated ? isError : false,
    errorMessage,
  };
};

export default useMyLearningData;
