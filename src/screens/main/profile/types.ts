import type { IconType } from "react-icons";

export type ProfileNavItemId =
  | "profile-details"
  | "spoil-stats"
  | "my-bookmarks"
  | "my-spoils"
  | "spoil-performance-analytics"
  | "my-sponsorships"
  | "my-promotions"
  | "earnings-breakdown"
  | "transaction-history"
  | "manage-bank-account"
  | "change-password"
  | "faqs"
  | "customer-support"
  | "delete-my-account"
  | "log-out";

export interface ProfileNavItem {
  id: ProfileNavItemId;
  label: string;
  href?: string;
  icon: IconType;
}

export interface ProfileNavGroup {
  title: string;
  items: ProfileNavItem[];
}

export type MySpoilTabId = "published" | "unpublished" | "drafts";

export interface MySpoilTabOption {
  id: MySpoilTabId;
  label: string;
}

export interface ProfileDisplay {
  name: string;
  handle: string;
  followersLabel: string;
  avatar: string | null;
  initials: string;
}
