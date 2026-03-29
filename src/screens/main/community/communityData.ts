"use client";


export const communityFilters = [
  { value: "all", label: "All Communities" },
  { value: "free", label: "Free Communities" },
  { value: "locked", label: "Locked Communities" },
] as const;

export type CommunityFilterValue = (typeof communityFilters)[number]["value"];

