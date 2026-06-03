"use client";

import { useDeferredValue, useMemo, useState } from "react";

import { useRouter } from "next/navigation";

import NoData from "@spt/components/noData";
import { useGetAllSpoilsQuery } from "@spt/hooks/apiRequests/useGetAllSpoilsQuery";
import { useAuthStore } from "@spt/store/authStore";
import type { SpoilDatum } from "@spt/utils/spoils";

import { ErrorState } from "../../home/spoilDetails/spoilDetails";
import { LoadingState } from "../../spoil/preSpoilQuiz/components/LoadingState";
import { mySpoilsTabOptions } from "../profileData";

import MySpoilDetailView from "./components/MySpoilDetailView";
import MySpoilsCard from "./components/mySpoilsCard";
import MySpoilsSearchBar from "./components/mySpoilsSearchBar";
import RepublishSpoilModal from "./components/RepublishSpoilModal";
import RepublishSuccessModal from "./components/RepublishSuccessModal";
import useRepublishSpoil from "./hooks/useRepublishSpoil";

import type { MySpoilTabId, MySpoilTabOption } from "../types";

interface MySpoilsSectionProps {
  initialTab?: MySpoilTabId;
  tabs?: MySpoilTabOption[];
}

const MySpoilsSection = ({
  initialTab = "published",
  tabs = mySpoilsTabOptions,
}: MySpoilsSectionProps) => {
  const [activeTab, setActiveTab] = useState<MySpoilTabId>(initialTab);
  const [searchValue, setSearchValue] = useState("");
  const [selectedSpoil, setSelectedSpoil] = useState<SpoilDatum | null>(null);
  const [republishSpoil_, setRepublishSpoil] = useState<SpoilDatum | null>(null);
  const [successSpoil, setSuccessSpoil] = useState<SpoilDatum | null>(null);
  const user = useAuthStore((state) => state.user);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const deferredSearchValue = useDeferredValue(searchValue);
  const { republishSpoil, isRepublishing } = useRepublishSpoil();

  const queryParams = useMemo(() => {
    switch (activeTab) {
      case "published":
        return { visibility: "published", tutor_id: user?.id ?? null };
      case "unpublished":
        return { status: 0, tutor_id: user?.id ?? null };
      case "drafts":
        return { is_draft: true, tutor_id: user?.id ?? null, status: 0 };
      default:
        return { tutor_id: user?.id ?? null };
    }
  }, [activeTab, user?.id]);

  const { data, isLoading, isError, errorMessage } =
    useGetAllSpoilsQuery(queryParams, Boolean(hasHydrated) && Boolean(user?.id));
  const spoils = useMemo(() => data?.data?.data ?? [], [data?.data?.data]);
  // Published renders compact cards (2-up, 3-up on very wide screens); drafts &
  // unpublished render large hero cards whose fixed-size action buttons overflow
  // when squeezed into a half-column, so they keep the full width on every size.
  const resultsLayoutClass =
    activeTab === "published"
      ? "grid-cols-1 md:grid-cols-2 2xl:grid-cols-3"
      : "grid-cols-1";
  const filteredSpoils = useMemo(() => {
    const normalizedSearch = deferredSearchValue.trim().toLowerCase();

    if (!normalizedSearch) {
      return spoils;
    }

    return spoils.filter((spoil) => {
      const searchableValues = [
        spoil.title,
        spoil.institution,
        spoil.category?.name,
        spoil.tutor?.first_name,
        spoil.tutor?.last_name,
      ].filter((value): value is string => Boolean(value));

      return searchableValues.some((value) =>
        value.toLowerCase().includes(normalizedSearch),
      );
    });
  }, [deferredSearchValue, spoils]);

  const handleRepublishClick = (spoil: SpoilDatum) => {
    setRepublishSpoil(spoil);
  };

  const handleRepublishConfirm = async () => {
    if (!republishSpoil_) {
      return;
    }

    try {
      await republishSpoil(republishSpoil_.id);
      setSuccessSpoil(republishSpoil_);
      setRepublishSpoil(null);
    } catch {
      // mutation hook already shows feedback and keeps the modal open
    }
  };

  const handleCloseRepublishModal = () => {
    if (isRepublishing) {
      return;
    }

    setRepublishSpoil(null);
  };

  const router = useRouter();

  // Show detail view when a spoil is selected
  if (selectedSpoil) {
    return (
      <MySpoilDetailView
        spoilId={selectedSpoil.id}
        onBack={() => setSelectedSpoil(null)}
      />
    );
  }

  if (isLoading) {
    return <LoadingState />;
  }

  if (isError) {
    return <ErrorState message={errorMessage} />;
  }

  return (
    <div>
      <h2 className="text-lg font-semibold text-black">My Spoylz</h2>

      <div className="mt-5 border-b border-[#E9EEF2]">
        <div className="flex gap-3 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTab;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`cursor-pointer relative min-w-[140px] pb-3 text-sm font-medium transition ${
                  isActive
                    ? "text-[#0B5368]"
                    : "text-[#8A98A3] hover:text-[#20262D]"
                }`}
              >
                {tab.label}
                <span
                  className={`absolute inset-x-0 bottom-[-1px] h-0.5 rounded-full transition ${
                    isActive ? "bg-[#0B5368]" : "bg-transparent"
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>

      <MySpoilsSearchBar value={searchValue} onChange={setSearchValue} />

      <div className="mt-5 min-h-[420px]">
        {filteredSpoils.length > 0 ? (
          <div className={`grid gap-5 ${resultsLayoutClass}`}>
            {filteredSpoils.map((spoil) => (
              <MySpoilsCard
                key={spoil.id}
                spoil={spoil}
                activeTab={activeTab}
                onRepublish={handleRepublishClick}
                onCardClick={setSelectedSpoil}
              />
            ))}
          </div>
        ) : searchValue.trim() ? (
          <div className="flex min-h-[420px] items-center justify-center px-4 py-10 text-center">
            <NoData
              heading="No Spoylz Found"
              description="Try a different search term to find the spoil you are looking for."
            />
          </div>
        ) : (
          <div className="flex min-h-[420px] items-center justify-center px-4 py-10 text-center">
            <NoData
              heading="You Haven't Created Any Spoil Yet"
              description="Start your journey as a tutor by creating your first Spoil."
            >
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() => router.push("/create-spoils")}
                  className="mt-2 inline-flex w-full items-center justify-center rounded-[12px] bg-[#0B5368] px-6 py-3 text-sm font-semibold text-white shadow-[0_14px_32px_rgba(11,83,104,0.18)] transition hover:bg-[#09485A]"
                >
                  Create Spoylz
                </button>
              </div>
            </NoData>
          </div>
        )}
      </div>

      <RepublishSpoilModal
        open={Boolean(republishSpoil_)}
        onClose={handleCloseRepublishModal}
        onConfirm={handleRepublishConfirm}
        isLoading={isRepublishing}
      />

      <RepublishSuccessModal
        open={Boolean(successSpoil)}
        onClose={() => setSuccessSpoil(null)}
      />
    </div>
  );
};

export default MySpoilsSection;
