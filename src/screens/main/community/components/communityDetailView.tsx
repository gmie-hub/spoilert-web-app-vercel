"use client";

import { useState } from "react";

import Image from "next/image";

import ArrowLeft from "@spt/assets/icons/arrow-left.svg";
import useGetCommunityCommentsQuery from "@spt/hooks/apiRequests/useGetCommunityCommentsQuery";
import useGetCommunityPostsQuery from "@spt/hooks/apiRequests/useGetCommunityPostsQuery";

import CommunityComposer from "./communityComposer";
import CommunityDetailSidebar from "./communityDetailSidebar";
import CommunityFeedCard from "./communityFeedCard";
import CommunitySearchBar from "./communitySearchBar";

import type { ViewMode } from "../communityPageTypes";
import type { CommunityFeedItem, CommunityProfile } from "../communityTypes";


interface CommunityDetailViewProps {
  community?: CommunityProfile | null;
  detailFeed: CommunityFeedItem[];
  detailSearchValue: string;
  selectedPost?: CommunityFeedItem | null;
  submittedDetailSearch: string;
  viewMode: ViewMode;
  onBack: () => void;
  onDetailSearchChange: (value: string) => void;
  onDetailSearchSubmit: () => void;
  onOpenComments: (postId: string) => void;
  isLoading?: boolean;
}

const CommunityDetailView = ({
  community,
  detailFeed,
  detailSearchValue,
  selectedPost,
  submittedDetailSearch,
  viewMode,
  onBack,
  onDetailSearchChange,
  onDetailSearchSubmit,
  onOpenComments,
  isLoading: propsIsLoading,
}: CommunityDetailViewProps) => {
  // defensive: allow `community` to be null/undefined and expose loading state
  const isLoading = typeof propsIsLoading === "boolean" ? propsIsLoading : (community as any) == null;
  const safeCommunity = (community as any) || {
    id: "",
    name: "",
    members: 0,
    description: "",
    spoilTitle: "",
    createdBy: "",
    createdDate: "",
    avatarLabel: "",
    accentColor: "#C8D4E3",
    feed: [],
    comments: [],
  } as CommunityProfile;
  const isSearchResults = submittedDetailSearch.trim().length > 0;

  const [loadComments, setLoadComments] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  const { data: postsData, isLoading: postsLoading } = useGetCommunityPostsQuery(
    { community_id: community?.id },
    Boolean(community?.id),
  );

  const { data: commentsData, isLoading: commentsLoading } = useGetCommunityCommentsQuery(
    { community_id: community?.id, post_id: selectedPostId ?? undefined },
    Boolean(loadComments && selectedPostId),
  );

  const posts = postsData ?? [];

  const handleOpenCommentsInternal = (postId: string) => {
    try {
      setSelectedPostId(String(postId));
      setLoadComments(true);
    } catch {}
    onOpenComments(postId);
  };

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-2 text-sm font-medium text-blue transition hover:opacity-80"
      >
        <Image src={ArrowLeft} alt="back" width={20} height={20} />
        <span>Back</span>
      </button>

      <div className="border-b border-[#E8EDF0] pb-5">
        <div className="flex items-center gap-4">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-white"
            style={{ backgroundColor: safeCommunity.accentColor }}
          >
            {safeCommunity.avatarLabel}
          </div>

          <div>
            <h2 className="text-xl font-semibold text-black">
              {isLoading ? "Loading..." : safeCommunity.name}
            </h2>
          </div>
        </div>

        <p className="mt-2 text-gray">{safeCommunity.members} Members</p>
        <p className="mt-1 text-gray">{safeCommunity.description}</p>
      </div>

      {viewMode === "detail" ? (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_374px]">
          <div className="space-y-6">
            <CommunitySearchBar
              value={detailSearchValue}
              onChange={onDetailSearchChange}
              onSubmit={onDetailSearchSubmit}
              placeholder="Search chat, keyword"
              showActionButton
            />

            {isSearchResults ? (
              <h3 className="text-[30px] font-semibold text-[#20262D]">
                Search Results
              </h3>
            ) : null}

            {(postsLoading ? [] : posts).map((item) => (
              <CommunityFeedCard
                key={item.id}
                item={item}
                onOpenComments={handleOpenCommentsInternal}
              />
            ))}

            <hr className="my-5 mt-16 border-0 border-t border-[#E8EDF0]" />

            <CommunityComposer placeholder="Write a post..." communityId={community?.id} />
          </div>

          <CommunityDetailSidebar community={community} />
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_374px]">
          <div className="space-y-6">
            {selectedPost ? <CommunityFeedCard item={selectedPost} /> : null}
            <div>
              <h3 className="text-xl font-semibold text-black">
                Comments
              </h3>
            </div>
            {(commentsData ?? []).map((item: any) => (
              <CommunityFeedCard key={item.id} item={item} isComment />
            ))}
            <CommunityComposer placeholder="Write a comment..." isComment postId={selectedPost?.id ?? selectedPostId} />
          </div>

          <CommunityDetailSidebar community={community} />
        </div>
      )}
    </div>
  );
};

export default CommunityDetailView;
