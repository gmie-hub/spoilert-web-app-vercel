"use client";

import { useMemo } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import MyLearningEmptyState from "./components/MyLearningEmptyState";
import MyLearningList from "./components/MyLearningList";
import MyLearningLoadingState from "./components/MyLearningLoadingState";
import MyLearningTabs from "./components/MyLearningTabs";
import useMyLearningData from "./useMyLearningData";

import type { LearningItem, MyLearningTabKey } from "./types";

const getActiveTab = (tab: string | null): MyLearningTabKey =>
  tab === "completed" ? "completed" : "ongoing";

export default function MyLearningPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = getActiveTab(searchParams.get("tab"));
  const { ongoingItems, completedItems, isLoading, isError, errorMessage } =
    useMyLearningData();

  const activeItems = useMemo(
    () => (activeTab === "completed" ? completedItems : ongoingItems),
    [activeTab, completedItems, ongoingItems],
  );

  const handleTabChange = (tab: MyLearningTabKey) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.replace(`/my-learnings?${params.toString()}`, { scroll: false });
  };

  const handleCardAction = (item: LearningItem) => {
    if (activeTab === "completed") {
      router.push(`/my-learnings/certificate/${item.id}`);
      return;
    }

    router.push(`/spoil/${item.id}/start`);
  };

  return (
    <section className="min-h-screen bg-[#FAFAFA] px-4 py-8 sm:px-6 lg:px-20">
      <div className="mx-auto max-w-[1120px]">
        <h1 className="text-[40px] font-semibold tracking-[-0.03em] text-[#212529]">
          My Learnings
        </h1>

        <div className="mx-auto mt-10 max-w-[720px] rounded-[20px] border border-[#ECEFF2] bg-white shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
          <MyLearningTabs activeTab={activeTab} onChange={handleTabChange} />

          {isLoading ? <MyLearningLoadingState /> : null}

          {!isLoading && isError ? (
            <div className="p-6 text-sm text-red-600">{errorMessage}</div>
          ) : null}

          {!isLoading && !isError && activeItems.length > 0 ? (
            <MyLearningList
              items={activeItems}
              tab={activeTab}
              onAction={handleCardAction}
            />
          ) : null}

          {!isLoading && !isError && activeItems.length === 0 ? (
            <MyLearningEmptyState
              tab={activeTab}
              onExplore={() => router.push("/")}
            />
          ) : null}
        </div>
      </div>
    </section>
  );
}