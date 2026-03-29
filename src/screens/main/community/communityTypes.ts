"use client";

import { SpoilDatum } from "@spt/utils/spoils";

export type CommunityAudience = "free" | "locked";

export type FeedItemType = "post" | "spoil";

export interface CommunityCardItem {
  id: string;
  name: string;
  description: string;
  audience: CommunityAudience;
  members: number;
  avatarLabel: string;
  accentColor: string;
  locked:number;
  avatarUrl?: string | null;
  spoil_id:number
  spoil:SpoilDatum;
  total_members:number
}

export interface CommunityAuthor {
  id: string;
  name: string;
  handle?: string;
  avatarLabel: string;
  accentColor: string;
  verified?: boolean;
  badge?: string;
  subtitle?: string;
}

export interface CommunityFeedItem {
  id: string;
  type: FeedItemType;
  author: CommunityAuthor;
  createdAt: string;
  content: string;
  likes: number;
  comments: number;
  imageLabel?: string;
  promoted?: boolean;
  tag?: string;
  title?: string;
  price?: string;
  institution?: string;
}

export interface CommunityProfile {
  id: string;
  name: string;
  members: number;
  description: string;
  spoilTitle: string;
  spoil?: {
    title?: string;
    description?: string;
    tutor?: {
      first_name?: string;
      last_name?: string;
      id?: string | number;
    } | null;
  } | null;
  createdBy: string;
  createdDate: string;
  avatarLabel: string;
  accentColor: string;
  feed: CommunityFeedItem[];
  comments: CommunityFeedItem[];
}
