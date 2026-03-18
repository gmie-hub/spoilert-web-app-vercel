"use client";

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
  createdBy: string;
  createdDate: string;
  avatarLabel: string;
  accentColor: string;
  feed: CommunityFeedItem[];
  comments: CommunityFeedItem[];
}
