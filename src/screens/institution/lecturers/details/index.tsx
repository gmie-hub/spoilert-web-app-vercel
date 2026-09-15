"use client";

import { useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { MOCK_LECTURERS } from "../constants";

import DetailsOverview from "./components/DetailsOverview";
import EarningsTab from "./components/earnings/EarningsTab";
import RemoveLecturerModal from "./components/RemoveLecturerModal";
import SpoylzCreatedTab from "./components/spoylz/SpoylzCreatedTab";
import TransactionsTab from "./components/transactions/TransactionsTab";

const TABS = ["Lecturer Overview", "Spoylz Created", "Earnings", "Transactions"] as const;
type Tab = (typeof TABS)[number];

const LecturerDetails = ({ id }: { id: string }) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("Lecturer Overview");
  const [showRemoveModal, setShowRemoveModal] = useState(false);

  const lecturer = MOCK_LECTURERS.find((item) => item.id === id) ?? MOCK_LECTURERS[0];

  const handleConfirmRemove = () => {
    setShowRemoveModal(false);
    toast.success("Lecturer removed successfully");
    router.push("/institution/lecturers");
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center gap-2 text-sm">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-1.5 font-medium text-[var(--color-blue)]"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M15 6l-6 6 6 6" stroke="var(--color-blue)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Go Back
        </button>
        <span className="text-gray-300">|</span>
        <Link href="/institution/lecturers" className="font-medium text-[var(--color-blue)]">
          Lecturers
        </Link>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M9 6l6 6-6 6" stroke="#9CA3AF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="text-gray-400">View Lecturer Details</span>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold text-[#212529]">Lecturer Details</h1>
          <button
            type="button"
            onClick={() => setShowRemoveModal(true)}
            className="flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m-9 0 1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12"
                stroke="#DC3545"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Remove Lecturer
          </button>
        </div>

        <div className="mt-5 flex gap-6 overflow-x-auto border-b border-gray-100">
          {TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`shrink-0 border-b-2 pb-3 text-sm font-medium ${
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

      {activeTab === "Lecturer Overview" && <DetailsOverview lecturer={lecturer} />}
      {activeTab === "Spoylz Created" && <SpoylzCreatedTab />}
      {activeTab === "Earnings" && <EarningsTab />}
      {activeTab === "Transactions" && <TransactionsTab />}

      {showRemoveModal && (
        <RemoveLecturerModal
          onClose={() => setShowRemoveModal(false)}
          onConfirm={handleConfirmRemove}
        />
      )}
    </div>
  );
};

export default LecturerDetails;
