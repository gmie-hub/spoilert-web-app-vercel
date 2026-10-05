"use client";

import { useRouter } from "next/navigation";

import { Pagination } from "@spt/components";

import { PAGE_SIZE, pageCount, pageItems } from "../utils";

import StatusBadge from "./StatusBadge";
import TableStatusRow from "./TableStatusRow";

import type { Lecturer } from "../types";

const LecturersTable = ({
  lecturers,
  page,
  onPageChange,
}: {
  lecturers: Lecturer[];
  page: number;
  onPageChange: (page: number) => void;
}) => {
  const router = useRouter();

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-gray-400">
              <th className="py-3 pr-4 font-medium">S/N</th>
              <th className="py-3 pr-4 font-medium">First Name</th>
              <th className="py-3 pr-4 font-medium">Last Name</th>
              <th className="py-3 pr-4 font-medium">Email Address</th>
              <th className="py-3 pr-4 font-medium">Department</th>
              <th className="py-3 pr-4 font-medium">Total Courses</th>
              <th className="py-3 pr-4 font-medium">Invite Status</th>
              <th className="py-3 pr-4 font-medium">Date Sent</th>
              <th className="py-3 pr-4 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {lecturers.length === 0 ? (
              <TableStatusRow colSpan={9} emptyMessage="No lecturers match your search." />
            ) : (
              pageItems(lecturers, page).map((lecturer, index) => (
                <tr key={lecturer.id} className="border-b border-gray-50">
                  <td className="py-4 pr-4 text-gray-500">{(page - 1) * PAGE_SIZE + index + 1}</td>
                  <td className="py-4 pr-4 text-[#212529]">{lecturer.firstName || "-"}</td>
                  <td className="py-4 pr-4 text-[#212529]">{lecturer.lastName || "-"}</td>
                  <td className="py-4 pr-4 text-gray-500">{lecturer.email || "-"}</td>
                  <td className="py-4 pr-4 text-[#212529]">{lecturer.department || "-"}</td>
                  <td className="py-4 pr-4 text-[#212529]">{lecturer.totalCourses}</td>
                  <td className="py-4 pr-4">
                    <StatusBadge status={lecturer.inviteStatus} />
                  </td>
                  <td className="py-4 pr-4 text-gray-500">{lecturer.dateSent}</td>
                  <td className="py-4 pr-4">
                    <button
                      type="button"
                      onClick={() => router.push(`/institution/lecturers/${lecturer.id}`)}
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

      <div className="mt-6">
        <Pagination activePage={page} totalPages={pageCount(lecturers.length)} onPageChange={onPageChange} />
      </div>
    </div>
  );
};

export default LecturersTable;
