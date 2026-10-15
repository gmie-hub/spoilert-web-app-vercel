"use client";

import { useState } from "react";

import Link from "next/link";

import useGetLecturersQuery from "@spt/hooks/apiRequests/useGetLecturersQuery";
import useGetSpoilDetailsQuery from "@spt/hooks/apiRequests/useGetSpoilDetailsQuery";
import useToggleSpoilStatusMutation from "@spt/hooks/apiRequests/useToggleSpoilStatusMutation";

import { findLecturer, isSpoylzDisabled } from "../mappers";

import EnrolledStudentsTab from "./components/EnrolledStudentsTab";
import EditSpoylzModal from "./components/modals/EditSpoylzModal";
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
  const [isEditOpen, setIsEditOpen] = useState(false);

  const { data: spoil, isLoading, isError, errorMessage } = useGetSpoilDetailsQuery(id);
  const { lecturers } = useGetLecturersQuery();
  const { toggleSpoilStatus, isToggling } = useToggleSpoilStatusMutation();

  const isDisabled = isSpoylzDisabled(spoil?.is_active);
  const isSimple = spoil?.type?.toLowerCase() === "simple";
  // Simple Spoylz don't have a quiz component, so the tab is hidden for them.
  const visibleTabs = TABS.filter((tab) => tab !== "Spoylz Quiz & Leaderboard" || !isSimple);
  const currentTab = visibleTabs.includes(activeTab) ? activeTab : "Spoylz Overview";

  const handleConfirmStatusChange = async () => {
    try {
      await toggleSpoilStatus({ id, isActive: statusModalAction === "enable" });
      setStatusModalAction(null);
    } catch {
      // The mutation has already shown the error.
    }
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
          {spoil && (
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setIsEditOpen(true)}
                className="flex items-center gap-2 rounded-lg border border-[var(--color-blue)] px-4 py-2 text-sm font-medium text-[var(--color-blue)]"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M4 20h4L18.5 9.5a2.1 2.1 0 0 0-3-3L5 17v3Z"
                    stroke="var(--color-blue)"
                    strokeWidth="1.6"
                    strokeLinejoin="round"
                  />
                  <path d="M13.5 8.5l3 3" stroke="var(--color-blue)" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
                Edit Spoylz
              </button>
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
          )}
        </div>

        {spoil && (
          <div className="mt-5 flex gap-6 overflow-x-auto border-b border-gray-100">
            {visibleTabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`shrink-0 whitespace-nowrap border-b-2 pb-3 text-sm font-medium ${
                  currentTab === tab
                    ? "border-[var(--color-blue)] text-[var(--color-blue)]"
                    : "border-transparent text-gray-400"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="h-[420px] animate-pulse rounded-2xl bg-[#F3F4F6]" />
      ) : !spoil ? (
        <div className="rounded-2xl border border-gray-100 bg-white p-6 text-sm text-red-600 sm:p-8">
          {isError ? errorMessage : "This Spoylz could not be found."}
        </div>
      ) : (
        <>
          {currentTab === "Spoylz Overview" && (
            <SpoylzOverviewTab spoil={spoil} lecturer={findLecturer(lecturers, spoil.tutor_id)} />
          )}
          {currentTab === "Spoylz Outline" && <SpoylzOutlineTab spoil={spoil} />}
          {currentTab === "Spoylz Quiz & Leaderboard" && <SpoylzQuizLeaderboardTab spoil={spoil} />}
          {currentTab === "Spoylz Reviews" && <SpoylzReviewsTab spoilId={spoil.id} />}
          {currentTab === "Enrolled Students" && <EnrolledStudentsTab spoilId={spoil.id} simplified={isSimple} />}
          {currentTab === "Spoylz Metrics" && <SpoylzMetricsTab spoil={spoil} />}
        </>
      )}

      {statusModalAction && (
        <SpoylzStatusModal
          action={statusModalAction}
          isLoading={isToggling}
          onClose={() => setStatusModalAction(null)}
          onConfirm={handleConfirmStatusChange}
        />
      )}

      {isEditOpen && spoil && <EditSpoylzModal spoil={spoil} onClose={() => setIsEditOpen(false)} />}
    </div>
  );
};

export default SpoylzManagementDetails;
