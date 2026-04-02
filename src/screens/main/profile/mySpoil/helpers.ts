import type { SpoilDatum } from "@spt/utils/spoils";

import type { MySpoilTabId } from "../types";

export const getMySpoilStatusLabel = (
  tab: MySpoilTabId,
  spoil: SpoilDatum,
) => {
  if (tab === "drafts") {
    return spoil.premiere_at ? "Scheduled" : "Draft";
  }

  if (tab === "unpublished") {
    return "Pending Review";
  }

  if (spoil.is_draft) {
    return "Draft";
  }

  return "Published";
};

export const formatSpoilPrice = (spoil: SpoilDatum) => {
  if (spoil.pricing === "free") {
    return "Free";
  }

  const amount = spoil.display_amount ?? spoil.amount ?? 0;

  return `N${amount.toLocaleString()}`;
};

export const getSpoilMeta = (spoil: SpoilDatum) => ({
  institution: spoil.institution || "University of Lagos",
  category: spoil.category?.name || "UI/UX Design",
  likes: spoil.likes_count ?? 0,
  shares: spoil.shares_count ?? 0,
  learners: spoil.enrolled_users ?? 0,
});

const getOrdinalSuffix = (value: number) => {
  const remainder = value % 100;

  if (remainder >= 11 && remainder <= 13) {
    return "th";
  }

  switch (value % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
};

export const formatScheduledSpoilDate = (dateValue?: string | null) => {
  if (!dateValue) {
    return "Not scheduled yet";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "Not scheduled yet";
  }

  const month = date.toLocaleString("en-US", { month: "short" });
  const day = date.getDate();
  const year = date.getFullYear();
  const time = date.toLocaleString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return `${month} ${day}${getOrdinalSuffix(day)}, ${year}, ${time}`;
};

export const isSpoilExpired = (dateValue?: string | null) => {
  if (!dateValue) {
    return false;
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return false;
  }

  return date.getTime() < Date.now();
};
