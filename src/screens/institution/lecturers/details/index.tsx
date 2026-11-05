"use client";

import { useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import useGetLecturersQuery from "@spt/hooks/apiRequests/useGetLecturersQuery";

import DetailsOverview from "./components/DetailsOverview";
import EarningsTab from "./components/earnings/EarningsTab";
import SpoylzCreatedTab from "./components/spoylz/SpoylzCreatedTab";
import TransactionsTab from "./components/transactions/TransactionsTab";

const TABS = ["Lecturer Overview", "Spoylz Created", "Earnings", "Transactions"] as const;
type Tab = (typeof TABS)[number];

const LecturerDetails = ({ id }: { id: string }) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("Lecturer Overview");

  const { lecturers, isLoading, isError, errorMessage } = useGetLecturersQuery();
  const lecturer = lecturers.find((item) => item.id === id);

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

      {isLoading ? (
        <div className="space-y-4">
          <div className="h-[120px] animate-pulse rounded-2xl bg-[#F3F4F6]" />
          <div className="h-[400px] animate-pulse rounded-2xl bg-[#F3F4F6]" />
        </div>
      ) : !lecturer ? (
        <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center">
          <h1 className="text-2xl font-semibold text-[#212529]">Lecturer Details</h1>
          <p className={`mt-3 text-sm ${isError ? "text-red-600" : "text-gray-400"}`}>
            {isError
              ? errorMessage
              : "We couldn’t find this lecturer. They may have been removed from your institution."}
          </p>
          <Link
            href="/institution/lecturers"
            className="mt-6 inline-block rounded-lg border border-[var(--color-blue)] px-4 py-2 text-sm font-medium text-[var(--color-blue)]"
          >
            Back to Lecturers
          </Link>
        </div>
      ) : (
        <>
          <div className="rounded-2xl border border-gray-100 bg-white p-6 sm:p-8">
            <h1 className="text-2xl font-semibold text-[#212529]">Lecturer Details</h1>

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
          {activeTab === "Spoylz Created" && <SpoylzCreatedTab lecturer={lecturer} />}
          {activeTab === "Earnings" && <EarningsTab lecturer={lecturer} />}
          {activeTab === "Transactions" && <TransactionsTab lecturer={lecturer} />}
        </>
      )}
    </div>
  );
};

export default LecturerDetails;
