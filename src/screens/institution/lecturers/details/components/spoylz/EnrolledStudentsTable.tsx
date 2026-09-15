"use client";

import { useState } from "react";

import { FilterBar, Pagination } from "@spt/components";

import Badge from "./Badge";

import type { EnrolledStudent } from "./constants";

const Avatar = () => (
  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="8" r="4" fill="#9CA3AF" />
      <path d="M4 20c0-4.4 3.6-7 8-7s8 2.6 8 7" fill="#9CA3AF" />
    </svg>
  </span>
);

const EnrolledStudentsTable = ({
  students,
  onBack,
  onViewMore,
}: {
  students: EnrolledStudent[];
  onBack?: () => void;
  onViewMore: (student: EnrolledStudent) => void;
}) => {
  const [search, setSearch] = useState("");
  const [activePage, setActivePage] = useState(1);

  const filtered = students.filter((student) =>
    student.name.toLowerCase().includes(search.trim().toLowerCase()),
  );

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 sm:p-8">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm font-medium text-[var(--color-blue)]"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M15 6l-6 6 6 6" stroke="var(--color-blue)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Go Back
        </button>
      )}

      <h2 className={`${onBack ? "mt-4" : ""} text-xl font-semibold text-[#212529]`}>Enrolled Students</h2>

      <div className="mt-5 space-y-5">
        <FilterBar
          searchPlaceholder="Search for a learner..."
          filters={[{ label: "Status" }, { label: "Date Enrolled", type: "date" }]}
          search={search}
          onSearchChange={setSearch}
          onReset={() => setSearch("")}
        />

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400">
                <th className="py-3 pr-4 font-medium">S/N</th>
                <th className="py-3 pr-4 font-medium">Name of Learner</th>
                <th className="py-3 pr-4 font-medium">Username</th>
                <th className="py-3 pr-4 font-medium">Date Enrolled</th>
                <th className="py-3 pr-4 font-medium">Status</th>
                <th className="py-3 pr-4 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((student, index) => (
                <tr key={student.id} className="border-b border-gray-50">
                  <td className="py-4 pr-4 text-gray-500">{index + 1}</td>
                  <td className="py-4 pr-4">
                    <div className="flex items-center gap-3">
                      <Avatar />
                      <span className="text-[#212529]">{student.name}</span>
                    </div>
                  </td>
                  <td className="py-4 pr-4 text-gray-500">{student.username}</td>
                  <td className="py-4 pr-4 text-gray-500">{student.dateEnrolled}</td>
                  <td className="py-4 pr-4">
                    <Badge label={student.status} />
                  </td>
                  <td className="py-4 pr-4">
                    <button
                      type="button"
                      onClick={() => onViewMore(student)}
                      className="whitespace-nowrap rounded-lg border border-[var(--color-blue)] px-4 py-1.5 text-sm font-medium text-[var(--color-blue)]"
                    >
                      View More
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination activePage={activePage} onPageChange={setActivePage} />
      </div>
    </div>
  );
};

export default EnrolledStudentsTable;
