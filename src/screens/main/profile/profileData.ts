import {
  FiBarChart2,
  FiBookOpen,
  FiBookmark,
  FiCreditCard,
  FiGift,
  FiHelpCircle,
  FiLayers,
  FiLifeBuoy,
  FiLock,
  FiLogOut,
  FiPercent,
  FiTrash2,
  FiTrendingUp,
  FiUser,
} from "react-icons/fi";

import type {
  MySpoilTabOption,
  ProfileDisplay,
  ProfileNavGroup,
} from "./types";

export const defaultProfileDisplay: ProfileDisplay = {
  name: "Omorinsola 98",
  handle: "Ogunsola Omorinsola",
  followersLabel: "20 Followers",
  avatar: null,
  initials: "OO",
};

export const mySpoilsTabOptions: MySpoilTabOption[] = [
  { id: "published", label: "Published" },
  { id: "unpublished", label: "Unpublished" },
  { id: "drafts", label: "Drafts" },
];

export const profileNavigationGroups: ProfileNavGroup[] = [
  {
    title: "General",
    items: [
      {
        id: "profile-details",
        label: "Profile Details",
        href: "/profile/profile-details",
        icon: FiUser,
      },
      {
        id: "spoil-stats",
        label: "Spoil Stats",
        href: "/profile/spoil-stats",
        icon: FiTrendingUp,
      },
      {
        id: "my-bookmarks",
        label: "My Bookmarks",
        href: "/profile/my-bookmarks",
        icon: FiBookmark,
      },
      {
        id: "my-spoils",
        label: "My Spoils",
        href: "/profile/my-spoils",
        icon: FiBookOpen,
      },
      {
        id: "spoil-performance-analytics",
        label: "Spoil Performance Analytics",
        href: "/profile/spoil-performance-analytics",
        icon: FiBarChart2,
      },
      {
        id: "my-sponsorships",
        label: "My Sponsorships",
        href: "/profile/my-sponsorships",
        icon: FiGift,
      },
      {
        id: "my-promotions",
        label: "My Promotions",
        href: "/profile/my-promotions",
        icon: FiPercent,
      },
    ],
  },
  {
    title: "Payments",
    items: [
      {
        id: "earnings-breakdown",
        label: "Earnings Breakdown",
        href: "/profile/earnings-breakdown",
        icon: FiLayers,
      },
      {
        id: "transaction-history",
        label: "Transaction History",
        href: "/profile/transaction-history",
        icon: FiCreditCard,
      },
      {
        id: "manage-bank-account",
        label: "Manage Bank Account",
        href: "/profile/manage-bank-account",
        icon: FiCreditCard,
      },
    ],
  },
  {
    title: "Security",
    items: [
      {
        id: "change-password",
        label: "Change Password",
        href: "/profile/change-password",
        icon: FiLock,
      },
    ],
  },
  {
    title: "Help and Support",
    items: [
      {
        id: "faqs",
        label: "FAQs",
        href: "/profile/faqs",
        icon: FiHelpCircle,
      },
      {
        id: "customer-support",
        label: "Customer Support",
        href: "/profile/customer-support",
        icon: FiLifeBuoy,
      },
    ],
  },
  {
    title: "Others",
    items: [
      {
        id: "delete-my-account",
        label: "Delete My Account",
        href: "/profile/delete-my-account",
        icon: FiTrash2,
      },
      {
        id: "log-out",
        label: "Log Out",
        icon: FiLogOut,
      },
    ],
  },
];
