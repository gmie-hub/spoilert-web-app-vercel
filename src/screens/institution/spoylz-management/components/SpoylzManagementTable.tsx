"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { FilterBar, Pagination } from "@spt/components";

import type { SpoylzManagementItem } from "../constants";

const Avatar = () => (
  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="8" r="4" fill="#9CA3AF" />
      <path d="M4 20c0-4.4 3.6-7 8-7s8 2.6 8 7" fill="#9CA3AF" />
    </svg>
  </span>
);

const SpoylzManagementTable = ({ items }: { items: SpoylzManagementItem[] }) => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [activePage, setActivePage] = useState(1);

  const query = search.trim().toLowerCase();
  const filtered = items.filter(
    (item) =>
      item.title.toLowerCase().includes(query) || item.lecturerName.toLowerCase().includes(query),
  );

  return (
    <div className="space-y-5 rounded-2xl border border-gray-100 bg-white p-6 sm:p-8">
      <FilterBar
        searchPlaceholder="Search for a Spoylz, Lecturer..."
        filters={[{ label: "Category" }, { label: "Date Created", type: "date" }]}
        search={search}
        onSearchChange={setSearch}
        onReset={() => setSearch("")}
      />

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1500px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-gray-400">
              <th className="py-3 pr-4 font-medium">S/N</th>
              <th className="py-3 pr-4 font-medium">Spoylz Title</th>
              <th className="py-3 pr-4 font-medium">Name of Lecturer</th>
              <th className="py-3 pr-4 font-medium">Category</th>
              <th className="py-3 pr-4 font-medium">Department</th>
              <th className="py-3 pr-4 font-medium">Spoylz Amount</th>
              <th className="py-3 pr-4 font-medium">Enrolled Students</th>
              <th className="py-3 pr-4 font-medium">Amount Earned by Lecturer</th>
              <th className="py-3 pr-4 font-medium">Amount Earned by Institution</th>
              <th className="py-3 pr-4 font-medium">Type</th>
              <th className="py-3 pr-4 font-medium">Date Created</th>
              <th className="py-3 pr-4 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item, index) => (
              <tr key={item.id} className="border-b border-gray-50">
                <td className="py-4 pr-4 text-gray-500">{index + 1}</td>
                <td className="py-4 pr-4">
                  <div className="flex items-center gap-3">
                    <span
                      className="h-9 w-9 shrink-0 rounded-lg"
                      style={{ backgroundColor: item.thumbnailColor }}
                    />
                    <span className="text-[#212529]">{item.title}</span>
                  </div>
                </td>
                <td className="py-4 pr-4">
                  <div className="flex items-center gap-3">
                    <Avatar />
                    <span className="text-[#212529]">{item.lecturerName}</span>
                  </div>
                </td>
                <td className="py-4 pr-4 text-[#212529]">{item.category}</td>
                <td className="py-4 pr-4 text-[#212529]">{item.department}</td>
                <td className="py-4 pr-4 text-[#212529]">{item.amount}</td>
                <td className="py-4 pr-4 text-[#212529]">{item.enrolledStudents}</td>
                <td className="py-4 pr-4 text-[#212529]">{item.earnedByLecturer}</td>
                <td className="py-4 pr-4 text-[#212529]">{item.earnedByInstitution}</td>
                <td className="py-4 pr-4 text-[#212529]">{item.type}</td>
                <td className="py-4 pr-4 text-gray-500">{item.dateCreated}</td>
                <td className="py-4 pr-4">
                  <button
                    type="button"
                    onClick={() => router.push(`/institution/spoylz-management/${item.id}`)}
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
  );
};

export default SpoylzManagementTable;
