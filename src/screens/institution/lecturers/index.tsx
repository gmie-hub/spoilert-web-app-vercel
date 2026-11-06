"use client";

import { useState } from "react";

import { FilterBar, SuccessModal } from "@spt/components";
import Button from "@spt/components/button";
import useAddLecturerMutation from "@spt/hooks/apiRequests/useAddLecturerMutation";
import useGetLecturersQuery from "@spt/hooks/apiRequests/useGetLecturersQuery";

import AddLecturerModal, { type LecturerFormValues } from "./components/AddLecturerModal";
import EmptyState from "./components/EmptyState";
import LecturersMetrics from "./components/LecturersMetrics";
import LecturersTable from "./components/LecturersTable";

import type { InviteStatus } from "./types";

const InstitutionLecturers = () => {
  const { lecturers, isLoading, isError, errorMessage } = useGetLecturersQuery();
  const { addLecturerHandler } = useAddLecturerMutation();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addedEmail, setAddedEmail] = useState<string | null>(null);

  // On success the lecturers query is refetched, so the new lecturer shows up
  // in the list; on failure the modal stays open with the error toast.
  const handleAdded = async (values: LecturerFormValues) => {
    const added = await addLecturerHandler(values);
    if (!added) return;
    setShowAddModal(false);
    setAddedEmail(values.email);
  };

  const filteredLecturers = lecturers.filter((lecturer) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;
    return (
      `${lecturer.firstName} ${lecturer.lastName}`.toLowerCase().includes(query) ||
      lecturer.email.toLowerCase().includes(query)
    );
  });

  // The counts only mean something once the API returns every lecturer's
  // status; until then they show "No data".
  const hasStatuses = lecturers.every((lecturer) => lecturer.inviteStatus !== null);
  const countByStatus = (status: InviteStatus) =>
    hasStatuses ? lecturers.filter((lecturer) => lecturer.inviteStatus === status).length : null;

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  return (
    <div className="w-full space-y-6">
      {isLoading ? (
        <div className="space-y-4">
          <div className="h-[120px] animate-pulse rounded-2xl bg-[#F3F4F6]" />
          <div className="h-[400px] animate-pulse rounded-2xl bg-[#F3F4F6]" />
        </div>
      ) : isError && lecturers.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center text-sm text-red-600">
          {errorMessage}
        </div>
      ) : lecturers.length === 0 ? (
        <EmptyState onAddLecturer={() => setShowAddModal(true)} />
      ) : (
        <>
          <div>
            <h1 className="text-2xl font-semibold text-[#212529]">Lecturers Metrics</h1>
            <div className="mt-5">
              <LecturersMetrics
                total={lecturers.length}
                declined={countByStatus("Declined")}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-lg font-semibold text-[#212529]">Lecturers List</h2>
              <Button
                type="button"
                className="rounded-full px-6"
                onClick={() => setShowAddModal(true)}
              >
                <span className="flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle cx="12" cy="12" r="9" stroke="#fff" strokeWidth="1.7" />
                    <path d="M12 8v8M8 12h8" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" />
                  </svg>
                  Add Lecturer
                </span>
              </Button>
            </div>

            <div className="mt-5">
              <FilterBar
                searchPlaceholder="Search for a lecturer..."
                filters={[
                  { label: "Invite Status" },
                  { label: "Department" },
                  { label: "Date Sent", type: "date" },
                ]}
                search={search}
                onSearchChange={handleSearchChange}
                onReset={() => handleSearchChange("")}
              />
            </div>

            <div className="mt-5">
              <LecturersTable lecturers={filteredLecturers} page={page} onPageChange={setPage} />
            </div>
          </div>
        </>
      )}

      {showAddModal && (
        <AddLecturerModal onClose={() => setShowAddModal(false)} onAdded={handleAdded} />
      )}

      {addedEmail && (
        <SuccessModal
          title="Lecturer Added Successfully 🎉"
          description={`Lecturer has been added to your institution. We've sent an invitation email to ${addedEmail}. Once they accept, they'll be able to access Spoylzert and start creating Spoylz.`}
          onContinue={() => setAddedEmail(null)}
        />
      )}
    </div>
  );
};

export default InstitutionLecturers;
