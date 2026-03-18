"use client";

export type PrimaryTab = "explore" | "myCommunities";
export type TutorTab = "joined" | "created";
export type ViewMode = "list" | "detail" | "comments";

export const primaryTabs: Array<{ label: string; value: PrimaryTab }> = [
  { label: "Explore", value: "explore" },
  { label: "My Communities", value: "myCommunities" },
];

export const tutorTabs: Array<{ label: string; value: TutorTab }> = [
  { label: "Communities Joined", value: "joined" },
  { label: "Created By Me", value: "created" },
];
