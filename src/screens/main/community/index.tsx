"use client";

import { useEffect, useState } from "react";

import { useAuthStore } from "@spt/store/authStore";

import {
  type CommunityFilterValue,
  exploreCommunities,
  learnerJoinedCommunities,
  tutorCreatedCommunities,
} from "./communityData";
import { detailCommunity } from "./communityDetailData";
import {
  type PrimaryTab,
  type TutorTab,
  type ViewMode,
  primaryTabs,
} from "./communityPageTypes";
import CommunityDetailView from "./components/communityDetailView";
import CommunityFilterModal from "./components/communityFilterModal";
import CommunityListView from "./components/communityListView";
import CommunityTabs from "./components/communityTabs";

const CommunityPage = () => {
  const user = useAuthStore((state) => state.user);
  const isTutor = true;

  const [activePrimaryTab, setActivePrimaryTab] = useState<PrimaryTab>("explore");
  const [activeTutorTab, setActiveTutorTab] = useState<TutorTab>("joined");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [searchValue, setSearchValue] = useState("");
  const [detailSearchValue, setDetailSearchValue] = useState("");
  const [submittedDetailSearch, setSubmittedDetailSearch] = useState("");
  const [selectedFilter, setSelectedFilter] =
    useState<CommunityFilterValue>("all");
  const [draftFilter, setDraftFilter] = useState<CommunityFilterValue>("all");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  useEffect(() => {
    setViewMode("list");
    setSubmittedDetailSearch("");
    setDetailSearchValue("");
    setSelectedPostId(null);
  }, [activePrimaryTab, activeTutorTab]);

  const normalizedSearch = searchValue.trim().toLowerCase();
  const filteredExploreCommunities = exploreCommunities.filter((community) => {
    const matchesSearch =
      normalizedSearch.length === 0 ||
      community.name.toLowerCase().includes(normalizedSearch) ||
      community.description.toLowerCase().includes(normalizedSearch);

    const matchesFilter =
      selectedFilter === "all" || community.audience === selectedFilter;

    return matchesSearch && matchesFilter;
  });

  const myCommunities =
    activeTutorTab === "created" ? tutorCreatedCommunities : learnerJoinedCommunities;

  const filteredMyCommunities = myCommunities.filter((community) => {
    if (searchValue.trim().length === 0) {
      return true;
    }

    return (
      community.name.toLowerCase().includes(normalizedSearch) ||
      community.description.toLowerCase().includes(normalizedSearch)
    );
  });

  const detailFeed = detailCommunity.feed.filter((item) => {
    if (submittedDetailSearch.trim().length === 0) {
      return true;
    }

    const normalizedSubmittedSearch = submittedDetailSearch.trim().toLowerCase();

    return [
      item.author.name,
      item.content,
      item.title ?? "",
      item.tag ?? "",
      item.institution ?? "",
    ].some((value) => value.toLowerCase().includes(normalizedSubmittedSearch));
  });

  const selectedPost =
    detailCommunity.feed.find((item) => item.id === selectedPostId) ??
    detailCommunity.feed[0];

  const handleOpenCommunity = () => {
    setViewMode("detail");
    setSelectedPostId(null);
  };

  const handleBack = () => {
    if (viewMode === "comments") {
      setViewMode("detail");
      return;
    }

    setViewMode("list");
    setSubmittedDetailSearch("");
    setDetailSearchValue("");
    setSelectedPostId(null);
  };

  const handleApplyFilter = () => {
    setSelectedFilter(draftFilter);
    setIsFilterModalOpen(false);
  };

  const handleResetFilter = () => {
    setDraftFilter("all");
    setSelectedFilter("all");
    setIsFilterModalOpen(false);
  };

  const handleOpenComments = (postId: string) => {
    setSelectedPostId(postId);
    setViewMode("comments");
  };

  return (
    <>
      <section className="min-h-screen bg-[#FCFEFF] px-4 py-8 sm:px-6 lg:px-[74px] xl:px-[80px]">
        <div className="mx-auto max-w-[1400px]">
          <h1 className="text-[24px] font-semibold tracking-[-0.03em] text-[#20262D] md:text-[32px]">
            Community
          </h1>

          <div className="mt-6">
            <CommunityTabs
              tabs={primaryTabs}
              value={activePrimaryTab}
              onChange={setActivePrimaryTab}
            />
          </div>

          <div className="mt-8">
            {viewMode === "list" ? (
              <CommunityListView
                activePrimaryTab={activePrimaryTab}
                activeTutorTab={activeTutorTab}
                filteredExploreCommunities={filteredExploreCommunities}
                filteredMyCommunities={filteredMyCommunities}
                isTutor={isTutor}
                searchValue={searchValue}
                onSearchChange={setSearchValue}
                onTutorTabChange={setActiveTutorTab}
                onOpenFilter={() => {
                  setDraftFilter(selectedFilter);
                  setIsFilterModalOpen(true);
                }}
                onOpenCommunity={handleOpenCommunity}
              />
            ) : (
              <CommunityDetailView
                community={detailCommunity}
                detailFeed={detailFeed}
                detailSearchValue={detailSearchValue}
                selectedPost={selectedPost}
                submittedDetailSearch={submittedDetailSearch}
                viewMode={viewMode}
                onBack={handleBack}
                onDetailSearchChange={setDetailSearchValue}
                onDetailSearchSubmit={() =>
                  setSubmittedDetailSearch(detailSearchValue)
                }
                onOpenComments={handleOpenComments}
              />
            )}
          </div>
        </div>
      </section>

      <CommunityFilterModal
        open={isFilterModalOpen}
        selectedFilter={draftFilter}
        onClose={() => setIsFilterModalOpen(false)}
        onSelect={setDraftFilter}
        onApply={handleApplyFilter}
        onReset={handleResetFilter}
      />
    </>
  );
};

export default CommunityPage;
