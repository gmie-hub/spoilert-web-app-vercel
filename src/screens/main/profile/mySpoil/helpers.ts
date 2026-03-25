import type { SpoilDatum } from "@spt/utils/spoils";

import type { MySpoilTabId } from "../types";

export const getMySpoilStatusLabel = (
  tab: MySpoilTabId,
  spoil: SpoilDatum,
) => {
  if (tab === "drafts") {
    return "Draft";
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
