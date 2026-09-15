"use client";

import { useState } from "react";

import { FilterBar, SuccessModal } from "@spt/components";
import Button from "@spt/components/button";

import AddLecturerModal, { type LecturerFormValues } from "./components/AddLecturerModal";
import EmptyState from "./components/EmptyState";
import LecturersMetrics from "./components/LecturersMetrics";
import LecturersTable from "./components/LecturersTable";
import { type Lecturer, MOCK_LECTURERS } from "./constants";

const InstitutionLecturers = () => {
  const [lecturers, setLecturers] = useState<Lecturer[]>(MOCK_LECTURERS);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [addedEmail, setAddedEmail] = useState<string | null>(null);

  const handleAdded = (values: LecturerFormValues) => {
    const newLecturer: Lecturer = {
      id: `new-${Date.now()}`,
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      phone: values.phone,
      faculty: values.faculty,
      department: values.department,
      position: values.position,
      totalCourses: 0,
      inviteStatus: "Pending",
      dateSent: new Date().toLocaleDateString("en-GB").split("/").join("-"),
      lastLogin: "-",
      metrics: {
        totalRevenueGenerated: "₦0",
        totalSpoylzCreated: 0,
        studentsEnrolled: 0,
        institutionEarnings: "₦0",
        lecturerEarnings: "₦0",
      },
    };

    setLecturers((prev) => [newLecturer, ...prev]);
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

  return (
    <div className="w-full space-y-6">
      {lecturers.length === 0 ? (
        <EmptyState onAddLecturer={() => setShowAddModal(true)} />
      ) : (
        <>
          <div>
            <h1 className="text-2xl font-semibold text-[#212529]">Lecturers Metrics</h1>
            <div className="mt-5">
              <LecturersMetrics total={20} pending={5000} accepted={3000} declined={5000} />
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
                onSearchChange={setSearch}
                onReset={() => setSearch("")}
              />
            </div>

            <div className="mt-5">
              <LecturersTable lecturers={filteredLecturers} />
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
