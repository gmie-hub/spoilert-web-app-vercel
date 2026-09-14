"use client";

import { useEffect, useState } from "react";

import Link from "next/link";
import toast from "react-hot-toast";

import { MOCK_SPOYLZ_MANAGEMENT } from "../constants";

import EnrolledStudentsTab from "./components/EnrolledStudentsTab";
import SpoylzMetricsTab from "./components/SpoylzMetricsTab";
import SpoylzOutlineTab from "./components/SpoylzOutlineTab";
import SpoylzOverviewTab from "./components/SpoylzOverviewTab";
import SpoylzQuizLeaderboardTab from "./components/SpoylzQuizLeaderboardTab";
import SpoylzReviewsTab from "./components/SpoylzReviewsTab";
import SpoylzStatusModal, { type SpoylzStatusAction } from "./components/SpoylzStatusModal";

const TABS = [
  "Spoylz Overview",
  "Spoylz Outline",
  "Spoylz Quiz & Leaderboard",
  "Spoylz Reviews",
  "Enrolled Students",
  "Spoylz Metrics",
] as const;
type Tab = (typeof TABS)[number];

const SpoylzManagementDetails = ({ id }: { id: string }) => {
  const [activeTab, setActiveTab] = useState<Tab>("Spoylz Overview");
  const [statusModalAction, setStatusModalAction] = useState<SpoylzStatusAction | null>(null);
  const [isDisabled, setIsDisabled] = useState(false);

  const item = MOCK_SPOYLZ_MANAGEMENT.find((entry) => entry.id === id) ?? MOCK_SPOYLZ_MANAGEMENT[0];
  const displayItem = { ...item, status: isDisabled ? ("Disabled" as const) : item.status };

  // Simple Spoylz don't have a quiz component, so the tab is hidden for them.
  const visibleTabs = TABS.filter((tab) => tab !== "Spoylz Quiz & Leaderboard" || item.type !== "Simple");

  useEffect(() => {
    if (!visibleTabs.includes(activeTab)) {
      setActiveTab("Spoylz Overview");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.id]);

  const handleConfirmStatusChange = () => {
    const nextDisabled = statusModalAction === "disable";
    setStatusModalAction(null);
    setIsDisabled(nextDisabled);
    toast.success(nextDisabled ? "Spoylz disabled successfully" : "Spoylz enabled successfully");
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center gap-2 text-sm">
        <Link href="/institution/spoylz-management" className="flex items-center gap-1.5 font-medium text-[var(--color-blue)]">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M15 6l-6 6 6 6" stroke="var(--color-blue)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Go Back
        </Link>
        <span className="text-gray-300">|</span>
        <Link href="/institution/spoylz-management" className="font-medium text-[var(--color-blue)]">
          Spoylz Management
        </Link>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M9 6l6 6-6 6" stroke="#9CA3AF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="text-gray-400">View Spoylz Details</span>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold text-[#212529]">Spoylz Details</h1>
          {isDisabled ? (
            <button
              type="button"
              onClick={() => setStatusModalAction("enable")}
              className="flex items-center gap-2 rounded-lg border border-green-200 px-4 py-2 text-sm font-medium text-green-600"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="12" r="9.3" stroke="#28A745" strokeWidth="1.5" />
                <path d="M8 12.3l2.6 2.6L16.2 9" stroke="#28A745" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Enable Spoylz
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setStatusModalAction("disable")}
              className="flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M10.3 3.9 2.6 17a2 2 0 0 0 1.7 3h15.4a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"
                  stroke="#DC3545"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                <path d="M12 9.5v4.2" stroke="#DC3545" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
              Disable Spoylz
            </button>
          )}
        </div>

        <div className="mt-5 flex gap-6 overflow-x-auto border-b border-gray-100">
          {visibleTabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`shrink-0 whitespace-nowrap border-b-2 pb-3 text-sm font-medium ${
                activeTab === tab
                  ? "border-[var(--color-blue)] text-[var(--color-blue)]"
                  : "border-transparent text-gray-400"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "Spoylz Overview" && <SpoylzOverviewTab item={displayItem} />}
      {activeTab === "Spoylz Outline" && <SpoylzOutlineTab />}
      {activeTab === "Spoylz Quiz & Leaderboard" && <SpoylzQuizLeaderboardTab />}
      {activeTab === "Spoylz Reviews" && <SpoylzReviewsTab />}
      {activeTab === "Enrolled Students" && <EnrolledStudentsTab simplified={item.type === "Simple"} />}
      {activeTab === "Spoylz Metrics" && <SpoylzMetricsTab />}

      {statusModalAction && (
        <SpoylzStatusModal
          action={statusModalAction}
          onClose={() => setStatusModalAction(null)}
          onConfirm={handleConfirmStatusChange}
        />
      )}
    </div>
  );
};

export default SpoylzManagementDetails;
