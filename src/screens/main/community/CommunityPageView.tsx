"use client";

import { useEffect, useRef } from "react";

import { ErrorState } from "../home/spoilDetails/spoilDetails";
import { LoadingState } from "../spoil/preSpoilQuiz/components/LoadingState";

import CommunityCard from "./components/communityCard";
import CommunityDetailView from "./components/communityDetailView";
import CommunityFilterModal from "./components/communityFilterModal";
import CommunityListView from "./components/communityListView";
import CommunitySearchBar from "./components/communitySearchBar";
import CommunityTabs from "./components/communityTabs";

import type { CommunityCardItem, CommunityProfile } from "./communityTypes";

type Props = {
  primaryTabs: any;
  tutorTabs: any;
} & any;

const CommunityPageView = (props: Props) => {
  const {
    primaryTabs,
    tutorTabs,
    activePrimaryTab,
    setActivePrimaryTab,
    activeTutorTab,
    setActiveTutorTab,
    viewMode,
    searchValue,
    setSearchValue,
    perPage,
    setPerPage,
    detailSearchValue,
    submittedDetailSearch,
    selectedFilter,
    draftFilter,
    isFilterModalOpen,
    setIsFilterModalOpen,
    communitiesLoading,
    filteredExploreCommunities,
    filteredMyCommunities,
    isTutor,
    communityDetailLoading,
    activeCommunityProfile,
    detailFeed,
    selectedPost,
    handleOpenCommunity,
    handleBack,
    handleOpenComments,
    handleSearchSubmit,
    handleApplyFilter,
    handleResetFilter,
    setDraftFilter,
    setQueryParams,
    activePagination,
    joinedLoading,
    createdLoading,
    fetchedExploreCommunities,
    activeIsError,
    activeErrorMessage,
    fetchNextJoinedPage,
    hasNextJoinedPage,
    isFetchingNextJoinedPage,
  } = props;

  const sentinelRef = useRef<HTMLDivElement>(null);
  const isViewingJoined =
    activePrimaryTab === "myCommunities" && activeTutorTab === "joined";

  useEffect(() => {
    if (!isViewingJoined || !hasNextJoinedPage) return;
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextJoinedPage && !isFetchingNextJoinedPage) {
          fetchNextJoinedPage();
        }
      },
      { rootMargin: "120px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [isViewingJoined, hasNextJoinedPage, isFetchingNextJoinedPage, fetchNextJoinedPage]);

  if (activeIsError) {
    return <ErrorState message={activeErrorMessage} />;
  }

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
            {activePrimaryTab === "myCommunities" ? (
              <div className="mt-4">
                <CommunityTabs
                  tabs={tutorTabs}
                  value={activeTutorTab}
                  onChange={setActiveTutorTab}
                  variant="pill"
                />
              </div>
            ) : null}
          </div>

          <div className="mt-8">
            {viewMode === "list" && activePrimaryTab === "explore" ? (
              <div className="space-y-6">
                <div className="flex items-start gap-2 rounded-xl border border-[#B8E3F8] bg-[#EAF7FF] px-4 py-2 text-sm text-black">
                  <span className="inline-block mr-2 align-middle">
                    <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><circle cx="10" cy="10" r="10" fill="#B8E3F8"/><text x="10" y="15" textAnchor="middle" fill="#0B5368" fontSize="12" fontFamily="Arial" dy="-2">i</text></svg>
                  </span>
                  <p>
                    Locked communities are exclusive to learners enrolled in their associated spoylz. Enroll to gain access.
                  </p>
                </div>
                <div className="max-w-[520px] relative">
                  <CommunitySearchBar
                    value={searchValue}
                    onChange={setSearchValue}
                    placeholder="Search for a community.."
                    onFilterClick={() => {
                      setDraftFilter(selectedFilter);
                      setIsFilterModalOpen(true);
                    }}
                  />
                </div>
                {communitiesLoading ? (
                  <LoadingState />
                ) : (
                  <div className="grid gap-10 sm:grid-cols-2 xl:grid-cols-4">
                    {filteredExploreCommunities.map((community: CommunityCardItem) => (
                      <CommunityCard
                        key={community.id}
                        community={community}
                        variant="explore"
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : viewMode === "list" ? (
                <CommunityListView
                  activePrimaryTab={activePrimaryTab}
                  activeTutorTab={activeTutorTab}
                  filteredExploreCommunities={filteredExploreCommunities}
                  filteredMyCommunities={filteredMyCommunities}
                  isTutor={isTutor}
                  searchValue={searchValue}
                  onSearchChange={setSearchValue}
                  onSearchSubmit={handleSearchSubmit}
                  onTutorTabChange={setActiveTutorTab}
                  onOpenFilter={() => {
                    setDraftFilter(selectedFilter);
                    setIsFilterModalOpen(true);
                  }}
                  onOpenCommunity={handleOpenCommunity}
                  isLoading={
                    activePrimaryTab === "myCommunities" && activeTutorTab === "joined"
                      ? joinedLoading
                      : activePrimaryTab === "myCommunities" && activeTutorTab === "created"
                        ? createdLoading
                        : communitiesLoading
                  }
                  perPage={perPage}
                  onPerPageChange={(n: number) => {
                    setPerPage(n);
                    setQueryParams((prev: any) => ({ ...prev, page: 1 }));
                  }}
                showTutorTabs={false}
                />
            ) : (
              <CommunityDetailView
                community={activeCommunityProfile as CommunityProfile}
                detailFeed={detailFeed}
                isLoading={communityDetailLoading}
                detailSearchValue={detailSearchValue}
                selectedPost={selectedPost}
                submittedDetailSearch={submittedDetailSearch}
                viewMode={viewMode}
                onBack={handleBack}
                onDetailSearchChange={() => { /* noop, handled upstream */ }}
                onDetailSearchSubmit={() => { /* noop, handled upstream */ }}
                onOpenComments={handleOpenComments}
                isCreatorView={activeTutorTab === "created"}
              />
            )}
          </div>
          {viewMode === "list" && isViewingJoined ? (
            <>
              <div ref={sentinelRef} className="h-1" />
              {isFetchingNextJoinedPage && (
                <div className="flex justify-center py-4">
                  <span className="text-sm text-gray animate-pulse">Loading more...</span>
                </div>
              )}
              {!hasNextJoinedPage && !joinedLoading && (
                <p className="mt-4 text-center text-xs text-gray">
                  You&apos;ve reached the end
                </p>
              )}
            </>
          ) : viewMode === "list" && activePagination ? (
            <div className="mt-6 flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={() =>
                  setQueryParams((prev: any) => ({ ...prev, page: Math.max((prev.page ?? 1) - 1, 1) }))
                }
                disabled={!activePagination?.prev_page_url}
                className="rounded border px-3 py-1 text-sm"
              >
                Prev
              </button>

              <span className="text-sm text-gray">
                Page {activePagination.current_page} of {activePagination.last_page}
              </span>

              <button
                type="button"
                onClick={() =>
                  setQueryParams((prev: any) => ({ ...prev, page: (prev.page ?? activePagination.current_page) + 1 }))
                }
                disabled={!activePagination?.next_page_url}
                className="rounded border px-3 py-1 text-sm"
              >
                Next
              </button>
            </div>
          ) : null}
        </div>
      </section>
      <CommunityFilterModal
        open={isFilterModalOpen}
        selectedFilter={draftFilter}
        onClose={() => setIsFilterModalOpen(false)}
        onSelect={setDraftFilter}
        onApply={handleApplyFilter}
        onReset={handleResetFilter}
        communities={fetchedExploreCommunities}
        onSearch={(term: string) => setSearchValue(term)}
      />
    </>
  );
};

export default CommunityPageView;
