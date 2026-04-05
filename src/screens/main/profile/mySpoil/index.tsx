"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import NoData from "@spt/components/noData";
import { useGetAllSpoilsQuery } from "@spt/hooks/apiRequests/useGetAllSpoilsQuery";
import { useAuthStore } from "@spt/store/authStore";

import { mySpoilsTabOptions } from "../profileData";

import MySpoilsCard from "./components/mySpoilsCard";
import MySpoilsSearchBar from "./components/mySpoilsSearchBar";

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
  const user = useAuthStore((state) => state.user);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const deferredSearchValue = useDeferredValue(searchValue);

  const queryParams = useMemo(() => {
    switch (activeTab) {
      case "published":
        return { visibility: "published", tutor_id: user?.id ?? null };
      case "unpublished":
        return { upcoming: true, tutor_id: user?.id ?? null };
      case "drafts":
        return { is_draft: true, tutor_id: user?.id ?? null, status: 0 };
      default:
        return { tutor_id: user?.id ?? null };
    }
  }, [activeTab, user?.id]);

  const { data, isLoading, isError, errorMessage } =
    useGetAllSpoilsQuery(queryParams, Boolean(hasHydrated) && Boolean(user?.id));
  const spoils = data?.data?.data ?? [];
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

  const router = useRouter();

  return (
    <div>
      <h2 className="text-lg font-semibold text-black">My Spoils</h2>

      <div className="mt-5 border-b border-[#E9EEF2]">
        <div className="flex gap-3 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTab;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`relative min-w-[140px] pb-3 text-sm font-medium transition ${
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
        {isLoading ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={`spoil-skeleton-${index}`}
                className="h-[156px] animate-pulse rounded-[18px] border border-[#F1F4F7] bg-[#F7FAFC]"
              />
            ))}
          </div>
        ) : isError ? (
          <div className="flex min-h-[420px] items-center justify-center px-4 py-10 text-center">
            <p className="text-sm text-[#D92D20]">{errorMessage}</p>
          </div>
        ) : filteredSpoils.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {filteredSpoils.map((spoil) => (
              <MySpoilsCard
                key={spoil.id}
                spoil={spoil}
                activeTab={activeTab}
              />
            ))}
          </div>
        ) : searchValue.trim() ? (
          <div className="flex min-h-[420px] items-center justify-center px-4 py-10 text-center">
            <NoData
              heading="No Spoil Found"
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
                  Create Spoil
                </button>
              </div>
            </NoData>
          </div>
        )}
      </div>
    </div>
  );
};

export default MySpoilsSection;
