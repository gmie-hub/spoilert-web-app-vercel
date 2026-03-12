"use client";

import { useMemo } from "react";

import { useQueries } from "@tanstack/react-query";

import FallbackCoverImage from "@spt/assets/images/homeimg.png";
import { useGetAllSpoilsQuery } from "@spt/hooks/apiRequests/useGetAllSpoilsQuery";
import api from "@spt/utils/apiClient";
import type { SpoilDatum, SpoilDetailsData } from "@spt/utils/spoils";

import type { LearningItem } from "./types";

const clampProgress = (value: number | null | undefined) => {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return 0;
  }

  return Math.max(0, Math.min(100, Math.round(value)));
};

const mapToLearningItem = (
  spoil: SpoilDetailsData,
  fallbackSpoil?: SpoilDatum,
): LearningItem => ({
  id: spoil.id,
  title: spoil.title,
  category: spoil.category?.name || fallbackSpoil?.category?.name || "General",
  coverImage: spoil.cover_image_url || fallbackSpoil?.cover_image_url || FallbackCoverImage,
  progress: clampProgress(spoil.percentage_completed),
});

const fetchSpoilDetails = async (spoilId: number) => {
  const response = await api.get<{ data: SpoilDetailsData }>(`/spoils/${spoilId}`);
  return response.data.data;
};

export const useMyLearningData = () => {
  const {
    data: spoilsResponse,
    isLoading: isAllSpoilsLoading,
    isError: isAllSpoilsError,
    errorMessage: allSpoilsErrorMessage,
  } = useGetAllSpoilsQuery();

  const enrolledSpoils = useMemo(
    () =>
      (spoilsResponse?.data?.data ?? []).filter((spoil) => spoil.is_enrolled),
    [spoilsResponse?.data?.data],
  );

  const detailQueries = useQueries({
    queries: enrolledSpoils.map((spoil) => ({
      queryKey: ["my-learning-spoil", spoil.id],
      queryFn: () => fetchSpoilDetails(spoil.id),
      staleTime: 1000 * 60 * 5,
    })),
  });

  const detailById = useMemo(
    () =>
      new Map(
        detailQueries
          .map((query) => query.data)
          .filter((queryData): queryData is SpoilDetailsData => Boolean(queryData))
          .map((spoil) => [spoil.id, spoil]),
      ),
    [detailQueries],
  );

  const learningItems = useMemo(
    () =>
      enrolledSpoils
        .map((spoil) => {
          const detailedSpoil = detailById.get(spoil.id);

          if (!detailedSpoil) {
            return null;
          }

          return mapToLearningItem(detailedSpoil, spoil);
        })
        .filter((item): item is LearningItem => Boolean(item)),
    [detailById, enrolledSpoils],
  );

  const ongoingItems = useMemo(
    () => learningItems.filter((item) => item.progress < 100),
    [learningItems],
  );
  const completedItems = useMemo(
    () => learningItems.filter((item) => item.progress >= 100),
    [learningItems],
  );

  const isDetailsLoading =
    enrolledSpoils.length > 0 &&
    detailQueries.some((query) => query.isPending || query.isLoading);
  const firstDetailsError = detailQueries.find((query) => query.isError)?.error;

  return {
    ongoingItems,
    completedItems,
    isLoading: isAllSpoilsLoading || isDetailsLoading,
    isError: isAllSpoilsError || Boolean(firstDetailsError),
    errorMessage:
      allSpoilsErrorMessage ||
      firstDetailsError?.message ||
      "Failed to load your learnings.",
  };
};

export default useMyLearningData;

