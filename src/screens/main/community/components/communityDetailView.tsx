"use client";

import Image from "next/image";

import ArrowLeft from "@spt/assets/icons/arrow-left.svg";

import CommunityComposer from "./communityComposer";
import CommunityDetailSidebar from "./communityDetailSidebar";
import CommunityFeedCard from "./communityFeedCard";
import CommunitySearchBar from "./communitySearchBar";

import type { ViewMode } from "../communityPageTypes";
import type { CommunityFeedItem, CommunityProfile } from "../communityTypes";

interface CommunityDetailViewProps {
  community: CommunityProfile;
  detailFeed: CommunityFeedItem[];
  detailSearchValue: string;
  selectedPost: CommunityFeedItem;
  submittedDetailSearch: string;
  viewMode: ViewMode;
  onBack: () => void;
  onDetailSearchChange: (value: string) => void;
  onDetailSearchSubmit: () => void;
  onOpenComments: (postId: string) => void;
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
}: CommunityDetailViewProps) => {
  const isSearchResults = submittedDetailSearch.trim().length > 0;

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
            style={{ backgroundColor: community.accentColor }}
          >
            {community.avatarLabel}
          </div>

          <div>
            <h2 className="text-xl font-semibold text-black">
              {community.name}
            </h2>
          </div>
        </div>

        <p className="mt-2 text-gray">{community.members} Members</p>
        <p className="mt-1 text-gray">{community.description}</p>
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

            {detailFeed.map((item) => (
              <CommunityFeedCard
                key={item.id}
                item={item}
                onOpenComments={onOpenComments}
              />
            ))}

            <hr className="my-5 mt-16 border-0 border-t border-[#E8EDF0]" />

            <CommunityComposer placeholder="Write a post..." />
          </div>

          <CommunityDetailSidebar community={community} />
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_374px]">
          <div className="space-y-6">
            <CommunityFeedCard item={selectedPost} />
            <div>
              <h3 className="text-xl font-semibold text-black">
                Comments
              </h3>
            </div>
            {community.comments.map((item) => (
              <CommunityFeedCard key={item.id} item={item} />
            ))}
            <CommunityComposer placeholder="Write a comment..." />
          </div>

          <CommunityDetailSidebar community={community} />
        </div>
      )}
    </div>
  );
};

export default CommunityDetailView;
