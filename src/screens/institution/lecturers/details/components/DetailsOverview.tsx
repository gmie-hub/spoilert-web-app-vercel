"use client";

import { type ReactNode, useState } from "react";

import toast from "react-hot-toast";

import { StatCard } from "@spt/components";

import { BookIcon, CoinIcon, NetworkIcon, PeopleIcon } from "../../components/icons";
import StatusBadge from "../../components/StatusBadge";

import ResendInvitationModal from "./ResendInvitationModal";

import type { Lecturer } from "../../constants";

const InfoIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="9" stroke="#DA8543" strokeWidth="1.7" />
    <path d="M12 11v5.5" stroke="#DA8543" strokeWidth="1.7" strokeLinecap="round" />
    <circle cx="12" cy="7.8" r="0.15" fill="#DA8543" stroke="#DA8543" strokeWidth="1.4" />
  </svg>
);

const RefreshIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M4 4v5h5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4.5 9A8 8 0 1 1 6 15" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const FieldRow = ({
  left,
  right,
}: {
  left: { label: string; value: ReactNode };
  right: { label: string; value: ReactNode };
}) => (
  <div className="grid grid-cols-1 gap-4 border-b border-gray-100 py-4 last:border-0 sm:grid-cols-2">
    <div>
      <p className="text-sm text-gray-400">{left.label}</p>
      <p className="mt-1 font-medium text-[#212529]">{left.value}</p>
    </div>
    <div>
      <p className="text-sm text-gray-400">{right.label}</p>
      <p className="mt-1 font-medium text-[#212529]">{right.value}</p>
    </div>
  </div>
);

const DetailsOverview = ({ lecturer }: { lecturer: Lecturer }) => {
  const [showResendModal, setShowResendModal] = useState(false);
  const isPending = lecturer.inviteStatus === "Pending";

  const handleConfirmResend = () => {
    setShowResendModal(false);
    toast.success("Invitation resent successfully");
  };

  return (
    <div className="space-y-6">
      {isPending && (
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[var(--color-yellow-light)] bg-[var(--color-yellow-lighter)] p-5">
          <div className="flex min-w-0 flex-1 items-start gap-3">
            <InfoIcon />
            <p className="min-w-0 text-sm text-[#92400E]">
              This lecturer has been added to your institution, but they haven&rsquo;t accepted their
              invitation yet. They&rsquo;ll gain access to their Spoylzert account after accepting the
              email invitation.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowResendModal(true)}
            className="flex shrink-0 items-center gap-2 rounded-lg bg-[var(--color-yellow)] px-4 py-2.5 text-sm font-medium text-white"
          >
            <RefreshIcon />
            Resend Invitation
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 sm:p-8 lg:col-span-2">
          <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="8" r="4" fill="#D1D5DB" />
              <path d="M4 20c0-4.4 3.6-7 8-7s8 2.6 8 7" fill="#D1D5DB" />
            </svg>
          </div>

          <FieldRow
            left={{ label: "First Name", value: lecturer.firstName }}
            right={{ label: "Last Name", value: lecturer.lastName }}
          />
          <FieldRow
            left={{ label: "Email Address", value: lecturer.email }}
            right={{ label: "Phone Number", value: lecturer.phone }}
          />
          <FieldRow
            left={{ label: "Faculty", value: lecturer.faculty }}
            right={{ label: "Department", value: lecturer.department }}
          />
          <FieldRow
            left={{ label: "Academic Position", value: lecturer.position }}
            right={{ label: "Date Added", value: lecturer.dateSent }}
          />
          <FieldRow
            left={{ label: "Last Login", value: lecturer.lastLogin }}
            right={{ label: "Status", value: <StatusBadge status={lecturer.inviteStatus} /> }}
          />
          {lecturer.bio && (
            <div className="border-t border-gray-100 py-4 first:border-t-0">
              <p className="text-sm text-gray-400">Bio</p>
              <p className="mt-1 font-medium text-[#212529]">{lecturer.bio}</p>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 sm:p-8">
          <h3 className="text-lg font-semibold text-[#212529]">Metrics</h3>
          <div className="mt-5 space-y-4">
            <StatCard
              label="Total Revenue Generated"
              value={lecturer.metrics.totalRevenueGenerated}
              icon={<CoinIcon color="#28A745" />}
              iconBg="bg-green-50"
            />
            <StatCard
              label="Total Spoylz Created"
              value={String(lecturer.metrics.totalSpoylzCreated)}
              icon={<BookIcon color="#DA8543" />}
              iconBg="bg-orange-50"
            />
            <StatCard
              label="Students Enrolled"
              value={String(lecturer.metrics.studentsEnrolled)}
              icon={<NetworkIcon color="#DC3545" />}
              iconBg="bg-red-50"
            />
            <StatCard
              label="Institution Earnings"
              value={lecturer.metrics.institutionEarnings}
              icon={<NetworkIcon color="#B5179E" />}
              iconBg="bg-purple-50"
            />
            <StatCard
              label="Lecturer Earnings"
              value={lecturer.metrics.lecturerEarnings}
              icon={<PeopleIcon color="#0891B2" />}
              iconBg="bg-cyan-50"
            />
          </div>
        </div>
      </div>

      {showResendModal && (
        <ResendInvitationModal
          email={lecturer.email}
          onClose={() => setShowResendModal(false)}
          onConfirm={handleConfirmResend}
        />
      )}
    </div>
  );
};

export default DetailsOverview;
