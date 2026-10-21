"use client";

import Image from "next/image";

import { StatCard } from "@spt/components";
import { useGetLearnerOverviewQuery } from "@spt/hooks/apiRequests/useGetLearnerOverviewQuery";

import { BookIcon } from "../../../lecturers/components/icons";
import { FieldRow } from "../../../lecturers/details/components/DetailsOverview";
import Badge from "../../../lecturers/details/components/spoylz/Badge";

import type { LearnerProfileDetails } from "../mappers";

const CheckCircleIcon = ({ color = "#28A745" }: { color?: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="9.3" stroke={color} strokeWidth="1.7" />
    <path d="M8 12.3l2.6 2.6L16.2 9" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const formatCount = (value?: number | null) => (value == null ? null : value.toLocaleString());

const LearnerOverviewTab = ({ profile }: { profile: LearnerProfileDetails }) => {
  const { data: overview, isLoading, isError } = useGetLearnerOverviewQuery(profile.id);
  // A failed request shows "No data" rather than zeros.
  const countOf = (value?: number | null) => (isError ? null : formatCount(value));

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="rounded-2xl border border-gray-100 bg-white p-6 sm:p-8 lg:col-span-2">
        <div className="relative mb-2 flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-gray-100">
          {profile.avatar ? (
            <Image src={profile.avatar} alt={profile.name} fill sizes="64px" className="object-cover" />
          ) : (
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="8" r="4" fill="#D1D5DB" />
              <path d="M4 20c0-4.4 3.6-7 8-7s8 2.6 8 7" fill="#D1D5DB" />
            </svg>
          )}
        </div>

        <FieldRow
          left={{ label: "Full Name", value: profile.name }}
          right={{ label: "Username", value: profile.username }}
        />
        <FieldRow
          left={{ label: "Email Address", value: profile.email }}
          right={{ label: "Date Joined", value: profile.dateJoined }}
        />
        <FieldRow
          left={{ label: "Last Login", value: profile.lastLogin }}
          right={{ label: "Status", value: profile.status && <Badge label={profile.status} /> }}
        />
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-6 sm:p-8">
        <h3 className="text-lg font-semibold text-[#212529]">Metrics</h3>
        <div className="mt-5 space-y-4">
          <StatCard
            label="Total Spoylz Enrolled"
            value={countOf(overview?.total_spoils_enrolled)}
            isLoading={isLoading}
            icon={<BookIcon color="#4F46E5" />}
            iconBg="bg-indigo-50"
          />
          <StatCard
            label="Total Spoylz Ongoing"
            value={countOf(overview?.total_ongoing_spoils)}
            isLoading={isLoading}
            icon={<BookIcon color="#DA8543" />}
            iconBg="bg-orange-50"
          />
          <StatCard
            label="Total Spoylz Completed"
            value={countOf(overview?.total_completed_spoils)}
            isLoading={isLoading}
            icon={<CheckCircleIcon color="#28A745" />}
            iconBg="bg-green-50"
          />
        </div>
      </div>
    </div>
  );
};

export default LearnerOverviewTab;
