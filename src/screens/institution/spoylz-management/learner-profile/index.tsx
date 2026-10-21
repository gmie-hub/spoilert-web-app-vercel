"use client";

import Link from "next/link";

import useGetUserDetailsQuery from "@spt/hooks/apiRequests/useGetUserDetailsQuery";

import LearnerOverviewTab from "./components/LearnerOverviewTab";
import { toLearnerProfile } from "./mappers";

const ChevronRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M9 6l6 6-6 6" stroke="#9CA3AF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// A learner enrolled on one of the institution's Spoylz, opened from their
// progress on it.
const LearnerProfile = ({ spoilId, learnerId }: { spoilId: string; learnerId: string }) => {
  const { user, isLoading, isError, errorMessage } = useGetUserDetailsQuery(learnerId);
  const profile = user ? toLearnerProfile(user) : null;

  const enrolledStudentsHref = `/institution/spoylz-management/${spoilId}?tab=enrolled-students`;
  // Straight back to this learner's progress, where the profile was opened.
  const backHref = `${enrolledStudentsHref}&learner=${learnerId}`;

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <Link href={backHref} className="flex items-center gap-1.5 font-medium text-[var(--color-blue)]">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M15 6l-6 6 6 6" stroke="var(--color-blue)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Go Back
        </Link>
        <span className="text-gray-300">|</span>
        <Link href="/institution/spoylz-management" className="font-medium text-[var(--color-blue)]">
          Spoylz Management
        </Link>
        <ChevronRight />
        <Link href={enrolledStudentsHref} className="font-medium text-[var(--color-blue)]">
          View Spoylz Details
        </Link>
        <ChevronRight />
        <span className="text-gray-400">View Learner&rsquo;s Profile</span>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <div className="h-[120px] animate-pulse rounded-2xl bg-[#F3F4F6]" />
          <div className="h-[400px] animate-pulse rounded-2xl bg-[#F3F4F6]" />
        </div>
      ) : !profile ? (
        <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center">
          <h1 className="text-2xl font-semibold text-[#212529]">Learner&rsquo;s Profile</h1>
          <p className={`mt-3 text-sm ${isError ? "text-red-600" : "text-gray-400"}`}>
            {isError ? errorMessage : "We couldn’t find this learner."}
          </p>
          <Link
            href={backHref}
            className="mt-6 inline-block rounded-lg border border-[var(--color-blue)] px-4 py-2 text-sm font-medium text-[var(--color-blue)]"
          >
            Back to Spoylz Details
          </Link>
        </div>
      ) : (
        <>
          <div className="rounded-2xl border border-gray-100 bg-white p-6 sm:p-8">
            <h1 className="text-2xl font-semibold text-[#212529]">Learner&rsquo;s Profile</h1>

            <div className="mt-5 flex gap-6 overflow-x-auto border-b border-gray-100">
              <span className="shrink-0 whitespace-nowrap border-b-2 border-[var(--color-blue)] pb-3 text-sm font-medium text-[var(--color-blue)]">
                Learner Overview
              </span>
            </div>
          </div>

          <LearnerOverviewTab profile={profile} />
        </>
      )}
    </div>
  );
};

export default LearnerProfile;
