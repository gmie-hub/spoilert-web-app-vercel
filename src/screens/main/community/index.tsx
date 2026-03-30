
"use client";

import { useEffect, useState } from "react";

import { useGetAllCommunitiesQuery } from "@spt/hooks/apiRequests/useGetAllCommunitiesQuery";
  import useGetCommunitiesCreatedByUserQuery from "@spt/hooks/apiRequests/useGetCommunitiesCreatedByUserQuery";
import useGetCommunityDetailQuery from "@spt/hooks/apiRequests/useGetCommunityDetailQuery";
import useGetUserCommunitiesQuery from "@spt/hooks/apiRequests/useGetUserCommunitiesQuery";
import { useAuthStore } from "@spt/store/authStore";

import { type CommunityFilterValue } from "./communityData";
// detailCommunity fixture removed — use live API data only
import {
  type PrimaryTab,
  type TutorTab,
  type ViewMode,
  primaryTabs,
  tutorTabs,
} from "./communityPageTypes";
import CommunityCard from "./components/communityCard";
import CommunityDetailView from "./components/communityDetailView";
import CommunityFilterModal from "./components/communityFilterModal";
import CommunityListView from "./components/communityListView";
import CommunitySearchBar from "./components/communitySearchBar";
import CommunityTabs from "./components/communityTabs";
import { mapToCard, mapToProfile } from "./mappers";

import type { CommunityCardItem, CommunityProfile } from "./communityTypes";

const CommunityPage = () => {
  // const user = useAuthStore((state) => state.user); // Unused
  const isTutor = true;

  const [activePrimaryTab, setActivePrimaryTab] = useState<PrimaryTab>(() => {
    try {
      if (typeof window === "undefined") return "explore" as PrimaryTab;
      const key = `community:activePrimaryTab:${window.location.pathname}`;
      const raw = localStorage.getItem(key);
      if (raw === "explore" || raw === "myCommunities") return raw as PrimaryTab;
    } catch  {
      // ignore
    }
    return "explore" as PrimaryTab;
  });
  const [activeTutorTab, setActiveTutorTab] = useState<TutorTab>(() => {
    try {
      if (typeof window === "undefined") return "joined" as TutorTab;
      const key = `community:activeTutorTab:${window.location.pathname}`;
      const raw = localStorage.getItem(key);
      if (raw === "joined" || raw === "created") return raw as TutorTab;
    } catch  {
      // ignore
    }
    return "joined" as TutorTab;
  });

  // persist tutor tab selection so refresh keeps the same sub-tab
  useEffect(() => {
    try {
      if (typeof window === "undefined") return;
      const key = `community:activeTutorTab:${window.location.pathname}`;
      localStorage.setItem(key, activeTutorTab);
    } catch  {
      // ignore
    }
  }, [activeTutorTab]);

  // persist primary tab selection so refresh keeps the same main tab
  useEffect(() => {
    try {
      if (typeof window === "undefined") return;
      const key = `community:activePrimaryTab:${window.location.pathname}`;
      localStorage.setItem(key, activePrimaryTab);
    } catch {
      // ignore
    }
  }, [activePrimaryTab]);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [searchValue, setSearchValue] = useState("");
  const [perPage, setPerPage] = useState<number>(20);
  const [detailSearchValue, setDetailSearchValue] = useState("");
  const [submittedDetailSearch, setSubmittedDetailSearch] = useState("");
  const [selectedFilter, setSelectedFilter] =
    useState<CommunityFilterValue>("all");
  const [draftFilter, setDraftFilter] = useState<CommunityFilterValue>("all");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [selectedCommunityId, setSelectedCommunityId] = useState<string | null>(null);

  useEffect(() => {
    setViewMode("list");
    setSubmittedDetailSearch("");
    setDetailSearchValue("");
    setSelectedPostId(null);
    setSelectedCommunityId(null);
    // Reset pagination when switching tabs
    setQueryParams((prev) => ({ ...prev, page: 1 }));
  }, [activePrimaryTab, activeTutorTab]);


  const [queryParams, setQueryParams] = useState<{
    page?: number;
    paid?: boolean;
    free?: boolean;
    search?: string;
    locked?: number | string | boolean;
  }>({});

  // Always keep searchValue in queryParams
  useEffect(() => {
    setQueryParams((prev) => ({
      ...prev,
      search: searchValue?.trim()?.length ? searchValue : undefined,
      page: prev.page, // preserve page if set
    }));
  }, [searchValue]);

  const {
    data: communitiesData,
    pagination: communitiesPagination,
    isLoading: communitiesLoading,
  } = useGetAllCommunitiesQuery({ ...queryParams, per_page: perPage }, activePrimaryTab === "explore");

  const rawCommunities: any[] = Array.isArray(communitiesData)
    ? communitiesData
    : // support paginated object { data: [...] } or the raw response
      (communitiesData ?? []);

  const fetchedExploreCommunities: CommunityCardItem[] = (rawCommunities ?? []).map(mapToCard);

  // Do not perform client-side filtering — backend handles search/filter/pagination.
  const filteredExploreCommunities = fetchedExploreCommunities;

  const user = useAuthStore((state) => state.user);

  const isViewingJoined = activePrimaryTab === "myCommunities" && activeTutorTab === "joined";
  const isViewingCreated = activePrimaryTab === "myCommunities" && activeTutorTab === "created";

  const {
    data: joinedData,
    pagination: joinedPagination,
    isLoading: joinedLoading,
  } = useGetUserCommunitiesQuery({ page: queryParams.page, per_page: perPage, search: queryParams.search }, isViewingJoined, true);

  const {
    data: createdData,
    pagination: createdPagination,
    isLoading: createdLoading,
  } = useGetCommunitiesCreatedByUserQuery({ user_id: user?.id, page: queryParams.page, per_page: perPage, search: queryParams.search }, isViewingCreated);

  const rawJoined: any[] = Array.isArray(joinedData) ? joinedData : (joinedData ?? []);
  const rawCreated: any[] = Array.isArray(createdData) ? createdData : (createdData ?? []);

  const fetchedJoinedCommunities: CommunityCardItem[] = (rawJoined ?? []).map(mapToCard);
  const fetchedCreatedCommunities: CommunityCardItem[] = (rawCreated ?? []).map(mapToCard);

  const filteredMyCommunities = isViewingJoined
    ? fetchedJoinedCommunities
    : isViewingCreated
      ? fetchedCreatedCommunities
      : fetchedExploreCommunities;

  // select active community profile (fetched or fallback static)
  const { data: fetchedCommunityDetail, isLoading: communityDetailLoading } = useGetCommunityDetailQuery(selectedCommunityId  || '', viewMode === "detail" && !!selectedCommunityId);

  useEffect(() => {
    if (fetchedCommunityDetail) {
      // Log raw API payload to help inspect structure during development
      // Remove or guard this in production
      // eslint-disable-next-line no-console
      console.debug("fetchedCommunityDetail:", fetchedCommunityDetail);
    }
  }, [fetchedCommunityDetail]);
  const activeCommunityProfile: CommunityProfile | null = mapToProfile(fetchedCommunityDetail, selectedCommunityId);

  const detailFeed = (activeCommunityProfile?.feed ?? []).filter((item) => {
    if (submittedDetailSearch.trim().length === 0) {
      return true;
    }

    const normalizedSubmittedSearch = submittedDetailSearch
      .trim()
      .toLowerCase();

    return [
      item.author.name,
      item.content,
      item.title ?? "",
      item.tag ?? "",
      item.institution ?? "",
    ].some((value) => value.toLowerCase().includes(normalizedSubmittedSearch));
  });

  const selectedPost =
    (activeCommunityProfile && activeCommunityProfile.feed ? activeCommunityProfile.feed.find((item) => item.id === selectedPostId) : undefined) ??
    (activeCommunityProfile && activeCommunityProfile.feed ? activeCommunityProfile.feed[0] : undefined);

  const handleOpenCommunity = (id: string) => {
    setSelectedCommunityId(id);
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
    setSelectedCommunityId(null);
  };

  const handleApplyFilter = () => {
    setSelectedFilter(draftFilter);

    const locked = draftFilter === "locked" ? 1 : undefined;
    const free = draftFilter === "free" ? true : undefined;

    setQueryParams((prev) => ({
      ...prev,
      search: searchValue?.trim()?.length ? searchValue : undefined,
      locked,
      free,
      page: 1,
    }));

    setIsFilterModalOpen(false);
  };

  // handle main search submit (button in `CommunitySearchBar` when `showActionButton=true`)
  const handleSearchSubmit = () => {
    setQueryParams((prev) => ({
      ...prev,
      search: searchValue?.trim()?.length ? searchValue : undefined,
      page: 1,
    }));
  };

  const handleResetFilter = () => {
    setDraftFilter("all");
    setSelectedFilter("all");
    setQueryParams({});
    setIsFilterModalOpen(false);
  };

  const handleOpenComments = (postId: string) => {
    setSelectedPostId(postId);
    setViewMode("comments");
  };

  

  const activePagination =
    activePrimaryTab === "myCommunities"
      ? activeTutorTab === "joined"
        ? joinedPagination
        : createdPagination
      : communitiesPagination;

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
                    Locked communities are exclusive to learners enrolled in their associated spoils. Enroll to gain access.
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
                  <div className="flex min-h-[200px] items-center justify-center">
                    <span className="text-gray text-lg font-medium">Loading communities...</span>
                  </div>
                ) : (
                  <div className="grid gap-10 sm:grid-cols-2 xl:grid-cols-4">
                    {filteredExploreCommunities.map((community) => (
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
                    onPerPageChange={(n) => {
                      setPerPage(n);
                      setQueryParams((prev) => ({ ...prev, page: 1 }));
                    }}
                  showTutorTabs={false}
                />
            ) : (
              <CommunityDetailView
                community={activeCommunityProfile as any}
                detailFeed={detailFeed}
                // show loading state while fetching detail
                isLoading={communityDetailLoading}
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
                isCreatorView={isViewingCreated}
              />
            )}
          </div>
          {viewMode === "list" && activePagination ? (
            <div className="mt-6 flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={() =>
                  setQueryParams((prev) => ({ ...prev, page: Math.max((prev.page ?? 1) - 1, 1) }))
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
                  setQueryParams((prev) => ({ ...prev, page: (prev.page ?? activePagination.current_page) + 1 }))
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
        onSearch={(term) => setSearchValue(term)}
      />
    </>
  );
};

export default CommunityPage;
