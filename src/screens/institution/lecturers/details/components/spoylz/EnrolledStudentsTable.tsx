"use client";

import { useState } from "react";

import Image from "next/image";

import { FilterBar, Pagination } from "@spt/components";

import TableStatusRow from "../../../components/TableStatusRow";
import { PAGE_SIZE, pageCount, pageItems } from "../../../utils";

import Badge from "./Badge";

import type { EnrolledStudent } from "./types";

export const Avatar = ({ src, alt }: { src?: string | null; alt: string }) => (
  <span className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-100">
    {src ? (
      <Image src={src} alt={alt} fill sizes="32px" className="object-cover" />
    ) : (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="8" r="4" fill="#9CA3AF" />
        <path d="M4 20c0-4.4 3.6-7 8-7s8 2.6 8 7" fill="#9CA3AF" />
      </svg>
    )}
  </span>
);

const EnrolledStudentsTable = <T extends EnrolledStudent>({
  students,
  isLoading = false,
  errorMessage,
  onBack,
  onViewMore,
}: {
  students: T[];
  isLoading?: boolean;
  errorMessage?: string | null;
  onBack?: () => void;
  onViewMore: (student: T) => void;
}) => {
  const [search, setSearch] = useState("");
  const [activePage, setActivePage] = useState(1);

  const query = search.trim().toLowerCase();
  const filtered = students.filter((student) => student.name.toLowerCase().includes(query));

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setActivePage(1);
  };

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
          onSearchChange={handleSearchChange}
          onReset={() => handleSearchChange("")}
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
              {isLoading || errorMessage || filtered.length === 0 ? (
                <TableStatusRow
                  colSpan={6}
                  isLoading={isLoading}
                  errorMessage={errorMessage}
                  emptyMessage={query ? "No learners match your search." : "No students have enrolled yet."}
                />
              ) : (
                pageItems(filtered, activePage).map((student, index) => (
                  <tr key={student.id} className="border-b border-gray-50">
                    <td className="py-4 pr-4 text-gray-500">{(activePage - 1) * PAGE_SIZE + index + 1}</td>
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-3">
                        <Avatar src={student.avatar} alt={student.name} />
                        <span className="text-[#212529]">{student.name}</span>
                      </div>
                    </td>
                    <td className="py-4 pr-4 text-gray-500">{student.username}</td>
                    <td className="py-4 pr-4 text-gray-500">{student.dateEnrolled}</td>
                    <td className="py-4 pr-4">
                      {student.status ? <Badge label={student.status} /> : <span className="text-gray-400">-</span>}
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
                ))
              )}
            </tbody>
          </table>
        </div>

        <Pagination activePage={activePage} totalPages={pageCount(filtered.length)} onPageChange={setActivePage} />
      </div>
    </div>
  );
};

export default EnrolledStudentsTable;
