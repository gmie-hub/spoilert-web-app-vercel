
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
import CommunityPageView from "./CommunityPageView";
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
    <CommunityPageView
      primaryTabs={primaryTabs}
      tutorTabs={tutorTabs}
      activePrimaryTab={activePrimaryTab}
      setActivePrimaryTab={setActivePrimaryTab}
      activeTutorTab={activeTutorTab}
      setActiveTutorTab={setActiveTutorTab}
      viewMode={viewMode}
      setViewMode={setViewMode}
      searchValue={searchValue}
      setSearchValue={setSearchValue}
      perPage={perPage}
      setPerPage={setPerPage}
      detailSearchValue={detailSearchValue}
      submittedDetailSearch={submittedDetailSearch}
      selectedFilter={selectedFilter}
      draftFilter={draftFilter}
      isFilterModalOpen={isFilterModalOpen}
      setIsFilterModalOpen={setIsFilterModalOpen}
      selectedPostId={selectedPostId}
      selectedCommunityId={selectedCommunityId}
      communitiesLoading={communitiesLoading}
      filteredExploreCommunities={filteredExploreCommunities}
      filteredMyCommunities={filteredMyCommunities}
      isTutor={isTutor}
      communityDetailLoading={communityDetailLoading}
      activeCommunityProfile={activeCommunityProfile}
      detailFeed={detailFeed}
      selectedPost={selectedPost}
      handleOpenCommunity={handleOpenCommunity}
      handleBack={handleBack}
      handleOpenComments={handleOpenComments}
      handleSearchSubmit={handleSearchSubmit}
      handleApplyFilter={handleApplyFilter}
      handleResetFilter={handleResetFilter}
      setDraftFilter={setDraftFilter}
      setQueryParams={setQueryParams}
      activePagination={activePagination}
      joinedLoading={joinedLoading}
      createdLoading={createdLoading}
      fetchedExploreCommunities={fetchedExploreCommunities}
    />
  );
};

export default CommunityPage;
